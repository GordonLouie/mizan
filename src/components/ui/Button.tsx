"use client";

import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface AsButton extends BaseProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface AsLink extends BaseProps {
  href: string;
  type?: never;
  onClick?: never;
  external?: boolean;
}

type Props = AsButton | AsLink;

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 " +
    "shadow-sm border border-navy-800 focus-visible:ring-2 focus-visible:ring-navy-700/30",
  secondary:
    "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 " +
    "focus-visible:ring-2 focus-visible:ring-gray-300",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 " +
    "focus-visible:ring-2 focus-visible:ring-gray-200",
  link:
    "bg-transparent text-navy-700 hover:text-navy-900 underline-offset-2 hover:underline px-0 h-auto",
};

export function Button(props: Props) {
  const { variant = "primary", size = "md", leftIcon, rightIcon, fullWidth, className = "", children } = props;
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors " +
    "focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed " +
    SIZE_CLASS[size] + " " + VARIANT_CLASS[variant] + " " +
    (fullWidth ? "w-full " : "") + className;

  const content = (
    <>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  );

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {content}
        </a>
      );
    }
    return <Link href={props.href} className={cls}>{content}</Link>;
  }

  const buttonProps = props as AsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className={cls}
    >
      {content}
    </button>
  );
}
