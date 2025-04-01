package com.example.product_service.service;

import com.example.event.dto.UpdateStockRequest;
import com.example.product_service.dto.request.FilterRequest;
import com.example.product_service.dto.request.OrderItemRequest;
import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.entity.WeightProduct;
import com.example.product_service.entity.WeightType;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.mapper.ProductMapper;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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

     String urlImagePath ="http://localhost:8082/products/images/";

    public ProductResponse getProductById(Long productId) {
        ProductResponse response = productMapper.toProductResponse
                (productRepository.findById(productId).orElseThrow(()
                -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
        response.setImage(urlImagePath+response.getImage());
        return response;
    }
    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        return productMapper.toProductResponse(productRepository.save(product));
    }
    public ProductResponse updateProduct(Long productId, ProductRequest productRequest) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Map request data to existing product
        productMapper.updateProduct(product, productRequest);

        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        // Save and return the updated product
        return productMapper.toProductResponse(productRepository.save(product));
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage = productRepository.findAll(pageable);

        return getListProductResponses(productPage,page);
    }

    public void updateStock(UpdateStockRequest request){
        log.info(request.toString());
        request.getItems().forEach(req -> {

            Optional<Product> productOp = productRepository.findById(req.getProductId());
            if (productOp.isPresent()) {
                Product p = productOp.get();
               for (WeightProduct o : p.getWeightProducts()){
                   if(o.getWeightType().getValue()==req.getWeight()){
                       o.setStock(o.getStock() - req.getQuantity());
                       break;
                   }
               }
                productRepository.save(p);
            } else {
                log.error("ERROR: Product not found for ID {}", req.getProductId());
            }
        });

    }

    public PageResponse<ProductResponse> getProductsByCategory(long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);

        return getListProductResponses(productPage,page);
    }
    public PageResponse<ProductResponse> searchProducts(String query,int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage = productRepository.searchProducts(query, pageable);
        return getListProductResponses(productPage,page);
    }


    private  PageResponse<ProductResponse> getListProductResponses ( Page<Product> productPage,int page ){
        List<ProductResponse> productResponses =  productPage.getContent()
                .stream()
                .map(product -> {
                    ProductResponse response = productMapper.toProductResponse(product);
                    response.setImage(urlImagePath + response.getImage());
                    return response;
                })
                .toList();
        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }
    public PageResponse<ProductResponse> getProductsByFilter(FilterRequest filter, int page, int size) {
        Specification<Product> spec = filterProducts(filter);
        Pageable pageable = PageRequest.of(page-1, size);
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        return getListProductResponses(productPage,page);

    }
    private Specification<Product> filterProducts(FilterRequest filter) {
        log.info("Filtering products: " + filter.toString());
        return (root, queryObj, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

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
                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern)

                        )
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }


    public List<String> checkStock(List<OrderItemRequest> request) {
        List<String> outOfStockProducts = new ArrayList<>();

        for (OrderItemRequest item : request) {
            Optional<Product> productOpt = productRepository.findById(Long.valueOf(item.getProductCode()));

            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                for( WeightProduct weightProduct : product.getWeightProducts()){
                    if(weightProduct.getWeightType().getValue() == item.getWeight()){
                        if(weightProduct.getStock() < item.getQuantity()){
                            outOfStockProducts.add(product.getName() +
                                    " (" + weightProduct.getWeightType().getValue() + "kg)");
                        }
                    }
                }

            } else {
                outOfStockProducts.add("Sản phẩm có mã " + item.getProductCode() + " không tồn tại");
            }
        }

        return outOfStockProducts;
    }

}
