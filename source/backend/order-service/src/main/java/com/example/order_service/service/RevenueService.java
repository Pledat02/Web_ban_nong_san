package com.example.order_service.service;

import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.dto.response.TopCustomerResponse;
import com.example.order_service.dto.response.TopProductResponse;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class RevenueService {
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;

    public List<RevenueResponse> getDailyRevenue() {
        List<Object[]> results = orderRepository.getDailyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public List<RevenueResponse> getWeeklyRevenue() {
        List<Object[]> results = orderRepository.getWeeklyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public List<RevenueResponse> getMonthlyRevenue() {
        List<Object[]> results = orderRepository.getMonthlyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public List<RevenueResponse> getYearlyRevenue() {
        List<Object[]> results = orderRepository.getYearlyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public Double getAverageMonthlyRevenue() {
        return orderRepository.getAverageMonthlyRevenue();
    }

    public List<TopProductResponse> getTopProductsByRevenue(String timeframe, int limit) {
        List<Object[]> currentResults = orderItemRepository.findTopProductsByRevenue(timeframe);
        String previousTimeframe = getPreviousTimeframe(timeframe);
        List<Object[]> previousResults = orderItemRepository.findTopProductsByRevenue(previousTimeframe);

        Map<Long, Double> previousRevenueMap = previousResults.stream()
                .collect(Collectors.toMap(
                        row ->((Number) row[0]).longValue(),
                        row -> ((Number) row[3]).doubleValue()
                ));

        return currentResults.stream()
                .limit(limit)
                .map(result -> {
                    long productCode = ((Number) result[0]).longValue();
                    double currentRevenue = ((Number) result[3]).doubleValue();
                    double previousRevenue = previousRevenueMap.getOrDefault(productCode, 0.0);
                    double growth = previousRevenue == 0 ? 0.0 :
                            ((currentRevenue - previousRevenue) / previousRevenue) * 100;

                    return TopProductResponse.builder()
                            .id(productCode)
                            .name((String) result[1])
                            .quantity(((Number) result[2]).longValue())
                            .revenue(currentRevenue)
                            .growth(Double.isFinite(growth) ? growth : 0.0)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<TopCustomerResponse> getTopCustomersByValue(String timeframe, int limit) {
        List<Object[]> customerResults = orderItemRepository.findTopCustomersByValue(timeframe);
        List<Object[]> favoriteProductResults = orderItemRepository.findFavoriteProductsByCustomer(timeframe);

        Map<String, String> favoriteProductMap = favoriteProductResults.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0], // userId
                        row -> (String) row[1], // productName
                        (existing, replacement) -> existing // Giữ lại giá trị đầu tiên nếu trùng
                ));

        return customerResults.stream()
                .limit(limit)
                .map(row -> {
                    String userId = (String) row[0];
                    return TopCustomerResponse.builder()
                            .userId(userId)
                            .customerName((String) row[1])
                            .totalOrders(((Number) row[2]).longValue())
                            .totalValue(((Number) row[3]).doubleValue())
                            .favoriteProduct(favoriteProductMap.getOrDefault(userId, "Unknown"))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public long getCustomerCount(String timeframe) {
        return orderItemRepository.countCustomersByTimeframe(timeframe);
    }

    public long getProductsSoldCount(String timeframe) {
        Long result = orderItemRepository.countProductsSoldByTimeframe(timeframe);
        return result != null ? result : 0L;
    }

    private String getPreviousTimeframe(String timeframe) {
        return switch (timeframe.toLowerCase()) {
            case "daily" -> "yesterday";
            case "weekly" -> "last_week";
            case "monthly" -> "last_month";
            case "yearly" -> "last_year";
            case "all" -> "all";
            default -> throw new IllegalArgumentException("Invalid timeframe: " + timeframe);
        };
    }
}