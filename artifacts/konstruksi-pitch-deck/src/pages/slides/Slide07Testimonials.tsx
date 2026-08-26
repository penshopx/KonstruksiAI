export default function Slide07Testimonials() {
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
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
          paddingBottom: "2vh",
          marginBottom: "5vh",
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
          06 / Testimoni
        </div>
      </div>

      {/* Headline */}
      <div style={{ marginBottom: "4vh" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2vw",
            marginBottom: "1vh",
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
            Apa Kata Mereka
          </div>
          <div
            style={{
              fontSize: "0.7vw",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#8C8C8C",
              border: "1px solid rgba(140,140,140,0.4)",
              padding: "0.3vh 0.8vw",
            }}
          >
            Ilustratif
          </div>
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3.5vw",
            lineHeight: 1.1,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Respons dari Profesional{" "}
          <span style={{ fontStyle: "italic", color: "#C45B28" }}>
            Keteknikan Indonesia
          </span>
        </h2>
      </div>

      {/* Three Testimonial Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "3vw",
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            borderLeft: "3px solid #C45B28",
            paddingLeft: "2vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "5vw",
                color: "rgba(196, 91, 40, 0.2)",
                lineHeight: 1,
                marginBottom: "1vh",
              }}
            >
              "
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "1.35vw",
                lineHeight: 1.6,
                color: "#2C2C2C",
                margin: 0,
              }}
            >
              KonstruksiAI sangat membantu tim kami menyusun RAB dengan cepat
              dan akurat. Proses yang biasanya butuh 2 hari kerja sekarang
              selesai dalam hitungan jam.
            </p>
          </div>
          <div style={{ marginTop: "3vh" }}>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "rgba(140,140,140,0.3)",
                marginBottom: "1.5vh",
              }}
            />
            <div style={{ fontSize: "1vw", fontWeight: 600, color: "#2C2C2C" }}>
              Budi Santoso
            </div>
            <div style={{ fontSize: "0.85vw", color: "#C45B28", marginTop: "0.3vh" }}>
              Direktur, PT Maju Konstruksi
            </div>
            <div style={{ fontSize: "0.8vw", color: "#8C8C8C", marginTop: "0.2vh" }}>
              Jakarta
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            borderLeft: "3px solid #C45B28",
            paddingLeft: "2vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "5vw",
                color: "rgba(196, 91, 40, 0.2)",
                lineHeight: 1,
                marginBottom: "1vh",
              }}
            >
              "
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "1.35vw",
                lineHeight: 1.6,
                color: "#2C2C2C",
                margin: 0,
              }}
            >
              Fitur K3 dan JSA-nya luar biasa detail. Sangat membantu
              mempersiapkan dokumen keselamatan untuk proyek PLTS berskala besar
              di Jawa Timur.
            </p>
          </div>
          <div style={{ marginTop: "3vh" }}>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "rgba(140,140,140,0.3)",
                marginBottom: "1.5vh",
              }}
            />
            <div style={{ fontSize: "1vw", fontWeight: 600, color: "#2C2C2C" }}>
              Ratih Handayani
            </div>
            <div style={{ fontSize: "0.85vw", color: "#C45B28", marginTop: "0.3vh" }}>
              Manajer K3, PT EBT Nusantara
            </div>
            <div style={{ fontSize: "0.8vw", color: "#8C8C8C", marginTop: "0.2vh" }}>
              Surabaya
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            borderLeft: "3px solid #C45B28",
            paddingLeft: "2vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "5vw",
                color: "rgba(196, 91, 40, 0.2)",
                lineHeight: 1,
                marginBottom: "1vh",
              }}
            >
              "
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "1.35vw",
                lineHeight: 1.6,
                color: "#2C2C2C",
                margin: 0,
              }}
            >
              Platform terbaik untuk profesional konstruksi Indonesia. Panduan
              tender LPSE dan strategi penawarannya sangat relevan dengan
              kondisi pasar saat ini.
            </p>
          </div>
          <div style={{ marginTop: "3vh" }}>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "rgba(140,140,140,0.3)",
                marginBottom: "1.5vh",
              }}
            />
            <div style={{ fontSize: "1vw", fontWeight: 600, color: "#2C2C2C" }}>
              Ahmad Fauzi
            </div>
            <div style={{ fontSize: "0.85vw", color: "#C45B28", marginTop: "0.3vh" }}>
              Konsultan Tender Senior
            </div>
            <div style={{ fontSize: "0.8vw", color: "#8C8C8C", marginTop: "0.2vh" }}>
              Bandung
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
          07
        </div>
      </div>
    </div>
  );
}
