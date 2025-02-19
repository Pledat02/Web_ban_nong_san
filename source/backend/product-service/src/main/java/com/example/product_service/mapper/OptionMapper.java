package com.example.product_service.mapper;

import com.example.product_service.dto.request.OptionTypeRequest;
import com.example.product_service.dto.response.OptionTypeResponse;
import com.example.product_service.entity.OptionType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OptionMapper {
    OptionType toOptionType(OptionTypeRequest request);
    OptionTypeResponse toOptionTypeResponse(OptionType optionType);
    OptionType updateOptionType (long id, OptionTypeRequest request);
}
