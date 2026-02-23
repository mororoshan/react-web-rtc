import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage/MainPage";
import MainLayout from "../layouts/MainLayout";
import { routes } from "./models/enums/routes.enum";
import LiquidGlassPage from "../pages/LiquidGlassPage";
import ConnectionPage from "../pages/ConnectionPage";

const MainRoutes = () => (
    <Routes>
        <Route path="" element={<MainLayout />}>
            <Route path={routes.HOME} element={<MainPage />} />
            <Route path={routes.SIMPLE_CONNECT} element={<ConnectionPage />} />
            <Route path={routes.LIQUID_GLASS} element={<LiquidGlassPage />} />
        </Route>
    </Routes>
);

export default MainRoutes;
