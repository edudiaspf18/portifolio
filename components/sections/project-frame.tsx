export function ProjectFrame() {
  return (
    <svg
      aria-hidden
      data-testid="project-frame"
      className="pointer-events-none absolute inset-0 z-20 size-full text-signal"
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="31"
        ry="31"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
        className="transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0] group-focus-within:[stroke-dashoffset:0] motion-reduce:transition-none"
      />
    </svg>
  );
}
