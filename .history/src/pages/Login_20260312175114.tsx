 <div
          style={{
            background: "#0F172A",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            height: 48,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            position: "sticky",
            top: 0,
            zIndex: 200,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginRight: "auto",
              cursor: "pointer",
            }}
            onClick={() => setDetailDS(null)}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🫁
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              LungOmics
            </span>
          </div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {user.role === "admin" && (
                <button
                  onClick={() => setShowAdm(true)}
                  style={{
                    background: "rgba(139,92,246,0.18)",
                    border: "1px solid rgba(139,92,246,0.35)",
                    color: "#C4B5FD",
                    padding: "5px 11px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  [gear] Admin
                </button>
              )}
              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                border: "none",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          )}
        </div>