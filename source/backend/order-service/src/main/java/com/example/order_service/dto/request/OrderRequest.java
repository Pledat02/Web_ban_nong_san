package com.example.order_service.dto.request;

import com.example.order_service.entity.OrderItem;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class OrderRequest {
    String id_order;
    ProfileRequest  user;
    Double totalPrice;
    String paymentMethod;
    String status;
    Timestamp order_date;
    String note;
    List<OrderItemRequest> orderItems;
}
