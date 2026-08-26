export default function Slide10CTA() {
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
      {/* Decorative large serif letter */}
      <div
        style={{
          position: "absolute",
          top: "-5vh",
          left: "-2vw",
          fontSize: "80vh",
          fontFamily: "'Playfair Display', serif",
          color: "rgba(196, 91, 40, 0.05)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        B
      </div>

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
          paddingBottom: "2vh",
          marginBottom: "10vh",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "1vw",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#8C8C8C",
            fontWeight: 400,
          }}
        >
          konstruksi.ai
        </div>
        <div
          style={{
            fontSize: "1vw",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#8C8C8C",
          }}
        >
          2026
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* Left: Contact / Details */}
        <div
          style={{
            flex: 1,
            paddingRight: "4vw",
            borderRight: "1px solid rgba(140, 140, 140, 0.4)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "4vh",
          }}
        >
          <div
            style={{
              fontSize: "0.85vw",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#C45B28",
              fontWeight: 500,
            }}
          >
            Mulai Sekarang
          </div>

          <div>
            <div
              style={{
                fontSize: "0.8vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginBottom: "1vh",
              }}
            >
              Platform
            </div>
            <div
              style={{
                fontSize: "1.5vw",
                color: "#2C2C2C",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              konstruksi.ai
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.8vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginBottom: "1vh",
              }}
            >
              Akses Gratis
            </div>
            <div
              style={{
                fontSize: "1.5vw",
                color: "#2C2C2C",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Tersedia sekarang
            </div>
            <div
              style={{
                fontSize: "1vw",
                color: "#8C8C8C",
                marginTop: "0.5vh",
              }}
            >
              Tanpa kartu kredit
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.8vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginBottom: "1vh",
              }}
            >
              Pro Waitlist
            </div>
            <div
              style={{
                fontSize: "1.5vw",
                color: "#2C2C2C",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Daftar antrian terbuka
            </div>
            <div
              style={{
                fontSize: "1vw",
                color: "#8C8C8C",
                marginTop: "0.5vh",
              }}
            >
              Early access untuk mitra strategis
            </div>
          </div>
        </div>

        {/* Right: Big Title */}
        <div
          style={{
            flex: 1.5,
            paddingLeft: "6vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "9vw",
              lineHeight: 0.9,
              fontWeight: 400,
              margin: "0 0 2vh 0",
              color: "#2C2C2C",
              letterSpacing: "-0.02em",
            }}
          >
            Mari
            <br />
            <span style={{ fontStyle: "italic", color: "#C45B28" }}>
              Membangun.
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.4vw",
              lineHeight: 1.6,
              color: "#8C8C8C",
              marginTop: "2vh",
              maxWidth: "80%",
              fontWeight: 400,
            }}
          >
            3 sektor industri, 26 sub-bidang, 126 koneksi AI — semuanya
            dirancang khusus untuk Indonesia.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(140, 140, 140, 0.4)",
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
            color: "#8C8C8C",
          }}
        >
          KonstruksiAI / Rahasia
        </div>
        <div
          style={{
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "#8C8C8C",
          }}
        >
          10
        </div>
      </div>
    </div>
  );
}
