import { Sample } from "../../data/datasets";

interface AgeHistogramProps {
  samples: Sample[];
}

export default function AgeHistogram({ samples }: AgeHistogramProps) {
  const bins = [
    { label: "20-29", min: 20, max: 29 },
    { label: "30-39", min: 30, max: 39 },
    { label: "40-49", min: 40, max: 49 },
    { label: "50-59", min: 50, max: 59 },
  ];
  const W = 300,
    H = 120,
    bw = 50,
    gap = 10,
    px = 30,
    py = 10;
  const counts = bins.map((b) => ({
    ...b,
    young: samples.filter(
      (s) => s.group === "Young" && s.age >= b.min && s.age <= b.max,
    ).length,
    old: samples.filter(
      (s) => s.group === "Old" && s.age >= b.min && s.age <= b.max,
    ).length,
  }));
  const maxC = Math.max(...counts.map((c) => c.young + c.old), 1);
  const barH = H - py - 22;
  return (
    <svg
      width={W}
      height={H}
      style={{
        borderRadius: 8,
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
      }}
    >
      {counts.map((c, i) => {
        const x = px + i * (bw + gap);
        const yH = (c.young / maxC) * barH,
          oH = (c.old / maxC) * barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={H - 22 - yH}
              width={bw / 2 - 1}
              height={yH}
              fill="#60A5FA"
              rx={2}
            />
            <rect
              x={x + bw / 2}
              y={H - 22 - oH}
              width={bw / 2 - 1}
              height={oH}
              fill="#F97316"
              rx={2}
            />
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize={9}
              fill="#6B7280"
            >
              {c.label}
            </text>
          </g>
        );
      })}
      <text x={2} y={py + 6} fontSize={8} fill="#60A5FA" fontWeight={700}>
        {" "}
        Young
      </text>
      <text x={60} y={py + 6} fontSize={8} fill="#F97316" fontWeight={700}>
        {" "}
        Old
      </text>
    </svg>
  );
}
