import Carousel from "../components/carousel";
import FoodList from "../list/food-list";
import CategoriesList from "../list/category-home-list";



const Home = () => {
    return (
        <div className="container mx-auto px-4">
            <Carousel />
            <CategoriesList/>
            <FoodList />
            <img src="https://nongsan4.vnwordpress.net/wp-content/uploads/2019/07/banner-main-002-5.png"/>
        </div>
    );
};

export default Home;
