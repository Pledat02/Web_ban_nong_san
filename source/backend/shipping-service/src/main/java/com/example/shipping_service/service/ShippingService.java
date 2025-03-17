package com.example.shipping_service.service;

import com.example.shipping_service.dto.request.ShippingFeeRequest;
import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.ApiResponse;
import com.example.shipping_service.dto.response.CancelShippingResponse;
import com.example.shipping_service.dto.response.OrderStatusResponse;
import com.example.shipping_service.dto.response.ShippingResponse;
import com.example.shipping_service.entity.ShippingInfo;
import com.example.shipping_service.mapper.ShippingMapper;
import com.example.shipping_service.repository.ShippingRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingService {
    private static final Logger log = LoggerFactory.getLogger(ShippingService.class);
    final ShippingRepository shippingRepository;
    final RestTemplate restTemplate = new RestTemplate();

    @Value("${GHTK_API_URL}")
    String GHTK_API_URL;
    @Value("${GHTK_TOKEN}")
    String GHTK_TOKEN;
    @Value("${GHTK_PARTNER_CODE}")
    String GHTK_PARTNER_CODE;

    public ShippingResponse createShipping(ShippingRequest request) throws JsonProcessingException {
        String url = GHTK_API_URL + "/order";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHTK_TOKEN);
        headers.set("X-Client-Source", GHTK_PARTNER_CODE);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ShippingRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            boolean success = Optional.ofNullable((Boolean) responseBody.get("success")).orElse(false);
            String message = (String) responseBody.get("message");
            String warningMessage = (String) responseBody.getOrDefault("warning_message", "");

            // Lấy thông tin order nếu có
            Map<String, Object> orderDataMap = (Map<String, Object>) responseBody.get("order");
            ShippingResponse.OrderData orderData = null;

            if (orderDataMap != null) {
                orderData = new  ShippingResponse.OrderData(
                        (String) orderDataMap.get("partner_id"),
                        (String) orderDataMap.get("label"),
                        ((Number) orderDataMap.get("area")).intValue(),
                        ((Number) orderDataMap.get("fee")).intValue(),
                        ((Number) orderDataMap.get("insurance_fee")).intValue(),
                        (String) orderDataMap.get("estimated_pick_time"),
                        (String) orderDataMap.get("estimated_deliver_time"),
                        ((Number) orderDataMap.get("status_id")).intValue(),
                        ((Number) orderDataMap.get("tracking_id")).longValue(),
                        (String) orderDataMap.get("sorting_code"),
                        (String) orderDataMap.get("date_to_delay_pick"),
                        ((Number) orderDataMap.get("pick_work_shift")).intValue(),
                        (String) orderDataMap.get("date_to_delay_deliver"),
                        ((Number) orderDataMap.get("deliver_work_shift")).intValue(),
                        ((Number) orderDataMap.get("pkg_draft_id")).intValue(),
                        ((Number) orderDataMap.get("is_xfast")).intValue()
                );
            }


            return new ShippingResponse(success, message, orderData, warningMessage);
        } else {
            throw new RuntimeException("Unexpected response from GHTK");
        }
    }


    public Double getShippingFee(ShippingFeeRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHTK_TOKEN);
        headers.set("X-Client-Source", GHTK_PARTNER_CODE);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = GHTK_API_URL + "/fee";

        HttpEntity<ShippingFeeRequest> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            return (Double) responseBody.get("fee");
        } else {
            throw new RuntimeException("Failed to get shipping fee from GHTK");
        }
    }
    public OrderStatusResponse checkOrderStatus(String trackingOrder) {
        String url = GHTK_API_URL + trackingOrder;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Client-Source", GHTK_PARTNER_CODE);
        headers.set("Token", GHTK_TOKEN);
//        headers.set("X-Client-Source", PARTNER_CODE);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();

            Boolean success = (Boolean) responseBody.get("success");
            String message = (String) responseBody.get("message");
            Map<String, Object> order = (Map<String, Object>) responseBody.get("order");
            if (order != null) {
                return OrderStatusResponse.builder()
                        .success(success)
                        .message(message)
                        .labelId((String) order.get("label_id"))
                        .partnerId((String) order.get("partner_id"))
                        .status((String) order.get("status"))
                        .statusText((String) order.get("status_text"))
                        .created((String) order.get("created"))
                        .modified((String) order.get("modified"))
                        .pickDate((String) order.get("pick_date"))
                        .deliverDate((String) order.get("deliver_date"))
                        .customerFullname((String) order.get("customer_fullname"))
                        .customerTel((String) order.get("customer_tel"))
                        .address((String) order.get("address"))
                        .storageDay(parseDouble(order.get("storage_day")))
                        .shipMoney(parseDouble(order.get("ship_money")))
                        .insurance(parseDouble(order.get("insurance")))
                        .value(parseDouble(order.get("value")))
                        .weight(parseDouble(order.get("weight")))
                        .pickMoney(parseDouble(order.get("pick_money")))
                        .isFreeship(Integer.parseInt((String) order.get("is_freeship")))
                        .build();
            }
        }
        throw new RuntimeException("Failed to fetch order status from GHTK");
    }
    private Double parseDouble(Object value) {
        if (value == null) return null;
        return Double.parseDouble(value.toString());
    }
    public CancelShippingResponse cancelShipping(String trackingOrder){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHTK_TOKEN);
        headers.set("X-Client-Source", GHTK_PARTNER_CODE);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Gửi request đến API GHTK
        String url = GHTK_API_URL + "/cancel/"+trackingOrder;
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
        );

        // Xử lý phản hồi
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            return CancelShippingResponse.builder()
                    .success((Boolean) responseBody.get("success"))
                    .message((String) responseBody.get("message"))
                    .log_id((String) responseBody.get("log_id"))
                    .build();
        } else {
            throw new RuntimeException("Failed to cancel order with GHTK");
        }
    }



}
