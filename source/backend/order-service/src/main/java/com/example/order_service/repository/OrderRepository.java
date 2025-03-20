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

    @Query("SELECT o FROM Order o WHERE o.id_user = :userId " +
            "AND (:status IS NULL OR o.status = :status) " +
            "ORDER BY o.order_date DESC")
    Page<Order> findAllOrderByUserId(@Param("userId") String userId,
                                     @Param("status") String status,
                                     Pageable pageable);

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
