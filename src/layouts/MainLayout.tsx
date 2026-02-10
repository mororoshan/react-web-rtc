import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../widgets/Header/Header";
import Footer from "../widgets/Footer/Footer";

const MainLayout = () => {
    return (
        <div
            className={"bg-gray-800 box-border flex min-h-full w-full flex-col"}
        >
            <Header />

            <main className={"mx-auto flex w-full flex-1 flex-col"}>
                <div
                    className={
                        "mx-auto flex h-full w-full flex-1 flex-col md:box-border md:max-w-376 md:px-8"
                    }
                >
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
