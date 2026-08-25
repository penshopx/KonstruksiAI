export default function Slide09Pricing() {
  return (
    <div
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
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
          paddingBottom: "2vh",
          marginBottom: "4vh",
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
          09 / Harga
        </div>
      </div>

      {/* Headline */}
      <div style={{ marginBottom: "4vh" }}>
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
          Paket &amp; Harga
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "4vw",
            lineHeight: 1,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Mulai Gratis,{" "}
          <span style={{ fontStyle: "italic", color: "#C45B28" }}>
            Upgrade Kapan Saja
          </span>
        </h2>
      </div>

      {/* Three tier cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "3vw",
          flex: 1,
        }}
      >
        {/* Free Tier */}
        <div
          style={{
            borderTop: "3px solid #8C8C8C",
            paddingTop: "2.5vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "0.8vw",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#8C8C8C",
              marginBottom: "1vh",
              fontWeight: 500,
            }}
          >
            Gratis
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "3.5vw",
              color: "#2C2C2C",
              lineHeight: 1,
              marginBottom: "1vh",
            }}
          >
            Rp 0
          </div>
          <div style={{ fontSize: "0.85vw", color: "#8C8C8C", marginBottom: "2.5vh" }}>
            Selamanya gratis
          </div>
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(140,140,140,0.3)",
              marginBottom: "2.5vh",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh", flex: 1 }}>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Chat AI + 8 Agen Spesialis
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Matriks Ruang Lingkup (126 koneksi)
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Riwayat percakapan lokal
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              SBU &amp; SKK readiness tools
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Ekspor percakapan (.md)
            </div>
          </div>
        </div>

        {/* Pro Tier */}
        <div
          style={{
            borderTop: "3px solid #C45B28",
            paddingTop: "2.5vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-1.2vh",
              right: 0,
              fontSize: "0.7vw",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#F5F2ED",
              backgroundColor: "#C45B28",
              padding: "0.4vh 1vw",
            }}
          >
            Segera Hadir
          </div>
          <div
            style={{
              fontSize: "0.8vw",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#C45B28",
              marginBottom: "1vh",
              fontWeight: 500,
            }}
          >
            Pro
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "3.5vw",
              color: "#2C2C2C",
              lineHeight: 1,
              marginBottom: "1vh",
            }}
          >
            TBA
          </div>
          <div style={{ fontSize: "0.85vw", color: "#8C8C8C", marginBottom: "2.5vh" }}>
            Per bulan, per pengguna
          </div>
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(196,91,40,0.3)",
              marginBottom: "2.5vh",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh", flex: 1 }}>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Semua fitur Gratis
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Koneksi LLM real-time
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Riwayat cloud (sinkronisasi)
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Analisis dokumen PDF
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Template dokumen premium
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Dukungan prioritas
            </div>
          </div>
        </div>

        {/* Enterprise Tier */}
        <div
          style={{
            borderTop: "3px solid #2C2C2C",
            paddingTop: "2.5vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "0.8vw",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#2C2C2C",
              marginBottom: "1vh",
              fontWeight: 500,
            }}
          >
            Enterprise
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "3.5vw",
              color: "#2C2C2C",
              lineHeight: 1,
              marginBottom: "1vh",
            }}
          >
            Kustom
          </div>
          <div style={{ fontSize: "0.85vw", color: "#8C8C8C", marginBottom: "2.5vh" }}>
            Harga sesuai kebutuhan
          </div>
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(44,44,44,0.2)",
              marginBottom: "2.5vh",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh", flex: 1 }}>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Deployment privat / on-premise
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              API access penuh
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Manajemen tim &amp; role-based access
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              SLA &amp; dedicated support
            </div>
            <div style={{ fontSize: "0.95vw", color: "#2C2C2C", display: "flex", gap: "1vw" }}>
              <span style={{ color: "#C45B28", fontWeight: 600 }}>—</span>
              Kustomisasi model &amp; knowledge base
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
          09
        </div>
      </div>
    </div>
  );
}
