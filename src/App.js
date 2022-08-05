import React, {useState, useEffect} from "react";
import Thumbnails from "./Thumbnails";

function App() {
  const [enabled, setEnabled] = useState(true);
  const [canceled, setCanceled] = useState(false);

  const handleUrlChange = () => {
    const isInHomepage =
      window.location.hostname === "www.youtube.com" &&
      window.location.pathname === "/";

    setEnabled(
      isInHomepage || process.env.REACT_APP_ENVIRONMENT?.slice(0, 3) === "DEV",
    );
  };

  useEffect(() => {
    handleUrlChange();
    const handleCancel = () => {
      console.log("Canceled Thumbnails");
      setCanceled(true);
    };
    const handleEnable = () => {
      console.log("Reenabled Thumbnails");
      setCanceled(false);
    };
    window.addEventListener("resetThumbnails", handleCancel);
    window.addEventListener("blurThumbnails", handleEnable);

    return () => {
      window.removeEventListener("resetThumbnails", handleCancel);
      window.removeEventListener("blurThumbnails", handleEnable);
    };
  }, []);

  React.useEffect(() => {
    //event handlers like onpopstate did not work to track url
    let previousUrl = "";
    const observer = new MutationObserver(function (mutations) {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        handleUrlChange();
      }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);

    return () => observer.disconnect();
  }, []);

  return enabled && !canceled && <Thumbnails />;
}

export default App;
