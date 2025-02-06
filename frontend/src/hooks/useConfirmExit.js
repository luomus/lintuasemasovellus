import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useConfirmExit = (
  shouldConfirmExit = () => true,
  onRouteExit = () => {}
) => {
  const { t } = useTranslation();

  useBlocker(() => {
    let block = false;
    if (shouldConfirmExit()) {
      block = !window.confirm(t("confirmExit"));
    }
    if (!block) {
      onRouteExit();
    }
    return block;
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
