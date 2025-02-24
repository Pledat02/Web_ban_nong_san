package com.example.order_service.service;

import com.example.order_service.dto.request.RevenueRequest;
import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.repository.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class RevenueService {
    OrderRepository orderRepository;
    public List<RevenueResponse> getDailyRevenue() {
        List<Object[]> results = orderRepository.getDailyRevenue();
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
}
