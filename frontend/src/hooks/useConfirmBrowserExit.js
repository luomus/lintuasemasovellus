import { useEffect, useState } from "react";

export const useConfirmBrowserExit = (
  defaultEnabled = false
) => {
  const [enabled, setEnabled] = useState(defaultEnabled);

  useEffect(() => {
    function listener(e) {
      if (enabled) {
        e.preventDefault();
      }
    }

    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [enabled]);

  return {
    enable() {
      setEnabled(true);
    },
    disable() {
      setEnabled(false);
    }
  };
};

