export default function Slide08Tech() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#2C2C2C",
        color: "#F5F2ED",
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
          color: "rgba(245, 242, 237, 0.04)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        T
      </div>

      {/* Orange accent stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "0.5vw",
          height: "100%",
          backgroundColor: "#C45B28",
          zIndex: 1,
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(245, 242, 237, 0.2)",
          paddingBottom: "2vh",
          marginBottom: "6vh",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "rgba(245,242,237,0.5)",
          }}
        >
          konstruksi.ai
        </div>
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "rgba(245,242,237,0.5)",
          }}
        >
          07 / Teknologi
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          zIndex: 1,
          gap: "5vw",
        }}
      >
        {/* Left: Title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontSize: "0.85vw",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#C45B28",
              marginBottom: "3vh",
              fontWeight: 500,
            }}
          >
            Platform &amp; Teknologi
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "5vw",
              lineHeight: 1,
              fontWeight: 400,
              margin: "0 0 3vh 0",
              color: "#F5F2ED",
              letterSpacing: "-0.02em",
            }}
          >
            Dibangun untuk{" "}
            <span style={{ fontStyle: "italic", color: "#C45B28" }}>
              Skalabilitas
            </span>
          </h2>
          <p
            style={{
              fontSize: "1.1vw",
              lineHeight: 1.7,
              color: "rgba(245,242,237,0.65)",
              maxWidth: "88%",
            }}
          >
            Arsitektur multi-agen AI dengan aplikasi web dan mobile yang sudah
            berjalan, serta roadmap infrastruktur enterprise.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1vw",
              marginTop: "3vh",
            }}
          >
            <div
              style={{
                width: "0.6vw",
                height: "0.6vw",
                borderRadius: "50%",
                backgroundColor: "#C45B28",
              }}
            />
            <span style={{ fontSize: "0.8vw", color: "rgba(245,242,237,0.5)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Tersedia sekarang
            </span>
            <div
              style={{
                width: "0.6vw",
                height: "0.6vw",
                borderRadius: "50%",
                backgroundColor: "rgba(245,242,237,0.3)",
                marginLeft: "1vw",
              }}
            />
            <span style={{ fontSize: "0.8vw", color: "rgba(245,242,237,0.5)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Roadmap
            </span>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: "1px",
            backgroundColor: "rgba(245,242,237,0.15)",
            alignSelf: "stretch",
          }}
        />

        {/* Right: Feature list */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vh" }}>
          {/* Available now */}
          <div>
            <div style={{ fontSize: "0.8vw", textTransform: "uppercase", letterSpacing: "0.3em", color: "#C45B28", marginBottom: "0.8vh", fontWeight: 500 }}>
              Aplikasi — Tersedia Sekarang
            </div>
            <p style={{ fontSize: "1.05vw", color: "#F5F2ED", margin: 0, lineHeight: 1.5 }}>
              Web — React + Multi-Agent AI Architecture
            </p>
            <p style={{ fontSize: "1.05vw", color: "#F5F2ED", margin: "0.5vh 0 0 0", lineHeight: 1.5 }}>
              Mobile — iOS &amp; Android (Expo React Native)
            </p>
          </div>
          <div style={{ height: "1px", backgroundColor: "rgba(245,242,237,0.12)" }} />

          {/* Available now */}
          <div>
            <div style={{ fontSize: "0.8vw", textTransform: "uppercase", letterSpacing: "0.3em", color: "#C45B28", marginBottom: "0.8vh", fontWeight: 500 }}>
              AI Engine — Tersedia Sekarang
            </div>
            <p style={{ fontSize: "1.05vw", color: "#F5F2ED", margin: 0, lineHeight: 1.5 }}>
              Multi-agent AI dengan basis pengetahuan konstruksi Indonesia
            </p>
            <p style={{ fontSize: "1.05vw", color: "#F5F2ED", margin: "0.5vh 0 0 0", lineHeight: 1.5 }}>
              Chat lokal, riwayat percakapan, ekspor Markdown
            </p>
          </div>
          <div style={{ height: "1px", backgroundColor: "rgba(245,242,237,0.12)" }} />

          {/* Roadmap */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1vw",
                marginBottom: "0.8vh",
              }}
            >
              <div style={{ fontSize: "0.8vw", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(245,242,237,0.45)", fontWeight: 500 }}>
                Roadmap Pro &amp; Enterprise
              </div>
            </div>
            <p style={{ fontSize: "1.05vw", color: "rgba(245,242,237,0.55)", margin: 0, lineHeight: 1.5 }}>
              Koneksi LLM real-time — Analisis PDF tender — Sinkronisasi cloud
            </p>
            <p style={{ fontSize: "1.05vw", color: "rgba(245,242,237,0.55)", margin: "0.5vh 0 0 0", lineHeight: 1.5 }}>
              Data residency Indonesia — Enterprise SSO — API kustom
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(245,242,237,0.15)",
          paddingTop: "2vh",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "rgba(245,242,237,0.4)",
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
          08
        </div>
      </div>
    </div>
  );
}
