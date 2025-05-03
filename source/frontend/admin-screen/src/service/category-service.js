import axios from "axios";
import { toast } from "react-toastify";

class CategoryService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/products/categories",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
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

    // Get all categories with pagination and search
    async getAllCategories(page = 1, size = 10, keyword = "") {
        try {
            const response = await this.api.get("", {
                params: { page, size, keyword },
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
                    toast.error('Dữ liệu danh mục không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không lấy được danh sách danh mục", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách danh mục: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }
    // Create a new category
    async createCategory(name) {
        try {
            const response = await this.api.post("", { name });
            if (response.status === 200 && response.data.code === 0) {
                toast.success("Tạo danh mục thành công", { position: "top-right" });
                return response.data.data;
            } else {
                toast.error(response.data.message || "Không thể tạo danh mục", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi tạo danh mục: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }
}

const categoriesService = new CategoryService();
export default categoriesService;