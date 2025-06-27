package com.example.order_service.repository;

import com.example.order_service.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

    @Query(nativeQuery = true, value =
            "SELECT oi.product_code AS productCode, oi.name AS name, " +
                    "SUM(oi.quantity) AS quantity, SUM(oi.quantity * oi.price) AS revenue " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE o.order_date BETWEEN :startDate AND :endDate " +
                    "GROUP BY oi.product_code, oi.name " +
                    "ORDER BY revenue DESC " +
                    "LIMIT :limit")
    List<Object[]> findTopProductsByRevenueCustomRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("limit") int limit);

    @Query(nativeQuery = true, value =
            "SELECT o.id_user AS userId, o.customer_name AS customerName, " +
                    "COUNT(o.id_order) AS totalOrders, SUM(o.value) AS totalValue " +
                    "FROM orders o " +
                    "WHERE o.order_date BETWEEN :startDate AND :endDate " +
                    "GROUP BY o.id_user, o.customer_name " +
                    "ORDER BY totalValue DESC " +
                    "LIMIT :limit")
    List<Object[]> findTopCustomersByValueCustomRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("limit") int limit);

    @Query(nativeQuery = true, value =
            "SELECT o.id_user AS userId, oi.name AS productName " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE o.order_date BETWEEN :startDate AND :endDate " +
                    "GROUP BY o.id_user, oi.name " +
                    "HAVING SUM(oi.quantity) = (" +
                    "    SELECT MAX(total_quantity) " +
                    "    FROM (" +
                    "        SELECT SUM(oi2.quantity) AS total_quantity " +
                    "        FROM order_item oi2 " +
                    "        JOIN orders o2 ON oi2.id_order = o2.id_order " +
                    "        WHERE o2.id_user = o.id_user " +
                    "        AND o2.order_date BETWEEN :startDate AND :endDate " +
                    "        GROUP BY oi2.product_code " +
                    "    ) sub" +
                    ")")
    List<Object[]> findFavoriteProductsByCustomerCustomRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(DISTINCT o.id_user) " +
                    "FROM orders o " +
                    "WHERE o.order_date BETWEEN :startDate AND :endDate")
    long countCustomersByCustomRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query(nativeQuery = true, value =
            "SELECT SUM(oi.quantity) " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE o.order_date BETWEEN :startDate AND :endDate")
    long countProductsSoldByCustomRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(DISTINCT o.id_user) " +
                    "FROM orders o " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY))")
    long countCustomersByTimeframe(@Param("timeframe") String timeframe);

    @Query(nativeQuery = true, value =
            "SELECT SUM(oi.quantity) " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY))")
    Long countProductsSoldByTimeframe(@Param("timeframe") String timeframe);

    @Query(nativeQuery = true, value =
            "SELECT o.id_user AS userId, o.customer_name AS customerName, " +
                    "COUNT(o.id_order) AS totalOrders, SUM(o.value) AS totalValue " +
                    "FROM orders o " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)) " +
                    "GROUP BY o.id_user, o.customer_name " +
                    "ORDER BY totalValue DESC " +
                    "LIMIT :limit")
    List<Object[]> findTopCustomersByValue(@Param("timeframe") String timeframe, @Param("limit") int limit);

    @Query(nativeQuery = true, value =
            "SELECT o.id_user AS userId, oi.name AS productName " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)) " +
                    "GROUP BY o.id_user, oi.name " +
                    "HAVING SUM(oi.quantity) = (" +
                    "    SELECT MAX(total_quantity) " +
                    "    FROM (" +
                    "        SELECT SUM(oi2.quantity) AS total_quantity " +
                    "        FROM order_item oi2 " +
                    "        JOIN orders o2 ON oi2.id_order = o2.id_order " +
                    "        WHERE o2.id_user = o.id_user " +
                    "        AND (:timeframe = 'all' OR " +
                    "             (:timeframe = 'daily' AND o2.order_date >= CURRENT_DATE) OR " +
                    "             (:timeframe = 'weekly' AND o2.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "             (:timeframe = 'monthly' AND o2.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "             (:timeframe = 'yearly' AND o2.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY))) " +
                    "        GROUP BY oi2.product_code " +
                    "    ) sub" +
                    ") " +
                    "LIMIT :limit")
    List<Object[]> findFavoriteProductsByCustomer(@Param("timeframe") String timeframe, @Param("limit") int limit);

    @Query(nativeQuery = true, value =
            "SELECT oi.product_code AS productCode, oi.name AS name, " +
                    "SUM(oi.quantity) AS quantity, SUM(oi.quantity * oi.price) AS revenue " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)) " +
                    "GROUP BY oi.product_code, oi.name " +
                    "ORDER BY revenue DESC " +
                    "LIMIT :limit")
    List<Object[]> findTopProductsByRevenue(@Param("timeframe") String timeframe, @Param("limit") int limit);
}