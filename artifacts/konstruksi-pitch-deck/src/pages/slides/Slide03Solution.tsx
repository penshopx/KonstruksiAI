export default function Slide03Solution() {
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
          02 / Solusi
        </div>
      </div>

      {/* Pull Quote Section */}
      <div
        style={{
          marginBottom: "5vh",
          position: "relative",
          paddingLeft: "3vw",
          paddingRight: "8vw",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "-1vw",
            top: "-3vh",
            fontSize: "12vw",
            fontFamily: "'Playfair Display', serif",
            color: "rgba(196, 91, 40, 0.12)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          "
        </span>
        <div
          style={{
            fontSize: "0.85vw",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "#C45B28",
            marginBottom: "2vh",
            fontWeight: 500,
          }}
        >
          Solusi
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "3.2vw",
            lineHeight: 1.3,
            fontWeight: 400,
            margin: 0,
            color: "#2C2C2C",
          }}
        >
          AI yang Memahami Bahasa Konstruksi, Energi, dan Migas Indonesia.
        </h2>
      </div>

      {/* Horizontal Rule */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(44, 44, 44, 0.6)",
          marginBottom: "5vh",
        }}
      />

      {/* 2 Columns */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Column 1 */}
        <div
          style={{
            flex: "0 0 46%",
            fontSize: "1.1vw",
            lineHeight: 1.8,
            color: "#4A4A4A",
          }}
        >
          <p style={{ margin: 0 }}>
            KonstruksiAI adalah platform multi-agen AI yang dirancang khusus
            untuk sektor konstruksi, energi terbarukan, dan migas Indonesia.
            Platform ini memahami regulasi PUPR, LPSE, dan ESDM — bukan sekadar
            AI generik.
          </p>
          <p style={{ marginTop: "2.5vh" }}>
            Dengan 8 agen spesialis dan 126 titik koneksi pengetahuan, setiap
            profesional mendapat panduan yang tepat untuk kebutuhan spesifik
            mereka — kapan saja, tanpa antrian, tanpa biaya konsultan.
          </p>
        </div>

        {/* Vertical Gutter Rule */}
        <div
          style={{
            width: "1px",
            backgroundColor: "rgba(140, 140, 140, 0.4)",
            height: "100%",
          }}
        />

        {/* Column 2: Key points */}
        <div style={{ flex: "0 0 46%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3vh" }}>
            <div>
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
                Regulasi Nusantara
              </div>
              <p
                style={{
                  fontSize: "1.1vw",
                  lineHeight: 1.6,
                  color: "#2C2C2C",
                  margin: 0,
                }}
              >
                Memahami bahasa PUPR, LPSE, dan ESDM. Dilatih dengan regulasi
                UU Cipta Kerja dan Perpres 16/2018 terkini.
              </p>
            </div>
            <div>
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
                Multi-Agen Spesialis
              </div>
              <p
                style={{
                  fontSize: "1.1vw",
                  lineHeight: 1.6,
                  color: "#2C2C2C",
                  margin: 0,
                }}
              >
                8 agen AI mencakup setiap fungsi bisnis — dari tender hingga K3,
                dari perijinan hingga manajemen subkontraktor.
              </p>
            </div>
            <div>
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
                Tersedia 24/7
              </div>
              <p
                style={{
                  fontSize: "1.1vw",
                  lineHeight: 1.6,
                  color: "#2C2C2C",
                  margin: 0,
                }}
              >
                Tanpa konsultan, tanpa waktu tunggu. Jawaban yang tepat tersedia
                setiap saat di web maupun mobile.
              </p>
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
          03
        </div>
      </div>
    </div>
  );
}
