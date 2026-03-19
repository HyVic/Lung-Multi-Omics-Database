import { useMemo } from "react";

interface HeatmapProps {
  genes: string[];
  nSamples?: number;
}

export default function Heatmap({ genes, nSamples = 14 }: HeatmapProps) {
  const vals = useMemo(
    () =>
      genes.map(() =>
        Array.from({ length: nSamples }, () => Math.random() * 4),
      ),
    [genes, nSamples],
  );
  const col = (v: number) => {
    const t = Math.min(v / 4, 1);
    return `rgb(${Math.round(255 * (1 - t))},${Math.round(100 * (1 - t) + 76 * t)},${Math.round(204 * (1 - t))})`;
  };
  const cW = 14,
    cH = 15,
    lW = 65,
    W = lW + nSamples * cW + 8,
    H = genes.length * cH + 28;
  return (
    <svg
      width={W}
      height={H}
      style={{ borderRadius: 8, border: "1px solid #E2E8F0", maxWidth: "100%" }}
    >
      <rect width={W} height={H} fill="#F8FAFC" />
      {genes.map((g, gi) => (
        <g key={gi}>
          <text
            x={lW - 5}
            y={14 + gi * cH + cH / 2 + 3}
            textAnchor="end"
            fontSize={9.5}
            fill="#374151"
            fontStyle="italic"
          >
            {g}
          </text>
          {vals[gi].map((v, si) => (
            <rect
              key={si}
              x={lW + si * cW}
              y={14 + gi * cH}
              width={cW - 1}
              height={cH - 1}
              fill={col(v)}
              rx={1}
            />
          ))}
        </g>
      ))}
      <line
        x1={lW + (nSamples * cW) / 2}
        y1={14}
        x2={lW + (nSamples * cW) / 2}
        y2={H - 12}
        stroke="#475569"
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <text
        x={lW + (nSamples * cW) / 4}
        y={H - 4}
        textAnchor="middle"
        fontSize={8.5}
        fill="#6B7280"
        fontWeight={600}
      >
        Young (n=7)
      </text>
      <text
        x={lW + (nSamples * cW * 3) / 4}
        y={H - 4}
        textAnchor="middle"
        fontSize={8.5}
        fill="#6B7280"
        fontWeight={600}
      >
        Old (n=7)
      </text>
    </svg>
  );
}
