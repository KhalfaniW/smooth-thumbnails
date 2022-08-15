import React, {useEffect, useState, useRef} from "react";
import {useTimeout, useMouse} from "ahooks";

export default function useIsThumbnailHidden(recommendationElement) {
  const {clientX, clientY} = useMouse();

  const thumbnailElement = recommendationElement.querySelector("img#img");
  const detailsElement = recommendationElement.querySelector("div#details");

  const [isThumbnailHoverEnabled, setIsThumbnailHoverEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHoveringOverDetails, setIsHoveringOverDetails] = useState(false);
  const [isHoveringOverThumbnail, setIsHoveringOverThumbnail] = useState(false);

  //opacity is !important because all thumbnails it will be hidden by default to allow custom hiding before initial view
  const transition = initialized && " transition: all 200ms;";

  const recommendationContent =
    recommendationElement.querySelector("div#content");
  //Watch this value to recalculate on scroll
  const reccomendationScrollPosition =
    recommendationElement.getBoundingClientRect().top;

  useEffect(() => {
    function isInBoundingBox(x, y, element) {
      if (!element) return false;
      // use bounding rect because hovering is canceled when hovering on elements inside box
      const boundingRect = element.getBoundingClientRect();
      return (
        boundingRect.x <= x &&
        x <= boundingRect.x + boundingRect.width &&
        boundingRect.y <= y &&
        y <= boundingRect.y + boundingRect.height
      );
    }
    const isHoveringOverRecommendation = isInBoundingBox(
      clientX,
      clientY,
      recommendationContent,
    );
    const isCurrentHoveringOverThumbnail =
      isHoveringOverRecommendation && !isHoveringOverDetails;

    setIsHoveringOverDetails((prevHoveringOverDetails) => {
      const isCurrentHoveringOverDetails = isInBoundingBox(
        clientX,
        clientY,
        detailsElement,
      );

      const hasJustMovedFromDetails =
        prevHoveringOverDetails && !isCurrentHoveringOverDetails;
      if (hasJustMovedFromDetails) {
        setIsThumbnailHoverEnabled(true);
      }
      return isCurrentHoveringOverDetails;
    });
    setIsHoveringOverThumbnail((prevHoveringThumbnail) => {
      const isCurrentHoveringOverThumbnail =
        isInBoundingBox(clientX, clientY, recommendationContent) &&
        !isHoveringOverDetails;

      const hasJustStoppedHoveringOverThumbnail =
        prevHoveringThumbnail && !isCurrentHoveringOverThumbnail;
      if (hasJustStoppedHoveringOverThumbnail)
        setIsThumbnailHoverEnabled(false);

      return isCurrentHoveringOverThumbnail;
    });

    if (!isHoveringOverRecommendation) {
      setIsHidden(true);
      return;
    }
    if (
      isHoveringOverDetails ||
      (isHoveringOverThumbnail && isThumbnailHoverEnabled)
    ) {
      setIsHidden(false);
    }
  }, [clientX, clientY, reccomendationScrollPosition]);

  return isHidden;
}
