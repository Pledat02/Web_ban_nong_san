package com.example.shipping_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderStatusResponse {
    private Boolean success;
    private String message;
    private String labelId;
    private String partnerId;
    private String status;
    private String statusText;
    private String created;
    private String modified;
    private String pickDate;
    private String deliverDate;
    private String customerFullname;
    private String customerTel;
    private String address;
    private double storageDay;
    private double shipMoney;
    private double insurance;
    private double value;
    private double weight;
    private double pickMoney;
    private int isFreeship;
}
