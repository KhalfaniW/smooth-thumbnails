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
  const thumbnailElement = recommendationElement.querySelector("img#img");
  const detailsElement = recommendationElement.querySelector("div#details");

  const [thumbnailHoverEnabled, setThumbnailHoverEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [currentBlur, setCurrentBlur] = useState(8);
  const [isHidden, setIsHidden] = useState(true);
  const [imageSource, setImageSource] = useState(null);
  const [isThumbnailHoveringEnabled, setIsThumbnailHoveringEnabled] =
    useState(null);

  const thumbnailRef = useRef(null);
  //opacity is !important becuase all thumbnails it will be hidden by defautl to allow custom hidding before initial view
  const transition = initialized && " transition: all 200ms;";
  const other = "transition: all ${initialized? 1000: 0}ms;";
  const imgClass = css`
    display: block;
    width: 100%;
    position: relative;
    z-index: 3;
  `;
  const hidden = css`
    ${hide && "opacity: 0; !important"};
    filter: blur(${blur ? currentBlur : 0}px) ${grayScale && "grayScale(100%)"};
    transition: all ${initialized ? 400 : 0}ms;
  `;

  const visible = css`
    opacity: 1; !important;
    transition: all 400ms;C
  `;

  // need to delay thumnail cancelation becuase onmouseleave runs while its still in the bounding box
  // const cancelThumbnailDeactivationOverThumbnail = useTimeout(
  //   () => {
  //     if (isHoveringOverThumbnail) {
  //       setIsThumbnailHoveringEnabled(true);
  //     } else {
  //       set isThumbnailHoveringEnabled1(false);
  //       setIsHidden(true);
  //     }
  //     console.log({isHoveringOverThumbnail, isHidden});
  //   },
  //   isThumbnailHoveringEnabled1 ? 50 : null,
  // );
  const {clientX, clientY} = useMouse();

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
  const isHoveringOverDetails = getIsInBoundingBox(
    clientX,
    clientY,
    detailsElement,
  );
  const isHoveringOverThumbnail =
    thumbnailRef.current &&
    getIsInBoundingBox(clientX, clientY, thumbnailRef.current);

  const cancelThumbnailHoverDeactivation = useTimeout(
    () => {
      if (!isHoveringOverThumbnail) setIsThumbnailHoveringEnabled(false);
    },
    isThumbnailHoveringEnabled ? 500 : null,
  );
  useEffect(() => {
    //this should only change if it was true and now is false
    if (!isHoveringOverDetails) setIsThumbnailHoveringEnabled(true);

    setIsHidden(!isHoveringOverDetails);
    // eslint-disable-next-line
  }, [isHoveringOverDetails]);

  useEffect(() => {
    if (isThumbnailHoveringEnabled) {
      cancelThumbnailHoverDeactivation();
      setIsHidden(false);
    }
    if (!isHoveringOverThumbnail && !isHoveringOverDetails)
      setIsThumbnailHoveringEnabled(false);

    setIsHidden(
      !isHoveringOverDetails &&
        !(isHoveringOverThumbnail && isThumbnailHoveringEnabled),
    );
    // eslint-disable-next-line
  }, [isHoveringOverThumbnail]);

  useEffect(() => {
    const thumbnailElement =
      recommendationElement.querySelector("#thumbnail img#img");
    setImageSource(thumbnailElement.src);
    setInitialized(true);
  }, []);

  const hider = css`
    position: absolute;
    inset: 0;
     z-index: 99999;
    text-align: center;
}`;
  return (
    <>
      {isThumbnailHoveringEnabled &&
        createPortal(
          <div
            className={cx(hider, {[hoverDisabled]: !thumbnailHoverEnabled})}
            onMouseEnter={() => {
              cancelThumbnailHoverDeactivation();

              setIsHidden(false);
            }}
            onMouseLeave={() => {
              /* setThumbnailHoverEnabled(false); */
              /* setIsThumbnailHoveringEnabled(false); */
            }}
          ></div>,
          thumbnailElement.parentNode,
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
