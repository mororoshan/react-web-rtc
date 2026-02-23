import { useTranslation } from "react-i18next";
import { i18nNamespaces } from "../../../shared/config/i18n/models/i18n.namespaces";

type Props = {};

const Hero = (props: Props) => {
    const { t } = useTranslation(i18nNamespaces.MAIN_PAGE);

    return (
        <section className="w-full">
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-xl">
                {t("developerDescription")}
            </p>
        </section>
    );
};

export default Hero;
