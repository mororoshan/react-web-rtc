import i18n from "../i18n.config";
import { i18nNamespaces } from "../models/i18n.namespaces";
import en from "./en";
import ru from "./ru";

export const registerCommonI18n = () => {
    i18n.addResourceBundle("en", i18nNamespaces.COMMON, en, true, true);
    i18n.addResourceBundle("ru", i18nNamespaces.COMMON, ru, true, true);
};
