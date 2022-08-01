//on scroll
import React, {useState, useEffect} from "react";
import Hider from "./Hider";
import {css, cx} from "@emotion/css";

function Thumbnails() {
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setRecommendations(
        Array.from(document.querySelectorAll("ytd-rich-item-renderer")),
      );
    }, 500);

    var hideThumbnailsCss = `#thumbnail img#img{
      display: none;
    }
    `;
    var styleSheet = document.createElement("style");
    styleSheet.innerText = hideThumbnailsCss;
    document.head.appendChild(styleSheet);

    return () => clearInterval(interval);
  }, []);

  return recommendations.map((recommendation, index) => {
    const thumbnail = recommendation.querySelector("a#thumbnail");

    return thumbnail?.href ? (
      <Hider
        key={thumbnail.href}
        index={index}
        recommendationElement={recommendation}
        onLoad={() => {
          
        }}
      />
    ) : null;
  });
}

export default Thumbnails;
