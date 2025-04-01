package com.example.product_service.mapper;

import com.example.product_service.dto.request.WeightTypeRequest;
import com.example.product_service.dto.response.WeightTypeResponse;
import com.example.product_service.dto.response.WeightTypeResponse;
import com.example.product_service.entity.WeightType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WeightTypeMapper {
    WeightType toWeightType(WeightTypeRequest weightType);
    WeightTypeResponse toWeightTypeResponse(WeightType weightType);
    WeightType updateWeightType (long id, WeightTypeRequest request);
}
