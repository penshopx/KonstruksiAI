/**
 * Mechanical Engineering Response Generator
 * Provides formatted responses for the chat API
 */

import {
  mechanicalDocumentTypes,
  mechanicalStandards,
  generateMechanicalDocument,
  type CFDReport,
  type DesignReviewPresentation,
  type FailureAnalysisReport,
  type ComponentSelectionReport,
  type DesignValidationReport,
  type FEAReport,
  type ProductPerformanceReport,
  type ToleranceAnalysisReport,
  type ManufacturingProcessPlan,
  type MaterialSelectionReport,
  type EngineeringDrawing,
  type AssemblyInstructions,
  type DesignRiskAssessment,
  type TestProcedure,
  type EngineeringChangeOrder,
  type HeatTransferAnalysis,
  type MaintenanceManual,
  type ExpertConsultation
} from './mechanical-engineer';

export function getMechanicalEngineerResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Computational Fluid Dynamics
  if (msg.includes('cfd') || msg.includes('computational fluid') || 
      msg.includes('dinamika fluida komputasi') || msg.includes('analisis cfd') ||
      msg.includes('fluid dynamics') || msg.includes('analisis aliran')) {
    return generateCFDResponse();
  }
  
  // Design Review
  if (msg.includes('design review') || msg.includes('ulasan desain') || 
      msg.includes('review desain') || msg.includes('desain produk')) {
    return generateDesignReviewResponse();
  }
  
  // Failure Analysis
  if (msg.includes('failure analysis') || msg.includes('analisis kegagalan') ||
      msg.includes('root cause') || msg.includes('penyebab utama') ||
      msg.includes('gagal')) {
    return generateFailureAnalysisResponse();
  }
  
  // Component Selection
  if (msg.includes('component selection') || msg.includes('pemilihan komponen') ||
      msg.includes('material selection') || msg.includes('pemilihan material') ||
      msg.includes('selector')) {
    return generateComponentSelectionResponse();
  }
  
  // Design Validation
  if (msg.includes('design validation') || msg.includes('validasi desain') ||
      msg.includes('verification') || msg.includes('verifikasi')) {
    return generateDesignValidationResponse();
  }
  
  // FEA - Finite Element Analysis
  if (msg.includes('fea') || msg.includes('finite element') || 
      msg.includes('analisis elemen hingga') || msg.includes('fem')) {
    return generateFEAResponse();
  }
  
  // Product Performance
  if (msg.includes('product performance') || msg.includes('kinerja produk') ||
      msg.includes('performa produk') || msg.includes('pengujian produk')) {
    return generateProductPerformanceResponse();
  }
  
  // Tolerance Analysis
  if (msg.includes('tolerance analysis') || msg.includes('analisis toleransi') ||
      msg.includes('toleransi') || msg.includes('stackup') || msg.includes('gd&t')) {
    return generateToleranceAnalysisResponse();
  }
  
  // Manufacturing Process Plans
  if (msg.includes('manufacturing process') || msg.includes('proses manufaktur') ||
      msg.includes('process plan') || msg.includes('rencana proses') ||
      msg.includes('工作流程') || msg.includes('工艺流程')) {
    return generateManufacturingProcessResponse();
  }
  
  // Engineering Drawings
  if (msg.includes('engineering drawing') || msg.includes('gambar teknik') ||
      msg.includes('technical drawing') || msg.includes('gambar kerja') ||
      msg.includes('blueprint') || msg.includes('denah')) {
    return generateEngineeringDrawingResponse();
  }
  
  // Assembly Instructions
  if (msg.includes('assembly instruction') || msg.includes('instruksi perakitan') ||
      msg.includes('petunjuk perakitan') || msg.includes('assembly manual')) {
    return generateAssemblyInstructionsResponse();
  }
  
  // Design Risk Assessment
  if (msg.includes('design risk') || msg.includes('risiko desain') ||
      msg.includes('risk assessment') || msg.includes('penilaian risiko') ||
      msg.includes('hazard')) {
    return generateDesignRiskResponse();
  }
  
  // Test Procedures
  if (msg.includes('test procedure') || msg.includes('prosedur uji') ||
      msg.includes('uji coba') || msg.includes('testing procedure')) {
    return generateTestProcedureResponse();
  }
  
  // Engineering Change Orders
  if (msg.includes('engineering change') || msg.includes('perubahan desain') ||
      msg.includes('eco') || msg.includes('change order')) {
    return generateEngineeringChangeResponse();
  }
  
  // Heat Transfer Analysis
  if (msg.includes('heat transfer') || msg.includes('perpindahan panas') ||
      msg.includes('thermal analysis') || msg.includes('analisis termal')) {
    return generateHeatTransferResponse();
  }
  
  // Maintenance Manual
  if (msg.includes('maintenance manual') || msg.includes('manual pemeliharaan') ||
      msg.includes('pemeliharaan') || msg.includes('maintenance') ||
      msg.includes('perawatan')) {
    return generateMaintenanceManualResponse();
  }
  
  // Expert Consultation
  if (msg.includes('consult expert') || msg.includes('konsultasi ahli') ||
      msg.includes('mechanical engineer') || msg.includes('insinyur mekanik') ||
      msg.includes('ahli mesin')) {
    return generateExpertConsultationResponse();
  }
  
  // Default - General Mechanical Engineering
  if (msg.includes('mechanical') || msg.includes('mekanik') || 
      msg.includes('mesin') || msg.includes('teknik mesin')) {
    return generateGeneralMechanicalResponse();
  }
  
  return '';
}

function generateCFDResponse(): string {
  return `COMPUTATIONAL FLUID DYNAMICS (CFD) ANALYSIS REPORT

As a Mechanical Engineer with 30 years of experience in fluid dynamics and thermal analysis:

---

## DOCUMENT OVERVIEW

- **Document Type**: CFD Analysis Report
- **ID**: CFD-001
- **Standards**: ASME, ISO, NIST
- **Reference**: Shigley's Mechanical Engineering Design, Incropera & DeWitt

---

## CFD ANALYSIS CATEGORIES

### 1. External Flow Analysis
- Vehicle aerodynamics
- Building wind loads
- Turbine blades
- Bridge structures

### 2. Internal Flow Analysis
- Pipe networks
- HVAC systems
- Heat exchangers
- Pumps and compressors

### 3. Thermal Analysis
- Conjugate heat transfer
- Natural convection
- Radiation analysis
- Phase change

### 4. Multiphase Flow
- Particle-laden flows
- Bubble dynamics
- Spray analysis
- Sedimentation

---

## TYPICAL CFD WORKFLOW

1. **Geometry Creation**
   - CAD model import
   - Geometry cleanup
   - Domain definition

2. **Mesh Generation**
   - Mesh type selection
   - Boundary layer refinement
   - Mesh independence study

3. **Physics Setup**
   - Material properties
   - Boundary conditions
   - Solver settings

4. **Solution**
   - Initialization
   - Convergence monitoring
   - Residual analysis

5. **Post-Processing**
   - Velocity contours
   - Pressure distribution
   - Streamlines
   - Force/moment calculation

---

## BOUNDARY CONDITIONS

| Type | Application |
|------|-------------|
| Velocity Inlet | Specified flow velocity |
| Pressure Inlet | Total pressure specified |
| Pressure Outlet | Static pressure specified |
| Wall | No-slip, slip, or moving wall |
| Symmetry | Mirror plane |
| Periodic | Repeating geometry |

---

## TURBULENCE MODELS

- **k-ε**: General purpose, robust
- **k-ω**: Near-wall treatment
- **SST**: Best of both worlds
- **LES**: Large eddy simulation
- **DNS**: Direct numerical simulation

---

## RESULTS INTERPRETATION

### Key Metrics:
- Velocity magnitude and direction
- Pressure distribution
- Temperature field
- Turbulence intensity
- Wall shear stress
- Drag and lift coefficients

### Validation:
- Compare with analytical solutions
- Experimental data correlation
- Mesh independence verification
- Sensitivity analysis

---

*Untuk analisis CFD yang lebih detail, jelaskan:
1. Jenis aplikasi (external/internal flow)
2. Geometri dan dimensi
3. Kondisi operasi (kecepatan, tekanan, suhu)
4. Output yang diharapkan*`;
}

function generateDesignReviewResponse(): string {
  return `DESIGN REVIEW PRESENTATION

As a Mechanical Engineer:

---

## DESIGN REVIEW STAGES

### 1. Concept Review (CDR)
- Initial design concepts
- Feasibility assessment
- Risk identification

### 2. Preliminary Design Review (PDR)
- Detailed specifications
- Subsystem definitions
- Interface requirements

### 3. Critical Design Review (CDR)
- Complete design freeze
- Manufacturing feasibility
- Test plan approval

### 4. Final Design Review (FDR)
- Production readiness
- Documentation complete
- Handover approval

---

## REVIEW AGENDA

1. Design overview and objectives
2. Requirements verification
3. Design analysis results
4. Risk assessment update
5. Manufacturing status
6. Test and validation results
7. Action items review
8. Decision and next steps

---

## DECISION MATRIX

| Category | Status | Notes |
|----------|--------|-------|
| Approved | ✓ | Can proceed |
| Approved with Comments | ⚠ | Minor issues to address |
| Conditionally Approved | ⚠ | Major issues, proceed with caution |
| Not Approved | ✗ | Must redesign |

---

*Siapkan dokumen pendukung: requirements traceability, analysis reports, test results, risk register*`;
}

function generateFailureAnalysisResponse(): string {
  return `FAILURE ANALYSIS REPORT

As a Mechanical Engineer with expertise in failure analysis:

---

## FAILURE INVESTIGATION PROCESS

### 1. Background Collection
- Equipment history
- Operating conditions
- Maintenance records
- Previous failures

### 2. Visual Inspection
- Fracture surface examination
- Damage patterns
- Corrosion evidence
- Deformation analysis

### 3. Non-Destructive Testing
- Ultrasonic testing
- Magnetic particle inspection
- Liquid penetrant
- Radiography

### 4. Destructive Testing
- Mechanical testing
- Chemical analysis
- Metallurgical examination
- Fractography

---

## COMMON FAILURE MODES

| Mode | Characteristics | Typical Causes |
|------|-----------------|-----------------|
| Fatigue | Striations, beach marks | Cyclic loading |
| Overload | Necking, shear lips | Excess stress |
| Corrosion | Pitting, intergranular | Chemical attack |
| Creep | Elongation, voids | High temperature |
| Wear | Surface damage | Friction, abrasion |

---

## ROOT CAUSE ANALYSIS METHODS

1. **5 Whys**: Iterative questioning
2. **Fishbone Diagram**: Cause-effect
3. **FMEA**: Failure mode effects
4. **Fault Tree**: Logical analysis
5. **Pareto Analysis**: Prioritization

---

## PREVENTIVE RECOMMENDATIONS

- Material upgrade
- Design modification
- Surface treatment
- Load reduction
- Inspection frequency increase
- Operating condition adjustment

---

*Untuk analisis kegagalan yang detail, jelaskan:
1. Jenis komponen dan fungsi
2. Kondisi operasi (beban, suhu, lingkungan)
3. Gejala kegagalan yang diamati
4. Riwayat pemeliharaan*`;
}

function generateComponentSelectionResponse(): string {
  return `COMPONENT SELECTION REPORT

As a Mechanical Engineer:

---

## SELECTION CRITERIA

### Functional Requirements
- Load capacity
- Speed/torque
- Precision/accuracy
- Life expectancy

### Environmental Requirements
- Temperature range
- Humidity
- Corrosive elements
- Vibration/shock

### Manufacturing Requirements
- Machinability
- Formability
- Joinability
- Cost

### Regulatory Requirements
- Safety standards
- Environmental regulations
- Industry specifications

---

## EVALUATION MATRIX

| Component | Score (1-10) | Weight | Weighted Score |
|-----------|--------------|--------|----------------|
| Option A | | | |
| Option B | | | |
| Option C | | | |

---

## COMMON MECHANICAL COMPONENTS

### Bearings
- Ball bearings
- Roller bearings
- Thrust bearings
- Linear bearings

### Power Transmission
- Gears
- Belts
- Chains
- Couplings

### Fasteners
- Bolts
- Screws
- Rivets
- Pins

### Seals
- O-rings
- Gaskets
- Mechanical seals
- Lip seals

---

## MATERIAL SELECTION GUIDE

### Metals
- Steel (carbon, alloy, stainless)
- Aluminum
- Titanium
- Copper alloys

### Polymers
- ABS
- Nylon
- PTFE
- PEEK

### Composites
- Carbon fiber
- Glass fiber
- Sandwich structures

---

*Berikan detail aplikasi: fungsi, beban, kecepatan, lingkungan, batasan biaya*`;
}

function generateDesignValidationResponse(): string {
  return `DESIGN VALIDATION REPORT

As a Mechanical Engineer:

---

## VALIDATION APPROACH

### 1. Design Verification
- Calculation review
- Analysis validation
- Drawing verification

### 2. Prototype Testing
- Functional tests
- Performance tests
- Endurance tests
- Environmental tests

### 3. Production Validation
- Process capability
- First article inspection
- Statistical process control

---

## TEST CATEGORIES

| Test Type | Purpose | Standards |
|-----------|---------|-----------|
| Structural | Load capacity | ASTM, ISO |
| Environmental | Climate resistance | ASTM, IEC |
| Fatigue | Life prediction | ASTM E647 |
| Impact | Shock resistance | ASTM D256 |
| Thermal | Temperature effects | ASTM E21 |

---

## ACCEPTANCE CRITERIA

### Dimensional
- Feature tolerance: ±0.1mm
- Surface finish: Ra 1.6μm
- Position tolerance: ±0.05mm

### Performance
- Load capacity: >150% rated
- Operating temperature: -40 to +85°C
- Life: >10,000 cycles

### Safety Factor
- Static: 3.0 minimum
- Dynamic: 2.0 minimum
- Fatigue: Based on S-N curve

---

## VALIDATION DOCUMENTATION

- Test plans and procedures
- Data acquisition setup
- Test results and analysis
- Deviation reports
- Final validation report

---

*Siapkan: specifications, test plan, sample size, acceptance criteria*`;
}

function generateFEAResponse(): string {
  return `FINITE ELEMENT ANALYSIS (FEA) REPORT

As a Mechanical Engineer:

---

## FEA ANALYSIS TYPES

### 1. Structural Analysis
- Static analysis
- Dynamic analysis
- Modal analysis
- Harmonic response
- Response spectrum
- Random vibration

### 2. Thermal Analysis
- Steady-state thermal
- Transient thermal
- Conduction
- Convection
- Radiation

### 3. Fatigue Analysis
- Stress-life
- Strain-life
- Snubber analysis

### 4. Buckling Analysis
- Linear buckling
- Non-linear buckling

---

## MODELING BEST PRACTICES

### Geometry
- Simplify where possible
- Remove fillets if not critical
- Use symmetry appropriately

### Mesh Quality
- Element type selection
- Mesh refinement in stress zones
- Aspect ratio < 10:1
- Jacobian > 0.5

### Boundary Conditions
- Apply realistic constraints
- Use symmetry boundaries
- Avoid over-constrained models

---

## RESULTS INTERPRETATION

### Stress Results
- Von Mises stress (distortion energy)
- Principal stresses
- Shear stress
- Stress concentration factors

### Safety Factor
- FOS = Allowable/Actual
- Yield criterion
- Fracture criterion

### Displacement
- Total displacement
- Directional displacement
- Rotation

---

## VALIDATION

- Compare with hand calculations
- Verify with analytical solutions
- Mesh convergence study
- Benchmark with known results

---

*Untuk analisis FEA, jelaskan:
1. Jenis struktur/komponen
2. Beban dan kondisi batas
3. Material properties
4. Output yang dibutuhkan*`;
}

function generateProductPerformanceResponse(): string {
  return `PRODUCT PERFORMANCE REPORT

As a Mechanical Engineer:

---

## PERFORMANCE METRICS

### Efficiency
- Energy efficiency ratio
- Power factor
- Mechanical efficiency
- Thermal efficiency

### Reliability
- MTBF (Mean Time Between Failures)
- MTTF (Mean Time To Failure)
- Failure rate
- Availability

### Durability
- Cycle life
- Wear rate
- Degradation curve
- Service life prediction

---

## TESTING PROTOCOLS

### Accelerated Life Testing
- Elevated stress testing
- Cyclic loading
- Environmental aging

### Performance Mapping
- Full range characterization
- Performance curves
- Efficiency maps

### Field Performance
- In-service monitoring
- User feedback analysis
- Warranty data

---

## STATISTICAL ANALYSIS

- Sample size determination
- Confidence intervals
- Hypothesis testing
- Regression analysis
- Weibull analysis

---

## PERFORMANCE BENCHMARKS

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Efficiency | >85% | | |
| MTBF | >10,000 hrs | | |
| Weight | <50 kg | | |
| Cost | <$1000 | | |

---

*Siapkan: test plan, sample size, acceptance criteria, statistical methods*`;
}

function generateToleranceAnalysisResponse(): string {
  return `TOLERANCE ANALYSIS REPORT

As a Mechanical Engineer:

---

## TOLERANCE STACKUP METHODS

### 1. Worst-Case Analysis
- Sum of tolerances
- Maximum envelope method
- Conservative but safe

### 2. Statistical Analysis
- RSS (Root Sum Square)
- Monte Carlo simulation
- Six Sigma approach

---

## GD&T FUNDAMENTALS

### Geometric Controls
- Flatness
- Straightness
- Circularity
- Cylindricity
- Profile of surface
- Parallelism
- Perpendicularity
- Angularity
- Position
- Concentricity
- Symmetry
- Circular runout
- Total runout

### Datums
- Primary datum
- Secondary datum
- Tertiary datum
- Datum simulator

---

## TOLERANCE CHAIN EXAMPLE

| Component | Dimension | Tolerance |
|-----------|-----------|-----------|
| Shaft | 25.00 | ±0.05 |
| Bearing | 25.00 | +0.02/-0 |
| Housing | 25.10 | +0.10/-0 |
| Spacer | 0.10 | ±0.02 |

Stackup: 0.05 + 0.02 + 0.10 + 0.02 = 0.19mm (worst case)

---

## PROCESS CAPABILITY

### Capability Indices
- Cp = (USL - LSL) / 6σ
- Cpk = min[(USL-μ)/3σ, (μ-LSL)/3σ]

### Acceptance Criteria
- Cp ≥ 1.33 (capable)
- Cpk ≥ 1.33 (centered)
- Cpk ≥ 1.67 (highly capable)

---

*Berikan dimensional requirements dan assembly constraints untuk analisis detail*`;
}

function generateManufacturingProcessResponse(): string {
  return `MANUFACTURING PROCESS PLAN

As a Mechanical Engineer:

---

## PROCESS PLANNING STAGES

### 1. Part Analysis
- Material selection
- Feature identification
- Critical characteristics
- Machinability assessment

### 2. Process Selection
- Casting
- Machining
- Forming
- Additive manufacturing
- Assembly

### 3. Sequence Development
- Rough machining
- Semi-finishing
- Finishing
- Inspection
- Assembly

---

## COMMON MACHINING OPERATIONS

| Operation | Equipment | Typical Tolerances |
|-----------|-----------|-------------------|
| Turning | Lathe | ±0.05mm |
| Milling | CNC Mill | ±0.02mm |
| Drilling | Drill press | ±0.1mm |
| Grinding | Surface grinder | ±0.005mm |
| EDM | Wire EDM | ±0.01mm |

---

## QUALITY CONTROL POINTS

### In-Process Checks
- Tool wear monitoring
- Dimensional verification
- Surface inspection

### Final Inspection
- CMM measurement
- Surface finish
- Hardness testing
- Functional test

---

## PROCESS DOCUMENTATION

- Operation sheets
- Setup sheets
- Tool lists
- Inspection plans
- Control plans

---

## TIME ESTIMATION

- Setup time
- Cycle time
- Handling time
- Inspection time
- Contingency

---

*Berikan: part drawing, material, quantity, deadline untuk process plan detail*`;
}

function generateEngineeringDrawingResponse(): string {
  return `ENGINEERING DRAWING STANDARDS

As a Mechanical Engineer:

---

## DRAWING TYPES

### Detail Drawings
- Single part representation
- Full dimensions
- Tolerances
- Surface finish

### Assembly Drawings
- Multiple parts
- Bill of materials
- Assembly sequence
- General tolerances

### Schematic Drawings
- P&ID (Piping & Instrumentation)
- Hydraulic/Pneumatic
- Electrical

---

## GD&T SYMBOLS

### Form
- ☐ Flatness
- ⏤ Straightness
- ○ Circularity
- ⭯ Cylindricity

### Orientation
- ∥ Parallelism
- ⟂ Perpendicularity
- ∠ Angularity

### Profile
- ⌒ Profile of line
- ⌒ Profile of surface

### Location
- ⌖ Position
- ◎ Concentricity
- ⌯ Symmetry

### Runout
- ⌭ Circular runout
- ⌮ Total runout

---

## DRAWING BLOCK INFORMATION

### Title Block
- Drawing number
- Revision
- Title
- Scale
- Drawn/Checked/Approved

### Revision Block
- Revision letter
- Date
- Description
- Author

---

## STANDARD VIEWS

1. Front view (principal)
2. Top view
3. Right side view
4. Left side view
5. Bottom view
6. Rear view
7. Section views
8. Detail views
9. Auxiliary views

---

*Berikan: part number, revision level, required views untuk drawing detail*`;
}

function generateAssemblyInstructionsResponse(): string {
  return `ASSEMBLY INSTRUCTIONS DOCUMENT

As a Mechanical Engineer:

---

## DOCUMENT STRUCTURE

### 1. Introduction
- Scope
- References
- Definitions

### 2. Required Resources
- Tools
- Equipment
- Materials
- Parts

### 3. Safety Warnings
- Personal protective equipment
- Lockout/Tagout
- Hazardous materials
- Ergonomic considerations

### 4. Assembly Steps
- Sequential instructions
- Torque specifications
- Adhesives/thread lockers
- Critical inspections

### 5. Quality Checks
- Functional tests
- Leak tests
- Alignment verification
- Final inspection

---

## TORQUE SPECIFICATIONS

| Size | Grade | Dry (Nm) | Lubricated (Nm) |
|------|-------|----------|-----------------|
| M6 | 8.8 | 10 | 8 |
| M8 | 8.8 | 25 | 20 |
| M10 | 8.8 | 50 | 40 |
| M12 | 8.8 | 85 | 70 |
| M16 | 8.8 | 210 | 170 |

---

## COMMON ASSEMBLY SEQUENCE

1. Prepare workspace
2. Verify all parts available
3. Clean and inspect parts
4. Install sub-assemblies
5. Apply torque to fasteners
6. Apply adhesives if required
7. Perform quality checks
8. Document completion

---

## TROUBLESHOOTING GUIDE

| Problem | Cause | Solution |
|---------|-------|----------|
| Binding | Misalignment | Realign components |
| Leak | Seal damage | Replace seal |
| Noise | Loose fastener | Retorque |
| Vibration | Unbalanced | Check balance |

---

*Berikan: assembly number, parts list, special tools untuk instruksi detail*`;
}

function generateDesignRiskResponse(): string {
  return `DESIGN RISK ASSESSMENT

As a Mechanical Engineer:

---

## RISK ASSESSMENT PROCESS

### 1. Hazard Identification
- Energy sources
- Motion hazards
- Temperature hazards
- Chemical hazards
- Ergonomic hazards

### 2. Risk Evaluation
- Severity (S): 1-5 scale
- Probability (P): 1-5 scale
- Risk Level = S × P

---

## RISK MATRIX

| | Minor (1) | Moderate (2) | Serious (3) | Critical (4) | Catastrophic (5) |
|---|---|---|---|---|---|
| **Frequent (5)** | 5 | 10 | 15 | 20 | 25 |
| **Likely (4)** | 4 | 8 | 12 | 16 | 20 |
| **Occasional (3)** | 3 | 6 | 9 | 12 | 15 |
| **Remote (2)** | 2 | 4 | 6 | 8 | 10 |
| **Improbable (1)** | 1 | 2 | 3 | 4 | 5 |

---

## RISK CONTROL HIERARCHY

1. **Elimination** - Remove hazard
2. **Substitution** - Replace with less hazardous
3. **Engineering Controls** - Isolate, guard
4. **Administrative Controls** - Training, procedures
5. **PPE** - Last line of defense

---

## DOCUMENTATION

- Risk assessment register
- Control measures
- Residual risk acceptance
- Review schedule
- Training records

---

*Berikan: product description, intended use, user profile untuk risk assessment*`;
}

function generateTestProcedureResponse(): string {
  return `TEST PROCEDURE DOCUMENT

As a Mechanical Engineer:

---

## PROCEDURE STRUCTURE

### 1. Scope and Purpose
- Test objectives
- Applicability
- Limitations

### 2. References
- Standards
- Specifications
- Related procedures

### 3. Definitions
- Technical terms
- Acronyms
- Abbreviations

### 4. Test Setup
- Equipment list
- Calibration status
- Setup diagram
- Safety requirements

### 5. Test Procedure
- Step-by-step instructions
- Data to record
- Acceptance criteria
- Pass/fail criteria

### 6. Reporting
- Data analysis
- Results summary
- Non-conformances
- Conclusions

---

## COMMON MECHANICAL TESTS

| Test | Standard | Purpose |
|------|----------|---------|
| Tensile | ASTM E8 | Strength |
| Compressive | ASTM E9 | Strength |
| Hardness | ASTM E10/E18 | Hardness |
| Impact | ASTM E23 | Toughness |
| Fatigue | ASTM E647 | Life |
| Bending | ASTM E290 | Ductility |

---

## TEST EQUIPMENT CALIBRATION

- Traceability to national standards
- Calibration interval
- Calibration certificate
- Equipment ID

---

## ACCEPTANCE CRITERIA

- Specification limits
- Tolerance stackup
- Safety factors
- Statistical confidence

---

*Berikan: test standard, sample size, acceptance criteria untuk procedure detail*`;
}

function generateEngineeringChangeResponse(): string {
  return `ENGINEERING CHANGE ORDER (ECO)

As a Mechanical Engineer:

---

## ECO PROCESS

### 1. Change Initiation
- Request submission
- Justification
- Affected documents identification

### 2. Impact Assessment
- Design impact
- Manufacturing impact
- Quality impact
- Cost impact
- Schedule impact

### 3. Approval
- Technical review
- Management review
- Customer approval (if required)

### 4. Implementation
- Document revision
- Training
- Production release
- Obsolescence handling

---

## ECO DOCUMENTATION

| Field | Description |
|-------|-------------|
| ECO Number | Unique identifier |
| Originator | Requester |
| Part Numbers | Affected parts |
| Description | Change details |
| Reason | Justification |
| Benefit | Expected improvement |
| Effectivity | Implementation date |

---

## CHANGE CLASSIFICATION

### Class I - Major Change
- Affects function
- Requires customer notification
- May affect interchangeability

### Class II - Minor Change
- Does not affect function
- Production approval only
- Maintains interchangeability

### Class III - Documentation Only
- No manufacturing effect
- Clarification only
- No cost impact

---

## APPROVAL ROUTING

1. Engineering
2. Manufacturing
3. Quality
4. Procurement
5. Customer (if required)
6. Management

---

*Berikan: part number, current revision, proposed change untuk ECO detail*`;
}

function generateHeatTransferResponse(): string {
  return `HEAT TRANSFER ANALYSIS REPORT

As a Mechanical Engineer:

---

## HEAT TRANSFER MODES

### 1. Conduction
- Fourier's Law: q = -kA(dT/dx)
- Steady-state
- Transient

### 2. Convection
- Newton's Law: q = hA(Ts - T∞)
- Forced convection
- Natural convection

### 3. Radiation
- Stefan-Boltzmann: q = εσAT⁴
- Surface radiation
- View factors

---

## THERMAL ANALYSIS TYPES

### Steady-State
- Constant heat load
- Time-independent
- Thermal equilibrium

### Transient
- Time-varying conditions
- Thermal mass effects
- Heating/cooling curves

---

## BOUNDARY CONDITIONS

| Type | Application |
|------|-------------|
| Temperature | Fixed temperature |
| Heat Flux | Constant heat input |
| Convection | Fluid cooling/heating |
| Radiation | Surface-to-surface |
| Adiabatic | Insulated surface |

---

## THERMAL RESISTANCE

- Conduction: R = L/(kA)
- Convection: R = 1/(hA)
- Contact: R = Rc/A
- Overall: Rtotal = ΣRi

---

## THERMAL STRESS

- Thermal expansion: ΔL = αL₀ΔT
- Stress: σ = EαΔT
- Thermal strain: εth = αΔT
- Combined with mechanical stress

---

## VALIDATION

- Analytical solutions
- Experimental data
- Numerical comparison
- Sensitivity analysis

---

*Berikan: geometry, materials, operating conditions, thermal loads untuk analisis detail*`;
}

function generateMaintenanceManualResponse(): string {
  return `MAINTENANCE MANUAL

As a Mechanical Engineer:

---

## MANUAL STRUCTURE

### 1. Introduction
- Equipment description
- Specifications
- Operating parameters

### 2. Safety
- Safety warnings
- PPE requirements
- Lockout/tagout procedures
- Emergency procedures

### 3. Routine Maintenance
- Daily checks
- Weekly checks
- Monthly checks
- Quarterly checks
- Annual checks

### 4. Troubleshooting
- Symptom identification
- Possible causes
- Remedial actions

### 5. Spare Parts
- Parts list
- Part numbers
- Recommended stock

### 6. Drawings
- Schematics
- Wiring diagrams
- Assembly drawings

---

## MAINTENANCE SCHEDULE

| Interval | Tasks |
|----------|-------|
| Daily | Visual inspection, lubricant check |
| Weekly | Cleaning, filter inspection |
| Monthly | Detailed inspection, lubrication |
| Quarterly | Performance testing, alignment |
| Annual | Overhaul, calibration |

---

## LUBRICATION SCHEDULE

| Component | Lubricant | Quantity | Interval |
|-----------|-----------|----------|----------|
| Bearings | Grease NLGI 2 | As required | 6 months |
| Gears | Oil ISO VG 220 | As required | 3 months |
| Chains | Spray lubricant | As required | Monthly |
| Guides | Grease NLGI 1 | As required | Monthly |

---

## TROUBLESHOOTING GUIDE

| Problem | Cause | Solution |
|---------|-------|----------|
| Excessive vibration | Imbalance, misalignment | Realign, balance |
| Overheating | Overload, lubrication | Reduce load, lubricate |
| Noise | Worn bearings, loose parts | Replace, tighten |
| Leak | Seal failure | Replace seal |

---

*Berikan: equipment model, operating hours, failure symptoms untuk troubleshooting*`;
}

function generateExpertConsultationResponse(): string {
  return `EXPERT CONSULTATION: MECHANICAL ENGINEER

As a Senior Mechanical Engineer with 30+ years of experience:

---

## AREAS OF EXPERTISE

### Design & Analysis
- Mechanical design
- Finite element analysis
- Stress analysis
- Dynamics and vibrations

### Manufacturing
- Process planning
- Machining
- Quality control
- Lean manufacturing

### Thermal Systems
- Heat transfer
- HVAC
- Refrigeration
- Power systems

### Materials
- Material selection
- Metallurgy
- Failure analysis
- Corrosion

---

## CONSULTATION PROCESS

1. **Problem Definition**
   - Understand the issue
   - Gather background information
   - Identify constraints

2. **Analysis**
   - Apply engineering principles
   - Use analytical/numerical methods
   - Consider applicable standards

3. **Recommendations**
   - Proposed solutions
   - Alternative approaches
   - Implementation guidance

---

## STANDARDS & CODES

- ASME (Boiler & Pressure Vessel)
- ASTM (Materials Testing)
- ISO (Quality & Standards)
- ANSI (American National)
- API (Petroleum Industry)

---

## INFORMATION NEEDED

To provide accurate consultation, please specify:
- Type of application/equipment
- Operating conditions
- Materials involved
- Constraints/budget
- Timeline
- Specific questions

---

*Jangan ragu untuk bertanya tentang aspek teknis apapun. Saya siap membantu!*`;
}

function generateGeneralMechanicalResponse(): string {
  return `MECHANICAL ENGINEERING SUPPORT

Halo! Saya Mechanical Engineer dengan pengalaman 30+ tahun. Saya bisa membantu Anda dengan:

---

## LAYANAN YANG TERSEDIA

### 📊 Dokumen Teknis
1. **Computational Fluid Dynamics (CFD)** - Analisis aliran fluida
2. **Finite Element Analysis (FEA)** - Analisis elemen hingga
3. **Heat Transfer Analysis** - Analisis perpindahan panas
4. **Failure Analysis** - Analisis kegagalan

### 📋 Dokumen Manufaktur
5. **Manufacturing Process Plans** - Rencana proses manufaktur
6. **Material Selection** - Pemilihan material
7. **Tolerance Analysis** - Analisis toleransi
8. **Engineering Drawings** - Gambar teknik

### 📝 Dokumen Quality & Safety
9. **Design Validation** - Validasi desain
10. **Test Procedures** - Prosedur pengujian
11. **Design Risk Assessment** - Penilaian risiko
12. **Maintenance Manual** - Manual pemeliharaan

### 🎨 Dokumen Lainnya
13. **Design Review** - Ulasan desain
14. **Component Selection** - Pemilihan komponen
15. **Assembly Instructions** - Instruksi perakitan
16. **Engineering Change Orders** - Perubahan desain
17. **Product Performance** - Kinerja produk
18. **Expert Consultation** - Konsultasi ahli

---

## CARA MENGGUNAKAN

Tuliskan pertanyaan atau topik yang ingin Anda diskusikan, misalnya:
- "Buat CFD analysis untuk sistem HVAC"
- "Jelaskan cara memilih material untuk gear"
- "Bagaimana procedure testing untuk pump?"

---

## STANDAR YANG DIGUNAKAN

- ASME, ASTM, ISO, API, ANSI
- Referensi: Shigley's, Mott, Incropera

---

*Silakan pilih topik atau ajukan pertanyaan spesifik!*`;
}
