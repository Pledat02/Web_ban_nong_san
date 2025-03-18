package com.example.order_service.dto.response;

import com.example.order_service.dto.request.ProfileRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class OrderResponse {
    String id_order;
    ProfileResponse user;
    Double totalPrice;
    String paymentMethod;
    String status;
    Timestamp orderDate;
    String note;
    @ToString.Exclude
    List<OrderItemResponse> orderItems;
}
