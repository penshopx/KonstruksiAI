export default function Slide06Market() {
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
          05 / Pasar
        </div>
      </div>

      {/* Section label + headline */}
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
          Siapa yang Kami Layani
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
          Target Pasar{" "}
          <span style={{ fontStyle: "italic", color: "#C45B28" }}>
            Indonesia
          </span>
        </h2>
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          gap: "5vw",
        }}
      >
        {/* Left: Segment list */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.8vw",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#8C8C8C",
              marginBottom: "2.5vh",
              fontWeight: 500,
            }}
          >
            Segmen Pengguna
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "0.3vw",
                  minHeight: "4vh",
                  backgroundColor: "#C45B28",
                  flexShrink: 0,
                  marginTop: "0.3vh",
                }}
              />
              <div>
                <div style={{ fontSize: "1.05vw", fontWeight: 600, color: "#2C2C2C", marginBottom: "0.4vh" }}>
                  Kontraktor &amp; Subkontraktor
                </div>
                <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
                  Strategi tender, estimasi RAB, kepatuhan regulasi
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "0.3vw",
                  minHeight: "4vh",
                  backgroundColor: "#C45B28",
                  flexShrink: 0,
                  marginTop: "0.3vh",
                }}
              />
              <div>
                <div style={{ fontSize: "1.05vw", fontWeight: 600, color: "#2C2C2C", marginBottom: "0.4vh" }}>
                  Konsultan Engineering
                </div>
                <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
                  Kalkulasi teknis, JSA, HIRARC, dokumentasi proyek
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "0.3vw",
                  minHeight: "4vh",
                  backgroundColor: "#C45B28",
                  flexShrink: 0,
                  marginTop: "0.3vh",
                }}
              />
              <div>
                <div style={{ fontSize: "1.05vw", fontWeight: 600, color: "#2C2C2C", marginBottom: "0.4vh" }}>
                  Perusahaan EPC Migas &amp; Tambang
                </div>
                <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
                  Izin pipeline, K3 Migas, eksplorasi mineral
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "0.3vw",
                  minHeight: "4vh",
                  backgroundColor: "#C45B28",
                  flexShrink: 0,
                  marginTop: "0.3vh",
                }}
              />
              <div>
                <div style={{ fontSize: "1.05vw", fontWeight: 600, color: "#2C2C2C", marginBottom: "0.4vh" }}>
                  Developer &amp; Owner Proyek
                </div>
                <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
                  Perijinan IMB/PBG, manajemen proyek terintegrasi
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "0.3vw",
                  minHeight: "4vh",
                  backgroundColor: "#C45B28",
                  flexShrink: 0,
                  marginTop: "0.3vh",
                }}
              />
              <div>
                <div style={{ fontSize: "1.05vw", fontWeight: 600, color: "#2C2C2C", marginBottom: "0.4vh" }}>
                  Profesional Individu
                </div>
                <div style={{ fontSize: "0.95vw", color: "#8C8C8C", lineHeight: 1.5 }}>
                  Persiapan SKK, pengembangan karir, sertifikasi profesi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: "1px",
            backgroundColor: "rgba(140, 140, 140, 0.4)",
            alignSelf: "stretch",
          }}
        />

        {/* Right: Market size */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "5vh" }}>
          <div>
            <div
              style={{
                fontSize: "0.8vw",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "#8C8C8C",
                marginBottom: "2vh",
                fontWeight: 500,
              }}
            >
              Ukuran Pasar
            </div>
            <div
              style={{
                fontSize: "5.5vw",
                fontFamily: "'Playfair Display', serif",
                color: "#2C2C2C",
                lineHeight: 1,
              }}
            >
              180
              <span style={{ fontSize: "3vw", color: "#C45B28" }}>rb+</span>
            </div>
            <div
              style={{
                fontSize: "0.85vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginTop: "1vh",
                borderTop: "1px solid rgba(140,140,140,0.25)",
                paddingTop: "1vh",
              }}
            >
              Perusahaan Konstruksi Terdaftar (LPJK)
            </div>
            <div style={{ fontSize: "0.75vw", color: "rgba(140,140,140,0.7)", marginTop: "0.5vh", fontStyle: "italic" }}>
              Sumber: LPJK 2024
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "5.5vw",
                fontFamily: "'Playfair Display', serif",
                color: "#2C2C2C",
                lineHeight: 1,
              }}
            >
              800
              <span style={{ fontSize: "3vw", color: "#C45B28" }}>rb+</span>
            </div>
            <div
              style={{
                fontSize: "0.85vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8C8C",
                marginTop: "1vh",
                borderTop: "1px solid rgba(140,140,140,0.25)",
                paddingTop: "1vh",
              }}
            >
              Tenaga Ahli Bersertifikat di Indonesia
            </div>
            <div style={{ fontSize: "0.75vw", color: "rgba(140,140,140,0.7)", marginTop: "0.5vh", fontStyle: "italic" }}>
              Sumber: BNSP / perkiraan industri
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
          06
        </div>
      </div>
    </div>
  );
}
