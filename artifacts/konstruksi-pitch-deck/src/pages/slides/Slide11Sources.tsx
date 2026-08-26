export default function Slide11Sources() {
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
        padding: "4.5vh 5vw 4vh",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(140, 140, 140, 0.4)",
          paddingBottom: "2vh",
          marginBottom: "3.5vh",
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
          12 / Appendix
        </div>
      </div>

      <div style={{ zIndex: 1, marginBottom: "2.5vh" }}>
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
          Rujukan &amp; Status Verifikasi
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3.6vw",
            lineHeight: 1,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Klaim yang dapat{" "}
          <span style={{ fontStyle: "italic", color: "#C45B28" }}>
            diperiksa
          </span>
        </h2>
        <p
          style={{
            fontSize: "1.05vw",
            lineHeight: 1.45,
            color: "#8C8C8C",
            margin: "1.5vh 0 0",
            maxWidth: "72%",
          }}
        >
          Cocokkan label [S1–S3] yang tertera langsung di slide asal. Tautan
          eksternal dapat dibuka untuk pemeriksaan langsung, sedangkan klaim
          yang belum memiliki angka sumber primer ditandai secara eksplisit.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: "3vw",
          alignContent: "start",
          flex: 1,
          zIndex: 1,
        }}
      >
        <div
          style={{
            borderTop: "2px solid #C45B28",
            paddingTop: "1.2vh",
            display: "flex",
            flexDirection: "column",
            gap: "0.6vh",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8vw", color: "#C45B28" }}>
              [S1]
            </div>
            <div style={{ fontSize: "0.75vw", textTransform: "uppercase", letterSpacing: "0.16em", color: "#8C8C8C" }}>
              Slide 06 · Market
            </div>
          </div>
          <div style={{ fontSize: "1.05vw", fontWeight: 600 }}>
            186.534 perusahaan konstruksi di Indonesia, 2024
          </div>
          <a
            href="https://www.bps.go.id/id/publication/2024/10/31/9d13cb08e28433478ca0a11e/direktori-perusahaan-konstruksi-2024--buku-i-pulau-sumatera--kalimantan--sulawesi--dan-papua.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.9vw", color: "#C45B28", textDecoration: "underline", lineHeight: 1.35 }}
          >
            BPS — Direktori Perusahaan Konstruksi 2024
          </a>
          <div style={{ fontSize: "0.82vw", color: "#8C8C8C", lineHeight: 1.3 }}>
            Status: terverifikasi. Angka di Slide 06 memakai statistik dan tahun yang sama dengan publikasi BPS.
          </div>
        </div>

        <div
          style={{
            borderTop: "2px solid #C45B28",
            paddingTop: "1.2vh",
            display: "flex",
            flexDirection: "column",
            gap: "0.6vh",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8vw", color: "#C45B28" }}>
              [S2]
            </div>
            <div style={{ fontSize: "0.75vw", textTransform: "uppercase", letterSpacing: "0.16em", color: "#8C8C8C" }}>
              Slide 06 · Market
            </div>
          </div>
          <div style={{ fontSize: "1.05vw", fontWeight: 600 }}>
            800 rb+ tenaga ahli bersertifikat
          </div>
          <div style={{ display: "flex", gap: "1.2vw", alignItems: "baseline" }}>
            <a
              href="https://lpjk.pu.go.id/laporan-lpjk/sebaran-tkk/cari"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.9vw", color: "#C45B28", textDecoration: "underline" }}
            >
              Dashboard LPJK
            </a>
            <a
              href="https://data.pu.go.id/dataset/sertifikat-kompetensi-kerja-skk-konstruksi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.9vw", color: "#C45B28", textDecoration: "underline" }}
            >
              Open Data PUPR — SKK
            </a>
          </div>
          <div style={{ fontSize: "0.82vw", color: "#8C8C8C", lineHeight: 1.3 }}>
            Sumber menyediakan dashboard dan definisi data, tetapi total 800 rb+ belum direkonsiliasi di deck · Status: perlu verifikasi.
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(140, 140, 140, 0.55)",
            paddingTop: "1.2vh",
            display: "flex",
            flexDirection: "column",
            gap: "0.6vh",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8vw", color: "#2C2C2C" }}>
              [S3]
            </div>
            <div style={{ fontSize: "0.75vw", textTransform: "uppercase", letterSpacing: "0.16em", color: "#8C8C8C" }}>
              Slide 02 · Problem
            </div>
          </div>
          <div style={{ fontSize: "1.05vw", fontWeight: 600 }}>
            Konteks tender dan perizinan konstruksi
          </div>
          <div style={{ display: "flex", gap: "1.2vw", alignItems: "baseline" }}>
            <a
              href="https://jdih.lkpp.go.id/regulation/keputusan-deputi-i/keputusan-deputi-i-nomor-3-tahun-2024"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.9vw", color: "#C45B28", textDecoration: "underline" }}
            >
              LKPP — Kep. Deputi I No. 3/2024
            </a>
            <a
              href="https://peraturan.go.id/id/permen-pupr-no-1-tahun-2020"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.9vw", color: "#C45B28", textDecoration: "underline" }}
            >
              Permen PUPR No. 1/2020
            </a>
          </div>
          <div style={{ fontSize: "0.82vw", color: "#8C8C8C", lineHeight: 1.3 }}>
            Rujukan primer untuk domain kerja yang disebut di slide; bukan klaim kuantitatif tentang besarnya masalah.
          </div>
        </div>

      </div>

      <div
        style={{
          marginTop: "2vh",
          borderTop: "1px solid rgba(140, 140, 140, 0.4)",
          paddingTop: "1.5vh",
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
            fontSize: "0.8vw",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#8C8C8C",
          }}
        >
          Sumber · Verifikasi · 2026
        </div>
      </div>
    </div>
  );
}