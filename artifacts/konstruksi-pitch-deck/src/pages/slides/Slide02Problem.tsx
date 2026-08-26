export default function Slide02Problem() {
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
        boxSizing: "border-box",
        padding: "5vh 5vw",
        position: "relative",
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
          color: "rgba(140, 140, 140, 0.06)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        K
      </div>

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
          paddingBottom: "2vh",
          marginBottom: "5vh",
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
          01 / Masalah
        </div>
      </div>

      {/* Section label + headline */}
      <div style={{ zIndex: 1, marginBottom: "5vh" }}>
        <div
          style={{
            fontSize: "0.85vw",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "#C45B28",
            marginBottom: "1.5vh",
            fontWeight: 500,
          }}
        >
          Krisis Tersembunyi <span style={{ letterSpacing: "0.12em" }}>[S3]</span>
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "4.5vw",
            lineHeight: 1,
            fontWeight: 400,
            margin: 0,
            color: "#2C2C2C",
            letterSpacing: "-0.02em",
          }}
        >
          Di Jantung Industri{" "}
          <span style={{ fontStyle: "italic", color: "#C45B28" }}>
            Konstruksi
          </span>
        </h2>
      </div>

      {/* 4-priority grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "3vw",
          flex: 1,
          zIndex: 1,
          alignItems: "center",
        }}
      >
        {/* Priority 1 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "4.5vw",
              fontFamily: "'Playfair Display', serif",
              color: "#2C2C2C",
              lineHeight: 1,
            }}
          >
            Izin
          </div>
          <div
            style={{
              fontSize: "0.85vw",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#8C8C8C",
              marginTop: "1.5vh",
              borderTop: "1px solid rgba(140, 140, 140, 0.3)",
              paddingTop: "1.5vh",
            }}
          >
            Perizinan dan Kepatuhan
          </div>
          <p
            style={{
              fontSize: "1vw",
              color: "#2C2C2C",
              marginTop: "1vh",
              lineHeight: 1.6,
            }}
          >
            Tahapan, dokumen, dan rujukan instansi perlu ditelusuri dengan cermat.
          </p>
        </div>

        {/* Priority 2 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "4.5vw",
              fontFamily: "'Playfair Display', serif",
              color: "#2C2C2C",
              lineHeight: 1,
            }}
          >
            Tender
          </div>
          <div
            style={{
              fontSize: "0.85vw",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#8C8C8C",
              marginTop: "1.5vh",
              borderTop: "1px solid rgba(140, 140, 140, 0.3)",
              paddingTop: "1.5vh",
            }}
          >
            Kesiapan Penawaran
          </div>
          <p
            style={{
              fontSize: "1vw",
              color: "#2C2C2C",
              marginTop: "1vh",
              lineHeight: 1.6,
            }}
          >
            Persaingan menuntut dokumen, strategi, dan evaluasi internal yang rapi.
          </p>
        </div>

        {/* Priority 3 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "4.5vw",
              fontFamily: "'Playfair Display', serif",
              color: "#2C2C2C",
              lineHeight: 1,
            }}
          >
            Tim
          </div>
          <div
            style={{
              fontSize: "0.85vw",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#8C8C8C",
              marginTop: "1.5vh",
              borderTop: "1px solid rgba(140, 140, 140, 0.3)",
              paddingTop: "1.5vh",
            }}
          >
            Kompetensi dan Sertifikasi
          </div>
          <p
            style={{
              fontSize: "1vw",
              color: "#2C2C2C",
              marginTop: "1vh",
              lineHeight: 1.6,
            }}
          >
            Kebutuhan keahlian perlu dipetakan sejak perencanaan hingga pelaksanaan.
          </p>
        </div>

        {/* Priority 4 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "4.5vw",
              fontFamily: "'Playfair Display', serif",
              color: "#2C2C2C",
              lineHeight: 1,
            }}
          >
            Risiko
          </div>
          <div
            style={{
              fontSize: "0.85vw",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#8C8C8C",
              marginTop: "1.5vh",
              borderTop: "1px solid rgba(140, 140, 140, 0.3)",
              paddingTop: "1.5vh",
            }}
          >
            Biaya, Waktu, dan Mutu
          </div>
          <p
            style={{
              fontSize: "1vw",
              color: "#2C2C2C",
              marginTop: "1vh",
              lineHeight: 1.6,
            }}
          >
            Perubahan lapangan perlu dikelola dengan asumsi yang jelas dan dapat ditinjau.
          </p>
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
          02
        </div>
      </div>
    </div>
  );
}
