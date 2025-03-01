package com.example.shipping_service.repository;

import com.example.shipping_service.dto.response.ShippingResponse;
import com.example.shipping_service.entity.ShippingInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingRepository extends MongoRepository<ShippingResponse, String> {
}
