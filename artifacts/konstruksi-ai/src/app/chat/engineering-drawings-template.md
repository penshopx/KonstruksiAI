# Engineering Drawings - Technical Template

## Industrial Helical Gearbox Input Shaft Assembly
### Complete Drawing Package (ASME Y14.5-2018 Compliant)

---

# DOCUMENT CONTROL

| Field | Information |
|-------|-------------|
| **Document Number** | KONSTRUKSI-ME-2024-001 |
| **Project Name** | Industrial Gearbox Assembly Drawings |
| **Revision** | A |
| **Date** | 2024-01-15 |
| **Prepared By** | Mechanical Engineering Department |
| **Checked By** | Senior Design Engineer |
| **Approved By** | Engineering Manager |
| **Drawing Standard** | ASME Y14.5-2018 |
| **Units** | millimeters (mm) |

---

# TABLE OF CONTENTS

1. [Drawing Index](#1-drawing-index)
2. [General Arrangement Drawing](#2-general-arrangement-drawing)
3. [Component Part Drawings](#3-component-part-drawings)
4. [Assembly Drawing](#4-assembly-drawing)
5. [Bill of Materials (BOM)](#5-bill-of-materials-bom)
6. [Technical Specifications](#6-technical-specifications)
7. [GD&T Callouts Reference](#7-gdt-callouts-reference)
8. [Material Specifications](#8-material-specifications)
9. [Surface Finish Requirements](#9-surface-finish-requirements)
10. [Manufacturing Notes](#10-manufacturing-notes)
11. [Quality Assurance Requirements](#11-quality-assurance-requirements)
12. [Revision History](#12-revision-history)

---

# 1. DRAWING INDEX

## Drawing List

| Drawing No. | Title | Sheet Size | Rev |
|-------------|-------|------------|-----|
| KONSTRUKSI-ME-2024-001-GA | General Arrangement | A1 | A |
| KONSTRUKSI-ME-2024-001-01 | Input Shaft Detail | A3 | A |
| KONSTRUKSI-ME-2024-001-02 | Helical Gear Detail | A3 | A |
| KONSTRUKSI-ME-2024-001-03 | Bearing Housing Detail | A3 | A |
| KONSTRUKSI-ME-2024-001-04 | Shaft Key Detail | A4 | A |
| KONSTRUKSI-ME-2024-001-05 | Bearing Spacer Detail | A4 | A |
| KONSTRUKSI-ME-2024-001-ASSY | Assembly Drawing | A1 | A |
| KONSTRUKSI-ME-2024-001-BOM | Bill of Materials | A4 | A |

---

# 2. GENERAL ARRANGEMENT DRAWING

## KONSTRUKSI-ME-2024-001-GA
### Sheet 1 of 8

### Title Block (Bottom Right Corner)

```
┌─────────────────────────────────────────┐
│                                         │
│  KONSTRUKSIAI                          │
│  ENGINEERING                           │
├─────────────────────────────────────────┤
│ GENERAL ARRANGEMENT                     │
│ INPUT SHAFT ASSEMBLY                    │
│                                         │
│ DWG. NO: KONSTRUKSI-ME-2024-001-GA     │
│ REV: A    SCALE: 1:2                   │
│ SHEET: 1 OF 8    DATE: 2024-01-15      │
│                                         │
│ DRAWN: Mechanical Engineering          │
│ CHECKED: Senior Engineer                │
│ APPROVED: Engineering Manager           │
│                                         │
│ UNLESS OTHERWISE SPECIFIED:             │
│ DIMENSIONS IN MILLIMETERS               │
│ TOLERANCES: DECIMAL ±0.1               │
│              ANULAR ±0.05              │
│              ANGULAR ±1°                │
│                                         │
│ MATERIAL: SEE BOM                       │
│ FINISH: SEE SPECIFICATIONS              │
└─────────────────────────────────────────┘
```

### Drawing Views

#### Front View (Main)
- Shows gearbox housing outline
- Indicates input shaft position
- Shows bearing locations (Bearing A and Bearing B)
- Shows gear mounting position
- Shows keyway location

#### Top View
- Shows shaft centerline
- Shows overall length dimensions
- Shows mounting bolt pattern
- Shows shaft extension details

#### Side View (Right)
- Shows shaft profile
- Shows gear tooth representation
- Shows bearing arrangement
- Shows keyway position

#### Section A-A (Bearing Housing)
- Full sectional view through bearing bore
- Shows bearing seat dimensions
- Shows housing wall thickness
- Shows lubrication hole location

#### Section B-B (Gear Mesh)
- Shows gear tooth engagement
- Shows shaft-to-gear connection
- Shows key/keyway arrangement

### Overall Dimensions

| Dimension | Value (mm) |
|-----------|------------|
| Overall Length | 450.00 |
| Overall Width | 280.00 |
| Overall Height | 320.00 |
| Shaft Center Height | 180.00 |
| Mounting Foot Width | 200.00 |
| Mounting Bolt Circle | 170.00 |

### Notes on Drawing

1. All dimensions in millimeters unless otherwise specified
2. Remove all burrs and sharp edges - break all corners 0.5 x 45°
3. Unless otherwise specified, tolerance decimal dimensions to ±0.1mm
4. Surface roughness values shown on individual detail drawings
5. Refer to assembly drawing for parts list and quantity

---

# 3. COMPONENT PART DRAWINGS

## 3.1 INPUT SHAFT - KONSTRUKSI-ME-2024-001-01

### Sheet 2 of 8

### Drawing Overview

The input shaft is a critical power transmission component that transmits torque from the motor to the helical gear. The shaft is manufactured from AISI 4340 steel, quenched and tempered to achieve the required mechanical properties.

### Isometric View Description
- Shows shaft in horizontal orientation
- Shows gear mount location (right side)
- Shows bearing seats (both ends)
- Shows keyway on gear mount section
- Shows splined end connection

### Orthographic Views

#### Front View (Main)
```
     ═══════════════════════════════════════════════
     │                                                │
     │    ╔══════╗                                    │
     │    ║BEARIN║  Ø60.00 h6                         │
     │    ║G SEAT║  (LEFT BEARING SEAT)               │
     │    ╚══════╝                                    │
     │        │                                        │
     │        │  Ø55.00                                │
     │        │                                        │
     │    ╔══════╗                                    │
     │    ║      ║  Ø50.00 h6                         │
     │    ║SHOULDER║ (GEAR STOP)                      │
     │    ║      ║                                    │
     │    ╚══════╝                                    │
     │        │                                        │
     │        │  Ø45.00 (SHAFT BODY)                  │
     │        │                                        │
     │    ╔══════╗                                    │
     │    ║      ║  Ø55.00 h6                         │
     │    ║SHOULDER║ (RIGHT BEARING STOP)            │
     │    ║      ║                                    │
     │    ╚══════╝                                    │
     │        │                                        │
     │        │  Ø50.00                                │
     │        │                                        │
     │    ╔═══════════╗                               │
     │    ║  KEYWAY   ║  b=14.00 H7, t=5.50         │
     │    ║  (14x5.5)  ║  L=40.00                     │
     │    ╚═══════════╝                               │
     │        │                                        │
     │        │  Ø40.00 (SPLINED END)                 │
     │        │  8x Ø8.90-9.00 (splines)              │
     │        │                                        │
     ═══════════════════════════════════════════════
```

### Dimension Table

| Feature | Dimension | Tolerance | Notes |
|---------|-----------|-----------|-------|
| Total Length | 400.00 | ±0.20 | Overall length |
| Bearing Seat A (Left) | Ø60.00 | h6 (59.994/60.000) | Bearing 6008-2RS |
| Bearing Seat B (Right) | Ø55.00 | h6 (54.994/55.000) | Bearing 6007-2RS |
| Gear Mount Section | Ø50.00 | h6 (49.994/50.000) | Press fit gear |
| Splined End | Ø40.00 | h7 (39.975/40.000) | SAE 8T x 30° |
| Shaft Body | Ø45.00 | h8 (44.966/45.000) | Main shaft body |
| Shoulder A | Ø68.00 | +0.10/-0 | Gear stop face |
| Shoulder B | Ø62.00 | +0.10/-0 | Bearing stop face |
| Keyway A | 14.00 H7 | +0.018/0 | Width tolerance |
| Keyway Depth | 5.50 | +0.10/-0 | From shaft top |
| Keyway Length | 40.00 | ±0.20 | Effective length |
| Fillet Radius R1 | 2.00 | ±0.10 | At shoulder |
| Fillet Radius R2 | 1.50 | ±0.10 | At keyway |

### GD&T Callouts (Geometric Dimensioning and Tolerancing)

```
╔═══════════════════════════════════════════════════════════════════╗
║ GD&T SYMBOLS ON DRAWING                                           ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ⌀60.00h6 ═══════════════════════════════════════════════════    ║
║     │                                                              ║
║     │  ⌀ (B) ─┐                                                    ║
║     │         │  DATUM A: SHAFT CENTERLINE                        ║
║     │         │  RUNOUT: 0.020mm TOTAL RUNOUT                     ║
║     │         │  REFERENCE: ASME Y14.5-2018                       ║
║     │         │                                                    ║
║     └─────────────────────────────────────────────────────────    ║
║                                                                   ║
║  ⌀50.00h6 (GEAR SEAT) ──────────────────────────────────────     ║
║     │                                                              ║
║     │  ⌀ (C) ─┐                                                    ║
║     │         │  DATUM A: SHAFT CENTERLINE                        ║
║     │         │  DATUM B: RIGHT BEARING FACE                      ║
║     │         │  POSITION: 0.050mm                                 ║
║     │         │  TO: KEYWAY CENTER                                 ║
║     │         │                                                    ║
║     └─────────────────────────────────────────────────────────    ║
║                                                                   ║
║  KEYWAY b=14H7 ──────────────────────────────────────────────     ║
║     │                                                              ║
║     │  ║ (D) ──┐                                                  ║
║     │         │  DATUM A: SHAFT CENTERLINE                        ║
║     │         │  DATUM B: RIGHT BEARING FACE                      ║
║     │         │  POSITION: 0.080mm                                 ║
║     │         │                                                    ║
║     └─────────────────────────────────────────────────────────    ║
║                                                                   ║
║  SPLINED END ─────────────────────────────────────────────────     ║
║     │                                                              ║
║     │  ⌀ (E) ─┐                                                    ║
║     │         │  DATUM A: SHAFT CENTERLINE                        ║
║     │         │  PROFILE: 0.030mm                                  ║
║     │         │  OF SURFACE                                       ║
║     │         │                                                    ║
║     └─────────────────────────────────────────────────────────    ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Surface Roughness Requirements

| Surface Location | Ra (μm) | Rz (μm) | Method |
|------------------|---------|---------|--------|
| Bearing Seats | 0.8 | 3.2 | Precision grinding |
| Gear Mount Seat | 0.8 | 3.2 | Precision grinding |
| Keyway Surfaces | 1.6 | 6.3 | Broaching/Grinding |
| Spline Teeth | 1.6 | 6.3 | Hobbing + Grinding |
| Shaft Body | 1.6 | 6.3 | Turning + Polishing |
| Fillet Radii | 3.2 | 12.5 | Smooth blending |
| Non-critical Surfaces | 3.2 | 12.5 | Standard turning |

### Material Specifications

| Property | Value | Standard |
|----------|-------|----------|
| Material | AISI 4340 (SAE 4340) | ASTM A322 |
| Specification | AMS 6415 / AMS 6417 | Aerospace |
| Condition | Quenched & Tempered | - |
| Hardness | 280-320 HBW | ASTM E10 |
| Tensile Strength | 965 MPa (min) | ASTM A370 |
| Yield Strength | 795 MPa (min) | ASTM A370 |
| Elongation | 12% (min) | ASTM A370 |
| Reduction of Area | 50% (min) | ASTM A370 |

### Heat Treatment Requirements

1. **Quenching**: Oil quench from 850°C
2. **Tempering**: Temper at 570°C for 2 hours, air cool
3. **Final Hardness**: 280-320 HBW
4. **Case Hardening**: NOT REQUIRED (through-hardened)
5. **Surface Treatment**: Optional - Phosphating or Black Oxide

---

## 3.2 HELICAL GEAR - KONSTRUKSI-ME-2024-001-02

### Sheet 3 of 8

### Drawing Overview

The helical gear transmits power from the input shaft to the output shaft. This gear is designed for quiet operation and high load capacity.

### Gear Specifications

| Parameter | Value |
|-----------|-------|
| Number of Teeth (z) | 42 |
| Module (m) | 3.0 mm |
| Pressure Angle (α) | 20° |
| Helix Angle (β) | 15° (right hand) |
| Pitch Diameter (d) | 129.87 mm |
| Tip Diameter (da) | 137.37 mm |
| Root Diameter (df) | 120.87 mm |
| Face Width (b) | 50.00 mm |
| Bore Diameter (d1) | Ø50.00 H7 |
| Hub Diameter | 75.00 mm |
| Hub Length | 40.00 mm |

### Key Dimensions

| Feature | Dimension | Tolerance |
|---------|-----------|-----------|
| Bore Diameter | Ø50.00 | H7 (+0.030/0) |
| Hub Bore | Ø25.00 | H7 (+0.021/0) |
| Face Width | 50.00 | ±0.10 |
| Overall Length | 50.00 | ±0.10 |
| Keyway Width | 14.00 | H7 (+0.018/0) |
| Keyway Depth | 5.50 | +0.10/-0 |

### GD&T Requirements

```
⌀50.00H7 BORE ─────────────────────────────────────────────────
     │
     │  ⌀ (B) ─┐
     │         │  DATUM A: GEAR FACE (RIGHT)
     │         │  DATUM B: CENTERLINE
     │         │  PERPENDICULARITY: 0.020mm
     │         │  TO: DATUM A
     │         │
     └────────────────────────────────────────────────────────

⌀50.00H7 ────────────────────────────────────────────────────
     │
     │  (C) ───┐
     │         │  DATUM A: GEAR FACE (RIGHT)
     │         │  DATUM B: CENTERLINE
     │         │  POSITION: 0.050mm
     │         │  TO: THEORETICAL POSITION
     │         │
     └────────────────────────────────────────────────────────

TOOTH PROFILE ────────────────────────────────────────────────
     │
     │  ⌖     │  PROFILE OF TOOTH SURFACE: 0.025mm
     │        │  LEAD: 0.025mm
     │        │  TOOTH-TO-TOOTH: 0.020mm
     │        │  TOTAL COMPOSITE: 0.045mm
     │        │
     └────────────────────────────────────────────────────────
```

### Surface Roughness

| Surface | Ra (μm) | Method |
|---------|---------|--------|
| Gear Teeth | 0.8 | Gear shaving/grinding |
| Bore | 1.6 | Honing |
| Bore Face | 3.2 | Turning |
| Hub OD | 1.6 | Turning |
| Ends | 3.2 | Facing |

### Material: AISI 4140 Steel (Per ASTM A322)

- **Condition**: Quenched and Tempered
- **Hardness**: 285-321 HBW
- **Surface Treatment**: None (gear teeth to be finished by shaving)

---

## 3.3 BEARING HOUSING - KONSTRUKSI-ME-2024-001-03

### Sheet 4 of 8

### Drawing Overview

The bearing housing supports the bearing and provides a means of mounting the shaft assembly to the gearbox casing. Made from cast iron (ASTM A48 Class 35) for excellent vibration damping.

### Dimension Table

| Feature | Dimension | Tolerance |
|---------|-----------|-----------|
| Housing Bore | Ø80.00 | H7 (+0.030/0) |
| Housing OD | Ø120.00 | ±0.50 |
| Flange OD | Ø150.00 | ±0.50 |
| Flange Thickness | 15.00 | ±0.20 |
| Overall Height | 95.00 | ±0.50 |
| Mounting Bolt Circle | Ø100.00 | ±0.20 |
| Mounting Bolt Holes | 4 x Ø13.00 | +0.20/-0 |
| Lubrication Fitting | M10x1.0 | Standard |
| Housing Wall Thickness | 15.00 | Minimum |

### GD&T Requirements

```
⌀80.00H7 ────────────────────────────────────────────────────
     │
     │  ⌀ (A) ─┐
     │         │  DATUM A: HOUSING MOUNTING FACE
     │         │  PERPENDICULARITY: 0.030mm
     │         │  TO: DATUM A
     │         │
     └────────────────────────────────────────────────────────

MOUNTING FACE ───────────────────────────────────────────────
     │
     │  ⌐ (B) ─┐
     │         │  DATUM A: HOUSING MOUNTING FACE
     │         │  FLATNESS: 0.050mm
     │         │
     └────────────────────────────────────────────────────────

BOLT HOLES ──────────────────────────────────────────────────
     │
     │  ⌀ (C) ─┐
     │         │  POSITION: 0.20mm
     │         │  TO: DATUM A,B (REFS)
     │         │  (4x Ø13.00 HOLES)
     │         │
     └────────────────────────────────────────────────────────
```

### Material: Cast Iron ASTM A48 Class 35

| Property | Value |
|----------|-------|
| Compressive Strength | 205 MPa (min) |
| Tensile Strength | 170 MPa (min) |
| Hardness | 180-220 HB |
| Density | 7.15 g/cm³ |

---

## 3.4 SHAFT KEY - KONSTRUKSI-ME-2024-001-04

### Sheet 5 of 8

### Key Dimensions (Per ISO 2491)

| Parameter | Symbol | Value |
|-----------|--------|-------|
| Key Width | b | 14.00 mm |
| Key Height | h | 9.00 mm |
| Key Length | L | 40.00 mm |
| Key Type | - | Parallel Key |
| Key Fit | - | Normal (P9/s9) |

### Tolerances (ISO 2492)

| Dimension | Tolerance |
|-----------|-----------|
| Width b | 14.000-14.043 mm (P9) |
| Height h | 9.00-8.70 mm |
| Length L | 40.00-39.00 mm |

### Material: AISI 1045 Steel (Per ASTM A108)

- **Hardness**: 170-210 HB
- **Surface**: Ground finish on all working surfaces
- **Surface Roughness**: Ra ≤ 1.6 μm on contact surfaces

---

## 3.5 BEARING SPACER - KONSTRUKSI-ME-2024-001-05

### Sheet 6 of 8

### Spacer Dimensions

| Feature | Dimension | Tolerance |
|---------|-----------|-----------|
| OD | Ø62.00 | -0.10/-0.30 |
| ID | Ø50.00 | +0.10/+0.30 |
| Length | 5.00 | ±0.10 |

### Material: Cold Rolled Steel (CRS)

- **Specification**: ASTM A109
- **Surface**: Phosphate coated
- **Hardness**: 85-110 HRB

---

# 4. ASSEMBLY DRAWING

## KONSTRUKSI-ME-2024-001-ASSY
### Sheet 7 of 8

### Assembly Drawing Views

#### Main Assembly View (Section)
```
                    ╔═══════════════════════════╗
                    ║    GEARBOX HOUSING        ║
                    ║    (Shown in section)     ║
                    ╚═══════╤═══════════════════╝
                            │
              ╔═════════════╧═════════════════════╗
              ║     BEARING HOUSING (LEFT)      ║
              ║        6008-2RS BEARING         ║
              ║           (LUBRICATED)          ║
              ╚═════════════╤═══════════════════╝
                            │
      ╔══════════════════════╧═══════════════════════╗
      ║                                               ║
      ║        ╔═══════════════════════════╗          ║
      ║        ║      INPUT SHAFT          ║          ║
      ║        ║   (AISI 4340 Steel)       ║          ║
      ║        ╚═══════════════════════════╝          ║
      ║              │           │                     ║
      ║     ╔════════╩═══════════╩════════╗          ║
      ║     ║      HELICAL GEAR           ║          ║
      ║     ║     (AISI 4140 Steel)       ║          ║
      ║     ╚════════╤═══════════╤════════╝          ║
      ║              │           │                     ║
      ║              │   ╔═════╗  │                     ║
      ║              │   ║ KEY ║  │                     ║
      ║              │   ╚═════╝  │                     ║
      ║              │           │                     ║
      ╚══════════════╤═══════════╤════════════════════╝
                     │           │
           ╔═════════╧═══════════╧═════════╗
           ║    BEARING SPACER             ║
           ╚═════════╤═══════════╤═════════╝
                     │           │
           ╔═════════╧═══════════╧═════════╗
           ║      6007-2RS BEARING         ║
           ║   (RIGHT SIDE - LUBRICATED)    ║
           ╚═════════╤═══════════╤═════════╝
                     │           │
           ╔═════════╧═══════════╧═════════╗
           ║   BEARING HOUSING (RIGHT)      ║
           ╚═══════════════════════════════╝
```

### Assembly Sequence

| Step | Operation | Part Number | Qty | Torque/Force |
|------|-----------|-------------|-----|--------------|
| 1 | Install bearing spacers on shaft | KON-ME-001-05 | 1 | - |
| 2 | Press fit left bearing onto shaft | KON-ME-001-01 | 1 | 15 kN max |
| 3 | Press fit helical gear onto shaft | KON-ME-001-02 | 1 | 25 kN max |
| 4 | Install parallel key | KON-ME-001-04 | 1 | - |
| 5 | Press fit right bearing onto shaft | KON-ME-001-01 | 1 | 15 kN max |
| 6 | Install shaft assembly into housing | KON-ME-001-03 | 2 | - |
| 7 | Install bearing housings | KON-ME-001-03 | 2 | - |
| 8 | Install mounting bolts | M12 x 40 | 8 | 85 Nm |

### Critical Assembly Notes

1. **Bearing Installation**: Use hydraulic press or induction heater. DO NOT use hammer/burner method
2. **Lubrication**: Apply lithium EP2 grease to bearing rolling elements and races before assembly
3. **Key Fit**: Key should slide into keyway with light tapping - DO NOT FORCE
4. **Gear Position**: Gear face should contact shoulder with 0.00mm clearance (press fit)
5. **Torque Values**: All torque values are dry unless otherwise specified

---

# 5. BILL OF MATERIALS (BOM)

## KONSTRUKSI-ME-2024-001-BOM
### Sheet 8 of 8

| Item | Part Number | Description | Material | Qty | Unit | Mass (kg) |
|------|-------------|-------------|----------|-----|------|-----------|
| 1 | KON-ME-001-01 | Input Shaft | AISI 4340 | 1 | pc | 5.20 |
| 2 | KON-ME-001-02 | Helical Gear (42T x 3M) | AISI 4140 | 1 | pc | 2.85 |
| 3 | KON-ME-001-03 | Bearing Housing | Cast Iron ASTM A48 | 2 | pc | 4.50 |
| 4 | KON-ME-001-04 | Parallel Key 14x9x40 | AISI 1045 | 1 | pc | 0.04 |
| 5 | KON-ME-001-05 | Bearing Spacer | CRS | 1 | pc | 0.08 |
| 6 | BRG-6008-2RS | Bearing 6008-2RS | Chrome Steel | 1 | pc | 0.35 |
| 7 | BRG-6007-2RS | Bearing 6007-2RS | Chrome Steel | 1 | pc | 0.28 |
| 8 | BOLT-M12x40 | Hex Bolt M12x40 | Grade 8.8 | 8 | pc | 0.06 |
| 9 | BOLT-M10x30 | Socket Head M10x30 | Grade 12.9 | 4 | pc | 0.04 |
| 10 | WASHER-M12 | Flat Washer M12 | Stainless | 8 | pc | 0.01 |
| 11 | LUB-EP2 | Grease Lithium EP2 | - | 50 | g | 0.05 |

### Total Mass

| Item | Mass (kg) |
|------|-----------|
| Components | 18.46 |
| Hardware | 0.82 |
| **Total** | **19.28** |

---

# 6. TECHNICAL SPECIFICATIONS

## General Requirements

### Drawing Standards

| Standard | Title | Application |
|----------|-------|-------------|
| ASME Y14.5-2018 | Dimensioning and Tolerancing | All dimensions & GD&T |
| ASME Y14.100 | Engineering Drawing Practices | Drawing format |
| ISO 128 | Technical Drawings - General Principles | View representations |
| ISO 2768 | General Tolerances | Default tolerances |

### Default Tolerances (Per ISO 2768-m)

| Linear Dimensions | Angular Dimensions |
|-------------------|---------------------|
| 0.5 - 3 mm: ±0.1 mm | 0 - 15°: ±1° |
| 3 - 6 mm: ±0.1 mm | 15 - 30°: ±1° |
| 6 - 30 mm: ±0.2 mm | 30 - 90°: ±1° |
| 30 - 120 mm: ±0.3 mm | 90 - 180°: ±2° |
| 120 - 315 mm: ±0.5 mm | 180 - 270°: ±3° |
| 315 - 1000 mm: ±0.8 mm | 270 - 360°: ±4° |

### Standard Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| A/F | Across Flats |
| B/c | Because |
| C/L | Centerline |
| DIM | Dimension |
| DQ | Drawing Quality |
| GD&T | Geometric Dimensioning & Tolerancing |
| ID | Inside Diameter |
| OD | Outside Diameter |
| PCD | Pitch Circle Diameter |
| R | Radius |
| REQD | Required |
| TH | Through |
| TIR | Total Indicator Reading |
| Ø | Diameter |

---

# 7. GD&T CALLOUTS REFERENCE

## Common GD&T Symbols (Per ASME Y14.5-2018)

| Symbol | Name | Application |
|--------|------|-------------|
| ⌀ | Diameter | Round features |
| ⌖ | Position | Feature location |
| ⌐ | Flatness | Surface flatness |
| ⟂ | Perpendicularity | 90° relationship |
| ∥ | Parallelism | Parallel relationship |
| ⌭ | Circularity | Roundness |
| ⬭ | Cylindricity | Overall cylinder form |
| ⌅ | Profile of Surface | Surface contour |
| ⌖ | Position | Positional tolerance |
| ⤵ | Total Runout | Runout control |
| ↗ | Profile of Line | Line profile |

## Datum Reference Frame

```
           DATUM C (SIDE FACE)
                  │
                  │
    DATUM A ──────┼────── DATUM B
    (CENTERLINE)  │    (RIGHT FACE)
                  │
                  ▼
              (MOUNTING)
```

---

# 8. MATERIAL SPECIFICATIONS

## Summary Table

| Part | Material | Spec | Condition | Hardness |
|------|----------|------|-----------|----------|
| Input Shaft | AISI 4340 | AMS 6415 | Q&T | 280-320 HBW |
| Helical Gear | AISI 4140 | ASTM A322 | Q&T | 285-321 HBW |
| Key | AISI 1045 | ASTM A108 | Normalized | 170-210 HB |
| Spacer | CRS | ASTM A109 | Annealed | 85-110 HRB |
| Housing | CI ASTM A48 | ASTM A48-22 | Class 35 | 180-220 HB |

## Material Certifications Required

- [ ] Mill test certificates for all steel materials
- [ ] Foundry test certificates for castings
- [ ] Chemical composition analysis (spectro test)
- [ ] Mechanical properties test reports (tensile, hardness)

---

# 9. SURFACE FINISH REQUIREMENTS

## Surface Roughness Conversion Chart

| Ra (μm) | Ra (μin) | Rz (μm) | Application |
|---------|----------|---------|-------------|
| 0.2 | 8 | 1.0 | Superfinished surfaces |
| 0.4 | 16 | 2.0 | Precision bearings |
| 0.8 | 32 | 3.2 | Bearing seats, gear shafts |
| 1.6 | 63 | 6.3 | General machined surfaces |
| 3.2 | 125 | 12.5 | Commercial machined |
| 6.3 | 250 | 25.0 | Rough machined |
| 12.5 | 500 | 50.0 | Non-machined surfaces |

## Surface Protection

| Part | Protection | Specification |
|------|------------|---------------|
| Input Shaft | Oil coating | Anti-rust oil |
| Helical Gear | VCI Film | Vapor Corrosion Inhibitor |
| Housing | Primer | Red oxide primer |
| Hardware | Zinc Plating | ASTM B633 (SC1) |

---

# 10. MANUFACTURING NOTES

## General Manufacturing Instructions

1. **CLEANLINESS**: All parts must be free from burrs, scale, chips, and foreign material before assembly
2. **STRAIGHTNESS**: Shaft straightness shall be 0.05mm TIR maximum
3. **CHAMFER**: All sharp edges to be broken 0.5 x 45° unless otherwise specified
4. **INSPECTION**: 100% dimensional inspection required for critical features
5. **TRACEABILITY**: Individual part marking required for critical components

## Critical Process Controls

| Process | Control Parameter | Specification |
|---------|-------------------|---------------|
| Turning | Surface speed | 120-180 m/min |
| Grinding | Wheel grade | K-L (Aluminum Oxide) |
| Heat Treatment | Temperature | ±10°C |
| Quenching | Agitation | Oil flow 500 L/min min |
| Tempering | Soak time | 2 hours minimum |

---

# 11. QUALITY ASSURANCE REQUIREMENTS

## Inspection Checklist

| Item | Feature | Method | AQL |
|------|---------|--------|-----|
| 1 | Bearing seat diameter | Micrometer | 0.65% |
| 2 | Bearing seat roundness | Bore gauge | 0.65% |
| 3 | Keyway width | Plug gauge | 1.0% |
| 4 | Keyway position | Indicator | 1.0% |
| 5 | Surface roughness | Profilometer | 1.0% |
| 6 | Overall length | Caliper | 1.0% |
| 7 | Fillet radius | Radius gauge | 2.5% |
| 8 | Hardness | Hardness tester | 0.65% |
| 9 | Visual inspection | Visual | 0.25% |

## Non-Destructive Testing Requirements

| Part | NDT Method | Extent |
|------|------------|--------|
| Shaft | Magnetic Particle | 100% critical areas |
| Gear | Magnetic Particle | 100% tooth area |
| Housing | Liquid Penetrant | 100% machined surfaces |

---

# 12. REVISION HISTORY

| Rev | Date | Description | Author | Approved |
|-----|------|-------------|--------|----------|
| A | 2024-01-15 | Initial Release | Mechanical Eng | Eng Manager |

---

# REFERENCES

## Primary References

1. **Madsen & Madsen (2017)** - Engineering Drawing and Design
   - Chapter 3: Geometric Construction
   - Chapter 5: Dimensioning Principles
   - Chapter 7: Tolerancing Practices
   - Chapter 12: Assembly Drawings

2. **Narayana et al. (2018)** - Machine Drawing
   - Chapter 2: Orthographic Projections
   - Chapter 4: Sectional Views
   - Chapter 6: Machine Components Drawing
   - Chapter 9: Assembly Drawings

3. **Bhatt & Panchal (2018)** - Engineering Drawing
   - Chapter 1: Fundamentals
   - Chapter 4: Dimensioning
   - Chapter 8: Limits, Fits, and Tolerances
   - Chapter 12: Production Drawings

## Industry Standards

- ASME Y14.5-2018: Dimensioning and Tolerancing
- ASME Y14.100-2017: Engineering Drawing Practices
- ISO 128-1:2020: General Principles of Presentation
- ISO 2768-1:1989: General Tolerances
- ANSI/AGMA 2015-1:齒轮精度标准

---

# APPENDIX A: STANDARD DRAWING BLOCKS

## Revision Block

```
┌────────┬────────┬────────┬────────┬────────┐
│  REV   │  DATE  │  DESC  │ CHECK  │ APPROV │
├────────┼────────┼────────┼────────┼────────│
│  A     │24-01-15│ Initial│  ---   │  ---   │
└────────┴────────┴────────┴────────┴────────┘
```

## Tolerance Block

```
UNLESS OTHERWISE SPECIFIED:
  DIMENSIONS IN MILLIMETERS
  TOLERANCES:   DECIMAL  ±0.1
                ANULAR   ±0.05
                ANGULAR  ±1°
  SURFACE ROUGHNESS: Ra 3.2 μm MAX
```

## Material Block

```
MATERIAL: AISI 4340 STEEL PER AMS 6415
CONDITION: QUENCHED & TEMPERED
HARDNESS: 280-320 HBW
```

---

# APPENDIX B: WELDING SYMBOLS (PER AWS A2.4)

| Symbol | Meaning |
|--------|---------|
| ▽ | Fillet Weld |
| ⌒ | V-Groove |
| ʊ | Bevel Groove |
| ○ | Spot Weld |
| ≋ | Projection Weld |

---

# APPENDIX C: COMMON TOLERANCE ZONES

## Hole/Tolerance Zones (ISO 286)

| Size (mm) | H7 | H8 | H9 | JS7 | JS9 |
|-----------|----|----|----|-----|-----|
| >3-6 | +12/0 | +18/0 | +30/0 | ±6/±9 | ±15 |
| >6-10 | +15/0 | +22/0 | +36/0 | ±7/±11 | ±18 |
| >10-18 | +18/0 | +27/0 | +43/0 | ±9/±13 | ±21 |
| >18-30 | +21/0 | +33/0 | +52/0 | ±10/±16 | ±26 |

## Shaft/Tolerance Zones (ISO 286)

| Size (mm) | h6 | h7 | h8 | g6 | js6 |
|-----------|----|----|----|-----|-----|
| >3-6 | -8/-12 | -12/-18 | -18/-28 | -4/-8 | ±5/±7 |
| >6-10 | -9/-15 | -15/-22 | -22/-35 | -5/-10 | ±6/±9 |
| >10-18 | -11/-18 | -18/-27 | -27/-43 | -6/-12 | ±7/±11 |
| >18-30 | -13/-21 | -21/-33 | -33/-52 | -7/-14 | ±9/±13 |

---

🤖 **Would You Like Me To Evaluate This Work ☝ and Provide Options to Improve It? Yes or No?**
