import { useTranslation } from "react-i18next";


export const Title = () => {
  const { t } = useTranslation("common");

  return (<h1 className="px-2 text-xl md:text-3xl font-bold">{t('title')}</h1>);
}
