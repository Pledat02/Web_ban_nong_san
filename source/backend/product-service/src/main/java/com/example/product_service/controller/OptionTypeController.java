package com.example.product_service.controller;

import com.example.product_service.dto.request.OptionTypeRequest;
import com.example.product_service.dto.response.ApiResponse;
import com.example.product_service.dto.response.OptionTypeResponse;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.service.OptionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/options")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OptionTypeController {
    OptionService OptionTypeService;
    // Get all categories
    @GetMapping
    public ApiResponse<Iterable<OptionTypeResponse>> getAllCategories() {
        return ApiResponse.<Iterable<OptionTypeResponse>>builder()
                .data(OptionTypeService.getAllCategories())
                .build();
    }
    // Get OptionType by id
    @GetMapping("/{id}")
    public ApiResponse<OptionTypeResponse> getOptionTypeById(@PathVariable Long id) {
        return ApiResponse.<OptionTypeResponse>builder()
                .data(OptionTypeService.getOptionTypeById(id))
                .build();
    }
    // Post a new OptionType
    @PostMapping
    public ApiResponse<OptionTypeResponse> createOptionType(@RequestBody OptionTypeRequest request) {
        return ApiResponse.<OptionTypeResponse>builder()
               .data(OptionTypeService.createOptionType(request))
               .build();
    }
    // Update a OptionType
    @PutMapping("/{id}")
    public ApiResponse<OptionTypeResponse> updateOptionType(@PathVariable Long id, OptionTypeRequest request) {
        OptionTypeResponse OptionType = OptionTypeService.updateOptionType(id, request);
        if (OptionType == null) throw new AppException(ErrorCode.OPTION_TYPE_NOT_FOUND);
        return ApiResponse.<OptionTypeResponse>builder()
               .data(OptionType)
               .build();
    }
}
