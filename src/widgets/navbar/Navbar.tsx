import React from "react";
import { navRoutes } from "./models/consts/navRoutes";
import Button from "../../components/ui/Button/Button";
import { routes } from "../../routes/models/enums/routes.enum";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-1">
            {navRoutes.map((route) => (
                <Button key={route.path} onClick={() => navigate(route.path)}>
                    {route.name}
                </Button>
            ))}
        </div>
    );
};

export default Navbar;
