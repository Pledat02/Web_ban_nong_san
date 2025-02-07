package com.example.product_service.controller;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.ApiResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
     ProductService productService;

     // Get all products
    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts(){
        return ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getAllProducts())
                .build();
    }
    // Get product by id
    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id){
        ProductResponse product = productService.getProductById(id);
        if(product == null) throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        return ApiResponse.<ProductResponse>builder()
               .data(product)
               .build();
    }
    // Get products by category id
    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<ProductResponse>>
    getProductsByCategoryId(@PathVariable Long categoryId) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        if(products.isEmpty()) throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        return ApiResponse.<List<ProductResponse>>builder()
               .data(products)
               .build();
    }
    // create product
    @PostMapping
    public ApiResponse<ProductResponse> createProduct(ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
               .data(productService.createProduct(request))
               .build();
    }
    // update product
    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        if(product == null) throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        return ApiResponse.<ProductResponse>builder()
               .data(product)
               .build();
    }
    // delete product
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
               .build();
    }


}
