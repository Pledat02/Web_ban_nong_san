import Carousel from "../components/carousel";
import ProductCategoryList from "../list/product-category-list";
import CategoriesList from "../list/tag-home-list";
import banner from "../images/logo/banner.png"



const Home = () => {
    return (
        <div className="container mx-auto px-4">
            <Carousel />
            <CategoriesList/>
            <div className="bg-[#FFFDF1]  mx-auto pb-4">
                {/*organic products*/}
                <ProductCategoryList
                    title="TRÁI CÂY HỮU CƠ"
                    description="Cung cấp trái cây hữu cơ tươi sạch, không hóa chất, đảm bảo sức khỏe cho gia đình bạn."
                    categoryId={1}
                />
                <img className="justify-self-center w-2/3" src={banner}/>
                {/*vegetable product*/}
                <ProductCategoryList
                    title="RAU CỦ HỮU CƠ"
                    description="Rau củ sạch, canh tác tự nhiên, không hóa chất độc hại, tươi ngon mỗi ngày."
                    categoryId={2}
                />

            </div>
        </div>
    );
};

export default Home;
