import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage";
import MainLayout from "../layouts/MainLayout";
import { routes } from "./models/enums/routes.enum";
import LiquidGlassPage from "../pages/LiquidGlassPage";
import ConnectionPage from "../pages/ConnectionPage";

const MainRoutes = () => (
    <Routes>
        <Route path="" element={<MainLayout />}>
            <Route path={routes.home} element={<MainPage />} />
            <Route path={routes.simpleConnect} element={<ConnectionPage />} />
            <Route path={routes.glass} element={<LiquidGlassPage />} />
        </Route>
    </Routes>
);


export default MainRoutes;
