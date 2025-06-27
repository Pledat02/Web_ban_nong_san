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

import java.sql.Date;
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

    public List<RevenueResponse> getRevenueByDateRange(Date startDate, Date endDate) {
        List<Object[]> results = orderRepository.getRevenueByDateRange(startDate, endDate);
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public Double getAverageMonthlyRevenue() {
        Double result = orderRepository.getAverageMonthlyRevenue();
        return result != null ? result : 0.0; // Xử lý null
    }

    public List<TopProductResponse> getTopProductsByRevenue(String timeframe, int limit, Date startDate, Date endDate) {
        List<Object[]> currentResults;

        if ("date-range".equalsIgnoreCase(timeframe)) {
            if (startDate == null || endDate == null || startDate.after(endDate)) {
                throw new IllegalArgumentException("Invalid date range: startDate must be before endDate and both must be provided");
            }
            currentResults = orderItemRepository.findTopProductsByRevenueCustomRange(startDate, endDate, limit);
        } else {
            currentResults = orderItemRepository.findTopProductsByRevenue(timeframe, limit);
        }

        // Không tính growth cho date-range, đặt growth = 0.0
        return currentResults.stream()
                .map(result -> {
                    long productCode = ((Number) result[0]).longValue();
                    double currentRevenue = ((Number) result[3]).doubleValue();
                    double growth = "date-range".equalsIgnoreCase(timeframe) ? 0.0 : 0.0; // Không có previous data

                    return TopProductResponse.builder()
                            .id(productCode)
                            .name((String) result[1])
                            .quantity(((Number) result[2]).longValue())
                            .revenue(currentRevenue)
                            .growth(growth)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<TopCustomerResponse> getTopCustomersByValue(String timeframe, int limit, Date startDate, Date endDate) {
        List<Object[]> customerResults;
        List<Object[]> favoriteProductResults;

        if ("date-range".equalsIgnoreCase(timeframe)) {
            if (startDate == null || endDate == null || startDate.after(endDate)) {
                throw new IllegalArgumentException("Invalid date range: startDate must be before endDate and both must be provided");
            }
            customerResults = orderItemRepository.findTopCustomersByValueCustomRange(startDate, endDate, limit);
            favoriteProductResults = orderItemRepository.findFavoriteProductsByCustomerCustomRange(startDate, endDate);
        } else {
            customerResults = orderItemRepository.findTopCustomersByValue(timeframe, limit);
            favoriteProductResults = orderItemRepository.findFavoriteProductsByCustomer(timeframe,limit);
        }

        Map<String, String> favoriteProductMap = favoriteProductResults.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (String) row[1],
                        (existing, replacement) -> existing
                ));

        return customerResults.stream()
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

    public long getCustomerCount(String timeframe, Date startDate, Date endDate) {
        if ("date-range".equalsIgnoreCase(timeframe)) {
            if (startDate == null || endDate == null || startDate.after(endDate)) {
                throw new IllegalArgumentException("Invalid date range: startDate must be before endDate and both must be provided");
            }
            return orderItemRepository.countCustomersByCustomRange(startDate, endDate);
        }
        return orderItemRepository.countCustomersByTimeframe(timeframe);
    }

    public long getProductsSoldCount(String timeframe, Date startDate, Date endDate) {
        if ("date-range".equalsIgnoreCase(timeframe)) {
            if (startDate == null || endDate == null || startDate.after(endDate)) {
                throw new IllegalArgumentException("Invalid date range: startDate must be before endDate and both must be provided");
            }
            Long result = orderItemRepository.countProductsSoldByCustomRange(startDate, endDate);
            return result != null ? result : 0L;
        }
        Long result = orderItemRepository.countProductsSoldByTimeframe(timeframe);
        return result != null ? result : 0L;
    }

    private String getPreviousTimeframe(String timeframe) {
        // Không áp dụng cho date-range
        if ("date-range".equalsIgnoreCase(timeframe)) {
            throw new IllegalArgumentException("Previous timeframe not applicable for date-range");
        }
        return switch (timeframe.toLowerCase()) {
            case "daily" -> "daily";
            case "weekly" -> "weekly";
            case "monthly" -> "monthly";
            case "yearly" -> "yearly";
            case "all" -> "all";
            default -> throw new IllegalArgumentException("Invalid timeframe: " + timeframe);
        };
    }
}