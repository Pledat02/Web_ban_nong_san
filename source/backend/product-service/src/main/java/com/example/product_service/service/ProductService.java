package com.example.product_service.service;

import com.example.event.dto.UpdateStockRequest;
import com.example.product_service.controller.FileUtils;
import com.example.product_service.dto.request.FilterRequest;
import com.example.product_service.dto.request.OrderItemRequest;
import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.entity.WeightProduct;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.mapper.ProductMapper;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.repository.OrderClientHttp;
import com.example.product_service.repository.ProductRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;
    OrderClientHttp orderClientHttp;
    RedisTemplate<String, Object> redisTemplate;
    ObjectMapper objectMapper;

    String urlImagePath = "http://localhost:8082/products/image-product/";

    // ===== USER APIs =====
    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_USER_NEW_' + #page + '_' + #size")
    public PageResponse<ProductResponse> getNewProducts(int page, int size) {
        log.info("Fetching new products from DB");

        Specification<Product> spec = (root, query, cb) -> cb.isTrue(root.get("isActive"));

        Page<Product> productPage = productRepository.findAll(
                spec,
                PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return mapToPageResponse(productPage, page);
    }
  @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_TOP_NEW_' + #page + '_' + #size")
  public PageResponse<ProductResponse> getTopProducts(int page, int size) {
      List<Long> topProductsId = orderClientHttp.getTopProductsId().getData();
      Specification<Product> spec = (root, query, cb) -> {
          Predicate isActive = cb.isTrue(root.get("isActive"));
          Predicate inClause = root.get("id_product").in(topProductsId);
          return cb.and(isActive, inClause);
      };

      Page<Product> productPage = productRepository.findAll(
              spec,
              PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"))
      );
      return mapToPageResponse(productPage, page);
  }

    @Cacheable(value = "products", key = "'PRODUCT_' + #productId")
    public ProductResponse getProductByIdForUser(Long productId) {
        log.info("Fetching product from DB for user with ID: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!product.isActive()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        return mapToProductResponseWithImage(product);
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_USER_ALL_' + #page + '_' + #size")
    public PageResponse<ProductResponse> getAllProductsForUser(int page, int size) {
        log.info("Fetching all active products for page: {}, size: {}", page, size);
        Specification<Product> spec = (root, query, cb) -> cb.isTrue(root.get("isActive"));
        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_USER_CATEGORY_' + #categoryId + '_' + #page + '_' + #size")
    public PageResponse<ProductResponse> getProductsByCategoryForUser(long categoryId, int page, int size) {
        log.info("Fetching active products by category ID: {}, page: {}, size: {}", categoryId, page, size);
        Specification<Product> spec = (root, query, cb) -> cb.and(
                cb.equal(root.get("category").get("id"), categoryId),
                cb.isTrue(root.get("isActive"))
        );
        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_USER_FILTER_' + #filter.toString() + '_' + #page + '_' + #size")
    public PageResponse<ProductResponse> getProductsByFilter(FilterRequest filter, int page, int size) {
        log.info("Fetching products by filter for page: {}, size: {}", page, size);
        Specification<Product> spec = filterProductsForUser(filter);
        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_USER_SEARCH_' + #query + '_' + #page + '_' + #size")
    public PageResponse<ProductResponse> searchProductsByUser(String query, int page, int size) {
        log.info("Searching active products with query: {}, page: {}, size: {}", query, page, size);
        Specification<Product> spec = (root, q, cb) -> cb.and(
                cb.isTrue(root.get("isActive")),
                cb.like(cb.lower(root.get("name")), "%" + query.trim().toLowerCase() + "%")
        );

        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    // ===== ADMIN APIs =====

    @Cacheable(value = "products", key = "'PRODUCT_' + #productId")
    public ProductResponse getProductById(Long productId) {
        log.info("Fetching product from DB with ID: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return mapToProductResponseWithImage(product);
    }

    @Transactional
    @CacheEvict(value = {"products", "productsPage"}, allEntries = true)
    public ProductResponse createProduct(ProductRequest productRequest, MultipartFile file) {
        Product product = productMapper.toProduct(productRequest);
        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        if (file != null && !file.isEmpty()) {
            String imageFilename = FileUtils.saveImage(file);
            product.setImage(imageFilename);
        }

        Product savedProduct = productRepository.save(product);
        String cacheKey = "PRODUCT_" + savedProduct.getId_product();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedProduct));
            log.info("Cached product with key: {}", cacheKey);
        } catch (JsonProcessingException e) {
            log.error("Error caching product: {}", e.getMessage());
        }
        return mapToProductResponseWithImage(savedProduct);
    }

    @Transactional
    @CacheEvict(value = {"products", "productsPage"}, allEntries = true)
    public ProductResponse updateProduct(Long productId, ProductRequest productRequest, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        productMapper.updateProduct(product, productRequest);

        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        if (file != null && !file.isEmpty()) {
            FileUtils.deleteImage(product.getImage());
            String imageFilename = FileUtils.saveImage(file);
            product.setImage(imageFilename);
        }

        Product savedProduct = productRepository.save(product);
        String cacheKey = "PRODUCT_" + savedProduct.getId_product();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedProduct));
            log.info("Updated cache for product with key: {}", cacheKey);
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
        return mapToProductResponseWithImage(savedProduct);
    }

    @Transactional
    @CacheEvict(value = {"products", "productsPage"}, allEntries = true)
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(false);
        Product savedProduct = productRepository.save(product);
        String cacheKey = "PRODUCT_" + productId;
        redisTemplate.delete(cacheKey);
        log.info("Deleted product ID: {}, cache key: {}", productId, cacheKey);
    }

    @Transactional
    @CacheEvict(value = {"products", "productsPage"}, allEntries = true)
    public void restoreProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(true);
        Product savedProduct = productRepository.save(product);
        String cacheKey = "PRODUCT_" + productId;
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedProduct));
            log.info("Restored product ID: {}, cache key: {}", productId, cacheKey);
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_ADMIN_ALL_' + #page + '_' + #size")
    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        log.info("Fetching all products from DB for page: {}, size: {}", page, size);
        Page<Product> productPage = productRepository.findAll(PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_ADMIN_CATEGORY_' + #categoryId + '_' + #page + '_' + #size")
    public PageResponse<ProductResponse> getProductsByCategory(long categoryId, int page, int size) {
        log.info("Fetching products by category ID: {}, page: {}, size: {}", categoryId, page, size);
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    @Cacheable(value = "productsPage", key = "'PRODUCTS_PAGE_ADMIN_SEARCH_' + #query + '_' + #page + '_' + #size")
    public PageResponse<ProductResponse> searchProducts(String query, int page, int size) {
        log.info("Searching products with query: {}, page: {}, size: {}", query, page, size);
        Page<Product> productPage = productRepository.searchProducts(query, PageRequest.of(page - 1, size));
        return mapToPageResponse(productPage, page);
    }

    // ===== STOCK MANAGEMENT =====

    @Transactional
    @CacheEvict(value = {"products", "productsPage"}, allEntries = true)
    public void updateStock(UpdateStockRequest request) {
        request.getItems().forEach(req -> {
            Optional<Product> productOp = productRepository.findById(req.getProductId());
            if (productOp.isPresent()) {
                Product product = productOp.get();
                for (WeightProduct weightProduct : product.getWeightProducts()) {
                    if (weightProduct.getWeightType().getValue() == req.getWeight()) {
                        int newStock = weightProduct.getStock() + req.getQuantity();
                        if (newStock < 0) {
                            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
                        }
                        weightProduct.setStock(newStock);
                        break;
                    }
                }
                Product savedProduct = productRepository.save(product);
                String cacheKey = "PRODUCT_" + savedProduct.getId_product();
                try {
                    redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedProduct));
                    log.info("Updated cache for product with key: {}", cacheKey);
                } catch (JsonProcessingException e) {
                    log.error("Error updating Redis cache for product ID {}: {}", savedProduct.getId_product(), e.getMessage());
                }
            } else {
                log.error("Product not found for ID {}", req.getProductId());
                throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
            }
        });
    }

    public List<String> checkStock(List<OrderItemRequest> request) {
        List<String> outOfStockProducts = new ArrayList<>();

        for (OrderItemRequest item : request) {
            Optional<Product> productOpt = productRepository.findById(Long.valueOf(item.getProductCode()));
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                for (WeightProduct weightProduct : product.getWeightProducts()) {
                    if (weightProduct.getWeightType().getValue() == item.getWeight()) {
                        if (weightProduct.getStock() < item.getQuantity()) {
                            outOfStockProducts.add(product.getName() +
                                    " (" + weightProduct.getWeightType().getValue() + "kg) chỉ còn " +
                                    weightProduct.getStock() + ", yêu cầu " + item.getQuantity());
                        }
                    }
                }
            } else {
                outOfStockProducts.add("Sản phẩm có mã " + item.getProductCode() + " không tồn tại");
            }
        }

        return outOfStockProducts;
    }

    // ===== SHARED METHODS =====

    private PageResponse<ProductResponse> mapToPageResponse(Page<Product> productPage, int page) {
        List<ProductResponse> productResponses = productPage.getContent()
                .stream()
                .map(this::mapToProductResponseWithImage)
                .toList();

        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }

    private ProductResponse mapToProductResponseWithImage(Product product) {
        ProductResponse response = productMapper.toProductResponse(product);
        response.setImage(response.getImage() != null ? urlImagePath + response.getImage() : null);
        return response;
    }

    private Specification<Product> filterProductsForUser(FilterRequest filter) {
        return (root, queryObj, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.isTrue(root.get("isActive")));

            if (filter.getOrganic() != null) {
                predicates.add(criteriaBuilder.equal(root.get("organic"), filter.getOrganic()));
            }
            if (filter.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }
            if (filter.getCategoryId() != null && filter.getCategoryId() > 0) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId()));
            }
            if (filter.getBrand() != null && !filter.getBrand().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("brand"), "%" + filter.getBrand().trim() + "%"));
            }
            if (filter.getOrigin() != null && !filter.getOrigin().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("origin"), "%" + filter.getOrigin().trim() + "%"));
            }
            if (filter.getQuery() != null && !filter.getQuery().trim().isEmpty()) {
                String searchPattern = "%" + filter.getQuery().trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}