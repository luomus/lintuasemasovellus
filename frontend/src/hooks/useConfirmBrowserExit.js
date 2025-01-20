import { useEffect } from "react";

export const useConfirmBrowserExit = (
  shouldConfirmExit = () => true
) => {
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
