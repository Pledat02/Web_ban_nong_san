package com.example.product_service.service;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.mapper.ProductMapper;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.repository.ProductRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;

     String urlImagePath ="http://localhost:8082/products/images/";

    public ProductResponse getProductById(Long productId) {
        ProductResponse response = new ProductResponse();
        productMapper.toProductResponse(productRepository.findById(productId).orElseThrow(()
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

        List<ProductResponse> productResponses = getListProductResponses(productPage);
        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }



    public PageResponse<ProductResponse> getProductsByCategory(long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);

        List<ProductResponse> productResponses = getListProductResponses(productPage);

        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }
    public PageResponse<ProductResponse> searchProducts(String product,int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage = productRepository.searchProducts(product, pageable);
        List<ProductResponse> productResponses = getListProductResponses(productPage);

        return PageResponse.<ProductResponse>builder()
               .currentPage(page)
               .totalPages(productPage.getTotalPages())
               .totalElements(productPage.getTotalElements())
               .elements(productResponses)
               .build();
    }
    private  List<ProductResponse> getListProductResponses ( Page<Product> productPage){
        return  productPage.getContent()
                .stream()
                .map(product -> {
                    ProductResponse response = productMapper.toProductResponse(product);
                    response.setImage(urlImagePath + response.getImage());
                    return response;
                })
                .toList();
    }

}
