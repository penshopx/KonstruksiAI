export default function Slide08Traction() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        backgroundColor: "#F5F2ED",
        color: "#2C2C2C",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        padding: "5vh 5vw",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-2vw",
          bottom: "-12vh",
          fontFamily: "'Playfair Display', serif",
          fontSize: "68vh",
          lineHeight: 1,
          color: "rgba(196, 91, 40, 0.05)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        T
      </div>

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
          07 / Traksi
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          gap: "5vw",
          zIndex: 1,
        }}
      >
        <div
          style={{
            flex: 0.9,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5vw",
              marginBottom: "1.5vh",
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
              Sinyal Awal di Pasar
            </div>
            <div
              style={{
                fontSize: "0.7vw",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#C45B28",
                border: "1px solid rgba(196,91,40,0.55)",
                padding: "0.4vh 0.8vw",
              }}
            >
              Draft — Verifikasi
            </div>
          </div>
          <div
            style={{
              fontSize: "0.95vw",
              color: "#8C8C8C",
              marginBottom: "2vh",
              lineHeight: 1.5,
            }}
          >
            Snapshot dari materi produk internal; angka dan contoh use case di
            bawah perlu diverifikasi sebelum dipakai eksternal.
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "4.4vw",
              lineHeight: 1.02,
              fontWeight: 400,
              margin: "0 0 3vh 0",
              letterSpacing: "-0.02em",
              maxWidth: "92%",
            }}
          >
            Penggunaan tumbuh dari{" "}
            <span style={{ fontStyle: "italic", color: "#C45B28" }}>
              use case nyata
            </span>
          </h2>
          <p
            style={{
              fontSize: "1.15vw",
              lineHeight: 1.6,
              color: "#8C8C8C",
              maxWidth: "88%",
              margin: 0,
            }}
          >
            Materi produk saat ini menyebut penggunaan oleh profesional yang
            mengerjakan tender, perijinan, dan proyek energi.
          </p>
          <div
            style={{
              marginTop: "4vh",
              paddingTop: "2vh",
              borderTop: "1px solid rgba(140,140,140,0.35)",
              width: "82%",
            }}
          >
            <div
              style={{
                fontSize: "0.8vw",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#8C8C8C",
                marginBottom: "1vh",
              }}
            >
              Ilustrasi tren pertumbuhan
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "1.2vw",
                height: "8vh",
                paddingBottom: "1vh",
              }}
            >
              <div
                style={{
                  width: "2.4vw",
                  height: "2vh",
                  backgroundColor: "rgba(196,91,40,0.3)",
                }}
              />
              <div
                style={{
                  width: "2.4vw",
                  height: "4.5vh",
                  backgroundColor: "rgba(196,91,40,0.55)",
                }}
              />
              <div
                style={{
                  width: "2.4vw",
                  height: "7vh",
                  backgroundColor: "#C45B28",
                }}
              />
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.65vw",
                  lineHeight: 1.2,
                  color: "#2C2C2C",
                  marginLeft: "0.8vw",
                }}
              >
                50+ proyek/bulan*
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.15vw",
                fontSize: "0.7vw",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#8C8C8C",
              }}
            >
              <span>Baseline</span>
              <span>Validasi</span>
              <span>Saat ini</span>
            </div>
            <div
              style={{
                fontSize: "0.75vw",
                color: "#8C8C8C",
                fontStyle: "italic",
                marginTop: "1vh",
              }}
            >
              Ilustrasi, bukan time series; gantikan dengan data cohort terverifikasi.
            </div>
          </div>
        </div>

        <div
          style={{
            width: "1px",
            backgroundColor: "rgba(140, 140, 140, 0.4)",
            alignSelf: "stretch",
          }}
        />

        <div
          style={{
            flex: 1.35,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "3vh",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "2vw",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                borderTop: "3px solid #C45B28",
                paddingTop: "2vh",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "6.5vw",
                  lineHeight: 0.9,
                  color: "#2C2C2C",
                }}
              >
                5.000
                <span style={{ fontSize: "3vw", color: "#C45B28" }}>+</span>
              </div>
              <div
                style={{
                  fontSize: "0.95vw",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#8C8C8C",
                  marginTop: "1.5vh",
                  lineHeight: 1.5,
                }}
              >
                <div>Pengguna aktif*</div>
                <div>snapshot 2 tahun terakhir</div>
              </div>
            </div>

            <div
              style={{
                borderTop: "3px solid #2C2C2C",
                paddingTop: "2vh",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "5.3vw",
                  lineHeight: 0.9,
                  color: "#2C2C2C",
                }}
              >
                50<span style={{ fontSize: "3vw", color: "#C45B28" }}>+</span>
              </div>
              <div
                style={{
                  fontSize: "0.95vw",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#8C8C8C",
                  marginTop: "1.5vh",
                  lineHeight: 1.5,
                }}
              >
                <div>Proyek sukses*</div>
                <div>snapshot per bulan</div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(140,140,140,0.4)",
              borderBottom: "1px solid rgba(140,140,140,0.4)",
              padding: "2vh 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "1.5vh",
              }}
            >
              <div
                style={{
                  fontSize: "0.8vw",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "#8C8C8C",
                }}
              >
                Dampak yang terukur
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.5vw",
                  color: "#C45B28",
                }}
              >
                +300%
              </div>
            </div>
            <div
              style={{
                fontSize: "1.1vw",
                color: "#2C2C2C",
                lineHeight: 1.4,
              }}
            >
              Klaim peningkatan win rate tender dari strategi dan dokumentasi
              yang lebih siap.*
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.8vw",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#8C8C8C",
                marginBottom: "1.2vh",
              }}
            >
              Contoh use case dalam materi produk — bukan customer reference terverifikasi
            </div>
            <div
              style={{
                display: "flex",
                gap: "2vw",
                fontSize: "1.05vw",
                color: "#2C2C2C",
              }}
            >
              <span style={{ color: "#C45B28" }}>—</span>
              <span>PT Maju Konstruksi</span>
              <span style={{ color: "#C45B28" }}>—</span>
              <span>PT EBT Nusantara</span>
              <span style={{ color: "#C45B28" }}>—</span>
              <span>Konsultan tender</span>
            </div>
            <div
              style={{
                fontSize: "0.8vw",
                color: "#8C8C8C",
                fontStyle: "italic",
                marginTop: "1.2vh",
              }}
            >
              * Angka ilustratif dari materi internal; baseline, periode, dan sumber perlu dilengkapi.
            </div>
          </div>
        </div>
      </div>

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
          07
        </div>
      </div>
    </div>
  );
}