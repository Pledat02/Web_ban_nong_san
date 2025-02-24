package com.example.order_service.controller;

import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/revenue")
@RequiredArgsConstructor
public class RevenueController {
    private final RevenueService revenueService;

    @GetMapping("/daily")
    public ApiResponse<List<RevenueResponse>> getDailyRevenue() {
       return ApiResponse.<List<RevenueResponse>>builder()
               .data(revenueService.getDailyRevenue())
               .build();
    }

    @GetMapping("/monthly")
    public ApiResponse<List<RevenueResponse>> getMonthlyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
               .data(revenueService.getMonthlyRevenue())
               .build();
    }
    @GetMapping("/yearly")
    public ApiResponse<List<RevenueResponse>> getYearlyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
               .data(revenueService.getYearlyRevenue())
               .build();
    }

}

