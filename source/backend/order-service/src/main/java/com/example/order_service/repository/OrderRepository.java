package com.example.order_service.repository;

import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order,String> {

    @Query("SELECT o FROM Order o WHERE o.id_user = :userId ORDER BY o.order_date DESC")
    Page<Order> findAllOrderByUserId(String userId, Pageable pageable);
    @Query("SELECT o FROM Order o WHERE " +
            "CAST(o.order_date AS string) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.paymentMethod) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.status) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Order> searchOrders(String keyword, Pageable pageable);


    // Doanh thu theo ngày
    @Query("SELECT DATE(o.order_date) AS timePeriod, SUM(o.totalPrice) AS totalRevenue FROM Order o GROUP BY DATE(o.order_date)")
    List<Object[]> getDailyRevenue();

    // Doanh thu theo tháng
    @Query("SELECT CONCAT(YEAR(o.order_date), '-', MONTH(o.order_date)) AS timePeriod, SUM(o.totalPrice) AS totalRevenue FROM Order o GROUP BY YEAR(o.order_date), MONTH(o.order_date)")
    List<Object[]> getMonthlyRevenue();

    // Doanh thu theo năm
    @Query("SELECT YEAR(o.order_date) AS timePeriod, SUM(o.totalPrice) AS totalRevenue FROM Order o GROUP BY YEAR(o.order_date)")
    List<Object[]> getYearlyRevenue();




}
