import React from "react";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import { registerMainPageI18n } from "./i18next";

export const MainPage = () => {
    registerMainPageI18n();
    return (
        <>
            <Hero />
            <Projects />
        </>
    );
};

export default MainPage;
