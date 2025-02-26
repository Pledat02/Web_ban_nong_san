package com.example.shipping_service.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "shipping_info")  // Specify the collection name
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ShippingInfo {
    @Id
    private String id;

    private String partnerId;
    private String label;
    private String area;
    private String fee;
    private String insuranceFee;
    private Long trackingId;
    private String estimatedPickTime;
    private String estimatedDeliverTime;
    private int statusId;
    private List<Long> listProductId;  // Embedded list of products
}
