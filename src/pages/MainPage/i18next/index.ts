import i18n from "../../../shared/config/i18n/i18n.config";
import { i18nNamespaces } from "../../../shared/config/i18n/models/i18n.namespaces";
import en from "./en";
import ru from "./ru";

export const registerMainPageI18n = () => {
    i18n.addResourceBundle("en", i18nNamespaces.MAIN_PAGE, en, true, true);
    i18n.addResourceBundle("ru", i18nNamespaces.MAIN_PAGE, ru, true, true);
};
