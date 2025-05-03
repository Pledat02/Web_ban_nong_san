import axios from "axios";
import { toast } from "react-toastify";

class ProductService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/products/admin",
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },

        });
        this.api.interceptors.request.use(
            (config) => {
                const user = JSON.parse(localStorage.getItem("user")) || {};
                const token = user.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    // Get all products with pagination
    async getAllProducts(page = 1, size = 10) {
        try {
            const response = await this.api.get("", {
                params: { page, size },
            });
            if (response.status === 200 && response.data.code === 0) {
                const data = response.data.data;
                if (data && typeof data === 'object' && Array.isArray(data.elements)) {
                    return {
                        content: data.elements,
                        page: data.currentPage || page,
                        size: size,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1,
                    };
                } else {
                    console.warn('Unexpected response structure:', data);
                    toast.error('Dữ liệu sản phẩm không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không lấy được danh sách sản phẩm", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách sản phẩm: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    // Get product by ID
    async getProductById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            if (response.status === 200 && response.data.code === 0) {
                const product = response.data.data;
                return product || null;
            } else {
                toast.error(response.data.message || "Không lấy được thông tin sản phẩm", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin sản phẩm: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    // Create a new product
    async createProduct({ productData, file }) {
        try {
            if (!productData || !file) {
                throw new Error("productData and file are required");
            }
            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            formData.append('file', file);

            const response = await this.api.post("/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Tạo sản phẩm thành công", { position: "top-right" });
                const product = response.data.data;
                return product || null;
            } else {
                toast.error(response.data.message || "Không tạo được sản phẩm", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi tạo sản phẩm: ${message}`, {
                position: "top-right",
            });
            console.error('Error creating product:', error);
            return null;
        }
    }

    // Update product
    async updateProduct(id, { productData, file }) {
        try {
            if (!productData) {
                throw new Error("productData is required");
            }
            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            if (file) {
                formData.append('file', file);
            }

            const response = await this.api.put(`/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success("Cập nhật sản phẩm thành công", { position: "top-right" });
                const product = response.data.data;
                return product || null;
            } else {
                toast.error(response.data.message || "Không cập nhật được sản phẩm", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi cập nhật sản phẩm: ${message}`, {
                position: "top-right",
            });
            console.error('Error updating product:', error);
            return null;
        }
    }

    // Delete product
    async deleteProduct(id) {
        try {
            const response = await this.api.delete(`/${id}`);
            if (response.status === 200) {
                const message = response.data.message || "Xóa sản phẩm thành công";
                toast.success(message, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không xóa được sản phẩm", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }

    // Restore product
    async restoreProduct(id) {
        try {
            const response = await this.api.post(`/${id}/restore`);
            if (response.status === 200 && response.data.code === 0) {
                const message = response.data.message || "Khôi phục sản phẩm thành công";
                toast.success(message, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không khôi phục được sản phẩm", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi khôi phục sản phẩm: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }
}

const productService = new ProductService();
export default productService;