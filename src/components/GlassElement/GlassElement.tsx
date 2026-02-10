import { CSSProperties, ReactNode, useState } from "react";

import { getDisplacementMap } from "./getDisplacementMap";
import styles from "./getElement.module.css";
import { DisplacementOptions, getDisplacementFilter } from "./getGlassElementFilter";

type GlassElementProps = DisplacementOptions & {
  className?: string;
  children?: ReactNode | undefined;
  blur?: number;
  debug?: boolean;
};

export const GlassElement = ({
  className,
  height,
  width,
  depth: baseDepth,
  radius,
  children,
  strength,
  chromaticAberration,
  blur = 2,
  debug = false,
}: GlassElementProps) => {
  const [clicked, setClicked] = useState(false);
  let depth = baseDepth / (clicked ? 0.7 : 1);

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${width}px`,
    borderRadius: `${radius}px`,
    backdropFilter: `blur(${blur / 2}px) url('${getDisplacementFilter({
      height,
      width,
      radius,
      depth,
      strength,
      chromaticAberration,
    })}') blur(${blur}px) brightness(1.1) saturate(1.5) `,
  };

  if (debug === true) {
    style.background = `url("${getDisplacementMap({
      height,
      width,
      radius,
      depth,
    })}")`;
    style.boxShadow = "none";
  }
  return (
    <div
      className={styles.box + " " + className}
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
    >
      {children}
    </div>
  );
};