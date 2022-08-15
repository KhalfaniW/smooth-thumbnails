import React, {useEffect, useState, useRef} from "react";

import {createPortal} from "react-dom";

import {css, cx} from "@emotion/css";
import useIsThumbnailHidden from "./useIsThumbnailHidden";

export default function Hider({
  index,
  recommendationElement,
  hide = false,
  blur = true,
  grayScale = true,
  maxBlur = 8,
}) {
  const isThumbnailHidden = useIsThumbnailHidden(recommendationElement);

  const toggleDefaulThumbnailHover = () => {
    const thumbnailHoverElement =
      recommendationElement.querySelector("ytd-thumbnail");
    thumbnailHoverElement.style.pointerEvents = isThumbnailHidden
      ? "none"
      : "initial";

    return () => {
      thumbnailHoverElement.style.pointerEvents = "initial";
    };
  };

  const enableThumbnailClick = () => {
    const thumbnailHoverElement =
      recommendationElement.querySelector("ytd-thumbnail");
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

    recommendationElement.onclick = ({clientX, clientY}) => {
      if (
        !isInBoundingBox(
          clientX,
          clientY,
          recommendationElement.querySelector("div#details"),
        )
      )
        recommendationElement.querySelector("a#thumbnail").click();
    };

    return () => (recommendationElement.onclick = undefined);
  };

  useEffect(toggleDefaulThumbnailHover, [isThumbnailHidden]);
  useEffect(enableThumbnailClick, [isThumbnailHidden]);

  return (
    <ThumbnailCover
      isHidden={isThumbnailHidden}
      recommendationElement={recommendationElement}
    />
  );
}

function ThumbnailCover({isHidden, recommendationElement}) {
  const recommendationContent =
    recommendationElement.querySelector("div#content");
  const thumbnailElement = recommendationElement.querySelector("img#img");
  const detailsElement = recommendationElement.querySelector("div#details");

  const [imageSource, setImageSource] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const thumbnailRef = useRef(null);

  const hidden = css`
    filter: blur(5px) grayScale(100%);
    transition: all ${initialized ? 400 : 0}ms;
  `;

  const visible = css`
    opacity: 1;
    transition: all 400ms;
  `;

  const imgClass = css`
    display: block;
    width: 100%;
    position: relative;
    z-index: 99999;
  `;
  const thumbnailImageSource =
    recommendationElement.querySelector("#thumbnail img#img").src;
  useEffect(() => {
    if (
      typeof thumbnailImageSource !== "string" ||
      thumbnailImageSource.length < 5
    )
      return;
    setImageSource(thumbnailImageSource);
    setTimeout(() => setInitialized(true), 600);
  }, [thumbnailImageSource]);

  return createPortal(
    <img
      onAnimationEnd={() => setInitialized(true)}
      ref={thumbnailRef}
      src={imageSource}
      className={cx(imgClass, isHidden ? hidden : visible)}
    />,
    thumbnailElement.parentNode,
  );
}
