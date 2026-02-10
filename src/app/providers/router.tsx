import { BrowserRouter } from "react-router-dom";
import MainRoutes from "../../routes/routes";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <MainRoutes />
        </BrowserRouter>
    );
};

