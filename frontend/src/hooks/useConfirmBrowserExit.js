import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useConfirmBrowserExit = (
  shouldConfirmExit = () => true
) => {
  const { t } = useTranslation();

  useBlocker(() => {
    if (shouldConfirmExit()) {
      return !window.confirm(t("confirmExit"));
    } else {
      return false;
    }
  });

  useEffect(() => {
    function listener(e) {
      if (shouldConfirmExit()) {
        e.preventDefault();
      }
    }

    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [shouldConfirmExit]);
};
