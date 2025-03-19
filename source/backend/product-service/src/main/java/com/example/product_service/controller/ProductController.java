package com.example.product_service.controller;

import com.example.event.dto.UpdateStockRequest;
import com.example.product_service.dto.request.FilterRequest;
import com.example.product_service.dto.request.OrderItemRequest;
import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.ApiResponse;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
     ProductService productService;
    private ObjectMapper objectMapper;
    // Get all products
    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getAllProducts(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ){
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(productService.getAllProducts(page, size))
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
    public ApiResponse<PageResponse<ProductResponse>>
    getProductsByCategoryId(@PathVariable Long categoryId,
                            @RequestParam(required = false, defaultValue = "1") Integer page,
                            @RequestParam(required = false, defaultValue = "10") Integer size) {
        PageResponse<ProductResponse> products = productService.getProductsByCategory(categoryId,page,size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
               .data(products)
               .build();
    }
    // create product
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> createProduct(
            @RequestPart("request") @Valid ProductRequest request,
            @RequestPart("file") MultipartFile file) throws AppException {

        try {
            String imagePath = FileUtils.saveImage(file);
            request.setImage(imagePath);

            ProductResponse response = productService.createProduct(request);

            return ApiResponse.<ProductResponse>builder()
                    .data(response)
                    .build();
        } catch (AppException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    // update product
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestPart("request") @Valid ProductRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        if (file != null) {
            request.setImage(FileUtils.saveImage(file));
        }
        ProductResponse product = productService.updateProduct(id, request);
        if (product == null) throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);

        return ApiResponse.<ProductResponse>builder()
                .data(product)
                .build();
    }
    //update stock
    @KafkaListener(topics = "update-stock")
    public void updateStock(@Payload UpdateStockRequest request) {
        productService.updateStock(request);
    }

    @PostMapping("/stock/check")
    public ApiResponse<List<String>> isStock(@RequestBody List<OrderItemRequest> request) {
        List<String> nameNotStockProducts = productService.checkStock(request);
        return  ApiResponse.<List<String>>
                builder()
                .data(nameNotStockProducts)
               .build()  ;
    }

    // delete product
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
               .build();
    }
    @GetMapping("/search")
    public ApiResponse<PageResponse<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        PageResponse<ProductResponse> products =
                productService.searchProducts(keyword, page, size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(products)
                .build() ;
    }
    // Get products by filter
    @GetMapping("/filter")
    public ApiResponse<PageResponse<ProductResponse>> filterProducts(
            FilterRequest filter,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        PageResponse<ProductResponse> products =
                productService.getProductsByFilter(filter,page, size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(products)
                .build();
    }


}
