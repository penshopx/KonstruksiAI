/**
 * Energy Efficiency Analysis Response Generator
 * Provides formatted responses for the chat API
 */

import {
  energyCategories,
  evaluationCriteria,
  complianceStandards,
  getEnergyCategoryById,
  getCategoriesByFacilityType,
  getImprovementMeasuresByCategory,
  getComplianceRequirements,
  type FacilityType,
  type EnergyCategoryData,
  type ImprovementMeasure
} from './energy-efficiency';

export function getEnergyEfficiencyResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Main energy efficiency document
  if (msg.includes("energy efficiency") || msg.includes("efisiensi energi") ||
      msg.includes("analisis energi") || msg.includes("energy audit") ||
      msg.includes("audit energi") || msg.includes("energy management") ||
      msg.includes("manajemen energi") || msg.includes("penghematan energi") ||
      msg.includes("saving energy")) {
    
    return `ENERGY EFFICIENCY ANALYSIS DOCUMENT

As an Electrical Engineer with 30 years of experience, here is a comprehensive Energy Efficiency Analysis Document:

---

## DOCUMENT INFO

- ID: EE-COMPLETE-001
- Title: Comprehensive Energy Efficiency Analysis Document
- Standards: PUIL 2011, ISO 50001:2018, ISO 14001:2015, SNI 6389:2020
- Facility Types: Industrial, Commercial, Residential, Utility, Mixed-use
- Methodology: Turner and Doty (2012), Wilson (2019), Turner and Turner (2017)

---

## ENERGY ANALYSIS CATEGORIES

### 1. Lighting System
${energyCategories[0].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

### 2. HVAC System
${energyCategories[1].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

### 3. Electric Motors and Drives
${energyCategories[2].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

### 4. Production Equipment
${energyCategories[3].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

### 5. Building Envelope
${energyCategories[4].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

### 6. Renewable Energy Integration
${energyCategories[5].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

### 7. Power Quality and Distribution
${energyCategories[6].improvementMeasures.map((m, i) => `${i + 1}. ${m.measure} - ${m.savings} (Payback: ${m.payback} years)`).join('\n')}

---

## EVALUATION CRITERIA

| Criteria | Weight | Description |
|----------|--------|-------------|
${evaluationCriteria.map(c => `| ${c.name} | ${c.weight}% | ${c.description} |`).join('\n')}

---

## COMPLIANCE STANDARDS

${complianceStandards.map(std => `### ${std.name} (${std.region})
${std.description}

Requirements:
${std.requirements.map(r => `- ${r}`).join('\n')}
`).join('\n')}

---

## AUDIT METHODOLOGY

### Audit Stages:
1. Pre-Audit - Initial data collection and scope definition
2. General Audit - Walk-through and opportunity identification
3. Detailed Audit - In-depth measurement and analysis
4. Verification - Results validation and recommendations

### Analysis Methods:
- Energy baseline analysis
- Energy balance and losses
- Industry standard benchmarking
- Life-cycle cost analysis (LCCA)
- Measurement and Verification (MandV)

---

## IMPLEMENTATION ROADMAP

### Phase 1: Quick Wins (0-6 months)
- Quick wins with payback less than 1 year
- LED lighting retrofit
- Occupancy sensors
- Compressed air leak repair

### Phase 2: Medium-term Improvements (6-18 months)
- VFD installation
- HVAC optimization
- Building envelope improvements

### Phase 3: Long-term Projects (18+ months)
- Solar PV installation
- Complete system upgrades
- Building management systems

---

Would you like me to create a complete Energy Efficiency Analysis Document in Word/PDF format? Or do you need specific details for certain systems?

Example questions:
- "Lighting System Analysis" - Detailed lighting efficiency
- "HVAC Audit" - How to optimize AC and ventilation
- "Solar PV" - Rooftop PLTS analysis
- "ISO 50001" - SMKN implementation`;
  }
  
  // Lighting specific
  if (msg.includes("lighting") || msg.includes("pencahayaan") || msg.includes("lampu") || msg.includes("led")) {
    return `LIGHTING SYSTEM EFFICIENCY ANALYSIS

Here is an in-depth analysis for lighting systems:

---

## TYPICAL CONSUMPTION: ~15% of total energy

### COMMON ISSUES:
${energyCategories[0].commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

---

## IMPROVEMENT MEASURES:

${energyCategories[0].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## SPECIFIC RECOMMENDATIONS:

1. For Offices:
   - LED Tubes + Occupancy Sensors
   - Daylight harvesting in window areas
   - Schedule-based lighting controls

2. For Factories:
   - High-bay LED fixtures
   - Zone-based controls
   - Maintenance optimization

3. For Homes:
   - LED bulbs all sockets
   - Motion sensors in corridors
   - Timer switches

---

Would you like detailed ROI calculations for specific lighting projects?`;
  }
  
  // HVAC specific
  if (msg.includes("hvac") || msg.includes("ac") || msg.includes("air conditioner") || msg.includes("pendingin") || msg.includes("ventilasi") || msg.includes("heating")) {
    return `HVAC SYSTEM EFFICIENCY ANALYSIS

Here is an in-depth analysis for HVAC systems:

---

## TYPICAL CONSUMPTION: ~30% of total energy

### COMMON ISSUES:
${energyCategories[1].commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

---

## IMPROVEMENT MEASURES:

${energyCategories[1].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## SPECIFIC RECOMMENDATIONS:

1. For Commercial Buildings:
   - Install VFD on AHU/FCU
   - Smart thermostats with scheduling
   - Duct sealing and insulation
   - Heat recovery ventilation

2. For Factories:
   - Process cooling optimization
   - Waste heat recovery
   - Compressor heat recovery

3. Best Practices:
   - Optimal setpoint: 24-26 degrees C
   - Preventive maintenance monthly
   - Filter cleaning bi-weekly

---

Would you like detailed VFD specifications or savings calculations?`;
  }
  
  // Motors specific
  if (msg.includes("motor") || msg.includes("motors") || msg.includes("vfd") || msg.includes("variable frequency") || msg.includes("soft starter")) {
    return `ELECTRIC MOTOR EFFICIENCY ANALYSIS

Here is an in-depth analysis for motor systems:

---

## TYPICAL CONSUMPTION: ~25% of total energy

### COMMON ISSUES:
${energyCategories[2].commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

---

## IMPROVEMENT MEASURES:

${energyCategories[2].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## MOTOR EFFICIENCY STANDARDS (IEC):

| Class | Efficiency | Notes |
|-------|------------|-------|
| IE1 | Standard | Being phased out |
| IE2 | High | Required in EU |
| IE3 | Premium | Best practice |
| IE4 | Super Premium | For critical |

### Recommendations:
1. Replace old motors with IE3+
2. Install VFD for variable load
3. Prevent oversizing with proper sizing
4. Power factor correction capacitor

---

Would you like a VFD savings calculation spreadsheet?`;
  }
  
  // Production/Industrial specific
  if (msg.includes("production") || msg.includes("industrial") || msg.includes("manufaktur") || msg.includes("pabrik") || msg.includes("kompresor") || msg.includes("compressed air")) {
    return `PRODUCTION EQUIPMENT EFFICIENCY ANALYSIS

Here is an analysis for industrial systems:

---

## TYPICAL CONSUMPTION: ~35% of total energy (industrial)

### COMMON ISSUES:
${energyCategories[3].commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

---

## IMPROVEMENT MEASURES:

${energyCategories[3].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## PRIORITY AREAS:

### 1. Compressed Air System
- Leak detection and repair
- Pressure reduction (7 bar optimal)
- Heat recovery from compressors
- Variable speed compressors

### 2. Process Heating
- Waste heat recovery
- Optimized scheduling
- High-efficiency burners

### 3. Motors and Drives
- VFD on all variable loads
- Premium efficiency motors
- Soft starters

### 4. Lighting
- LED high-bay
- Occupancy controls
- Daylight integration

---

Would you like an energy balance for specific processes?`;
  }
  
  // Building envelope
  if (msg.includes("building envelope") || msg.includes("selubung bangunan") || msg.includes("insulasi") || msg.includes("insulation") || msg.includes("jendela") || msg.includes("window") || msg.includes("roof") || msg.includes("atap")) {
    return `BUILDING ENVELOPE EFFICIENCY ANALYSIS

Here is an analysis for building envelope:

---

## TYPICAL CONSUMPTION: ~10% of total energy

### COMMON ISSUES:
${energyCategories[4].commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

---

## IMPROVEMENT MEASURES:

${energyCategories[4].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## RECOMMENDATIONS:

### Windows:
| Type | U-Value | SHGC | Notes |
|------|---------|------|-------|
| Single | 5.8 | 0.75 | Baseline |
| Double | 2.8 | 0.70 | Good |
| Low-E | 1.8 | 0.40 | Best |

### Wall Insulation:
| Material | R-Value | Thickness |
|----------|---------|-----------|
| Glass Wool | 3.5/m | 100mm |
| Rock Wool | 3.3/m | 100mm |
| PIR | 5.5/m | 50mm |

### Air Sealing:
- Blower door test
- Thermal imaging
- Caulking and weatherstripping

---

Would you like savings simulations for specific buildings?`;
  }
  
  // Renewable energy
  if (msg.includes("renewable") || msg.includes("terbarukan") || msg.includes("solar") || msg.includes("plts") || msg.includes("photovoltaic") || msg.includes("pv") || msg.includes("battery") || msg.includes("batrai") || msg.includes("储能")) {
    return `RENEWABLE ENERGY ANALYSIS

Here is an analysis for renewable energy integration:

---

## SYSTEM OPTIONS:

${energyCategories[5].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## SOLAR PV ANALYSIS:

### Indonesia Potential:
- Irradiation: 4-6 kWh/m2/day
- Peak sun hours: 4-5 hours
- System efficiency: 15-20%

### Space Requirements:
| Capacity | Required Area | Estimated Cost |
|-----------|---------------|----------------|
| 1 kWp | 6-8 m2 | Rp 15-20 million |
| 5 kWp | 30-40 m2 | Rp 75-100 million |
| 10 kWp | 60-80 m2 | Rp 150-200 million |
| 50 kWp | 300-400 m2 | Rp 750M-1B |

### ROI Solar PV:
- Payback: 5-7 years
- Lifetime: 25 years
- Degradation: 0.5%/year

---

## BESS (Battery Energy Storage):

### Use Cases:
1. Peak shaving
2. Backup power
3. Load shifting
4. Grid support

### Components:
- Lithium-ion batteries
- BMS (Battery Management System)
- Inverter/charger
- Monitoring system

---

Would you like a detailed Solar PV proposal for your facility?`;
  }
  
  // Power quality
  if (msg.includes("power quality") || msg.includes("kualitas daya") || msg.includes("harmonic") || msg.includes("power factor") || msg.includes("faktor daya") || msg.includes("distribusi")) {
    return `POWER QUALITY AND DISTRIBUTION ANALYSIS

Here is a power quality analysis:

---

## TYPICAL CONSUMPTION: ~5% of total energy

### COMMON ISSUES:
${energyCategories[6].commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

---

## IMPROVEMENT MEASURES:

${energyCategories[6].improvementMeasures.map(m => `
### ${m.measure}
- Description: ${m.description}
- Savings: ${m.savings}
- Payback: ${m.payback} years
- Complexity: ${m.complexity === 'simple' ? 'Simple' : m.complexity === 'moderate' ? 'Moderate' : 'Complex'}
`).join('')}

---

## POWER FACTOR CORRECTION:

### Target PF: greater than 0.95

### Capacitor Bank Calculation:
QC = P x (tan theta1 - tan theta2)

### Example:
- Load: 100 kW
- PF existing: 0.80
- PF target: 0.95
- QC = 100 x (0.75 - 0.33) = 42 kVAr

---

## HARMONIC MITIGATION:

### Harmonic Sources:
- VFDs
- UPS
- LED drivers
- Computers

### Solutions:
- Active filters
- Passive filters
- Isolation transformers
- Proper grounding

---

Would you like a power quality survey for your facility?`;
  }
  
  // ISO 50001 / Compliance
  if (msg.includes("iso 50001") || msg.includes("manajemen energi") || msg.includes("energy management system") || msg.includes("sni 6389") || msg.includes("ems")) {
    return `ENERGY MANAGEMENT SYSTEM IMPLEMENTATION

Here is a guide for ISO 50001 implementation:

---

## IMPLEMENTATION STEPS:

### 1. Preparation (EnMS)
- Top management commitment
- Energy policy
- EnMS team
- System scope

### 2. Planning
- Energy review
- Energy baseline
- EnPIs
- Energy action plans

### 3. Implementation
- Design and operation
- Monitoring
- Training
- Communication

### 4. Evaluation
- Measurement and monitoring
- Internal audit
- Management review

### 5. Improvement
- Nonconformity and correction
- Preventive actions
- Continual improvement

---

## REQUIRED DOCUMENTATION:

1. Energy Policy
2. Energy Review
3. Baseline Energy Performance
4. EnPIs (Energy Performance Indicators)
5. Energy Objectives and Targets
6. Energy Action Plans
7. Monitoring and Measurement Procedures
8. Internal Audit Results
9. Management Review Records

---

## ISO 50001 BENEFITS:

| Benefit | Impact |
|---------|--------|
| Energy cost reduction | 10-30% |
| Carbon footprint | 20-40% |
| Compliance | Regulatory |
| Reputation | CSR |

---

## TIMELINE:

| Phase | Duration | Activities |
|-------|----------|------------|
| Gap Analysis | 1-2 months | Initial assessment |
| Design | 2-3 months | System design |
| Implementation | 6-12 months | Deploy |
| Certification | 1-2 months | Audit |

---

Would you like ISO 50001 document templates?`;
  }
  
  // Calculation / Calculator
  if (msg.includes("calculate") || msg.includes("kalkulasi") || msg.includes("hitung") || msg.includes("roi") || msg.includes("payback") || msg.includes("rumus") || msg.includes("formula")) {
    return `ENERGY EFFICIENCY CALCULATIONS

Here are important formulas and calculations:

---

## 1. ENERGY INTENSITY

EI = Total Energy (kWh) / Area (m2)

Example:
- Total: 100,000 kWh/month
- Area: 10,000 m2
- EI = 10 kWh/m2/month

---

## 2. PAYBACK PERIOD

Payback = Initial Investment / Annual Savings

Example:
- LED Retrofit: Rp 50,000,000
- Annual Savings: Rp 20,000,000
- Payback = 2.5 years

---

## 3. ROI (Return on Investment)

ROI = (Annual Savings - Annual Cost) / Initial Investment x 100%

Example:
- Investment: Rp 100,000,000
- Annual Savings: Rp 30,000,000
- Annual OandM: Rp 5,000,000
- ROI = (30-5)/100 x 100% = 25%

---

## 4. LIFE CYCLE COST

LCC = Initial + (Annual OandM x n) + (Replacement x n/period) - Salvage

Example (10 years):
- Initial: Rp 100,000,000
- OandM: Rp 10,000,000/year x 10 = Rp 100,000,000
- LCC = Rp 200,000,000

---

## 5. CO2 REDUCTION

CO2 = Energy Saved (kWh) x Emission Factor

Emission Factor (PLN):
- Grid: 0.7 kg CO2/kWh

Example:
- Saved: 50,000 kWh/year
- CO2 = 50,000 x 0.7 = 35,000 kg = 35 tons/year

---

## CONVERSION FACTORS:

| From | To | Factor |
|------|-----|--------|
| kWh | BTU | 3,412 |
| kWh | Joules | 3.6 MJ |
| HP | kW | 0.746 |
| Ton AC | kW | 3.517 |

---

Would you like specific calculations for your project?`;
  }
  
  // Default response - show summary
  return `ENERGY EFFICIENCY ANALYSIS SUMMARY

This document covers:

| Category | Typical Consumption | Improvement Measures |
|----------|-------------------|---------------------|
| ${energyCategories[0].name} | ~15% | ${energyCategories[0].improvementMeasures.length} options |
| ${energyCategories[1].name} | ~30% | ${energyCategories[1].improvementMeasures.length} options |
| ${energyCategories[2].name} | ~25% | ${energyCategories[2].improvementMeasures.length} options |
| ${energyCategories[3].name} | ~35% | ${energyCategories[3].improvementMeasures.length} options |
| ${energyCategories[4].name} | ~10% | ${energyCategories[4].improvementMeasures.length} options |
| ${energyCategories[5].name} | Variable | ${energyCategories[5].improvementMeasures.length} options |
| ${energyCategories[6].name} | ~5% | ${energyCategories[6].improvementMeasures.length} options |

---

References:
- Turner and Doty (2012) - Energy Management Handbook
- Wilson (2019) - Energy Efficiency: Principles and Practices
- Turner and Turner (2017) - Industrial Energy Management

---

Please ask specific questions:
- "Lighting Analysis" - Lighting efficiency
- "HVAC Audit" - AC and ventilation
- "Motor and VFD" - Motor optimization
- "Solar PV" - Rooftop PLTS
- "ISO 50001" - Energy management
- "ROI Calculation" - Calculate savings
- "Power Quality" - Power quality`;
}

export default getEnergyEfficiencyResponse;
