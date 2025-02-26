package com.example.shipping_service.mapper;

import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.ShippingResponse;
import com.example.shipping_service.entity.ShippingInfo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShippingMapper {
    ShippingInfo toShipping(ShippingRequest request);
    ShippingResponse toShippingResponse(ShippingInfo Shipping);
}
