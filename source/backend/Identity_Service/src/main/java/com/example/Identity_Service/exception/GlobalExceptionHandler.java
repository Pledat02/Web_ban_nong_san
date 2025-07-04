package com.example.Identity_Service.exception;

import com.example.Identity_Service.dto.response.ApiResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.util.backoff.FixedBackOff;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import jakarta.validation.ConstraintViolation;

import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE ="min";
    // bat cac valid chua duoc configuration
//    @ExceptionHandler(value = Exception.class)
//    ResponseEntity<ApiResponse<String>> handleRuntimeExceptions() {
//        ApiResponse<String> ApiResponse = new ApiResponse<>();
//        ApiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
//        ApiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
//        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode()).body(ApiResponse);
//    }

    // check valid api
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<String>> handleAppExceptions(AppException exception) {
        ApiResponse<String> ApiResponse = new ApiResponse<>();
        ApiResponse.setCode(exception.getErrorCode().getCode());
        ApiResponse.setMessage(exception.getMessage());
        return ResponseEntity.status(exception.getErrorCode().getStatusCode()).body(ApiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<String>> handleAccessDeniedExceptions() {
        ApiResponse<String> ApiResponse = new ApiResponse<>();
        ApiResponse.setCode(ErrorCode.USER_NOT_AUTHORIZED.getCode());
        ApiResponse.setMessage(ErrorCode.USER_NOT_AUTHORIZED.getMessage());
        return ResponseEntity.status(ErrorCode.USER_NOT_AUTHORIZED.getStatusCode()).body(ApiResponse);
    }

    // check valid entity
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        ErrorCode errorCode;
        Map<String, Object> atrributes = null;
        String enumkey = ex.getFieldError().getDefaultMessage();
        try {
            errorCode = ErrorCode.valueOf(enumkey);
            var constraintViolation = ex.getBindingResult()
                    .getAllErrors().getFirst().unwrap(ConstraintViolation.class);
             atrributes = constraintViolation.getConstraintDescriptor().getAttributes();
        } catch (IllegalArgumentException exception) {
            errorCode = ErrorCode.INVALID_KEY;
        }
        ApiResponse<String> ApiResponse = new ApiResponse<>();
        ApiResponse.setCode(errorCode.getCode());
        ApiResponse.setMessage(Objects.nonNull(atrributes)
        ? getMessageError(atrributes, errorCode.getMessage())
                : errorCode.getMessage());
        return ResponseEntity.status(ex.getStatusCode()).body(ApiResponse);
    }

    private String getMessageError(Map<String, Object> attributes , String message) {
            String minvalue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        return message.replace("{"+MIN_ATTRIBUTE+"}",minvalue);
    }
    @Bean
    public DefaultErrorHandler errorHandler() {
        FixedBackOff fixedBackOff = new FixedBackOff(1000L, 3); // retry 3 lần, mỗi lần cách 1 giây
        DefaultErrorHandler errorHandler = new DefaultErrorHandler((record, exception) -> {
        }, fixedBackOff);
        return errorHandler;
    }

}
