const ROUTE = [
  [60, 150],
  [130, 80],
  [200, 120],
  [270, 60],
  [340, 100],
] as const;

export function ProjectArtCaminu() {
  const path = ROUTE.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg
      aria-hidden
      data-testid="project-art"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 size-full text-muted-foreground"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
        <circle cx="200" cy="100" r="40" />
        <circle cx="200" cy="100" r="72" />
        <circle cx="200" cy="100" r="104" />
      </g>
      <polyline
        points={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 5"
      />
      {ROUTE.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={i === 3 ? 6 : 3.5}
          className={i === 3 ? "fill-signal" : "fill-foreground"}
        />
      ))}
    </svg>
  );
}
