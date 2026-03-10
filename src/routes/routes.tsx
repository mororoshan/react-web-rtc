import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { routesConfig } from "./config/routesConfig";

const MainRoutes = () => (
    <Routes>
        <Route path="" element={<MainLayout />}>
            {routesConfig.map(({ path, component: Component }) => (
                <Route
                    key={path}
                    path={path === "/" ? "" : path.slice(1)}
                    element={<Component />}
                />
            ))}
        </Route>
    </Routes>
);

export default MainRoutes;
