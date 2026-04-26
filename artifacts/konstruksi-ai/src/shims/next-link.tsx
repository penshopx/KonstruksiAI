import { Link as WouterLink } from "wouter";
import React from "react";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  }
  return (
    <WouterLink href={href} {...props}>
      {children}
    </WouterLink>
  );
};

export default Link;
