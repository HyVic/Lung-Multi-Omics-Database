import { ReactNode, MouseEvent } from "react";

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: (e?: MouseEvent) => void;
}

export default function Card({ children, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
