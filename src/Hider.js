import React, {useEffect, useState, useRef} from "react";

import {createPortal} from "react-dom";

import {useTimeout, useMouse} from "ahooks";

import {css, cx} from "@emotion/css";

// import './styles.css';

const hoverDisabled = css`
  pointer-events: none;
`;

function Hider({
  index,
  recommendationElement,
  hide = false,
  blur = true,
  grayScale = true,
  maxBlur = 8,
}) {
  const recommendationContent =
    recommendationElement.querySelector("div#content");
  const thumbnailElement = recommendationElement.querySelector("img#img");
  const detailsElement = recommendationElement.querySelector("div#details");

  const [isThumbnailHoverEnabled, setIsThumbnailHoverEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [currentBlur, setCurrentBlur] = useState(8);
  const [isHidden, setIsHidden] = useState(true);
  const [imageSource, setImageSource] = useState(null);
  const [isHoveringOverDetails, setIsHoveringOverDetails] = useState(false);
  const [isHoveringOverThumbnail, setIsHoveringOverThumbnail] = useState(false);

  const thumbnailRef = useRef(null);
  //opacity is !important because all thumbnails it will be hidden by default to allow custom hiding before initial view
  const transition = initialized && " transition: all 200ms;";
  const other = "transition: all ${initialized? 1000: 0}ms;";
  const imgClass = css`
    display: block;
    width: 100%;
    position: relative;
    z-index: 3;
  `;
  // if the blur and opacity is high the blur animation will be glitched
  const hidden = css`
    ${hide && "opacity: .5;"};
    filter: blur(${blur ? 5 : 0}px) ${grayScale && "grayScale(100%)"};
    transition: all ${initialized ? 400 : 0}ms;
  `;

  const visible = css`
    opacity: 1;
    transition: all 400ms;
  `;

  const {clientX, clientY} = useMouse();
  //Watch this value to recalculate on scroll
  const reccomendationScrollPosition =
    recommendationElement.getBoundingClientRect().top;

  useEffect(() => {
    function getIsInBoundingBox(x, y, element) {
      // use bounding rect because hovering is canceled when hovering on elements inside box
      const boundingRect = element.getBoundingClientRect();
      return (
        boundingRect.x <= x &&
        x <= boundingRect.x + boundingRect.width &&
        boundingRect.y <= y &&
        y <= boundingRect.y + boundingRect.height
      );
    }
    const isHoveringOverRecommendation = getIsInBoundingBox(
      clientX,
      clientY,
      recommendationContent,
    );
    const isCurrentHoveringOverThumbnail =
      isHoveringOverRecommendation && !isHoveringOverDetails;
    setIsHoveringOverDetails((prevHoveringOverDetails) => {
      const isCurrentHoveringOverDetails = getIsInBoundingBox(
        clientX,
        clientY,
        detailsElement,
      );

      if (index == 0) {
        window.data2 = {
          prevHoveringOverDetails,
          isCurrentHoveringOverDetails,
          isCurrentHoveringOverThumbnail,
          isThumbnailHoverEnabled,
        };
        window.debugData = {
          recommendationContent,
          thumbnailElement,
          recommendationElement,
          thumbnailRef,
        };
      }
      if (prevHoveringOverDetails && !isCurrentHoveringOverDetails) {
        setIsThumbnailHoverEnabled(true);
      }
      return isCurrentHoveringOverDetails;
    });
    setIsHoveringOverThumbnail((prevHoveringThumbnail) => {
      const isCurrentHoveringOverThumbnail =
        getIsInBoundingBox(clientX, clientY, recommendationContent) &&
        !isHoveringOverDetails;

      if (prevHoveringThumbnail && !isCurrentHoveringOverThumbnail)
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

  if (index == 0)
    window.data = {
      index,
      isHoveringOverDetails,
      isHoveringOverThumbnail,
      isThumbnailHoverEnabled,
      isHidden,
    };

  const thumbnailImageSource =
    recommendationElement.querySelector("#thumbnail img#img").src;
  useEffect(() => {
    setImageSource(thumbnailImageSource);
    setInitialized(true);
  }, [thumbnailImageSource]);

  const hider = css`
    position: absolute;
    inset: 0;
     z-index: 99999;
    text-align: center;
}`;
  let disableThumbnailHover = css``;
  if (isHidden && thumbnailRef.current) {
    const thumbnailBoundingRectangle =
      thumbnailRef.current.getBoundingClientRect();
    disableThumbnailHover = css`
    top: ${thumbnailBoundingRectangle.top}px;
    left: ${thumbnailBoundingRectangle.left}px;
    height: ${thumbnailBoundingRectangle.height}px;
    width: ${thumbnailBoundingRectangle.width}px;
    position: fixed;
    z-index: 3;
    }`;
  }

  return (
    <>
      {isHidden && (
        <div
          onClick={() => thumbnailElement.click()}
          className={disableThumbnailHover}
        />
      )}
      {createPortal(
        <img
          ref={thumbnailRef}
          src={imageSource}
          className={cx(imgClass, isHidden ? hidden : visible)}
        />,
        thumbnailElement.parentNode,
      )}
    </>
  );
}

export default Hider;
