interface SecTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SecTitle({ children, style }: SecTitleProps) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#6B7280",
        letterSpacing: "0.07em",
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
