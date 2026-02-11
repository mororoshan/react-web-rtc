import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export enum Languages {
    RU = "ru",
    EN = "en",
}

const supportedLanguages = Object.values(Languages);
const savedLanguage = sessionStorage.getItem("i18nextLng") || Languages.RU;

i18next.use(initReactI18next).init({
    fallbackLng: "ru",
    lng: savedLanguage,
    debug: false,
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    interpolation: {
        escapeValue: false,
    },
    returnEmptyString: false,
});

export default i18next;
