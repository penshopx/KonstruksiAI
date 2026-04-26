// Equipment Manuals Document Library
// Comprehensive electrical equipment manuals for Indonesian standards (PUIL 2011, SNI IEC, ISO 9001)
// Expert Level Electrical Engineer - 30 years experience

export interface EquipmentManual {
  id: string;
  name: string;
  category: string;
  voltage: string;
  sections: ManualSection[];
}

export interface ManualSection {
  title: string;
  content: string;
}

// Main function to get equipment manual response
export function getEquipmentManualResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Equipment type detection
  if (lowerQuery.includes('transformator') || lowerQuery.includes('trafo')) {
    return getTransformatorManual();
  } else if (lowerQuery.includes('generator') || lowerQuery.includes('genset')) {
    return getGeneratorManual();
  } else if (lowerQuery.includes('panel') || lowerQuery.includes('mdp') || lowerQuery.includes('ldp') || lowerQuery.includes('sdp')) {
    return getPanelManual();
  } else if (lowerQuery.includes('motor') || lowerQuery.includes('mcc')) {
    return getMotorManual();
  } else if (lowerQuery.includes('ups')) {
    return getUPSManual();
  } else if (lowerQuery.includes('ats') || lowerQuery.includes('automatic transfer')) {
    return getATSManual();
  } else if (lowerQuery.includes('manual') || lowerQuery.includes('equipment') || lowerQuery.includes('petunjuk')) {
    return getEquipmentManualOverview();
  }
  
  return getEquipmentManualOverview();
}

// Comprehensive Equipment Manual Overview
function getEquipmentManualOverview(): string {
  return `# 📘 MANUAL PERALATAN LISTRIK
## Electrical Equipment Manuals - KonstruksiAI

---

## DAFTAR ISI
1. [Transformator](#1-transformator)
2. [Generator/Genset](#2-generatorgenset)
3. [Panel Listrik](#3-panel-listrik)
4. [Motor Listrik](#4-motor-listrik)
5. [UPS (Uninterruptible Power Supply)](#5-ups-uninterruptible-power-supply)
6. [ATS (Automatic Transfer Switch)](#6-ats-automatic-transfer-switch)

---

## 1. TRANSFORMATOR

### 1.1 Spesifikasi Teknis
| Parameter | Spesifikasi |
|-----------|-------------|
| Tipe | Dry Type / Oil Filled |
| Kapasitas | 100kVA - 2500kVA |
| Tegangan Primer | 20kV |
| Tegangan Sekunder | 380V / 220V |
| Frekuensi | 50Hz |
| Impedansi | 5-8% |
| Standar | SNI IEC 60076, PUIL 2011 |

### 1.2 Instalasi
1. **Lokasi**: Ruang transformator dengan ventilasi memadai
2. **Pendinginan**: Oil natural (ONAN) atau Air natural (AN)
3. **Grounding**: Body transformator harus di-ground
4. **Proteksi**: Overcurrent, Differential, Buchholz Relay

### 1.3 Pengoperasian
- Cek suhu minyak/bushing operasi normal 65-85°C
- Cek level minyak indikator
- Cek suara getar abnormal
- Cek kebocoran minyak

### 1.4 Pemeliharaan Preventif
| Aktivitas | Frekuensi |
|-----------|-----------|
| Inspeksi visual | Mingguan |
| Cek suhu | Harian |
| Sampling minyak | 6 bulanan |
| Megger winding | Tahunan |
| Cleaning bushing | 6 bulanan |

### 1.5 Troubleshooting
| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Suhu tinggi | Overload | Kurangi beban |
| Suara dengung | Loose core | Kencangkan clamp |
| Kebocoran minyak | Seal rusak | Ganti seal |
| Trip berulang | Short circuit | Cek proteksi |

---

## 2. GENERATOR/GENSET

### 2.1 Spesifikasi Teknis
| Parameter | Spesifikasi |
|-----------|-------------|
| Kapasitas | 50kVA - 2000kVA |
| Tegangan | 380V / 220V |
| Frekuensi | 50Hz |
| Putaran | 1500 RPM |
| Fuel | Solar / HSD |
| Standar | ISO 8528, PUIL 2011 |

### 2.2 Komponen Utama
1. **Engine**: Diesel engine 4-tak
2. **Alternator**: Synchronous generator
3. **Control Panel**: Auto start/stop, sync
4. **Fuel System**: Tank, filter, pump
5. **Cooling System**: Radiator, fan
6. **Exhaust System**: Muffler, silencer

### 2.3 Pengoperasian
- Pre-heat engine sebelum start
- Cek level bahan bakar
- Cek level oli mesin
- Cek suhu coolant
- Monitor parameter operasi

### 2.4 Pemeliharaan Preventif
| Aktivitas | Frekuensi |
|-----------|-----------|
| Cek level oli | Setiap start |
| Cek bahan bakar | Harian |
| Ganti oli mesin | 250 jam |
| Ganti filter | 500 jam |
| Service major | 2000 jam |

### 2.5 Troubleshooting
| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Sulit start | Aki lemah | Charge/replace |
| Tidak ada output | AVR rusak | Replace AVR |
| Overheating | Pendingin tersumbat | Cleaning radiator |
| Oil pressure low | Oli kurang | Tambah oli |

---

## 3. PANEL LISTRIK

### 3.1 Spesifikasi Teknis
| Parameter | MDP | LDP | SDP |
|-----------|-----|-----|-----|
| Rated Current | 2500A | 630A | 250A |
| Rated Voltage | 415V | 415V | 415V |
| Icu | 50kA | 25kA | 15kA |
| Frequency | 50Hz | 50Hz | 50Hz |
| Standar | SNI IEC 61439 | SNI IEC 61439 | SNI IEC 61439 |

### 3.2 Komponen Panel
1. **Main Breaker**: MCCB Incoming
2. **Busbar**: Copper/Aluminium
3. **Circuit Breaker**: MCB output
4. **Contactor**: Magnetic motor starter
5. **Overload Relay**: Motor protection
6. **Indicator**: Lamp, meter
7. **Control Circuit**: Fuse, relay

### 3.3 Pengoperasian
- Pastikan door panel tertutup
- Operasikan dengan APD
- Jangan overload panel
- Catat setiap operasional

### 3.4 Pemeliharaan Preventif
| Aktivitas | Frekuensi |
|-----------|-----------|
| Inspection visual | Mingguan |
| Torque check | 6 bulanan |
| Thermal scanning | Tahunan |
| Contact cleaning | Tahunan |

### 3.5 Troubleshooting
| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| MCCB trip | Overload/short | Cek beban |
| Kontak panas | Loose connection | Kencangkan |
| Indikator mati | Lampu rusak | Ganti lampu |
| Relay tidak work | Coil rusak | Replace relay |

---

## 4. MOTOR LISTRIK

### 4.1 Spesifikasi Teknis
| Parameter | Spesifikasi |
|-----------|-------------|
| Daya | 0.5HP - 500HP |
| Tegangan | 380V / 220V |
| Frekuensi | 50Hz |
| Putaran | 750-3000 RPM |
| Efisiensi | IE3 Premium |
| IP Rating | IP55 |
| Standar | IEC 60034, PUIL 2011 |

### 4.2 Komponen Utama
1. **Stator**: Wound with copper wire
2. **Rotor**: Squirrel cage / Slip ring
3. **Bearing**: Front & rear
4. **Housing**: Cast iron / Aluminum
5. **Terminal Box**: IP55
6. **Cooling Fan**: Shaft mounted

### 4.3 Pengoperasian
- Cek rotate direction
- Monitor current draw
- Cek suhu bearing
- Cek vibrasi normal

### 4.4 Pemeliharaan Preventif
| Aktivitas | Frekuensi |
|-----------|-----------|
| Megger test | 6 bulanan |
| Vibrasi analysis | 3 bulanan |
| Bearing replacement | 20.000 jam |
| Insulation test | Tahunan |

### 4.5 Troubleshooting
| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Motor tidak start | Supply problem | Cek fuse/contactor |
| Suara abnormal | Bearing rusak | Replace bearing |
| Overheating | Overload | Kurangi beban |
| Vibrasi tinggi | Alignment | Re-align |

---

## 5. UPS (UNINTERRUPTIBLE POWER SUPPLY)

### 5.1 Spesifikasi Teknis
| Parameter | Spesifikasi |
|-----------|-------------|
| Kapasitas | 1kVA - 500kVA |
| Topology | Online Double Conversion |
| Input Voltage | 380V / 220V |
| Output Voltage | 380V / 220V |
| Backup Time | 15-60 menit |
| Standar | IEC 62040, PUIL 2011 |

### 5.2 Komponen Utama
1. **Rectifier**: AC to DC conversion
2. **Battery Bank**: VRLA / Li-ion
3. **Inverter**: DC to AC conversion
4. **Static Switch**: Bypass automatic
5. **Control Panel**: LCD display
6. **Filter**: EMI/RFI filtering

### 5.3 Pengoperasian
- Monitor battery voltage
- Cek load percentage
- Cek temperature ambient
- Review alarm history

### 5.4 Pemeliharaan Preventif
| Aktivitas | Frekuensi |
|-----------|-----------|
| Battery test | Bulanan |
| Load test | 6 bulanan |
| Calibration | Tahunan |
| Fan replacement | 3 tahun |

### 5.5 Troubleshooting
| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| On battery mode | Input power fail | Cek supply |
| Battery weak | Ageing | Replace battery |
| Alarm overload | Load exceed | Kurangi beban |
| Fan noise | Bearing wear | Replace fan |

---

## 6. ATS (AUTOMATIC TRANSFER SWITCH)

### 6.1 Spesifikasi Teknis
| Parameter | Spesifikasi |
|-----------|-------------|
| Rating | 100A - 4000A |
| Voltage | 415V |
| Transfer Type | Open / Closed |
| Operating Time | < 100ms |
| Standby | 24/7 |
| Standar | IEC 60947-6-1, PUIL 2011 |

### 6.2 Komponen Utama
1. **Contactor**: Dual position
2. **Control Module**: Microprocessor
3. **Sensor**: Voltage sensing
4. **Timer**: Delay setting
5. **Indicator**: LED display
6. **Enclosure**: IP65

### 6.3 Pengoperasian
- Monitor source status
- Verify transfer test
- Check time delay settings
- Monitor transfer count

### 6.4 Pemeliharaan Preventif
| Aktivitas | Frekuensi |
|-----------|-----------|
| Visual inspection | Mingguan |
| Transfer test | Bulanan |
| Contact cleaning | 6 bulanan |
| Control test | Tahunan |

### 6.5 Troubleshooting
| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| No transfer | Sensor fail | Cek sensor |
| Delayed transfer | Timer setting | Adjust timer |
| Manual only | Control module | Replace module |
| Contact worn | Usage | Replace contactor |

---

## STANDAR REFERENSI

1. **PUIL 2011** - Persyaratan Umum Instalasi Listrik Indonesia
2. **SNI IEC 60076** - Power Transformers
3. **SNI IEC 60364** - Electrical Installations of Buildings
4. **SNI IEC 61439** - Low-voltage switchgear and controlgear assemblies
5. **IEC 60034** - Rotating electrical machines
6. **IEC 62040** - Uninterruptible power supplies
7. **ISO 8528** - Reciprocating internal combustion engine driven generating sets
8. **ISO 45001:2018** - Occupational health and safety

---

## SAFETY WARNING ⚠️

> **PERINGATAN**: Semua pekerjaan pemeliharaan harus dilakukan oleh teknisi tersertifikasi dengan menggunakan APD (Alat Pelindung Diri) yang sesuai. Pastikan sumber listrik telah dimatikan dan dikunci (LOTO - Lock Out Tag Out) sebelum melakukan pekerjaan apapun pada peralatan listrik.

### APD Wajib:
- Safety helmet
- Safety glasses
- Insulated gloves (Kelas 2)
- Safety shoes
- Ear protection
- Fire resistant clothing

---

## CONTACT & SUPPORT

Untuk informasi lebih lanjut:
- Email: support@konstruksiai.com
- Phone: +62-XXX-XXXX-XXXX
- Website: www.konstruksiai.com

---

*Document Version: 1.0*
*Last Updated: 2026*
*Author: Expert Level Electrical Engineer - 30 Years Experience*
*Standards: PUIL 2011, SNI IEC, ISO 9001*
`;
}

// Transformator Manual
function getTransformatorManual(): string {
  return `# 📘 MANUAL TRANSFORMATOR
## Transformator Installation, Operation & Maintenance Manual

---

## 1. INTRODUCTION

### 1.1 Purpose
Manual ini menyediakan panduan lengkap untuk pengoperasian dan pemeliharaan transformator daya sesuai standar PUIL 2011 dan SNI IEC 60076.

### 1.2 Scope
- Transformator Daya: 100kVA - 2500kVA
- Tegangan: 20kV (primer) / 380V (sekunder)
- Tipe: Oil Filled / Dry Type

---

## 2. SPECIFICATIONS

### 2.1 Technical Data
| Parameter | Value |
|-----------|-------|
| Rated Power | 1000 kVA |
| Primary Voltage | 20.000 V |
| Secondary Voltage | 400 V |
| Frequency | 50 Hz |
| Vector Group | Dyn11 |
| Impedance Voltage | 6% |
| No Load Current | 1% |
| Oil Volume | 450 L |
| Total Weight | 1200 kg |

---

## 3. SAFETY INSTRUCTIONS

### 3.1 Danger Levels
⚠️ **HIGH VOLTAGE**:危险 - Danger of death!

### 3.2 Safety Procedures
1. LOTO (Lock Out Tag Out) wajib sebelum maintenance
2. Gunakan APD lengkap
3. Groundkan sebelum menyentuh
4. Minimal 2 orang saat bekerja

---

## 4. INSTALLATION

### 4.1 Site Requirements
- Ruang dengan ventilasi baik
- Suhu ambient maks 40°C
- Kelembaban < 80%
- Bebas dari gas korosif
- Floor loading capacity > 1500 kg/m²

### 4.2 Foundation
- Concrete pedestal
- Vibration dampers
- Fire protection

### 4.3 Connections
1. Primary cable termination
2. Secondary busbar connection
3. Grounding connection
4. Oil level indicator

---

## 5. OPERATION

### 5.1 Start-Up Procedure
1. ✓ Visual inspection
2. ✓ Oil level check
3. ✓ Temperature check
4. ✓ Bushing inspection
5. ✓ Grounding verification
6. ✓ Apply load gradually

### 5.2 Normal Operation Parameters
| Parameter | Normal | Alarm | Trip |
|-----------|--------|-------|------|
| Oil Temp | 65°C | 80°C | 95°C |
| Winding Temp | 75°C | 90°C | 110°C |
| Load | <80% | 80-100% | >100% |

---

## 6. MAINTENANCE

### 6.1 Schedule
| Activity | Weekly | Monthly | 6-Month | Yearly |
|----------|--------|---------|---------|--------|
| Visual Check | ✓ | | | |
| Oil Level | ✓ | | | |
| Temperature | ✓ | | | |
| Sound Check | | ✓ | | |
| DGA Sample | | | ✓ | |
| Megger Test | | | | ✓ |

### 6.2 Oil Testing
- DGA (Dissolved Gas Analysis)
- Dielectric Strength
- Water Content
- Acidity

---

## 7. TROUBLESHOOTING

### 7.1 Common Problems
| Symptom | Cause | Solution |
|---------|-------|----------|
| Overheating | Overload | Reduce load |
| Noise | Core looseness | Tighten bolts |
| Oil leak | Seal failure | Replace seal |
| Gas accumulation | Internal fault | DGA analysis |
| High current | Short circuit | Check protection |

### 7.2 Emergency Procedures
1. Alert personnel
2. Isolate transformer
3. Activate fire protection
4. Notify engineering

---

*Reference: PUIL 2011, SNI IEC 60076-1, IEC 60076-2*
`;
}

// Generator Manual
function getGeneratorManual(): string {
  return `# 📘 MANUAL GENERATOR / GENSET
## Generator Set Installation, Operation & Maintenance Manual

---

## 1. INTRODUCTION

### 1.1 Purpose
Panduan lengkap pengoperasian dan pemeliharaan generator set (genset) sesuai standar ISO 8528 dan PUIL 2011.

### 1.2 Specifications
| Parameter | Value |
|-----------|-------|
| Rated Power | 500 kVA |
| Prime Power | 450 kVA |
| Voltage | 400/230 V |
| Frequency | 50 Hz |
| Speed | 1500 RPM |
| Engine | Diesel 4-stroke |
| Fuel | HSD/Solar |

---

## 2. COMPONENTS

### 2.1 Engine System
- Cylinder block & head
- Piston & connecting rod
- Crankshaft
- Camshaft & valve train
- Fuel injection system
- Lubrication system
- Cooling system

### 2.2 Alternator System
- Stator winding
- Rotor & exciter
- AVR (Automatic Voltage Regulator)
- Bearings
- Cooling fan

### 2.3 Control System
- Auto Start/Stop panel
- Voltage regulator
- Frequency controller
- Synchronizing equipment (if parallel)

---

## 3. OPERATION

### 3.1 Pre-Start Checklist
□ Fuel level adequate
□ Oil level between marks
□ Coolant level OK
□ Battery voltage > 12.6V
□ Air filter clean
□ No leaks visible

### 3.2 Starting Procedure
1. Start pre-lube pump (if equipped)
2. Engage starter (max 10 sec)
3. Allow engine to warm up (3-5 min)
4. Check all gauges normal
5. Apply load gradually

### 3.3 Normal Parameters
| Gauge | Normal | Alarm |
|-------|--------|-------|
| Oil Pressure | 3-5 bar | < 2 bar |
| Coolant Temp | 80-90°C | > 95°C |
| Oil Temp | 90-100°C | > 110°C |
| RPM | 1500 | ± 50 |
| Voltage | 400V ± 5% | |

---

## 4. MAINTENANCE SCHEDULE

### 4.1 Daily
- Check fuel level
- Check oil level
- Check coolant level
- Visual inspection

### 4.2 Every 250 Hours
- Oil change
- Oil filter replacement
- Fuel filter replacement
- Air filter cleaning

### 4.3 Every 500 Hours
- All 250-hour tasks
- Valve clearance adjustment
- Injector inspection
- Coolant replacement

### 4.4 Every 2000 Hours
- Major overhaul
- Compression test
- Alternator inspection
- Control system calibration

---

## 5. TROUBLESHOOTING

### 5.1 Starting Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| No start | Weak battery | Recharge/replace |
| No start | No fuel | Refill fuel |
| No start | Air in fuel | Bleed fuel system |
| Hard start | Bad injectors | Service injectors |

### 5.2 Running Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| Low voltage | AVR fault | Adjust/replace |
| High voltage | AVR fault | Adjust/replace |
| Overheating | Low coolant | Refill coolant |
| Low oil pressure | Low oil | Add oil |

---

## 6. EMERGENCY PROCEDURES

### 6.1 Fire
1. Stop engine
2. Cut fuel supply
3. Activate fire extinguisher
4. Evacuate if needed

### 6.2 Electrical Fault
1. Disconnect load
2. Stop generator
3. Notify electrical engineer
4. Do not attempt repair

---

*Reference: ISO 8528, PUIL 2011, Manufacturer Manual*
`;
}

// Panel Listrik Manual
function getPanelManual(): string {
  return `# 📘 MANUAL PANEL LISTRIK
## Electrical Panel Installation, Operation & Maintenance Manual

---

## 1. INTRODUCTION

### 1.1 Purpose
Panduan lengkap pengoperasian dan pemeliharaan panel listrik (MDP, LDP, SDP) sesuai standar SNI IEC 61439 dan PUIL 2011.

### 1.2 Panel Types
- **MDP** (Main Distribution Panel): 2500A
- **LDP** (Lighting Distribution Panel): 630A
- **SDP** (Sub Distribution Panel): 250A

---

## 2. SPECIFICATIONS

### 2.1 Technical Data
| Parameter | MDP | LDP | SDP |
|-----------|-----|-----|-----|
| Rated Current | 2500A | 630A | 250A |
| Rated Voltage | 415V | 415V | 415V |
| Rated Frequency | 50Hz | 50Hz | 50Hz |
| Icu (Breaking) | 50kA | 25kA | 15kA |
| Ics (Service) | 35kA | 18kA | 10kA |
| IP Rating | IP42 | IP42 | IP42 |
| Busbar | Copper | Copper | Copper |

---

## 3. COMPONENTS

### 3.1 Incoming Section
- MCCB (Molded Case Circuit Breaker)
- Ammeter & Voltmeter
- Selector switch
- Indicator lights

### 3.2 Busbar System
- Main busbar
- Distribution busbar
- Neutral busbar
- Earth busbar

### 3.3 Outgoing Section
- MCB (Mini Circuit Breaker)
- MCCB
- Contactor
- Overload relay
- Timer

---

## 4. OPERATION

### 4.1 Operating Procedures
1. Ensure all doors closed
2. Verify supply voltage normal
3. Close incoming breaker
4. Monitor load distribution
5. Check indicator lights

### 4.2 Normal Readings
| Parameter | Normal | Abnormal |
|-----------|--------|----------|
| Voltage L-L | 380-415V | <360V />440V |
| Voltage L-N | 220-240V | <200V />250V |
| Current | <80% rated | >80% rated |
| Temperature | Ambient+20°C | >Ambient+40°C |

---

## 5. MAINTENANCE

### 5.1 Preventive Maintenance
| Activity | Weekly | Monthly | 6-Month | Yearly |
|----------|--------|---------|---------|--------|
| Visual inspection | ✓ | | | |
| Thermal scan | | ✓ | | |
| Torque check | | | ✓ | |
| Contact cleaning | | | ✓ | |
| Megger test | | | | ✓ |

### 5.2 Maintenance Procedures
1. **Lockout before work**
2. Clean dust and debris
3. Check wire connections
4. Test protective devices
5. Verify grounding

---

## 6. TROUBLESHOOTING

### 6.1 MCCB Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| Trip frequently | Overload | Reduce load |
| Trip on start | Short circuit | Find fault |
| Cannot close | Mechanical | Replace |
| Heating | Loose contact | Tighten |

### 6.2 General Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| Voltmeter zero | VT fuse | Replace fuse |
| Ammeter zero | CT open | Replace CT |
| Indicator off | Lamp died | Replace lamp |
| Panel heating | Overload | Reduce load |

---

## 7. SAFETY

⚠️ **WARNING**: 
- Only qualified personnel
- Always LOTO before work
- Wear appropriate PPE
- Keep panel doors closed

---

*Reference: SNI IEC 61439-1, PUIL 2011, NFPA 70E*
`;
}

// Motor Listrik Manual
function getMotorManual(): string {
  return `# 📘 MANUAL MOTOR LISTRIK
## Electric Motor Operation & Maintenance Manual

---

## 1. INTRODUCTION

### 1.1 Purpose
Panduan pengoperasian dan pemeliharaan motor listrik sesuai standar IEC 60034 dan PUIL 2011.

### 1.2 Specifications
| Parameter | Value |
|-----------|-------|
| Power | 0.5 - 500 HP |
| Voltage | 380V / 220V |
| Frequency | 50 Hz |
| Speed | 750 - 3000 RPM |
| Efficiency | IE3 Premium |
| IP Rating | IP55 |
| Duty1 ( | SContinuous) |

---

## 2. CONSTRUCTION

### 2.1 Main Components
1. **Stator**: Laminated iron core with copper windings
2. **Rotor**: Squirrel cage aluminum bars
3. **Housing**: Cast iron or aluminum
4. **Bearings**: Front and rear (deep groove ball)
5. **Shaft**: Precision ground steel
6. **Terminal Box**: IP55 rated

### 2.2 Cooling
- IC411: Fan cooled (Surface mounted)
- IC416: Forced ventilation (Separate fan)

---

## 3. OPERATION

### 3.1 Pre-Start Checklist
□ Check supply voltage
□ Verify motor connection (Y/Δ)
□ Check bearing condition
□ Test rotation manually
□ Check grounding

### 3.2 Starting
1. Start under no load
2. Verify rotation direction
3. Check starting current
4. Monitor temperature rise
5. Apply load gradually

### 3.3 Operating Parameters
| Parameter | Normal | Alarm | Trip |
|-----------|--------|-------|------|
| Current | <100% FLA | 100-110% | >110% |
| Temperature | <80°C | 80-90°C | >90°C |
| Vibrasi | <4.5 mm/s | 4.5-7 mm/s | >7 mm/s |
| Noise | <70 dB | 70-85 dB | >85 dB |

---

## 4. MAINTENANCE

### 4.1 Schedule
| Activity | Frequency |
|----------|-----------|
| Visual inspection | Daily |
| Bearing temperature | Daily |
| Vibration check | Monthly |
| Megger test | 6 Monthly |
| Resistance measurement | 6 Monthly |
| Bearing replacement | 20,000 hours |

### 4.2 Testing
1. **Insulation Resistance**: > 100 MΩ
2. **Winding Resistance**: Balanced within 2%
3. **Dielectric Test**: 2 x rated voltage + 1000V
4. **Vibration**: < 4.5 mm/s

---

## 5. TROUBLESHOOTING

### 5.1 Starting Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| Won't start | No supply | Check fuse/contactor |
| Won't start | Jammed | Check load |
| Slow start | Low voltage | Check supply |
| Wrong rotation | Wrong phase | Swap 2 phases |

### 5.2 Running Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| Overheating | Overload | Reduce load |
| Overheating | Poor ventilation | Clean vents |
| Vibration | Unbalance | Balance rotor |
| Vibration | Bearing wear | Replace bearing |
| Noise | Bearing damage | Replace bearing |

---

## 6. PROTECTION

### 6.1 Required Protection
- Overload relay
- Short circuit (MCCB/Fuse)
- Phase failure relay
- Thermal overload

### 6.2 Settings
| Protection | Setting |
|------------|---------|
| Overload | 100-105% FLA |
| Short circuit | 10-12x FLA |
| Phase loss | Instant |

---

*Reference: IEC 60034, NEMA MG1, PUIL 2011*
`;
}

// UPS Manual
function getUPSManual(): string {
  return `# 📘 MANUAL UPS
## Uninterruptible Power Supply Operation & Maintenance Manual

---

## 1. INTRODUCTION

### 1.1 Purpose
Panduan lengkap pengoperasian dan pemeliharaan UPS sesuai standar IEC 62040 dan PUIL 2011.

### 1.2 Specifications
| Parameter | Value |
|-----------|-------|
| Capacity | 10 - 500 kVA |
| Topology | Online Double Conversion |
| Input Voltage | 380V / 220V |
| Output Voltage | 380V / 220V |
| Frequency | 50 Hz |
| THDV | < 3% |
| Efficiency | > 95% |

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Main Components
1. **Rectifier**: Converts AC to DC
2. **Battery Charger**: Maintains battery
3. **Battery Bank**: VRLA / Li-ion
4. **Inverter**: Converts DC to AC
5. **Static Switch**: Transfer to bypass
6. **Bypass**: Manual transfer path

### 2.2 Operating Modes
- **Normal**: Input → Rectifier → Inverter → Load
- **Battery**: Battery → Inverter → Load
- **Bypass**: Input → Bypass → Load
- **Maintenance**: Maintenance bypass

---

## 3. OPERATION

### 3.1 Start-Up
1. Verify input voltage normal
2. Close input breaker
3. Close battery breaker
4. Start UPS via control panel
5. Transfer to normal mode
6. Close output breaker

### 3.2 Monitoring
| Parameter | Normal | Alarm |
|-----------|--------|-------|
| Input Voltage | 380-415V | <340V />460V |
| Output Voltage | 380-415V | <360V />440V |
| Battery Voltage | 540V (48 batt) | <480V |
| Load | < 80% | > 80% |
| Temperature | < 30°C | > 35°C |

---

## 4. BATTERY MAINTENANCE

### 4.1 Battery Parameters
| Parameter | VRLA | Li-ion |
|-----------|------|--------|
| Voltage/cell | 2.25V | 3.2V |
| Float voltage | 2.25-2.30V | 3.4V |
| Life span | 5 years | 10 years |
| Discharge cycles | 500 | 3000 |

### 4.2 Testing
- Monthly: Capacity test
- Quarterly: Discharge test
- Annually: Full load test

---

## 5. MAINTENANCE

### 5.1 Schedule
| Activity | Daily | Monthly | Quarterly | Yearly |
|----------|-------|---------|-----------|--------|
| Status check | ✓ | | | |
| Alarm review | ✓ | | | |
| Battery test | | ✓ | | |
| Load test | | | ✓ | |
| Calibration | | | | ✓ |
| Fan replace | | | | 3 years |

### 5.2 Preventive Maintenance
1. Clean filters and vents
2. Check battery terminals
3. Verify grounding
4. Test transfer function
5. Update firmware

---

## 6. TROUBLESHOOTING

### 6.1 Common Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| On battery | Input fail | Check supply |
| Battery alarm | Low battery | Replace battery |
| Overload | Load too high | Reduce load |
| Fan alarm | Fan failed | Replace fan |
| Inverter fault | Internal error | Service call |

---

## 7. SAFETY

⚠️ **WARNING**: 
- High voltage inside
- Battery hazard
- Only qualified personnel
- Follow LOTO procedures

---

*Reference: IEC 62040-1, IEC 62040-3, PUIL 2011*
`;
}

// ATS Manual
function getATSManual(): string {
  return `# 📘 MANUAL ATS
## Automatic Transfer Switch Operation & Maintenance Manual

---

## 1. INTRODUCTION

### 1.1 Purpose
Panduan pengoperasian dan pemeliharaan Automatic Transfer Switch (ATS) sesuai standar IEC 60947-6-1 dan PUIL 2011.

### 1.2 Specifications
| Parameter | Value |
|-----------|-------|
| Rating | 100 - 4000 A |
| Voltage | 415 V |
| Frequency | 50 Hz |
| Transfer Time | < 100 ms |
| Withstand Icu | 35 kA |
| Mechanical Life | 10,000 ops |

---

## 2. SYSTEM DESCRIPTION

### 2.1 Components
1. **Transfer Mechanism**: Motorized contactor
2. **Control Module**: Microprocessor based
3. **Voltage Sensor**: Monitor both sources
4. **Time Delay**: Configurable delays
5. **Indicators**: LED display
6. **Enclosure**: IP65

### 2.2 Operating Principle
 \`\`\`
 Normal: Source 1 → Load
     ↓ (Source 1 fails)
 Transfer: Source 2 → Load
     ↓ (Source 1 restores)
 Retransfer: Source 1 → Load (after delay)
 \`\`\`

---

## 3. OPERATION

### 3.1 Controls
- **AUTO**: Automatic transfer
- **MANUAL**: Local control
- **TEST**: Test mode
- **OFF**: Disconnect

### 3.2 Settings
| Parameter | Default | Range |
|-----------|---------|-------|
| Undervoltage | 85% | 80-90% |
| Overvoltage | 110% | 105-115% |
| Transfer delay | 1 sec | 0-30 sec |
| Retransfer delay | 5 min | 0-30 min |

### 3.3 Indicators
| LED | Meaning |
|-----|---------|
| Green - Source 1 | Normal |
| Green - Source 2 | Available |
| Red - Transfer | In transfer |
| Amber - Alarm | Fault |

---

## 4. TRANSFER PROCEDURE

### 4.1 Automatic Transfer
1. Source 1 fails (voltage < 85%)
2. Time delay starts (default 1 sec)
3. Transfer to Source 2
4. Load powered by Source 2
5. Source 1 restores
6. Retransfer delay (default 5 min)
7. Transfer back to Source 1

### 4.2 Manual Transfer
1. Select MANUAL mode
2. Open Source 1 breaker
3. Close Source 2 breaker

---

## 5. MAINTENANCE

### 5.1 Schedule
| Activity | Weekly | Monthly | 6-Month | Yearly |
|----------|--------|---------|---------|--------|
| Visual inspection | ✓ | | | |
| Indicator check | ✓ | | | |
| Transfer test | | ✓ | | |
| Contact cleaning | | | ✓ | |
| Control test | | | | ✓ |

### 5.2 Testing
1. **Manual Transfer Test**: Operate test switch
2. **Automatic Test**: Simulate source failure
3. **Time Delay Test**: Verify timing
4. **Load Test**: Full load transfer

---

## 6. TROUBLESHOOTING

### 6.1 Problems
| Problem | Cause | Solution |
|---------|-------|----------|
| No transfer | Sensor fail | Check sensor |
| Delayed transfer | Timer wrong | Adjust timer |
| Motor won't run | Motor损坏 | Replace motor |
| Contact wear | Usage | Replace contacts |
| Control fail | Module坏 | Replace module |

---

## 7. SAFETY

⚠️ **WARNING**:
- High current
- Arc flash hazard
- Lockout required
- Qualified personnel only

---

*Reference: IEC 60947-6-1, UL 1008, PUIL 2011*
`;
}

export function getEquipmentManualCategories(): string[] {
  return [
    "Transformator",
    "Generator/Genset", 
    "Panel Listrik (MDP/LDP/SDP)",
    "Motor Listrik",
    "UPS",
    "ATS"
  ];
}
