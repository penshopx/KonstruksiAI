/**
 * Test Plans Response Generator
 * Provides formatted responses for the chat API
 */

import { 
  TEST_PLANS, 
  COMPLETE_TEST_PLAN,
  TRANSFORMER_TESTS,
  SWITCHGEAR_TESTS,
  DISTRIBUTION_TESTS,
  RENEWABLE_TESTS,
  PERIODIC_MAINTENANCE_TESTS,
  getTestProceduresByCategory,
  getTestProceduresByVoltage,
  getChecklistById,
  getReportTemplateById
} from './test-plans';

export function getTestPlansResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Main test plans document
  if (msg.includes("test plan") || msg.includes("rencana uji") || 
      msg.includes("dokumen uji") || msg.includes("pengujian") ||
      msg.includes("uji coba") || msg.includes("commissioning") ||
      msg.includes("verifikasi") || msg.includes("test procedures")) {
    
    return `👋 **DOKUMEN RENCANA UJI (TEST PLANS) - SISTEM KELISTRIKAN**

Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut adalah Dokumen Rencana Uji Komprehensif untuk sistem kelistrikan:

---

## 📋 INFORMASI DOKUMEN

| Aspek | Detail |
|-------|--------|
| **ID Dokumen** | TP-COMPLETE-001 |
| **Judul** | Dokumen Rencana Uji Sistem Kelistrikan Komprehensif |
| **Standar** | PUIL 2011, IEC 60364, IEC 61850, IEC 61439, ISO 9001 |
| **Tegangan** | LV (230V/400V), MV (6-20kV), HV (>20kV) |
| **Tipe Sistem** | Residensial, Komersial, Industrial, EBT |

---

## 🔧 PROSEDUR PENGUJIAN

### 1. TRANSFORMATOR
${TRANSFORMER_TESTS.map(t => `- **${t.id}**: ${t.name} (${t.voltageLevel})`).join('\n')}

### 2. SWITCHGEAR & PROTEKSI
${SWITCHGEAR_TESTS.map(t => `- **${t.id}**: ${t.name} (${t.voltageLevel})`).join('\n')}

### 3. DISTRIBUSI & OUTLET
${DISTRIBUTION_TESTS.map(t => `- **${t.id}**: ${t.name} (${t.voltageLevel})`).join('\n')}

### 4. ENERGI TERBARUKAN (PLTS/PLTB)
${RENEWABLE_TESTS.map(t => `- **${t.id}**: ${t.name}`).join('\n')}

### 5. PEMELIHARAAN PERIODIK
${PERIODIC_MAINTENANCE_TESTS.map(t => `- **${t.id}**: ${t.name}`).join('\n')}

---

## ✅ CHECKLIST

${COMPLETE_TEST_PLAN.checklists.map(c => `### ${c.name}
${c.items.map(i => `- [ ] ${i.description}`).join('\n')}`).join('\n\n')}

---

## 📊 CONTOH PARAMETER PENGUJIAN

| No | Parameter | Metode | Kriteria Penerimaan | Referensi |
|----|-----------|--------|-------------------|-----------|
| 1 | Insulation Resistance | Megger Test 5000V DC | > 1000 MΩ | IEC 60076-1 |
| 2 | Transformer Ratio | TTR Test | ± 0.5% nameplate | IEC 60076-1 |
| 3 | Earth Resistance | Fall of Potential | < 5 Ω | PUIL 2011 |
| 4 | Hi-Pot Test | AC Withstand | No breakdown 1 min | IEC 62271-1 |
| 5 | Protection Relay | Secondary Injection | ± 5% setting | IEC 60255 |

---

## 📝 LAPORAN TEMPLATE

### Test Summary Report Sections:
${COMPLETE_TEST_PLAN.reports[0]?.sections.map(s => `- **${s.title}**: ${s.fields.map(f => f.label).join(', ')}`).join('\n') || 'N/A'}

---

## 🎯 REKOMENDASI

Berdasarkan kebutuhan Anda (kombinasi semua sistem, sistem penuh, semua tegangan), saya merekomendasikan:

1. **Commissioning Test** - Untuk semua equipment baru
2. **Periodic Maintenance** - Sesuai jadwal (tahunan/semesteran)
3. **Compliance Verification** - Untuk audit dan sertifikasi

---

📌 **Ingin saya buatkan dokumen lengkap Test Plans dalam format Word/PDF?** Atau butuh detail spesifik untuk sistem tertentu (Transformator, Switchgear, PLTS)?`;
  }
  
  // Specific test procedures
  if (msg.includes("transformator") || msg.includes("trafo") || msg.includes("transformer")) {
    return `👋 **PROSEDUR UJI TRANSFORMATOR**

Berikut prosedur pengujian transformator yang komprehensif:

${TRANSFORMER_TESTS.map(proc => `
### ${proc.id}: ${proc.name}
**Kategori:** ${proc.category} | **Tegangan:** ${proc.voltageLevel}

**Prasyarat:**
${proc.prerequisites.map(p => `- ${p}`).join('\n')}

**Parameter Pengujian:**
${proc.parameters.map(p => `
#### ${p.name}
- **Deskripsi:** ${p.description}
- **Metode:** ${p.method}
- **Kriteria:** ${p.acceptanceCriteria}
- **Referensi:** ${p.reference}
`).join('\n')}

**Peralatan yang Diperlukan:**
- Megger (5000V DC untuk HV, 1000V DC untuk LV)
- TTR (Transformer Turns Ratio) Tester
- Kelvin Bridge
- Oil Test Kit (untuk oil-filled)

**Referensi Standar:** IEC 60076-1, IEC 60076-2, PUIL 2011 Pasal 7.3
`).join('\n')}

📌 Butuh detail lebih lanjut untuk jenis transformator tertentu?`;
  }
  
  if (msg.includes("switchgear") || msg.includes("panel") || msg.includes("mcb") || msg.includes("mccb") || msg.includes("circuit breaker")) {
    return `👋 **PROSEDUR UJI SWITCHGEAR & PROTEKSI**

Berikut prosedur pengujian switchgear dan sistem proteksi:

${SWITCHGEAR_TESTS.map(proc => `
### ${proc.id}: ${proc.name}
**Kategori:** ${proc.category} | **Tegangan:** ${proc.voltageLevel}

**Prasyarat:**
${proc.prerequisites.map(p => `- ${p}`).join('\n')}

**Parameter Pengujian:**
${proc.parameters.map(p => `
#### ${p.name}
- **Deskripsi:** ${p.description}
- **Metode:** ${p.method}
- **Kriteria:** ${p.acceptanceCriteria}
- **Referensi:** ${p.reference}
`).join('\n')}

**Peralatan yang Diperlukan:**
- Hi-Pot Tester
- Circuit Breaker Analyzer
- Secondary Injection Test Set
- Protection Relay Test Set

**Referensi Standar:** IEC 61439-1, IEC 62271-1, IEC 62271-100, PUIL 2011
`).join('\n')}

📌 Butuh detail untuk jenis switchgear tertentu (LV/MV/HV)?`;
  }
  
  if (msg.includes("distribusi") || msg.includes("outlet") || msg.includes("kabel") || msg.includes("grounding") || msg.includes("earth") || msg.includes("grounding")) {
    return `👋 **PROSEDUR UJI SISTEM DISTRIBUSI**

Berikut prosedur pengujian sistem distribusi dan grounding:

${DISTRIBUTION_TESTS.map(proc => `
### ${proc.id}: ${proc.name}
**Kategori:** ${proc.category} | **Tegangan:** ${proc.voltageLevel}

**Prasyarat:**
${proc.prerequisites.map(p => `- ${p}`).join('\n')}

**Parameter Pengujian:**
${proc.parameters.map(p => `
#### ${p.name}
- **Deskripsi:** ${p.description}
- **Metode:** ${p.method}
- **Kriteria:** ${p.acceptanceCriteria}
- **Referensi:** ${p.reference}
`).join('\n')}
`).join('\n')}

**Peralatan yang Diperlukan:**
- Megger (500V DC)
- Continuity Tester
- Earth Resistance Tester
- Clamp Meter
- Polarity Tester

**Referensi Standar:** IEC 60364-6, PUIL 2011 Pasal 6.2-6.3

📌 Butuh detail untuk pengujian outlet atau kabel tertentu?`;
  }
  
  if (msg.includes("plts") || msg.includes("panel surya") || msg.includes("solar") || msg.includes("renewable") || msg.includes("ebt") || msg.includes("battery") || msg.includes("bess")) {
    return `👋 **PROSEDUR UJI SISTEM ENERGI TERBARUKAN**

Berikut prosedur pengujian PLTS dan sistem penyimpanan energi:

${RENEWABLE_TESTS.map(proc => `
### ${proc.id}: ${proc.name}
**Kategori:** ${proc.category} | **Tegangan:** ${proc.voltageLevel}

**Prasyarat:**
${proc.prerequisites.map(p => `- ${p}`).join('\n')}

**Parameter Pengujian:**
${proc.parameters.map(p => `
#### ${p.name}
- **Deskripsi:** ${p.description}
- **Metode:** ${p.method}
- **Kriteria:** ${p.acceptanceCriteria}
- **Referensi:** ${p.reference}
`).join('\n')}
`).join('\n')}

**Peralatan yang Diperlukan:**
- DC Voltmeter/Amperemeter
- Power Analyzer
- Solar Irradiance Meter
- Protocol Analyzer (untuk BMS)
- Battery Discharge Tester

**Referensi Standar:** IEC 61215, IEC 61730, IEC 61683, IEC 62116, IEC 62548

📌 Butuh detail untuk kapasitas PLTS tertentu?`;
  }
  
  if (msg.includes("checklist") || msg.includes("formulir")) {
    return `👋 **CHECKLIST PENGUJIAN SISTEM KELISTRIKAN**

${COMPLETE_TEST_PLAN.checklists.map(c => `
## ${c.name}

| No | Deskripsi | Status | Catatan |
|----|-----------|--------|---------|
${c.items.map((i, idx) => `| ${idx + 1} | ${i.description} | ⬜ | |`).join('\n')}
`).join('\n')}

📌 Butuh checklist untuk sistem atau area tertentu?`;
  }
  
  if (msg.includes("standar") || msg.includes("referensi") || msg.includes("puil") || msg.includes("iec")) {
    return `👋 **STANDAR PENGUJIAN SISTEM KELISTRIKAN**

Berikut standar yang digunakan dalam Test Plans:

## Standar Nasional Indonesia
| Kode | Nama | Deskripsi |
|------|------|-----------|
| PUIL 2011 | Persyaratan Umum Instalasi Listrik 2011 | Standar utama instalasi listrik di Indonesia |
| SPLN | Standar PLN | Standar khusus untuk instalasi PLN |

## Standar Internasional
| Kode | Nama | Deskripsi |
|------|------|-----------|
| IEC 60364 | Electrical Installations of Buildings | Instalasi bangunan |
| IEC 61850 | Communication Networks for Power Utility | Komunikasi automasi gardu |
| IEC 61439 | Low-voltage Switchgear Assemblies | Perakitan switchgear LV |
| IEC 62271 | High-voltage Switchgear | Switchgear MV/HV |
| IEC 60076 | Power Transformers | Transformator daya |
| IEC 60255 | Electrical Relays | Relay proteksi |
| IEC 61215 | Crystalline Silicon PV Modules | Modul surya |
| ISO 9001 | Quality Management Systems | Manajemen mutu |

📌 Butuh detail penerapan standar tertentu untuk proyek Anda?`;
  }
  
  // Default response - show summary
  return `📋 **RINGKASAN TEST PLANS - SISTEM KELISTRIKAN**

Dokumen Rencana Uji ini mencakup:

| Kategori | Jumlah Prosedur |
|----------|-----------------|
| Transformator | ${TRANSFORMER_TESTS.length} |
| Switchgear & Proteksi | ${SWITCHGEAR_TESTS.length} |
| Distribusi & Outlet | ${DISTRIBUTION_TESTS.length} |
| Energi Terbarukan | ${RENEWABLE_TESTS.length} |
| Pemeliharaan Periodik | ${PERIODIC_MAINTENANCE_TESTS.length} |

**Sistem yang Dicakup:**
- LV (230V/400V) ✓
- MV (6-20kV) ✓
- HV (>20kV) ✓

**Tipe Bangunan:**
- Residensial ✓
- Komersial ✓
- Industrial ✓
- Energi Terbarukan ✓

---

Silakan specify jenis pengujian yang Anda butuhkan:
- "Test Plans lengkap" - Dokumen lengkap
- "Uji Transformator" - Prosedur transformator
- "Uji Switchgear" - Prosedur switchgear
- "Uji Distribusi" - Prosedur distribusi
- "Uji PLTS" - Prosedur energi terbarukan
- "Checklist" - Formulir checklist
- "Standar" - Referensi standar`;
}

export default getTestPlansResponse;
