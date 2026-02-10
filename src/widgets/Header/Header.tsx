import Navbar from "../navbar/Navbar";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t } = useTranslation();

    return (
        <div className="h-32 flex items-center px-8 border">
            <Navbar />
            {t("Hello", { lng: "ru" })}
        </div>
    );
};

export default Header;
