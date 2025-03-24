import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow container mt-[9rem] mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet/>
            </main>

            <Footer/>
        </div>
    );
};

export default MainLayout;
