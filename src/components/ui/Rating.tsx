import React from "react";

function Star({ fill, index }: { fill: number; index: number }) {
  const gradId = `bb-star-${index}-${Math.round(fill * 100)}`;
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId}>
          <stop offset={`${fill * 100}%`} stopColor="var(--bb-brass)" />
          <stop offset={`${fill * 100}%`} stopColor="var(--bb-linen)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.07 1.1-6.47L2.6 9.35l6.5-.95z"
        fill={
          fill >= 1
            ? "var(--bb-brass)"
            : fill <= 0
              ? "var(--bb-linen)"
              : `url(#${gradId})`
        }
      />
    </svg>
  );
}

interface RatingProps {
  value?: number;
  count?: number;
  showValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Rating({
  value = 5,
  count,
  showValue = false,
  className = "",
  style = {},
}: RatingProps) {
  const stars = [0, 1, 2, 3, 4].map((i) =>
    Math.max(0, Math.min(1, value - i))
  );

  return (
    <span
      className={`bb-rating ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, ...style }}
    >
      <span
        style={{ display: "inline-flex", gap: 2 }}
        aria-label={`${value} out of 5 stars`}
      >
        {stars.map((f, i) => (
          <Star key={i} fill={f} index={i} />
        ))}
      </span>

      {showValue && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          {value.toFixed(1)}
        </span>
      )}

      {count != null && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--text-subtle)",
          }}
        >
          ({count})
        </span>
      )}
    </span>
  );
}
