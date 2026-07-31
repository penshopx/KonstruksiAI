const base = import.meta.env.BASE_URL;

export default function Slide01Title() {
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
      {/* Decorative large serif letter watermark */}
      <div
        style={{
          position: "absolute",
          top: "-5vh",
          right: "-2vw",
          fontSize: "80vh",
          fontFamily: "'Playfair Display', serif",
          color: "rgba(196, 91, 40, 0.06)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        K
      </div>

      {/* Hero image panel - right side background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "44%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <img
          src={`${base}hero.jpg`}
          crossOrigin="anonymous"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, #F5F2ED 0%, rgba(245,242,237,0.5) 40%, rgba(245,242,237,0) 100%)",
          }}
        />
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

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* Left Side: Huge Title */}
        <div style={{ flex: 1.5, paddingRight: "5vw" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "10vw",
              lineHeight: 0.9,
              fontWeight: 400,
              margin: 0,
              color: "#2C2C2C",
              letterSpacing: "-0.02em",
            }}
          >
            Konstruksi
            <br />
            <span style={{ fontStyle: "italic", color: "#C45B28" }}>AI</span>
          </h1>
        </div>

        {/* Right Side: Supporting text */}
        <div
          style={{
            flex: 1,
            borderLeft: "1px solid rgba(140, 140, 140, 0.4)",
            paddingLeft: "4vw",
            paddingTop: "5vh",
            paddingBottom: "5vh",
          }}
        >
          <div
            style={{
              fontSize: "0.9vw",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#C45B28",
              marginBottom: "3vh",
              fontWeight: 500,
            }}
          >
            Investor Deck
          </div>
          <p
            style={{
              fontSize: "2vw",
              lineHeight: 1.4,
              fontWeight: 300,
              margin: 0,
              color: "#2C2C2C",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Asisten Kecerdasan Buatan untuk Industri Keteknikan Indonesia.
          </p>
          <p
            style={{
              fontSize: "1.1vw",
              lineHeight: 1.7,
              color: "#8C8C8C",
              marginTop: "3vh",
              maxWidth: "85%",
              fontWeight: 400,
            }}
          >
            From tender strategy to certification compliance — the AI platform
            built for Indonesia's construction, energy, and mining professionals.
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
          Vol. 1
        </div>
      </div>
    </div>
  );
}
