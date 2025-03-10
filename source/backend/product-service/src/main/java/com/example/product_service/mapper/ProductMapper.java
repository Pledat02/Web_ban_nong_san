package com.example.product_service.mapper;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.request.WeightTypeResponse;
import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Product;
import com.example.product_service.entity.WeightType;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "category", source = "category")
    @Mapping(target = "weightTypes", source = "weightTypes")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "weightTypes", ignore = true)
    Product toProduct(ProductRequest productRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProduct(@MappingTarget Product product, ProductRequest request);


    default List<WeightTypeResponse> toWeightTypeResponses(List<WeightType> weightTypes) {
        if (weightTypes == null) return null;
        return weightTypes.stream()
                .map(weightType -> WeightTypeResponse.builder()
                        .id_weight_type(weightType.getId_weight_type())
                        .weight(weightType.getWeight())
                        .unit(weightType.getUnit())
                        .build())
                .collect(Collectors.toList());
    }
}
