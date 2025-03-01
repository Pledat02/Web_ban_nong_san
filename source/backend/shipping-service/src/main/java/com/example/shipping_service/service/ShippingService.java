package com.example.shipping_service.service;

import com.example.shipping_service.dto.request.ShippingFeeRequest;
import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.ApiResponse;
import com.example.shipping_service.dto.response.OrderStatusResponse;
import com.example.shipping_service.dto.response.ShippingResponse;
import com.example.shipping_service.entity.ShippingInfo;
import com.example.shipping_service.mapper.ShippingMapper;
import com.example.shipping_service.repository.ShippingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShippingService {
    ShippingRepository shippingRepository;
    RestTemplate restTemplate = new RestTemplate();

    String GHTK_API_URL = "https://services-staging.ghtklab.com/services/shipment";
    String GHTK_TOKEN = "YOUR_API_KEY";

    public ShippingResponse createShipping(ShippingRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHTK_TOKEN);
        String url="/order";
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ShippingRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            // Lấy dữ liệu từ response
            Boolean success = (Boolean) responseBody.get("success");
            String message = (String) responseBody.get("message");
            Map<String, Object> data = (Map<String, Object>) responseBody.get("data");

            // Kiểm tra nếu data không null
            String code = data != null ? (String) data.get("code") : null;
            String token = data != null ? (String) data.get("token") : null;
            return shippingRepository.save(ShippingResponse.builder()
                    .success(success)
                    .message(message)
                    .data(new ShippingResponse.ShippingData(code, token))
                    .build()
            );
        } else {
            throw new RuntimeException("Failed to create shipping order with GHTK");
        }
    }
    public Double getShippingFee(ShippingFeeRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHTK_TOKEN);
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
    public ShippingResponse cancelShipping(String trackingOrder){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHTK_TOKEN);
//        headers.set("X-Client-Source", partnerCode);
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
            return ShippingResponse.builder()
                    .success((Boolean) responseBody.get("success"))
                    .message((String) responseBody.get("message"))
                    .data((String) responseBody.get("log_id"))
                    .build();
        } else {
            throw new RuntimeException("Failed to cancel order with GHTK");
        }
    }



}
