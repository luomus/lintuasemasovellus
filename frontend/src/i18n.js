import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations/translation";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fi",
    fallbackLng: "fi",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;