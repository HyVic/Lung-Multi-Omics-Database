interface OTagProps {
  term: string;
  id?: string;
}

export default function OTag({ term, id }: OTagProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#F0F4FF",
        border: "1px solid #C7D2FE",
        borderRadius: 4,
        padding: "2px 7px",
        fontSize: 11,
        color: "#4338CA",
      }}
    >
      <b>{term}</b>
      {id && <span style={{ color: "#818CF8", fontSize: 10 }}>{id}</span>}
    </span>
  );
}
