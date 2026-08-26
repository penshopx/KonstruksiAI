export default function Slide04Agents() {
  return (
    <div
      className="deck-slide w-screen h-screen overflow-hidden relative"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#F5F2ED",
        color: "#2C2C2C",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        padding: "5vh 5vw",
      }}
    >
      {/* Decorative letter */}
      <div
        style={{
          position: "absolute",
          top: "-5vh",
          right: "-2vw",
          fontSize: "80vh",
          fontFamily: "'Playfair Display', serif",
          color: "rgba(140, 140, 140, 0.05)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        A
      </div>

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
          paddingBottom: "2vh",
          marginBottom: "4vh",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#8C8C8C",
          }}
        >
          konstruksi.ai
        </div>
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#8C8C8C",
          }}
        >
          03 / Platform
        </div>
      </div>

      {/* Title Row */}
      <div style={{ zIndex: 1, marginBottom: "4vh" }}>
        <div
          style={{
            fontSize: "0.85vw",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "#C45B28",
            marginBottom: "1vh",
            fontWeight: 500,
          }}
        >
          8 Agen Spesialis
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "4vw",
            lineHeight: 1,
            fontWeight: 400,
            margin: 0,
            color: "#2C2C2C",
            letterSpacing: "-0.02em",
          }}
        >
          Satu Platform,{" "}
          <span style={{ fontStyle: "italic", color: "#C45B28" }}>
            Semua Keahlian
          </span>
        </h2>
      </div>

      {/* Agents Grid — two columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2.5vh 5vw",
          flex: 1,
          zIndex: 1,
          alignContent: "start",
        }}
      >
        {/* Agent 1 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Tender &amp; Pengadaan
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Analisis dokumen LPSE, estimasi RAB, strategi pemenangan
            </div>
          </div>
        </div>

        {/* Agent 2 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Manajemen Bisnis
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Cashflow, kontrak, subkontraktor, operasional perusahaan
            </div>
          </div>
        </div>

        {/* Agent 3 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Perijinan &amp; Sertifikasi
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              SBU, SKK, IUJK, IMB/PBG, dan regulasi terkini
            </div>
          </div>
        </div>

        {/* Agent 4 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Teknik Konstruksi
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Arsitektur, Sipil, Mekanikal, Elektrikal, K3
            </div>
          </div>
        </div>

        {/* Agent 5 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Energi Terbarukan
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Solar, angin, hidro, transmisi &amp; distribusi listrik
            </div>
          </div>
        </div>

        {/* Agent 6 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Migas &amp; Pertambangan
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Eksplorasi, pipeline, fasilitas, K3 Migas
            </div>
          </div>
        </div>

        {/* Agent 7 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Tender Intelligence
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Bid scoring real-time, eligibility check, evidence mapping
            </div>
          </div>
        </div>

        {/* Agent 8 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
          <div
            style={{
              width: "0.3vw",
              height: "4vh",
              backgroundColor: "#C45B28",
              flexShrink: 0,
              marginTop: "0.5vh",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "1vw",
                fontWeight: 600,
                color: "#2C2C2C",
                marginBottom: "0.5vh",
              }}
            >
              Engineering Solver
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
              Kalkulasi teknis, lookup regulasi, simulasi proyek
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "3vh",
          borderTop: "1px solid rgba(140, 140, 140, 0.4)",
          paddingTop: "2vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "#8C8C8C",
          }}
        >
          KonstruksiAI / Rahasia
        </div>
        <div
          style={{
            width: "2.5vw",
            height: "2.5vw",
            borderRadius: "50%",
            border: "1px solid #C45B28",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9vw",
            color: "#C45B28",
            fontStyle: "italic",
          }}
        >
          04
        </div>
      </div>
    </div>
  );
}
