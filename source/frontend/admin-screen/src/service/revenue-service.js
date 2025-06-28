import axios from "axios";
import { toast } from "react-toastify";

class RevenueService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/orders/revenue",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Giữ session nếu dùng cookie
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
            (error) => Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 403) {
                    toast.error("Bạn không có quyền truy cập tài nguyên này!", {
                        position: "top-right",
                    });
                    window.location.href = "/403";
                }
                return Promise.reject(error);
            }
        );
    }

    // Lấy doanh thu theo ngày
    async getDailyRevenue() {
        try {
            const response = await this.api.get("/daily");
            if (response.status === 200) {
                return response.data.data.map(({ timePeriod, totalRevenue }) => ({
                    date: timePeriod,
                    revenue: Number(totalRevenue) || 0,
                }));
            } else {
                toast.error(response.data.message || "Không lấy được doanh thu theo ngày", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy doanh thu theo ngày: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }

    // Lấy doanh thu theo tuần
    async getWeeklyRevenue() {
        try {
            const response = await this.api.get("/weekly");
            if (response.status === 200) {
                return response.data.data.map(({ timePeriod, totalRevenue }) => ({
                    date: timePeriod,
                    revenue: Number(totalRevenue) || 0,
                }));
            } else {
                toast.error(response.data.message || "Không lấy được doanh thu theo tuần", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy doanh thu theo tuần: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }

    // Lấy doanh thu theo tháng
    async getMonthlyRevenue() {
        try {
            const response = await this.api.get("/monthly");
            if (response.status === 200) {
                return response.data.data.map(({ timePeriod, totalRevenue }) => ({
                    date: timePeriod,
                    revenue: Number(totalRevenue) || 0,
                }));
            } else {
                toast.error(response.data.message || "Không lấy được doanh thu theo tháng", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy doanh thu theo tháng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }

    // Lấy doanh thu theo năm
    async getYearlyRevenue() {
        try {
            const response = await this.api.get("/yearly");
            if (response.status === 200) {
                return response.data.data.map(({ timePeriod, totalRevenue }) => ({
                    date: timePeriod,
                    revenue: Number(totalRevenue) || 0,
                }));
            } else {
                toast.error(response.data.message || "Không lấy được doanh thu theo năm", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy doanh thu theo năm: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }

    // Lấy doanh thu trung bình tháng
    async getAverageMonthlyRevenue() {
        try {
            const response = await this.api.get("/average-monthly");
            if (response.status === 200) {
                return Number(response.data.data) || 0;
            } else {
                toast.error(response.data.message || "Không lấy được doanh thu trung bình tháng", {
                    position: "top-right",
                });
                return 0;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy doanh thu trung bình tháng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return 0;
        }
    }

    // Lấy doanh thu tháng hiện tại và tỉ lệ tăng trưởng
    async getCurrentMonthGrowth() {
        try {
            const data = await this.getMonthlyRevenue();
            const currentMonth = new Date().toISOString().slice(0, 7); // Ví dụ: '2025-06'
            const [year, month] = currentMonth.split('-').map(Number);
            const previousMonthDate = `${month === 1 ? year - 1 : year}-${month === 1 ? '12' : String(month - 1).padStart(2, '0')}`;
            const current = data.find(item => item.date === currentMonth)?.revenue || 0;
            const previous = data.find(item => item.date === previousMonthDate)?.revenue || 0;
            const growth = previous === 0 ? 0 : ((current - previous) / previous) * 100;
            return {
                currentRevenue: current,
                growthRate: Math.round(Math.abs(growth) * 10) / 10,
                isPositive: growth >= 0,
            };
        } catch (error) {
            toast.error("Lỗi khi tính tỉ lệ tăng trưởng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { currentRevenue: 0, growthRate: 0, isPositive: true };
        }
    }

    // Lấy top sản phẩm theo doanh thu
    async getTopProductsByRevenue(timeframe = 'all', limit = 5, startDate = null, endDate = null) {
        try {
            const params = { timeframe, limit };
            if (timeframe.toLowerCase() === 'date-range' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            } else if (timeframe.toLowerCase() === 'date-range') {
                toast.error("startDate and endDate are required for date-range timeframe", {
                    position: "top-right",
                });
                return [];
            }

            const response = await this.api.get("/top-products", { params });
            if (response.status === 200) {
                return response.data.data.map(({ id, name, quantity, revenue, growth }) => ({
                    id: Number(id) || 0,
                    name: name || "Unknown",
                    quantity: Number(quantity) || 0,
                    revenue: Number(revenue) || 0,
                    growth: Number(growth) || 0,
                }));
            } else {
                toast.error(response.data.message || "Không lấy được top sản phẩm", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy top sản phẩm: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }

    // Lấy top khách hàng theo giá trị
    async getTopCustomersByValue(timeframe = 'all', limit = 5, startDate = null, endDate = null) {
        try {
            const params = { timeframe, limit };
            if (timeframe.toLowerCase() === 'date-range' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            } else if (timeframe.toLowerCase() === 'date-range') {
                toast.error("startDate and endDate are required for date-range timeframe", {
                    position: "top-right",
                });
                return [];
            }

            const response = await this.api.get("/top-customers", { params });
            if (response.status === 200) {
                return response.data.data.map(({ userId, customerName, totalOrders, totalValue, favoriteProduct }) => ({
                    id: userId || "",
                    name: customerName || "Unknown",
                    totalOrders: Number(totalOrders) || 0,
                    totalSpent: Number(totalValue) || 0,
                    favoriteProduct: favoriteProduct || "Unknown",
                }));
            } else {
                toast.error(response.data.message || "Không lấy được top khách hàng", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy top khách hàng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }

    // Lấy số lượng khách hàng đã mua hàng
    async getCustomerCount(timeframe = 'all', startDate = null, endDate = null) {
        try {
            const params = { timeframe };
            if (timeframe.toLowerCase() === 'date-range' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            } else if (timeframe.toLowerCase() === 'date-range') {
                toast.error("startDate and endDate are required for date-range timeframe", {
                    position: "top-right",
                });
                return 0;
            }

            const response = await this.api.get("/customer-count", { params });
            if (response.status === 200) {
                return Number(response.data.data) || 0;
            } else {
                toast.error(response.data.message || "Không lấy được số lượng khách hàng", {
                    position: "top-right",
                });
                return 0;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy số lượng khách hàng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return 0;
        }
    }

    // Lấy số lượng sản phẩm đã được bán
    async getProductsSoldCount(timeframe = 'all', startDate = null, endDate = null) {
        try {
            const params = { timeframe };
            if (timeframe.toLowerCase() === 'date-range' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            } else if (timeframe.toLowerCase() === 'date-range') {
                toast.error("startDate and endDate are required for date-range timeframe", {
                    position: "top-right",
                });
                return 0;
            }

            const response = await this.api.get("/products-sold-count", { params });
            if (response.status === 200) {
                return Number(response.data.data) || 0;
            } else {
                toast.error(response.data.message || "Không lấy được số lượng sản phẩm đã bán", {
                    position: "top-right",
                });
                return 0;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy số lượng sản phẩm đã bán: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return 0;
        }
    }

    // Trong revenue-service.js
    async getRevenueByDateRange(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                toast.error("startDate and endDate are required for date-range", {
                    position: "top-right",
                });
                return [];
            }

            const response = await this.api.get("/date-range", {
                params: { startDate, endDate },
            });
            if (response.status === 200) {
                return response.data.data.map(({ timePeriod, totalRevenue }) => ({
                    date: timePeriod,
                    revenue: Number(totalRevenue) || 0,
                }));
            } else {
                toast.error(response.data.message || "Không lấy được doanh thu theo khoảng thời gian", {
                    position: "top-right",
                });
                return [];
            }
        } catch (error) {
            toast.error("Lỗi khi lấy doanh thu theo khoảng thời gian: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return [];
        }
    }
}

const revenueService = new RevenueService();
export default revenueService;