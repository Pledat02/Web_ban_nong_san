import axios from "axios";

class ProductService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/products",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: false
        });
    }

    /**
     * Lấy danh sách sản phẩm theo categoryId (có phân trang)
     * @param {number} categoryId - ID của danh mục sản phẩm
     * @param {number} page - Số trang (mặc định 1)
     * @param {number} size - Số sản phẩm trên mỗi trang (mặc định 10)
     * @returns {Promise<Object>} - Dữ liệu phản hồi từ API
     */
    async getProductsByCategory(categoryId, page = 1, size = 8) {
        try {
            const response = await this.api.get(`/category/${categoryId}`, {
                params: { page, size },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching products by category:", error);
            throw error;
        }
    }
    async getProducts( page = 1, size = 6) {
        try {
            const response = await this.api.get("");
            return response.data.data.elements;
        } catch (error) {
            console.error("Error fetching products by category:", error);
            throw error;
        }
    }
    async getFilteredProducts({ query,organic, minPrice, maxPrice, categoryId, brand, origin, page = 1, size = 6 }) {
        try {
            // Lọc ra những tham số không bị undefined
            const params =
                { query,organic, minPrice, maxPrice, categoryId, brand, origin, page, size }
                ;


            const response = await this.api.get("/filter", { params });
            console.log(response)
            return response.data.data;
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            throw error;
        }
    }

    async getProductById(id){
        try {
            const response = await this.api.get(`/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching product by id:", error);
            throw error;
        }
    }
    getMaxPrice(weightProducts,price){
        let maxValue = 0;
        weightProducts.forEach((weightProduct) => {
            let value =0;
            if(weightProduct.unit === 'g'){
                value = price * weightProduct.weightType.value /1000 ;
            }else {
                //kg
                value = price * weightProduct.weightType.value;
            }
            if (value > maxValue) {
                maxValue = value;
            }
        });
        return maxValue;
    }
    getMinPrice(weightProducts,price){
        let minValue = 9999999999;
        weightProducts.forEach((weightProduct) => {
            let value = 0;
            if(weightProduct.unit === 'g'){
                value = price * weightProduct.weightType.value /1000 ;
            }else {
                //kg
                value = price * weightProduct.weightType.value;
            }
            if (value < minValue) {
                minValue = value;
            }
        });
        return minValue;
    }
    async getNewProducts(page = 1, size = 6) {
        try {
            const response = await this.api.get("/new", {
                params: { page, size },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching new products:", error);
            throw error;
        }
    }
    async getTopProducts(page = 1, size = 6) {
        try {
            const response = await this.api.get("/top-products", {
                params: { page, size },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching top products:", error);
            throw error;
        }
    }
}

export default new ProductService();
