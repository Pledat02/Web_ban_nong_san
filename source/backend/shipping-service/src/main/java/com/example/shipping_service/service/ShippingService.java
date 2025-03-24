package com.example.shipping_service.service;

import com.example.shipping_service.configuration.GhtkConfig;
import com.example.shipping_service.configuration.OrderConfig;
import com.example.shipping_service.dto.request.OrderRequest;
import com.example.shipping_service.dto.request.ShippingFeeRequest;
import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.CancelShippingResponse;
import com.example.shipping_service.dto.response.OrderStatusResponse;
import com.example.shipping_service.dto.response.ShippingFeeResponse;
import com.example.shipping_service.dto.response.ShippingResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingService {
    private static final Logger log = LoggerFactory.getLogger(ShippingService.class);
    private final OrderConfig orderConfig;
    final GhtkConfig ghtkConfig;

    public ShippingResponse createShipping(ShippingRequest request) {
        String url = ghtkConfig.getGhtkStagingUrl() + "/order";
        HttpHeaders headers = createHeadersStaging();
        request.getOrder().fromConfig(orderConfig);
        HttpEntity<ShippingRequest> entity = new HttpEntity<>(request, headers);
        log.info("request:" +request);
        ResponseEntity<Map> response = ghtkConfig.ghtkRestTemplate().exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            boolean success = Optional.ofNullable((Boolean) responseBody.get("success")).orElse(false);
            String message = (String) responseBody.get("message");
            String warningMessage = (String) responseBody.getOrDefault("warning_message", "");

            Map<String, Object> orderDataMap = (Map<String, Object>) responseBody.get("order");
            ShippingResponse.OrderData orderData = mapOrderData(orderDataMap);

            return new ShippingResponse(success, message, orderData, warningMessage);
        } else {
            throw new RuntimeException("Unexpected response from GHTK");
        }
    }

    public ShippingFeeResponse getShippingFee(ShippingFeeRequest request) {
        String url = ghtkConfig.getGhtkProductionUrl() + "/fee";
        HttpHeaders headers = createHeadersProduction();
        request.fromConfig(orderConfig);

        log.info("Sending request to GHTK: {}", request);
        HttpEntity<ShippingFeeRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<Map> response = ghtkConfig.ghtkRestTemplate().exchange(url, HttpMethod.POST, entity, Map.class);
            log.info("GHTK Response: {}", response);

            if (response.getStatusCode() != HttpStatus.OK) {
                log.error("Failed to get shipping fee. HTTP Status: {}", response.getStatusCode());
                return ShippingFeeResponse.builder().success(false).build();
            }

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !Boolean.TRUE.equals(responseBody.get("success"))) {
                log.error("GHTK API failure: {}", responseBody != null ? responseBody.get("message") : "No response");
                return ShippingFeeResponse.builder().success(false).build();
            }

            Map<String, Object> feeData = (Map<String, Object>) responseBody.get("fee");
            if (feeData == null) {
                log.error("Invalid fee format: {}", responseBody.get("fee"));
                return ShippingFeeResponse.builder().success(false).build();
            }

            ShippingFeeResponse.FeeDetails feeDetails = new ShippingFeeResponse.FeeDetails();
            feeDetails.setName((String) feeData.getOrDefault("name", "Unknown"));
            feeDetails.setFee((Integer) feeData.getOrDefault("fee", 0));
            feeDetails.setInsuranceFee((Integer) feeData.getOrDefault("insurance_fee", 0));
            feeDetails.setDelivery((Boolean) feeData.getOrDefault("delivery", false));

            Object extFeesObject = feeData.get("extFees");
            if (extFeesObject instanceof List<?> extFeesList) {
                feeDetails.setExtFees(extFeesList.stream().map(extFee -> {
                    Map<String, Object> extFeeMap = (Map<String, Object>) extFee;
                    return new ShippingFeeResponse.ExtraFee(
                            (String) extFeeMap.getOrDefault("display", "N/A"),
                            (String) extFeeMap.getOrDefault("title", "N/A"),
                            (Integer) extFeeMap.getOrDefault("amount", 0),
                            (String) extFeeMap.getOrDefault("type", "N/A"));
                }).toList());
            }

            return ShippingFeeResponse.builder()
                    .success(true)
                    .message((String) responseBody.get("message"))
                    .fee(feeDetails)
                    .build();
        } catch (Exception e) {
            log.error("Error while calling GHTK API: {}", e.getMessage(), e);
            return ShippingFeeResponse.builder().success(false).build();
        }
    }

    public OrderStatusResponse checkOrderStatus(String trackingOrder) {
        String url = ghtkConfig.getGhtkStagingUrl() + trackingOrder;
        HttpHeaders headers = createHeadersStaging();

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = ghtkConfig.ghtkRestTemplate().exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            Boolean success = (Boolean) responseBody.get("success");
            String message = (String) responseBody.get("message");
            Map<String, Object> order = (Map<String, Object>) responseBody.get("order");

            if (order != null) {
                return mapOrderStatusResponse(success, message, order);
            }
        }
        throw new RuntimeException("Failed to fetch order status from GHTK");
    }

    public CancelShippingResponse cancelShipping(String trackingOrder) {
        String url = ghtkConfig.getGhtkStagingUrl() + "/cancel/" + trackingOrder;
        HttpHeaders headers = createHeadersStaging();

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = ghtkConfig.ghtkRestTemplate().exchange(url, HttpMethod.GET, entity, Map.class);

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

    private HttpHeaders createHeadersStaging() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghtkConfig.getGhtkStagingToken());
        headers.set("X-Client-Source", ghtkConfig.getGhtkPartnerCode());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
    private HttpHeaders createHeadersProduction() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghtkConfig.getGhtkProductionToken());
        headers.set("X-Client-Source", ghtkConfig.getGhtkPartnerCode());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private ShippingResponse.OrderData mapOrderData(Map<String, Object> orderDataMap) {
        if (orderDataMap == null) {
            return null;
        }
        return new ShippingResponse.OrderData(
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

    private OrderStatusResponse mapOrderStatusResponse(Boolean success, String message, Map<String, Object> order) {
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

    private Double parseDouble(Object value) {
        return value == null ? null : Double.parseDouble(value.toString());
    }
}
