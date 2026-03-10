import React from "react";
import { routesConfig } from "../../routes/config/routesConfig";
import Button from "../../shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-1">
            {routesConfig.map((route) => (
                <Button key={route.path} onClick={() => navigate(route.path)}>
                    {route.name}
                </Button>
            ))}
        </div>
    );
};

export default Navbar;
