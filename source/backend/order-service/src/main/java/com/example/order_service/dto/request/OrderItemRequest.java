package com.example.order_service.dto.request;

import com.example.order_service.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemRequest {
    String id_order_item;
    long product_code;
    int quantity;
    Double price;
    String name;
    double weight;

}
