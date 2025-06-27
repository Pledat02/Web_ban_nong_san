package com.example.order_service.controller;

import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.dto.response.TopCustomerResponse;
import com.example.order_service.dto.response.TopProductResponse;
import com.example.order_service.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.sql.Date;
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
                .message("Daily revenue retrieved successfully")
                .build();
    }

    @GetMapping("/weekly")
    public ApiResponse<List<RevenueResponse>> getWeeklyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
                .data(revenueService.getWeeklyRevenue())
                .message("Weekly revenue retrieved successfully")
                .build();
    }

    @GetMapping("/monthly")
    public ApiResponse<List<RevenueResponse>> getMonthlyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
                .data(revenueService.getMonthlyRevenue())
                .message("Monthly revenue retrieved successfully")
                .build();
    }

    @GetMapping("/yearly")
    public ApiResponse<List<RevenueResponse>> getYearlyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
                .data(revenueService.getYearlyRevenue())
                .message("Yearly revenue retrieved successfully")
                .build();
    }

    @GetMapping("/date-range")
    public ApiResponse<List<RevenueResponse>> getRevenueByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            dateFormat.setLenient(false); // Ngăn chặn phân tích ngày không hợp lệ
            Date sqlStartDate = new Date(dateFormat.parse(startDate).getTime());
            Date sqlEndDate = new Date(dateFormat.parse(endDate).getTime());

            if (sqlStartDate.after(sqlEndDate)) {
                return ApiResponse.<List<RevenueResponse>>builder()
                        .message("Start date must be before end date")
                        .build();
            }

            return ApiResponse.<List<RevenueResponse>>builder()
                    .data(revenueService.getRevenueByDateRange(sqlStartDate, sqlEndDate))
                    .message("Revenue by date range retrieved successfully")
                    .build();
        } catch (ParseException e) {
            return ApiResponse.<List<RevenueResponse>>builder()
                    .message("Invalid date format. Use yyyy-MM-dd")
                    .build();
        }
    }

    @GetMapping("/average-monthly")
    public ApiResponse<Double> getAvgRevenue() {
        return ApiResponse.<Double>builder()
                .data(revenueService.getAverageMonthlyRevenue())
                .message("Average monthly revenue retrieved successfully")
                .build();
    }

    @GetMapping("/top-products")
    public ApiResponse<List<TopProductResponse>> getTopProductsByRevenue(
            @RequestParam(defaultValue = "all") String timeframe,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            if ("date-range".equalsIgnoreCase(timeframe)) {
                if (startDate == null || endDate == null) {
                    return ApiResponse.<List<TopProductResponse>>builder()
                            .message("startDate and endDate are required for date-range timeframe")
                            .build();
                }
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                dateFormat.setLenient(false);
                Date sqlStartDate = new Date(dateFormat.parse(startDate).getTime());
                Date sqlEndDate = new Date(dateFormat.parse(endDate).getTime());

                if (sqlStartDate.after(sqlEndDate)) {
                    return ApiResponse.<List<TopProductResponse>>builder()
                            .message("Start date must be before end date")
                            .build();
                }

                return ApiResponse.<List<TopProductResponse>>builder()
                        .data(revenueService.getTopProductsByRevenue(timeframe, limit, sqlStartDate, sqlEndDate))
                        .message("Top products by revenue retrieved successfully")
                        .build();
            } else {
                return ApiResponse.<List<TopProductResponse>>builder()
                        .data(revenueService.getTopProductsByRevenue(timeframe, limit, null, null))
                        .message("Top products by revenue retrieved successfully")
                        .build();
            }
        } catch (ParseException e) {
            return ApiResponse.<List<TopProductResponse>>builder()
                    .message("Invalid date format. Use yyyy-MM-dd")
                    .build();
        }
    }

    @GetMapping("/top-customers")
    public ApiResponse<List<TopCustomerResponse>> getTopCustomersByRevenue(
            @RequestParam(defaultValue = "all") String timeframe,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            if ("date-range".equalsIgnoreCase(timeframe)) {
                if (startDate == null || endDate == null) {
                    return ApiResponse.<List<TopCustomerResponse>>builder()
                            .message("startDate and endDate are required for date-range timeframe")
                            .build();
                }
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                dateFormat.setLenient(false);
                Date sqlStartDate = new Date(dateFormat.parse(startDate).getTime());
                Date sqlEndDate = new Date(dateFormat.parse(endDate).getTime());

                if (sqlStartDate.after(sqlEndDate)) {
                    return ApiResponse.<List<TopCustomerResponse>>builder()
                            .message("Start date must be before end date")
                            .build();
                }

                return ApiResponse.<List<TopCustomerResponse>>builder()
                        .data(revenueService.getTopCustomersByValue(timeframe, limit, sqlStartDate, sqlEndDate))
                        .message("Top customers by revenue retrieved successfully")
                        .build();
            } else {
                return ApiResponse.<List<TopCustomerResponse>>builder()
                        .data(revenueService.getTopCustomersByValue(timeframe, limit, null, null))
                        .message("Top customers by revenue retrieved successfully")
                        .build();
            }
        } catch (ParseException e) {
            return ApiResponse.<List<TopCustomerResponse>>builder()
                    .message("Invalid date format. Use yyyy-MM-dd")
                    .build();
        }
    }

    @GetMapping("/customer-count")
    public ApiResponse<Long> getCustomerCount(
            @RequestParam(defaultValue = "all") String timeframe,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            if ("date-range".equalsIgnoreCase(timeframe)) {
                if (startDate == null || endDate == null) {
                    return ApiResponse.<Long>builder()
                            .message("startDate and endDate are required for date-range timeframe")
                            .build();
                }
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                dateFormat.setLenient(false);
                Date sqlStartDate = new Date(dateFormat.parse(startDate).getTime());
                Date sqlEndDate = new Date(dateFormat.parse(endDate).getTime());

                if (sqlStartDate.after(sqlEndDate)) {
                    return ApiResponse.<Long>builder()
                            .message("Start date must be before end date")
                            .build();
                }

                return ApiResponse.<Long>builder()
                        .data(revenueService.getCustomerCount(timeframe, sqlStartDate, sqlEndDate))
                        .message("Customer count retrieved successfully")
                        .build();
            } else {
                return ApiResponse.<Long>builder()
                        .data(revenueService.getCustomerCount(timeframe, null, null))
                        .message("Customer count retrieved successfully")
                        .build();
            }
        } catch (ParseException e) {
            return ApiResponse.<Long>builder()
                    .message("Invalid date format. Use yyyy-MM-dd")
                    .build();
        }
    }

    @GetMapping("/products-sold-count")
    public ApiResponse<Long> getProductsSoldCount(
            @RequestParam(defaultValue = "all") String timeframe,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            if ("date-range".equalsIgnoreCase(timeframe)) {
                if (startDate == null || endDate == null) {
                    return ApiResponse.<Long>builder()
                            .message("startDate and endDate are required for date-range timeframe")
                            .build();
                }
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                dateFormat.setLenient(false);
                Date sqlStartDate = new Date(dateFormat.parse(startDate).getTime());
                Date sqlEndDate = new Date(dateFormat.parse(endDate).getTime());

                if (sqlStartDate.after(sqlEndDate)) {
                    return ApiResponse.<Long>builder()
                            .message("Start date must be before end date")
                            .build();
                }

                return ApiResponse.<Long>builder()
                        .data(revenueService.getProductsSoldCount(timeframe, sqlStartDate, sqlEndDate))
                        .message("Products sold count retrieved successfully")
                        .build();
            } else {
                return ApiResponse.<Long>builder()
                        .data(revenueService.getProductsSoldCount(timeframe, null, null))
                        .message("Products sold count retrieved successfully")
                        .build();
            }
        } catch (ParseException e) {
            return ApiResponse.<Long>builder()
                    .message("Invalid date format. Use yyyy-MM-dd")
                    .build();
        }
    }
}