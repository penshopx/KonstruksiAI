import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
}

const Image: React.FC<ImageProps> = ({ src, alt, width, height, priority: _priority, fill, quality: _quality, style, ...props }) => {
  const imgStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
    : style ?? {};
  return <img src={src} alt={alt} width={width} height={height} style={imgStyle} {...props} />;
};

export default Image;
