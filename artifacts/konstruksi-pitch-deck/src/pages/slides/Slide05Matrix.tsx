export default function Slide05Matrix() {
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
          color: "rgba(196, 91, 40, 0.05)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        M
      </div>

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
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
          04 / Keunggulan
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          zIndex: 1,
        }}
      >
        {/* Left Side: Title + description */}
        <div
          style={{
            flex: 1,
            paddingRight: "4vw",
            paddingTop: "2vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
            Matriks Ruang Lingkup
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "5vw",
              lineHeight: 1,
              fontWeight: 400,
              margin: "0 0 3vh 0",
              color: "#2C2C2C",
              letterSpacing: "-0.02em",
            }}
          >
            126 Titik{" "}
            <span style={{ fontStyle: "italic", color: "#C45B28" }}>
              Koneksi
            </span>
          </h2>
          <p
            style={{
              fontSize: "1.1vw",
              lineHeight: 1.7,
              color: "#8C8C8C",
              fontWeight: 400,
              maxWidth: "90%",
            }}
          >
            Grid interaktif 21x6 yang menghubungkan setiap fungsi keteknikan
            dengan setiap domain bisnis. Tidak ada platform lain yang menawarkan
            kedalaman ini untuk industri konstruksi Indonesia.
          </p>
        </div>

        {/* Right Side: Stats */}
        <div
          style={{
            flex: 1.5,
            borderLeft: "1px solid rgba(140, 140, 140, 0.4)",
            paddingLeft: "4vw",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "4vh 3vw",
          }}
        >
          {/* Stat 1 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontSize: "5vw",
                fontFamily: "'Playfair Display', serif",
                color: "#2C2C2C",
                lineHeight: 1,
              }}
            >
              21
              <span style={{ color: "#C45B28", fontSize: "3vw" }}> fungsi</span>
            </div>
            <div
              style={{
                fontSize: "0.85vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginTop: "1vh",
                borderTop: "1px solid rgba(140, 140, 140, 0.2)",
                paddingTop: "1vh",
              }}
            >
              Fungsi Teknis
            </div>
            <p style={{ fontSize: "0.9vw", color: "#2C2C2C", marginTop: "0.8vh", lineHeight: 1.5 }}>
              Dari arsitektur hingga geologi eksplorasi
            </p>
          </div>

          {/* Stat 2 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontSize: "5vw",
                fontFamily: "'Playfair Display', serif",
                color: "#2C2C2C",
                lineHeight: 1,
              }}
            >
              6
              <span style={{ color: "#C45B28", fontSize: "3vw" }}> kolom</span>
            </div>
            <div
              style={{
                fontSize: "0.85vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginTop: "1vh",
                borderTop: "1px solid rgba(140, 140, 140, 0.2)",
                paddingTop: "1vh",
              }}
            >
              Domain Bisnis
            </div>
            <p style={{ fontSize: "0.9vw", color: "#2C2C2C", marginTop: "0.8vh", lineHeight: 1.5 }}>
              Tender, perijinan, K3, manajemen, dan lebih
            </p>
          </div>

          {/* Stat 3 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontSize: "5vw",
                fontFamily: "'Playfair Display', serif",
                color: "#2C2C2C",
                lineHeight: 1,
              }}
            >
              3
              <span style={{ color: "#C45B28", fontSize: "3vw" }}> sektor</span>
            </div>
            <div
              style={{
                fontSize: "0.85vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginTop: "1vh",
                borderTop: "1px solid rgba(140, 140, 140, 0.2)",
                paddingTop: "1vh",
              }}
            >
              Industri Vertikal
            </div>
            <p style={{ fontSize: "0.9vw", color: "#2C2C2C", marginTop: "0.8vh", lineHeight: 1.5 }}>
              Konstruksi, Energi Terbarukan, Migas &amp; Tambang
            </p>
          </div>

          {/* Stat 4 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontSize: "5vw",
                fontFamily: "'Playfair Display', serif",
                color: "#2C2C2C",
                lineHeight: 1,
              }}
            >
              126
              <span style={{ color: "#C45B28", fontSize: "3vw" }}>+</span>
            </div>
            <div
              style={{
                fontSize: "0.85vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginTop: "1vh",
                borderTop: "1px solid rgba(140, 140, 140, 0.2)",
                paddingTop: "1vh",
              }}
            >
              Titik Koneksi AI
            </div>
            <p style={{ fontSize: "0.9vw", color: "#2C2C2C", marginTop: "0.8vh", lineHeight: 1.5 }}>
              Setiap titik membuka agen AI kontekstual yang relevan
            </p>
          </div>
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
          05
        </div>
      </div>
    </div>
  );
}
