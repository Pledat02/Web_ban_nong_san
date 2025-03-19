package com.example.order_service.mapper;

import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(target = "id_order", source = "id")
    @Mapping(target = "orderItems", ignore = true) // 🚀 Bỏ qua orderItems trước
    Order toOrder(OrderRequest request);

    @Mapping(target = "id", source = "id_order")
    OrderResponse toOrderResponse(Order order);


}
