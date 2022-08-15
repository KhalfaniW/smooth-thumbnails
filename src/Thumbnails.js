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

      var hideThumbnailsCss = `ytd-rich-grid-renderer #thumbnail img#img{
      display: none;
    }
    `;
    var styleSheet = document.createElement("style");
    styleSheet.id = "thumbnailEditStyles";
    styleSheet.innerText = hideThumbnailsCss;
    document.head.appendChild(styleSheet);

    return () => {
      document.getElementById("thumbnailEditStyles").remove();
      clearInterval(interval);
    };
  }, []);

  return recommendations.map((recommendation, index) => {
    const thumbnail = recommendation.querySelector("a#thumbnail");
    return thumbnail?.href ? (
      <Hider
        // the order will not change so key=index is not a problem
        key={thumbnail.href + index}
        index={index}
        recommendationElement={recommendation}
      />
    ) : null;
  });
}

export default Thumbnails;
