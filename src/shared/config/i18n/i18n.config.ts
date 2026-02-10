import i18n from "i18next";

export enum Languages {
    RU = "ru",
    EN = "en",
}

const supportedLanguages = Object.values(Languages);

const savedLanguage = sessionStorage.getItem("i18nextLng") || Languages.RU;

i18n.init({
    fallbackLng: "ru",
    lng: savedLanguage,
    debug: false,
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    interpolation: {
        escapeValue: false,
    },
    returnEmptyString: false,
    resources: {
        en: {
            translation: {
                hello: "Hello",
            },
        },
        ru: {
            translation: {
                hello: "Привет",
            },
        },
    },
});

export default i18n;

