interface BadgeProps {
  color: string;
  children: React.ReactNode;
  sm?: boolean;
}

export default function Badge({ color, children, sm }: BadgeProps) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        padding: sm ? "1px 6px" : "2px 9px",
        borderRadius: 4,
        fontSize: sm ? 10 : 11,
        fontWeight: 600,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
