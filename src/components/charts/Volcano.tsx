import { useMemo } from "react";
import { DEG } from "../../data/datasets";

interface VolcanoProps {
  degs: DEG[];
  width?: number;
  height?: number;
}

export default function Volcano({ degs, width = 300, height = 200 }: VolcanoProps) {
  if (!degs.length)
    return (
      <div style={{ color: "#9CA3AF", fontSize: 12, padding: 20 }}>
        No DEG data
      </div>
    );
  const px = 32,
    py = 20;
  const maxFC = Math.max(...degs.map((d) => Math.abs(d.logFC))) + 0.6;
  const maxP = Math.max(...degs.map((d) => -Math.log10(d.pval))) + 1.5;
  const tx = (fc: number) => px + ((fc + maxFC) / (2 * maxFC)) * (width - 2 * px);
  const ty = (p: number) => py + (1 - -Math.log10(p) / maxP) * (height - 2 * py);
  const fdrY = ty(0.05);
  return (
    <svg
      width={width}
      height={height}
      style={{
        background: "#F8FAFC",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={width} height={height} fill="#F8FAFC" rx={8} />
      <line
        x1={px}
        y1={fdrY}
        x2={width - px}
        y2={fdrY}
        stroke="#FCA5A5"
        strokeDasharray="4,3"
        strokeWidth={1.2}
      />
      <text
        x={width - px - 2}
        y={fdrY - 4}
        fontSize={9}
        fill="#EF4444"
        textAnchor="end"
      >
        FDR=0.05
      </text>
      <line
        x1={tx(0)}
        y1={py}
        x2={tx(0)}
        y2={height - py}
        stroke="#CBD5E1"
        strokeWidth={1}
      />
      {degs
        .filter((d) => d.fdr >= 0.05)
        .map((d, i) => (
          <circle
            key={i}
            cx={tx(d.logFC)}
            cy={ty(d.pval)}
            r={4}
            fill="#CBD5E1"
            opacity={0.5}
          />
        ))}
      {degs
        .filter((d) => d.fdr < 0.05)
        .map((d, i) => (
          <g key={i} filter="url(#glow)">
            <circle
              cx={tx(d.logFC)}
              cy={ty(d.pval)}
              r={6}
              fill={d.direction === "up" ? "#EF4444" : "#3B82F6"}
              opacity={0.88}
            />
            <text
              x={tx(d.logFC)}
              y={ty(d.pval) - 9}
              textAnchor="middle"
              fontSize={9.5}
              fill="#1E293B"
              fontWeight={700}
            >
              {d.gene}
            </text>
          </g>
        ))}
      <text x={px} y={height - 6} fontSize={9} fill="#9CA3AF">
        -logFC
      </text>
      <text
        x={width / 2}
        y={height - 6}
        textAnchor="middle"
        fontSize={9}
        fill="#9CA3AF"
      >
        log2 Fold Change
      </text>
      <text
        x={width - px}
        y={height - 6}
        fontSize={9}
        fill="#9CA3AF"
        textAnchor="end"
      >
        +logFC
      </text>
    </svg>
  );
}
