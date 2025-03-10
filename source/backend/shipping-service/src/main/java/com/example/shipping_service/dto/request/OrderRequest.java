package com.example.shipping_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderRequest {
    @NotBlank(message = "Order ID không được để trống")
    private String id;

    @NotBlank(message = "Tên người lấy hàng không được để trống")
    private String pickName;

    @NotBlank(message = "Địa chỉ lấy hàng không được để trống")
    private String pickAddress;

    @NotBlank(message = "Tỉnh/Thành phố lấy hàng không được để trống")
    private String pickProvince;

    @NotBlank(message = "Quận/Huyện lấy hàng không được để trống")
    private String pickDistrict;

    private String pickWard; // Không bắt buộc

    @NotBlank(message = "Số điện thoại nơi lấy hàng không được để trống")
    private String pickTel;

    @NotBlank(message = "Tên người nhận hàng không được để trống")
    private String name;

    @NotBlank(message = "Địa chỉ người nhận hàng không được để trống")
    private String address;

    @NotBlank(message = "Tỉnh/Thành phố của người nhận hàng không được để trống")
    private String province;

    @NotBlank(message = "Quận/Huyện của người nhận hàng không được để trống")
    private String district;

    @NotBlank(message = "Phường/Xã hoặc Đường/Phố phải có giá trị")
    private String ward;

    private String hamlet;

    @NotBlank(message = "Số điện thoại người nhận hàng không được để trống")
    private String tel;

    @NotNull(message = "Số tiền COD không được để trống")
    @Min(value = 0, message = "Số tiền COD phải lớn hơn hoặc bằng 0")
    private Integer pickMoney;

    @NotNull(message = "Giá trị đóng bảo hiểm không được để trống")
    @Min(value = 0, message = "Giá trị đóng bảo hiểm phải lớn hơn hoặc bằng 0")
    private Integer value;

    private String note; // Không bắt buộc

    private Integer isFreeship = 0; // Mặc định là 0 (không freeship)

    private String pickDate; // Không bắt buộc

    private String transport; // Không bắt buộc

    private String pickOption = "cod"; // Mặc định là cod

    @NotNull(message = "Danh sách sản phẩm không được để trống")
    @Size(min = 1, message = "Phải có ít nhất một sản phẩm")
    private List<ProductRequest> products;
}
