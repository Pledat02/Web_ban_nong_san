package com.example.Identity_Service;

import com.example.Identity_Service.dto.request.AuthenicationRequest;
import com.example.Identity_Service.dto.response.AuthenicationResponse;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import com.example.Identity_Service.service.AuthenicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Rollback
public class AuthenticationServiceConcurrentTests {

    @Autowired
    private AuthenicationService authenticationService;

    @SpyBean
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int NUMBER_OF_USERS = 5000;
    private static final int NUMBER_OF_THREADS = 100;
    private static final String PASSWORD = "password123";

    private List<User> testUsers = new ArrayList<>();

    @BeforeEach
    public void setUp() throws Exception {
        long startTime = System.currentTimeMillis();

        // Xóa cache Redis và dữ liệu DB
        redisTemplate.getConnectionFactory().getConnection().flushAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        testUsers.clear();

        // Tạo user và cache Redis
        for (int i = 0; i < NUMBER_OF_USERS; i++) {
            User user = new User();
            user.setEmail("user" + i + "@example.com");
            user.setUsername("user" + i);
            user.setPassword(passwordEncoder.encode(PASSWORD));
            userRepository.save(user);

            String userJson = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set("USER_" + user.getEmail(), userJson);
            testUsers.add(user);
        }

        // Xác minh dữ liệu đã được cache trong Redis
        for (User user : testUsers) {
            String cachedUserJson = (String) redisTemplate.opsForValue().get("USER_" + user.getEmail());
            assertNotNull(cachedUserJson, "Redis cache không tồn tại cho: " + user.getEmail());
        }

        long duration = System.currentTimeMillis() - startTime;
        System.out.println("✅ Đã setup xong dữ liệu test (" + NUMBER_OF_USERS + " users) trong: " + duration + " ms");
    }


    @Test
    public void testConcurrentAuthenticateServiceWithCacheHit() throws Exception {
        ExecutorService executorService = Executors.newFixedThreadPool(NUMBER_OF_THREADS);
        CountDownLatch latch = new CountDownLatch(NUMBER_OF_THREADS);

        AtomicLong totalResponseTime = new AtomicLong(0);
        AtomicLong successCount = new AtomicLong(0);
        List<Exception> exceptions = Collections.synchronizedList(new ArrayList<>());
        Random random = new Random();

        for (int i = 0; i < NUMBER_OF_THREADS; i++) {
            User randomUser = testUsers.get(random.nextInt(NUMBER_OF_USERS));
            AuthenicationRequest request = new AuthenicationRequest();
            request.setEmail(randomUser.getEmail());
            request.setPassword(PASSWORD);

            executorService.submit(() -> {
                try {
                    long start = System.currentTimeMillis();
                    AuthenicationResponse response = authenticationService.authenticate(request);
                    totalResponseTime.addAndGet(System.currentTimeMillis() - start);

                    assertNotNull(response.getToken(), "Token null");
                    assertTrue(response.isAuthenticated(), "User không được authenticate");
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    exceptions.add(e);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();
        assertTrue(executorService.awaitTermination(10, TimeUnit.SECONDS), "Executor chưa dừng đúng hạn");

        // Đảm bảo không có lỗi
        assertTrue(exceptions.isEmpty(), "Đã có lỗi xảy ra: " + exceptions);
        assertEquals(NUMBER_OF_THREADS, successCount.get(), "Không phải tất cả yêu cầu thành công");

        // Đảm bảo cache được sử dụng (DB không bị truy cập)
        verify(userRepository, never()).findByEmail(anyString());

        double avgResponseTime = totalResponseTime.get() / (double) NUMBER_OF_THREADS;
        System.out.println("✅ Thành công: " + successCount.get() + " requests");
        System.out.println("⚡ Trung bình thời gian authenticate: " + avgResponseTime + " ms");
    }
}
