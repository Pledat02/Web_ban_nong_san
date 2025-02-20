package com.example.product_service.mapper;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper  (componentModel = "spring")
public interface ProductMapper {

    Product toProduct(ProductRequest productRequest);
    @Mapping(target = "id_product", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest request);
    ProductResponse toProductResponse(Product product);
}
