package com.example.shipping_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingFeeResponse {
        private boolean success;
        private String message;
        private FeeDetails fee;

        @Data
        public static class FeeDetails {
            private String name;
            private int fee;
            private int insuranceFee;
            private boolean delivery;
            private List<ExtraFee> extFees;
        }

        @Data
        public static class ExtraFee {
            private String display;
            private String title;
            private int amount;
            private String type;
        }
}
