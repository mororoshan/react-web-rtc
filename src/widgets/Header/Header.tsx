import Navbar from "../navbar/Navbar";
import { useTranslation } from "react-i18next";
import { registerHeaderI18n } from "./i18next";
import { i18nNamespaces } from "../../shared/config/i18n/models/i18n.namespaces";

const Header = () => {
    registerHeaderI18n();

    const { t } = useTranslation([
        i18nNamespaces.HEADER,
        i18nNamespaces.COMMON,
    ]);

    return (
        <div className="h-32 flex items-center px-8 border">
            <Navbar />
            {t("role", { count: 0 })}
        </div>
    );
};

export default Header;
