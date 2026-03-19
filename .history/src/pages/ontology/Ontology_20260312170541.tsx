import { ONT } from "../../constants/ontology";
import { Card } from "../../components/ui";

export default function Ontology() {
  return (
    <div
            style={{ maxWidth: 900, margin: "24px auto", padding: "0 24px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "250px 1fr",
                gap: 20,
              }}
            >
              <Card>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  UBERON ANATOMY TREE
                </div>
                {[
                  { label: "Lung", id: "UBERON:0002048", lv: 0 },
                  { label: "Airway", id: "UBERON:0001005", lv: 1 },
                  { label: "Bronchus", id: "UBERON:0002185", lv: 2 },
                  { label: "Trachea", id: "UBERON:0003126", lv: 2 },
                  { label: "Alveolus", id: "UBERON:0002299", lv: 2 },
                  { label: "Vasculature", id: "UBERON:0002049", lv: 1 },
                  { label: "Pleura", id: "UBERON:0000977", lv: 1 },
                ].map((n, i) => (
                  <div
                    key={i}
                    onClick={() => setTFilter(n.label)}
                    style={{
                      paddingLeft: 8 + n.lv * 16,
                      paddingTop: 5,
                      paddingBottom: 5,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      borderRadius: 4,
                      background:
                        tFilter === n.label ? "#EEF2FF" : "transparent",
                      color: tFilter === n.label ? "#4338CA" : "#374151",
                      fontSize: 12,
                      fontWeight: tFilter === n.label ? 700 : 400,
                    }}
                  >
                    <span style={{ color: "#9CA3AF", fontSize: 10 }}>
                      {n.lv > 0 ? "L" : "*"}
                    </span>
                    <span>{n.label}</span>
                    <span
                      style={{
                        color: "#C7D2FE",
                        fontSize: 10,
                        marginLeft: "auto",
                      }}
                    >
                      {n.id}
                    </span>
                  </div>
                ))}
              </Card>
              <Card>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  OMICS ASSAY ONTOLOGY (OBI)
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {Object.entries(ONT.omics).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        background: v.color + "0F",
                        border: `1px solid ${v.color}33`,
                        borderRadius: 8,
                        padding: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: 13 }}>
                          {k}
                        </span>
                        <OTag term={v.id} id="" />
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>
                        {v.cat}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
  );
}
