import type * as React from "react";

import { cn } from "@/lib/utils";

type DotPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
};

export function DotPattern({
  width = 20,
  height = 20,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const patternId = "dot-pattern";

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={width}
        >
          <circle cx={cx} cy={cy} fill="currentColor" r={cr} />
        </pattern>
      </defs>
      <rect fill={`url(#${patternId})`} height="100%" width="100%" />
    </svg>
  );
}
