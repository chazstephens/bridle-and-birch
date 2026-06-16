import React from "react";

type SealVariant = "oval" | "circle" | "scalloped" | "bb";

interface SealProps {
  variant?: SealVariant;
  size?: number;
  color?: string;
  ringText?: boolean;
  est?: string;
  className?: string;
  style?: React.CSSProperties;
}

function scallopPath(
  cx: number,
  cy: number,
  r: number,
  bumps: number
): string {
  const step = (Math.PI * 2) / bumps;
  const bump = r * 0.085;
  let d = "";
  for (let i = 0; i < bumps; i++) {
    const a0 = i * step - Math.PI / 2;
    const a1 = a0 + step;
    const mid = (a0 + a1) / 2;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const mx = cx + Math.cos(mid) * (r + bump);
    const my = cy + Math.sin(mid) * (r + bump);
    if (i === 0) {
      const x0 = cx + Math.cos(a0) * r;
      const y0 = cy + Math.sin(a0) * r;
      d += `M ${x0.toFixed(2)} ${y0.toFixed(2)} `;
    }
    d += `Q ${mx.toFixed(2)} ${my.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)} `;
  }
  return d + "Z";
}

export function Seal({
  variant = "oval",
  size = 120,
  color,
  ringText = true,
  est = "EST. 2024",
  className = "",
  style = {},
}: SealProps) {
  const c = color ?? "currentColor";
  const W = 200;
  const isOval = variant === "oval" || variant === "bb";
  const H = isOval ? 240 : 200;
  const cx = 100;
  const cy = H / 2;

  const stroke = { fill: "none", stroke: c, strokeWidth: 2 };
  const thin = { fill: "none", stroke: c, strokeWidth: 1 };

  const arcR = isOval ? 78 : 74;
  const arcRy = isOval ? 96 : 74;
  const topArc = `M ${cx - arcR} ${cy} A ${arcR} ${arcRy} 0 0 1 ${cx + arcR} ${cy}`;
  const botArc = `M ${cx - arcR} ${cy} A ${arcR} ${arcRy} 0 0 0 ${cx + arcR} ${cy}`;

  const monogram = variant === "bb" ? "BB" : "B&B";

  // Unique ID for SVG defs to avoid conflicts when multiple Seals render
  const uid = `seal-${variant}`;

  function Diamond({ x, y, s = 3 }: { x: number; y: number; s?: number }) {
    return (
      <path
        d={`M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`}
        fill={c}
      />
    );
  }

  return (
    <svg
      className={`bb-seal ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      width={size}
      height={size * (H / W)}
      role="img"
      aria-label="Bridle & Birch monogram seal"
      style={{ color: c, display: "block", ...style }}
    >
      <defs>
        <path id={`${uid}-toparc`} d={topArc} />
        <path id={`${uid}-botarc`} d={botArc} />
      </defs>

      {/* Frame */}
      {variant === "circle" && (
        <>
          <circle cx={cx} cy={cy} r={92} {...stroke} />
          <circle cx={cx} cy={cy} r={85} {...thin} />
        </>
      )}
      {(variant === "oval" || variant === "bb") && (
        <>
          <ellipse cx={cx} cy={cy} rx={86} ry={108} {...stroke} />
          <ellipse cx={cx} cy={cy} rx={79} ry={101} {...thin} />
        </>
      )}
      {variant === "scalloped" && (
        <>
          <path d={scallopPath(cx, cy, 88, 16)} {...stroke} />
          <circle cx={cx} cy={cy} r={80} {...thin} />
        </>
      )}

      {/* Ring text */}
      {ringText && variant !== "bb" && (
        <text
          fontFamily="var(--font-body)"
          fontSize="13"
          fontWeight="600"
          letterSpacing="3.4"
          fill={c}
          textAnchor="middle"
        >
          <textPath href={`#${uid}-toparc`} startOffset="50%">
            BRIDLE&nbsp;&amp;&nbsp;BIRCH
          </textPath>
        </text>
      )}

      {/* Monogram */}
      <text
        x={cx}
        y={cy + (variant === "bb" ? 6 : 14)}
        fontFamily="var(--font-display)"
        fontSize={variant === "bb" ? 104 : 76}
        fontWeight="600"
        fill={c}
        textAnchor="middle"
        letterSpacing={variant === "bb" ? "-6" : "0"}
      >
        {monogram}
      </text>

      {/* Side ornaments */}
      {variant !== "bb" && (
        <>
          <Diamond x={cx - 56} y={cy - 4} />
          <Diamond x={cx + 56} y={cy - 4} />
          <line x1={cx - 50} y1={cy - 4} x2={cx - 40} y2={cy - 4} {...thin} />
          <line x1={cx + 40} y1={cy - 4} x2={cx + 50} y2={cy - 4} {...thin} />
        </>
      )}

      {/* EST line */}
      <g>
        <line
          x1={cx - 26}
          y1={cy + (isOval ? 52 : 44)}
          x2={cx + 26}
          y2={cy + (isOval ? 52 : 44)}
          {...thin}
        />
        <text
          x={cx}
          y={cy + (isOval ? 72 : 62)}
          fontFamily="var(--font-body)"
          fontSize="11"
          fontWeight="600"
          letterSpacing="2.5"
          fill={c}
          textAnchor="middle"
        >
          {est}
        </text>
      </g>
    </svg>
  );
}
