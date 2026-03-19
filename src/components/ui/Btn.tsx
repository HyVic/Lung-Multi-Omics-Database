interface BtnProps {
  onClick?: () => void;
  children: React.ReactNode;
  v?: "primary" | "secondary" | "danger" | "success" | "ghost" | "outline";
  sm?: boolean;
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Btn({ onClick, children, v = "primary", sm, disabled, full, type = "button" }: BtnProps) {
  const S: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg,#3B82F6,#6366F1)",
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: "#fff",
      color: "#374151",
      border: "1px solid #D1D5DB",
    },
    danger: {
      background: "#FEF2F2",
      color: "#EF4444",
      border: "1px solid #FECACA",
    },
    success: {
      background: "#F0FDF4",
      color: "#16A34A",
      border: "1px solid #BBF7D0",
    },
    ghost: { background: "transparent", color: "#6B7280", border: "none" },
    outline: {
      background: "transparent",
      color: "#3B82F6",
      border: "1px solid #3B82F6",
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...S[v],
        padding: sm ? "5px 11px" : "9px 18px",
        borderRadius: 7,
        fontSize: sm ? 11 : 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: full ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}
