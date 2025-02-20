package com.example.product_service.service;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.OptionType;
import com.example.product_service.entity.Product;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.mapper.ProductMapper;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.repository.OptionRepository;
import com.example.product_service.repository.ProductRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;
    OptionRepository optionRepository;

    public ProductResponse getProductById(Long productId) {
        return productMapper.toProductResponse(productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found")));
    }
    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        if (product.getOptions() == null) {
            product.setOptions(new ArrayList<>() )
            ;
        }
        for (long id_option : productRequest.getId_options()) {
            OptionType option = optionRepository.findById(id_option)
                    .orElseThrow(() -> new AppException(ErrorCode.OPTION_TYPE_NOT_FOUND));
            product.getOptions().add(option);
        }
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

        if (product.getOptions() == null) {
            product.setOptions(new ArrayList<>() )
            ;
        }
        for (long id_option : productRequest.getId_options()) {
            OptionType option = optionRepository.findById(id_option)
                    .orElseThrow(() -> new AppException(ErrorCode.OPTION_TYPE_NOT_FOUND));
            product.getOptions().add(option);
        }

        // Save and return the updated product
        return productMapper.toProductResponse(productRepository.save(product));
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage = productRepository.findAll(pageable);

        List<ProductResponse> productResponses = productPage.getContent()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();

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

        List<ProductResponse> productResponses = productPage.getContent()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();

        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }


}
