// ============================================================
// KonstruksiAI - Bill of Materials Library
// Comprehensive electrical BOM for Indonesian projects
// ============================================================

export function getBillOfMaterialsResponse(): string {
  return `---

# BILL OF MATERIALS (BOM)
## Daftar Material Instalasi Listrik

---

## 1. INFORMASI PROYEK

| Parameter | Detail |
|-----------|--------|
| **Nama Proyek** | [Nama Proyek] |
| **Lokasi** | [Alamat] |
| **Pemilik** | [Nama Pemilik] |
| **Kontraktor** | [Nama Kontraktor] |
| **Tanggal** | [DD/MM/YYYY] |
| **Nomor Dokumen** | [BOM/YYYY/XXXX] |

---

## 2. RINGKASAN REKAPITULASI

| No | Kategori | Jumlah Item | Estimasi Biaya |
|----|----------|-------------|----------------|
| 1 | Kabel dan Conduit | 45 | Rp xxx.xxx.xxx |
| 2 | Panel Listrik | 12 | Rp xxx.xxx.xxx |
| 3 | Proteksi dan MCB/RCCB | 85 | Rp xxx.xxx.xxx |
| 4 | Penerangan (Lampu) | 120 | Rp xxx.xxx.xxx |
| 5 | Stop Kontak dan Fitting | 75 | Rp xxx.xxx.xxx |
| 6 | Aksesoris Instalasi | 200 | Rp xxx.xxx.xxx |
| 7 | Sistem Grounding | 25 | Rp xxx.xxx.xxx |
| 8 | Material Lainnya | 50 | Rp xxx.xxx.xxx |
| | **TOTAL** | **612** | **Rp xxx.xxx.xxx** |

---

## 3. KABEL DAN CONDUCTOR

### 3.1 Kabel Daya (Power Cable)

| No | Jenis Kabel | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|-------------|-------------|--------|-----|--------------|-------|
| 1 | NYY | 2 x 1.5 mm² | m | 500 | Rp 8.500 | Rp 4.250.000 |
| 2 | NYY | 2 x 2.5 mm² | m | 800 | Rp 12.000 | Rp 9.600.000 |
| 3 | NYY | 2 x 4 mm² | m | 400 | Rp 18.500 | Rp 7.400.000 |
| 4 | NYY | 2 x 6 mm² | m | 200 | Rp 26.000 | Rp 5.200.000 |
| 5 | NYM | 3 x 1.5 mm² | m | 1.000 | Rp 15.000 | Rp 15.000.000 |
| 6 | NYM | 3 x 2.5 mm² | m | 2.000 | Rp 22.000 | Rp 44.000.000 |
| 7 | NYM | 3 x 4 mm² | m | 800 | Rp 32.000 | Rp 25.600.000 |
| 8 | NYM | 3 x 6 mm² | m | 400 | Rp 45.000 | Rp 18.000.000 |
| 9 | NYM | 3 x 10 mm² | m | 200 | Rp 68.000 | Rp 13.600.000 |
| 10 | NYY | 4 x 10 mm² | m | 150 | Rp 85.000 | Rp 12.750.000 |
| 11 | NYY | 4 x 16 mm² | m | 100 | Rp 125.000 | Rp 12.500.000 |
| 12 | NYY | 4 x 25 mm² | m | 80 | Rp 185.000 | Rp 14.800.000 |
| 13 | NYY | 4 x 35 mm² | m | 50 | Rp 245.000 | Rp 12.250.000 |
| 14 | NYF-LTBH | 2 x 1.5 mm² | m | 300 | Rp 18.000 | Rp 5.400.000 |
| 15 | NYF-LTBH | 2 x 2.5 mm² | m | 500 | Rp 25.000 | Rp 12.500.000 |

**Subtotal Kabel Daya: Rp 212.850.000**

### 3.2 Kabel Grounding

| No | Jenis Kabel | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|-------------|-------------|--------|-----|--------------|-------|
| 1 | NYCY | 1 x 10 mm² | m | 100 | Rp 35.000 | Rp 3.500.000 |
| 2 | NYCY | 1 x 16 mm² | m | 80 | Rp 52.000 | Rp 4.160.000 |
| 3 | NYCY | 1 x 25 mm² | m | 50 | Rp 78.000 | Rp 3.900.000 |
| 4 | BC (Bare Copper) | 10 mm² | m | 100 | Rp 45.000 | Rp 4.500.000 |
| 5 | BC (Bare Copper) | 16 mm² | m | 80 | Rp 68.000 | Rp 5.440.000 |

**Subtotal Kabel Grounding: Rp 21.500.000**

### 3.3 Conduit dan Accessories

| No | Material | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | PVC Conduit | Ø 20mm | m | 1.500 | Rp 12.000 | Rp 18.000.000 |
| 2 | PVC Conduit | Ø 25mm | m | 800 | Rp 16.000 | Rp 12.800.000 |
| 3 | PVC Conduit | Ø 32mm | m | 400 | Rp 22.000 | Rp 8.800.000 |
| 4 | PVC Conduit | Ø 40mm | m | 200 | Rp 28.000 | Rp 5.600.000 |
| 5 | PVC Conduit | Ø 50mm | m | 150 | Rp 38.000 | Rp 5.700.000 |
| 6 | Flexible Conduit | Ø 20mm | m | 200 | Rp 15.000 | Rp 3.000.000 |
| 7 | Flexible Conduit | Ø 25mm | m | 150 | Rp 20.000 | Rp 3.000.000 |
| 8 | Junction Box | Ø 20mm | pcs | 150 | Rp 8.500 | Rp 1.275.000 |
| 9 | Junction Box | Ø 25mm | pcs | 100 | Rp 12.000 | Rp 1.200.000 |
| 10 | Junction Box | Ø 32mm | pcs | 50 | Rp 18.000 | Rp 900.000 |
| 11 | Socket Box | 4" x 4" | pcs | 100 | Rp 15.000 | Rp 1.500.000 |
| 12 | Pull Box | 30x30x15cm | pcs | 20 | Rp 85.000 | Rp 1.700.000 |
| 13 | Pull Box | 40x40x20cm | pcs | 15 | Rp 125.000 | Rp 1.875.000 |
| 14 | Catenary Wire | Ø 3mm | m | 500 | Rp 5.000 | Rp 2.500.000 |
| 15 | Cable Ties | 300mm | pack | 50 | Rp 25.000 | Rp 1.250.000 |

**Subtotal Conduit: Rp 69.100.000**

---

## 4. PANEL LISTRIK

### 4.1 Main Distribution Panel (MDP)

| No | Komponen | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Panel Enclosure | 2000x800x500mm, IP54 | unit | 1 | Rp 15.000.000 | Rp 15.000.000 |
| 2 | Copper Busbar | 2500A, 50x10mm | set | 1 | Rp 8.500.000 | Rp 8.500.000 |
| 3 | Main Circuit Breaker | 2500A, 36kA, 400V | pcs | 1 | Rp 25.000.000 | Rp 25.000.000 |
| 4 | Busbar Supports | 2500A | set | 1 | Rp 2.500.000 | Rp 2.500.000 |
| 5 |Incoming Cable Lugs | 4x300mm² | set | 1 | Rp 1.500.000 | Rp 1.500.000 |
| 6 | Panel Accessories | Label, DIN rail, etc | set | 1 | Rp 1.000.000 | Rp 1.000.000 |

**Subtotal MDP: Rp 53.500.000**

### 4.2 Lighting Distribution Panel (LDP)

| No | Komponen | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Panel Enclosure | 1000x600x250mm, IP54 | unit | 5 | Rp 3.500.000 | Rp 17.500.000 |
| 2 | Copper Busbar | 630A, 30x5mm | set | 5 | Rp 1.800.000 | Rp 9.000.000 |
| 3 | Circuit Breaker | 100A 3P 25kA | pcs | 5 | Rp 1.200.000 | Rp 6.000.000 |
| 4 | MCB 1P | 20A | pcs | 50 | Rp 85.000 | Rp 4.250.000 |
| 5 | MCB 1P | 16A | pcs | 50 | Rp 75.000 | Rp 3.750.000 |
| 6 | MCB 1P | 10A | pcs | 80 | Rp 65.000 | Rp 5.200.000 |
| 7 | RCCB 2P | 40A 30mA Type A | pcs | 10 | Rp 450.000 | Rp 4.500.000 |
| 8 | RCCB 4P | 63A 30mA Type A | pcs | 5 | Rp 680.000 | Rp 3.400.000 |
| 9 | DIN Rail | 3m | pcs | 15 | Rp 120.000 | Rp 1.800.000 |
| 10 | Terminal Block | 35mm² | pcs | 100 | Rp 45.000 | Rp 4.500.000 |

**Subtotal LDP: Rp 59.900.000**

### 4.3 Sub Distribution Panel (SDP)

| No | Komponen | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Panel Enclosure | 600x400x200mm, IP54 | unit | 8 | Rp 1.800.000 | Rp 14.400.000 |
| 2 | Busbar | 250A, 20x5mm | set | 8 | Rp 650.000 | Rp 5.200.000 |
| 3 | MCB 3P | 63A 15kA | pcs | 8 | Rp 550.000 | Rp 4.400.000 |
| 4 | MCB 1P | 20A | pcs | 40 | Rp 85.000 | Rp 3.400.000 |
| 5 | MCB 1P | 16A | pcs | 40 | Rp 75.000 | Rp 3.000.000 |
| 6 | RCCB 2P | 40A 30mA | pcs | 8 | Rp 450.000 | Rp 3.600.000 |
| 7 | Terminal Block | 16mm² | pcs | 80 | Rp 25.000 | Rp 2.000.000 |

**Subtotal SDP: Rp 36.000.000**

---

## 5. PROTEKSI DAN PEMBATAS

### 5.1 Mini Circuit Breaker (MCB)

| No | Tipe | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|------|-------------|--------|-----|--------------|-------|
| 1 | MCB 1P | 6A 10kA | pcs | 30 | Rp 55.000 | Rp 1.650.000 |
| 2 | MCB 1P | 10A 10kA | pcs | 60 | Rp 60.000 | Rp 3.600.000 |
| 3 | MCB 1P | 13A 10kA | pcs | 40 | Rp 65.000 | Rp 2.600.000 |
| 4 | MCB 1P | 16A 10kA | pcs | 80 | Rp 70.000 | Rp 5.600.000 |
| 5 | MCB 1P | 20A 10kA | pcs | 60 | Rp 80.000 | Rp 4.800.000 |
| 6 | MCB 1P | 25A 10kA | pcs | 30 | Rp 85.000 | Rp 2.550.000 |
| 7 | MCB 1P | 32A 10kA | pcs | 20 | Rp 95.000 | Rp 1.900.000 |
| 8 | MCB 2P | 20A 10kA | pcs | 20 | Rp 150.000 | Rp 3.000.000 |
| 9 | MCB 2P | 32A 10kA | pcs | 15 | Rp 180.000 | Rp 2.700.000 |
| 10 | MCB 3P | 63A 25kA | pcs | 10 | Rp 550.000 | Rp 5.500.000 |
| 11 | MCB 3P | 100A 25kA | pcs | 5 | Rp 750.000 | Rp 3.750.000 |

**Subtotal MCB: Rp 37.650.000**

### 5.2 Residual Current Device (RCCB/GFI)

| No | Tipe | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|------|-------------|--------|-----|--------------|-------|
| 1 | RCCB 2P | 25A 30mA Type A | pcs | 20 | Rp 350.000 | Rp 7.000.000 |
| 2 | RCCB 2P | 40A 30mA Type A | pcs | 25 | Rp 400.000 | Rp 10.000.000 |
| 3 | RCCB 2P | 63A 30mA Type A | pcs | 10 | Rp 550.000 | Rp 5.500.000 |
| 4 | RCCB 4P | 40A 30mA Type A | pcs | 8 | Rp 600.000 | Rp 4.800.000 |
| 5 | RCCB 4P | 63A 30mA Type A | pcs | 5 | Rp 750.000 | Rp 3.750.000 |
| 6 | RCCB 4P | 100A 30mA Type A | pcs | 3 | Rp 950.000 | Rp 2.850.000 |
| 7 | RCBO | 20A 30mA 1P+N Type A | pcs | 30 | Rp 280.000 | Rp 8.400.000 |
| 8 | RCBO | 32A 30mA 1P+N Type A | pcs | 20 | Rp 320.000 | Rp 6.400.000 |

**Subtotal RCCB: Rp 48.700.000**

### 5.3 Surge Protection Device (SPD)

| No | Tipe | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|------|-------------|--------|-----|--------------|-------|
| 1 | SPD Type 1+2 | 275V 40kA | pcs | 3 | Rp 1.800.000 | Rp 5.400.000 |
| 2 | SPD Type 2 | 275V 40kA | pcs | 10 | Rp 850.000 | Rp 8.500.000 |
| 3 | SPD Type 3 | 275V 20kA | pcs | 15 | Rp 450.000 | Rp 6.750.000 |

**Subtotal SPD: Rp 20.650.000**

---

## 6. PENERANGAN (LIGHTING)

### 6.1 Lampu LED

| No | Jenis Lampu | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|-------------|-------------|--------|-----|--------------|-------|
| 1 | LED Downlight | 12W, 1200lm, 6500K | pcs | 80 | Rp 125.000 | Rp 10.000.000 |
| 2 | LED Downlight | 18W, 1800lm, 6500K | pcs | 40 | Rp 175.000 | Rp 7.000.000 |
| 3 | LED Panel Light | 2x2ft 40W | pcs | 60 | Rp 350.000 | Rp 21.000.000 |
| 4 | LED High Bay | 150W | pcs | 10 | Rp 1.200.000 | Rp 12.000.000 |
| 5 | LED High Bay | 100W | pcs | 15 | Rp 850.000 | Rp 12.750.000 |
| 6 | LED Floodlight | 50W | pcs | 20 | Rp 450.000 | Rp 9.000.000 |
| 7 | LED Strip | 5050 14W/m | m | 100 | Rp 85.000 | Rp 8.500.000 |
| 8 | LED Tube | 18W T8 120cm | pcs | 50 | Rp 65.000 | Rp 3.250.000 |
| 9 | LED Bulb | 12W E27 | pcs | 40 | Rp 45.000 | Rp 1.800.000 |
| 10 | LED Ceiling Light | 24W | pcs | 30 | Rp 180.000 | Rp 5.400.000 |

**Subtotal Lampu LED: Rp 90.700.000**

### 6.2 Armature dan Fitting

| No | Material | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Downlight Housing | 12-18W | pcs | 120 | Rp 25.000 | Rp 3.000.000 |
| 2 | Panel Frame | 2x2ft | pcs | 60 | Rp 45.000 | Rp 2.700.000 |
| 3 | High Bay Bracket | - | pcs | 25 | Rp 85.000 | Rp 2.125.000 |
| 4 | Floodlight Bracket | - | pcs | 20 | Rp 55.000 | Rp 1.100.000 |
| 5 | Pendant Kit | 1m | pcs | 40 | Rp 35.000 | Rp 1.400.000 |
| 6 | Socket E27 | Porcelain | pcs | 50 | Rp 15.000 | Rp 750.000 |
| 7 | TL Holder | T8 | pcs | 60 | Rp 12.000 | Rp 720.000 |

**Subtotal Armature: Rp 11.795.000**

### 6.3 Lighting Control

| No | Komponen | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Lighting Switch | 1 Gang | pcs | 80 | Rp 25.000 | Rp 2.000.000 |
| 2 | Lighting Switch | 2 Gang | pcs | 50 | Rp 35.000 | Rp 1.750.000 |
| 3 | Lighting Switch | 3 Gang | pcs | 30 | Rp 45.000 | Rp 1.350.000 |
| 4 | Dimmer Switch | 500W | pcs | 20 | Rp 150.000 | Rp 3.000.000 |
| 5 | Motion Sensor | 180° 1200W | pcs | 15 | Rp 250.000 | Rp 3.750.000 |
| 6 | Photocell | 1000W | pcs | 10 | Rp 180.000 | Rp 1.800.000 |
| 7 | Time Switch | 24H 16A | pcs | 5 | Rp 350.000 | Rp 1.750.000 |

**Subtotal Lighting Control: Rp 15.400.000**

---

## 7. STOP KONTAK DAN AKSESORIS

### 7.1 Stop Kontak

| No | Tipe | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|------|-------------|--------|-----|--------------|-------|
| 1 | Stop Kontak Flush | 16A 250V | pcs | 100 | Rp 45.000 | Rp 4.500.000 |
| 2 | Stop Kontak Flush | 10A 250V | pcs | 80 | Rp 38.000 | Rp 3.040.000 |
| 3 | Stop Kontak Waterproof | 16A IP44 | pcs | 30 | Rp 85.000 | Rp 2.550.000 |
| 4 | Stop Kontak Floor | 16A | pcs | 20 | Rp 150.000 | Rp 3.000.000 |
| 5 | Stop Kontak Kaki | 16A 3P+N+E | pcs | 15 | Rp 250.000 | Rp 3.750.000 |
| 6 | Stop Kontak AC | 16A 1P+E | pcs | 25 | Rp 65.000 | Rp 1.625.000 |
| 7 | Stop Kontak Shaver | 115/230V | pcs | 10 | Rp 180.000 | Rp 1.800.000 |

**Subtotal Stop Kontak: Rp 20.265.000**

### 7.2 Aksesoris Instalasi

| No | Material | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Saklar Box | 4x4" | pcs | 150 | Rp 8.000 | Rp 1.200.000 |
| 2 | Saklar Box | 3x4" | pcs | 100 | Rp 7.000 | Rp 700.000 |
| 3 | Klem Kabel | Ø 20mm | pack | 30 | Rp 35.000 | Rp 1.050.000 |
| 4 | Klem Kabel | Ø 25mm | pack | 20 | Rp 45.000 | Rp 900.000 |
| 5 | Klem Kabel | Ø 32mm | pack | 15 | Rp 55.000 | Rp 825.000 |
| 6 | Conex Kabel | 1.5-2.5mm² | pack | 20 | Rp 25.000 | Rp 500.000 |
| 7 | Conex Kabel | 4-6mm² | pack | 15 | Rp 35.000 | Rp 525.000 |
| 8 | Skun Kabel | 1.5mm² | pack | 10 | Rp 45.000 | Rp 450.000 |
| 9 | Skun Kabel | 2.5mm² | pack | 10 | Rp 50.000 | Rp 500.000 |
| 10 | Skun Kabel | 4mm² | pack | 10 | Rp 55.000 | Rp 550.000 |
| 11 | Pita Isolasi | Hitam 20m | roll | 50 | Rp 15.000 | Rp 750.000 |
| 12 | Pita Isolasi | PVC 20m | roll | 30 | Rp 12.000 | Rp 360.000 |

**Subtotal Aksesoris: Rp 7.560.000**

---

## 8. SISTEM GROUNDING

| No | Material | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Ground Rod | Ø 16mm x 2.5m Copper | pcs | 10 | Rp 450.000 | Rp 4.500.000 |
| 2 | Ground Rod Clamp | Bronze | pcs | 10 | Rp 85.000 | Rp 850.000 |
| 3 | Ground Bar | 30x5mm Copper 1m | pcs | 5 | Rp 350.000 | Rp 1.750.000 |
| 4 | Grounding Cable | 25mm² BC | m | 100 | Rp 78.000 | Rp 7.800.000 |
| 5 | Grounding Cable | 16mm² BC | m | 80 | Rp 52.000 | Rp 4.160.000 |
| 6 | Grounding Cable | 10mm² NYCY | m | 50 | Rp 35.000 | Rp 1.750.000 |
| 7 | Earth Pit | Pre-packed | pcs | 5 | Rp 650.000 | Rp 3.250.000 |
| 8 | Earth Enhancement | Bentonit | kg | 50 | Rp 45.000 | Rp 2.250.000 |
| 9 | Exothermic Welding | Kit | set | 2 | Rp 1.500.000 | Rp 3.000.000 |
| 10 | Grounding Label | - | pcs | 100 | Rp 2.500 | Rp 250.000 |

**Subtotal Grounding: Rp 29.560.000**

---

## 9. MATERIAL LAINNYA

| No | Material | Spesifikasi | Satuan | Qty | Harga Satuan | Total |
|----|----------|-------------|--------|-----|--------------|-------|
| 1 | Warning Sign | "Danger High Voltage" | pcs | 20 | Rp 35.000 | Rp 700.000 |
| 2 | Warning Sign | "Electric Shock Hazard" | pcs | 20 | Rp 35.000 | Rp 700.000 |
| 3 | Label Panel | Vinyl | sheet | 10 | Rp 50.000 | Rp 500.000 |
| 4 | Cable Marker | Number 1-50 | set | 5 | Rp 85.000 | Rp 425.000 |
| 5 | Fire Sealant | 300ml | tube | 20 | Rp 65.000 | Rp 1.300.000 |
| 6 | Silicone Sealant | 300ml | tube | 15 | Rp 45.000 | Rp 675.000 |
| 7 | Anchor Bolt | M12 | pcs | 100 | Rp 15.000 | Rp 1.500.000 |
| 8 | Nut & Bolt Set | M12 | pack | 10 | Rp 85.000 | Rp 850.000 |
| 9 | Safety Tape | Yellow/Black 50m | roll | 20 | Rp 35.000 | Rp 700.000 |
| 10 | First Aid Kit | Electrical | set | 3 | Rp 450.000 | Rp 1.350.000 |

**Subtotal Lainnya: Rp 8.700.000**

---

## 10. REKAPITULASI TOTAL

| No | Kategori | Subtotal |
|----|----------|----------|
| 1 | Kabel dan Conductor | Rp 303.450.000 |
| 2 | Conduit dan Aksesoris | Rp 69.100.000 |
| 3 | Panel Listrik | Rp 149.400.000 |
| 4 | Proteksi (MCB/RCCB/SPD) | Rp 107.000.000 |
| 5 | Penerangan | Rp 117.895.000 |
| 6 | Stop Kontak dan Aksesoris | Rp 27.825.000 |
| 7 | Sistem Grounding | Rp 29.560.000 |
| 8 | Material Lainnya | Rp 8.700.000 |
| | **TOTAL MATERIAL** | **Rp 812.930.000** |
| | PPN (11%) | Rp 89.422.300 |
| | **GRAND TOTAL** | **Rp 902.352.300** |

---

## 11. CATATAN

1. Harga belum termasuk biaya pengiriman dan asuransi
2. Harga dapat berubah sesuai fluktuasi kurs dan kondisi pasar
3. Quantities adalah estimasi, perlu dicek ulang berdasarkan gambar teknis
4. Spesifikasi dapat disesuaikan dengan kebutuhan proyek
5. Lead time: 2-4 minggu untuk material standar

---

## 12. STANDAR RUJUKAN

- PUIL 2011
- SNI IEC 60364
- SPLN S3.001-1:2019
- IEC 61439

---

## CHANGE LOG

- **v1.0** (2026-03-09): Rilis awal Bill of Materials dengan 8 kategori lengkap


`
};
