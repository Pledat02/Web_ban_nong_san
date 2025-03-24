package com.example.Identity_Service.service;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.dto.request.*;
import com.example.Identity_Service.dto.response.AuthenicationResponse;
import com.example.Identity_Service.dto.response.TokenResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.UserLoginMethod;
import com.example.Identity_Service.mapper.UserMapper;
import com.example.Identity_Service.repository.*;
import com.example.Identity_Service.dto.response.ValidTokenResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenicationService {

     UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
//    private final RedisTemplate<String, User> redisTemplate;
    private final RedisTemplate<String,String> stringRedisTemplate;
    UserLoginMethodRepository userLoginMethodRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signer_key;
    public AuthenicationResponse authenticate(AuthenicationRequest request) {
//        ValueOperations<String, User> valueOperations = redisTemplate.opsForValue();

        // Lấy user từ Redis trước
//        User user = valueOperations.get("USER_" + request.getEmail());

        // Nếu không có trong Redis, lấy từ DB
//        if (user == null) {
            User user= userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//        }


        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.USER_INVALID_CREDENTIALS);
        }

        String token = generateToken(user);

        return AuthenicationResponse.builder()
                .token(token)
                .authenticated(authenticated)
                .build();
    }

    public AuthenicationResponse loginWithSocial(UserCreationRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isPresent()) {
            // Kiểm tra user đã từng đăng nhập bằng Google/Facebook chưa
            boolean hasLoginMethod = userLoginMethodRepository.existsByUserAndLoginType(user.get(), request.getLoginType());

            if (!hasLoginMethod) {
                // Thêm phương thức đăng nhập mới nếu user chưa từng dùng Google/Facebook
                UserLoginMethod loginMethod = UserLoginMethod.builder()
                        .user(user.get())
                        .loginType(request.getLoginType())
                        .build();
                userLoginMethodRepository.save(loginMethod);
            }

            return AuthenicationResponse.builder()
                    .authenticated(true)
                    .token(generateToken(user.get()))
                    .build();
        } else {
            // Nếu user chưa tồn tại, tạo mới tài khoản
            HashSet<Role> roles = new HashSet<>();
            roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);
            User newUser = User.builder()
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .password("") // Không cần mật khẩu cho Google/Facebook
                    .avatar(request.getAvatar())
                    .roles(roles)
                    .build();
            userRepository.save(newUser);

            UserLoginMethod loginMethod = UserLoginMethod.builder()
                    .user(newUser)
                    .loginType(request.getLoginType())
                    .build();
            userLoginMethodRepository.save(loginMethod);

            return AuthenicationResponse.builder()
                    .authenticated(true)
                    .token(generateToken(newUser))
                    .build();
        }
    }


    public ValidTokenResponse introspect(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        boolean isValid  = false;
        try {
            verifyToken(token);
            isValid = true;
        }catch (Exception exception){
            log.error("Invalid token");
        }
        return ValidTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signer_key.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        boolean isValid = signedJWT.verify(verifier);
        Date expiredDate = signedJWT.getJWTClaimsSet().getExpirationTime();
        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        String username = signedJWT.getJWTClaimsSet().getSubject();
        if (expiredDate != null && expiredDate.before(new Date())) {
            throw new IllegalStateException("Token đã hết hạn");
        }
        // Kiểm tra nếu token đã bị blacklist
//        if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jwtID))) {
//            throw new IllegalStateException("Token đã bị thu hồi");
//        }

        return signedJWT;
    }


    public void logout(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token);
        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        String username = signedJWT.getJWTClaimsSet().getSubject();

        // Thêm token vào danh sách blacklist để ngăn chặn reuse
//        stringRedisTemplate.opsForValue().set("blacklist:" + jwtID, "blacklisted", 1, TimeUnit.DAYS);

    }

    public TokenResponse refreshToken(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token);
        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        String subject = signedJWT.getJWTClaimsSet().getSubject();

        // Kiểm tra nếu token đã bị blacklist trong Redis
//        if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jwtID))) {
//            throw new AppException(ErrorCode.INVALID_KEY);
//        }

        // Nếu không bị blacklist, cấp token mới
        User user = userRepository.findByUsername(subject)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String tokenReturn = generateToken(user);
//        stringRedisTemplate.opsForValue().set("blacklist:" + jwtID, "blacklisted", 1, TimeUnit.DAYS);
        return TokenResponse.builder()
                .token(tokenReturn)
                .build();
    }

    private String generateToken(User user) {
        UserResponse response = userMapper.toUserResponse(user);
        // header jwt
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(response.getUsername())
                .expirationTime(Date.from(Instant.now().plus(1, ChronoUnit.DAYS)))
                .issueTime(new Date())
                .claim("email", response.getEmail())
                .issuer("admin")
                .claim("id_user", response.getId_user())
                .claim("picture", response.getAvatar())
                .jwtID(UUID.randomUUID().toString())
               .claim("scope", getScopeClaim(user.getRoles()))
                .build();
        // payload jwt
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        // sign jwt
        try {
            jwsObject.sign(new MACSigner(signer_key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);

        }
    }

    private String getScopeClaim(Set<Role> roles){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!roles.isEmpty()){
            for(Role role : roles){
                log.info("ROLE_"+role.getName());
                stringJoiner.add("ROLE_"+role.getName());
                if(!role.getPermissons().isEmpty()){
                    stringJoiner.add(role.getPermissons().stream()
                           .map(p -> p.getName())
                           .collect(Collectors.joining(" ")));
                }
            }
        }
        return stringJoiner.toString();
    }
}
