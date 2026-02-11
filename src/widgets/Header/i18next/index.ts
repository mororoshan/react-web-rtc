import i18n from "../../../shared/config/i18n/i18n.config";
import { i18nNamespaces } from "../../../shared/config/i18n/models/i18n.namespaces";
import en from "./en";
import ru from "./ru";

export const registerHeaderI18n = () => {
    i18n.addResourceBundle("en", i18nNamespaces.HEADER, en, true, true);
    i18n.addResourceBundle("ru", i18nNamespaces.HEADER, ru, true, true);
};
