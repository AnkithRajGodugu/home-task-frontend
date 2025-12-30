export default function TeamWorkAnimation() {
  return (
    <svg
      width="260"
      height="260"
      viewBox="0 0 260 260"
      fill="none"
    >
      {/* Central task */}
      <circle cx="130" cy="130" r="26" fill="#86C49A">
        <animate
          attributeName="r"
          values="24;28;24"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Person component */}
      {[
        [130, 30, "1.8s"],
        [220, 80, "2s"],
        [220, 180, "1.7s"],
        [130, 230, "2.1s"],
        [40, 180, "1.9s"],
        [40, 80, "2.2s"],
      ].map(([x, y, dur], i) => (
        <g key={i}>
          {/* Head */}
          <circle cx={x} cy={y} r="10" fill="#A3BFFA">
            <animateTransform
              attributeName="transform"
              type="translate"
              from={`0 0`}
              to={`0 -6`}
              dur={dur}
              repeatCount="indefinite"
              direction="alternate"
            />
          </circle>

          {/* Body */}
          <rect
            x={x - 8}
            y={y + 12}
            width="16"
            height="24"
            rx="8"
            fill="#C4B5FD"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from={`0 0`}
              to={`0 -6`}
              dur={dur}
              repeatCount="indefinite"
              direction="alternate"
            />
          </rect>

          {/* Connection line */}
          <line
            x1={x}
            y1={y + 36}
            x2={130}
            y2={130}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  );
}
