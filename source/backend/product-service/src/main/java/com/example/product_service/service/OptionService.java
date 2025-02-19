package com.example.product_service.service;

import com.example.product_service.dto.request.OptionTypeRequest;
import com.example.product_service.dto.response.OptionTypeResponse;
import com.example.product_service.entity.OptionType;
import com.example.product_service.mapper.OptionMapper;
import com.example.product_service.repository.OptionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OptionService {
    OptionRepository OptionTypeRepository;
    OptionMapper OptionTypeMapper;

    // Method to fetch all categories
    public List<OptionTypeResponse> getAllCategories() {
        return OptionTypeRepository.findAll().stream()
                .map(OptionTypeMapper::toOptionTypeResponse).toList();
    }
    // Method to fetch a OptionType by id
    public OptionTypeResponse getOptionTypeById(Long OptionTypeId) {
        return OptionTypeMapper.toOptionTypeResponse(OptionTypeRepository.findById(OptionTypeId).orElse(null));
    }
    // Method to add a new OptionType
    public OptionTypeResponse createOptionType(OptionTypeRequest OptionTypeRequest) {
        log.info(OptionTypeRequest.toString());
        OptionType OptionType = OptionTypeRepository.save(OptionTypeMapper.toOptionType(OptionTypeRequest));
        return OptionTypeMapper.toOptionTypeResponse(OptionType);
    }
    // Method to update a OptionType
    public OptionTypeResponse updateOptionType(Long OptionTypeId, OptionTypeRequest OptionTypeRequest) {
        OptionType OptionType = OptionTypeMapper.updateOptionType(OptionTypeId, OptionTypeRequest);
        return OptionTypeMapper.toOptionTypeResponse(OptionTypeRepository.save(OptionType));
    }
    // Method to delete a OptionType
    public void deleteOptionType(Long OptionTypeId) {
        OptionTypeRepository.deleteById(OptionTypeId);
    }
}
