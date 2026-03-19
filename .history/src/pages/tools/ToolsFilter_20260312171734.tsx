<div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 24px" }}>
      {ACTIVE?.component ? (
        <div>
          <button
            onClick={() => setActiveTool(null)}
            style={{
              background: "none",
              border: "none",
              color: "#3B82F6",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              marginBottom: 16,
              padding: 0,
            }}
          >
            {"<- Back to Tools"}
          </button>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {ACTIVE.icon}
              </div>
              <div>
                <div
                  style={{ fontSize: 17, fontWeight: 800, color: "#1E293B" }}
                >
                  {ACTIVE.name}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  {ACTIVE.desc}
                </div>
              </div>
              <Badge
                color={ONT.omics["bulk RNA-seq"]?.color || "#3B82F6"}
                style={{ marginLeft: "auto" }}
              >
                {ACTIVE.category}
              </Badge>
            </div>
            {ACTIVE.component}
          </Card>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1E293B",
                margin: "0 0 6px",
              }}
            >
              Bioinformatics Tools
            </h2>
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
              Lightweight online tools for quick analysis - no installation
              required.
            </p>
          </div>
          {categories.map((cat) => (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                {cat.toUpperCase()}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                  gap: 14,
                }}
              >
                {TOOLS.filter((t) => t.category === cat).map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => tool.component && setActiveTool(tool.id)}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: 12,
                      padding: 18,
                      cursor: tool.component ? "pointer" : "default",
                      opacity: tool.component ? 1 : 0.55,
                      transition: "all 0.15s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "linear-gradient(135deg,#EFF6FF,#E0E7FF)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1E293B",
                          }}
                        >
                          {tool.name}
                        </div>
                        {!tool.component && (
                          <Badge color="#9CA3AF" sm>
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        lineHeight: 1.5,
                      }}
                    >
                      {tool.desc}
                    </div>
                    {tool.component && (
                      <div
                        style={{
                          marginTop: 10,
                          fontSize: 11,
                          color: "#3B82F6",
                          fontWeight: 600,
                        }}
                      >
                        Launch {"->"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>