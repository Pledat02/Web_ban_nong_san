package com.example.product_service.service;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Product;
import com.example.product_service.mapper.ProductMapper;
import com.example.product_service.repository.ProductRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;

    public ProductResponse getProductById(Long productId) {
        return productMapper.toProductResponse(productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found")));
    }
    public ProductResponse createProduct(ProductRequest productRequest) {
        return productMapper.toProductResponse(productRepository.save(productMapper.toProduct(productRequest)));
    }
    public ProductResponse updateProduct(Long productId, ProductRequest productRequest) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        productMapper.updateProduct(product, productRequest);
        return productMapper.toProductResponse(productRepository.save(product));
    }
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(productMapper::toProductResponse).toList();
    }
    public List<ProductResponse> getProductsByCategory(long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream().map(productMapper::toProductResponse).toList();
    }

}
