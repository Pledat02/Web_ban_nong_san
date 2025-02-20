package com.example.product_service.repository;

import com.example.product_service.entity.Category;
import com.example.product_service.entity.OptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionRepository extends JpaRepository<OptionType,Long> {

}
