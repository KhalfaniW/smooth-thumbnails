import React, {useState, useEffect} from "react";
import Thumbnails from "./Thumbnails";

function App() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const handleCancel = () => {
      setEnabled(false);
    };
    window.addEventListener("resetThumbnails", handleCancel);

    return () => {
      window.removeEventListener("resetThumbnails", handleCancel);
    };
  }, []);

  return enabled && <Thumbnails />;
}

export default App;
