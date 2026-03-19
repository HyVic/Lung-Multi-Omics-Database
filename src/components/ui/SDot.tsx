interface SDotProps {
  s: string;
}

export default function SDot({ s }: SDotProps) {
  const c: Record<string, string> = {
    active: "#10B981",
    pending: "#F59E0B",
    suspended: "#EF4444",
    published: "#10B981",
    review: "#F59E0B",
    draft: "#9CA3AF",
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c[s] || "#9CA3AF",
          display: "inline-block",
        }}
      />
      <span
        style={{ fontSize: 11, color: "#6B7280", textTransform: "capitalize" }}
      >
        {s}
      </span>
    </span>
  );
}
