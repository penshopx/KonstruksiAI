"use client";

import { useState, useMemo } from "react";
import {
  analyzeWorkforceAssignment,
  type ProjectPosition,
  type PersonnelProfile,
  type WorkforceAssignmentResult,
  type AssignmentMatch
} from "@/lib/workforce-assignment";
import NavbarAuth from "@/components/NavbarAuth";

const STEPS = [
  { id: "project", label: "📋 Setup Proyek", icon: "📋" },
  { id: "positions", label: "👥 Kebutuhan Posisi", icon: "👥" },
  { id: "personnel", label: "👷 Database Personel", icon: "👷" },
  { id: "analysis", label: "📊 Analisis Matching", icon: "📊" },
  { id: "results", label: "✅ Rekomendasi Assignment", icon: "✅" }
];

// Mock personnel data for demonstration
const MOCK_PERSONNEL: PersonnelProfile[] = [
  {
    id: "P-001",
    name: "Ahmad Sutanto",
    currentPosition: "Pengawas Lapangan",
    skills: [
      { skillName: "Project Management", proficiencyLevel: "advanced", yearsOfExperience: 8, lastUsedDate: "2024-01-15", verified: true },
      { skillName: "Construction Supervision", proficiencyLevel: "expert", yearsOfExperience: 10, lastUsedDate: "2024-01-15", verified: true }
    ],
    certifications: [
      { certificationType: "SKK", certificationLevel: "Pengawas Lapangan", issuedDate: "2022-01-01", expiryDate: "2027-01-01", issuingAuthority: "LPJK", verificationStatus: "verified" },
      { certificationType: "K3", certificationLevel: "Umum", issuedDate: "2023-01-01", expiryDate: "2026-01-01", issuingAuthority: "Kemnaker", verificationStatus: "verified" }
    ],
    experience: [
      { domain: "Construction", yearsOfExperience: 12, projectCount: 15, projectTypes: ["Building", "Infrastructure"], lastProjectDate: "2024-01-15", keyAchievements: ["On-time delivery", "Quality compliance"] }
    ],
    availability: {
      status: "available",
      availableFrom: "2024-02-01",
      maxConcurrentProjects: 2,
      currentCommitments: []
    },
    location: "Jakarta",
    workPreferences: {
      workType: "onsite",
      maxWorkHoursPerWeek: 50,
      noticePeriodDays: 30,
      willingToRelocate: true
    },
    performanceRating: 4.5,
    skkReadinessScore: 85
  },
  {
    id: "P-002",
    name: "Budi Santoso",
    currentPosition: "Kepala Proyek",
    skills: [
      { skillName: "Project Management", proficiencyLevel: "expert", yearsOfExperience: 15, lastUsedDate: "2024-01-10", verified: true },
      { skillName: "Contract Management", proficiencyLevel: "advanced", yearsOfExperience: 12, lastUsedDate: "2024-01-10", verified: true }
    ],
    certifications: [
      { certificationType: "SKK", certificationLevel: "Kepala Proyek", issuedDate: "2021-01-01", expiryDate: "2026-01-01", issuingAuthority: "LPJK", verificationStatus: "verified" },
      { certificationType: "SBU", certificationLevel: "Besar", issuedDate: "2022-01-01", expiryDate: "2025-01-01", issuingAuthority: "LPJK", verificationStatus: "verified" }
    ],
    experience: [
      { domain: "Construction", yearsOfExperience: 18, projectCount: 25, projectTypes: ["Building", "Infrastructure", "Energy"], lastProjectDate: "2024-01-10", keyAchievements: ["Budget control", "Team leadership"] }
    ],
    availability: {
      status: "partially_available",
      availableFrom: "2024-03-01",
      maxConcurrentProjects: 1,
      currentCommitments: [
        { projectId: "PROJ-001", projectName: "Current Project", role: "Kepala Proyek", commitmentPercentage: 80, endDate: "2024-06-30" }
      ]
    },
    location: "Bandung",
    workPreferences: {
      workType: "hybrid",
      maxWorkHoursPerWeek: 45,
      noticePeriodDays: 45,
      willingToRelocate: false
    },
    performanceRating: 4.8,
    skkReadinessScore: 92
  },
  {
    id: "P-003",
    name: "Citra Dewi",
    currentPosition: "Tenaga Ahli Elektrikal",
    skills: [
      { skillName: "Electrical Design", proficiencyLevel: "expert", yearsOfExperience: 10, lastUsedDate: "2024-01-05", verified: true },
      { skillName: "Power Systems", proficiencyLevel: "advanced", yearsOfExperience: 8, lastUsedDate: "2024-01-05", verified: true }
    ],
    certifications: [
      { certificationType: "SKK", certificationLevel: "Tenaga Ahli Elektrikal", issuedDate: "2023-01-01", expiryDate: "2028-01-01", issuingAuthority: "LPJK", verificationStatus: "verified" },
      { certificationType: "Electrical Safety", certificationLevel: "Expert", issuedDate: "2023-01-01", expiryDate: "2026-01-01", issuingAuthority: "PLN", verificationStatus: "verified" }
    ],
    experience: [
      { domain: "Electrical Engineering", yearsOfExperience: 12, projectCount: 20, projectTypes: ["Power Distribution", "Substation", "Renewable Energy"], lastProjectDate: "2024-01-05", keyAchievements: ["System reliability", "Safety compliance"] }
    ],
    availability: {
      status: "available",
      availableFrom: "2024-02-15",
      maxConcurrentProjects: 2,
      currentCommitments: []
    },
    location: "Surabaya",
    workPreferences: {
      workType: "onsite",
      maxWorkHoursPerWeek: 48,
      noticePeriodDays: 30,
      willingToRelocate: true
    },
    performanceRating: 4.6,
    skkReadinessScore: 88
  }
];

const SKILL_OPTIONS = [
  "Project Management", "Construction Supervision", "Contract Management",
  "Electrical Design", "Power Systems", "Civil Engineering", "Structural Analysis",
  "Quality Control", "Safety Management", "Cost Control", "Risk Management"
];

const CERTIFICATION_TYPES = [
  "SKK", "K3", "SBU", "Electrical Safety", "Mechanical Engineering",
  "Civil Engineering", "Quality Management", "Environmental Management"
];

export default function WorkforceAssignmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState({
    id: "PROJ-001",
    name: "Pembangunan Gardu Induk 150 kV",
    sector: "ketenagalistrikan",
    location: "Jawa Barat",
    startDate: "2024-06-01",
    endDate: "2025-06-01"
  });
  const [positions, setPositions] = useState<ProjectPosition[]>([
    {
      id: "POS-001",
      projectId: "PROJ-001",
      positionName: "Kepala Proyek",
      positionCode: "03.01.01",
      requiredCount: 1,
      skillRequirements: [
        { skillName: "Project Management", proficiencyLevel: "expert", mandatory: true, yearsRequired: 10 }
      ],
      certificationRequirements: [
        { certificationType: "SKK", certificationLevel: "Kepala Proyek", mandatory: true, expiryBuffer: 6 }
      ],
      experienceRequirements: [
        { domain: "Construction", yearsRequired: 8, projectTypes: ["Infrastructure", "Energy"], mandatory: true }
      ],
      availabilityRequirements: [
        { availabilityType: "full_time", workHoursPerWeek: 45, noticePeriodDays: 30, locationPreference: ["Jawa Barat"] }
      ],
      priority: "high",
      startDate: "2024-06-01",
      endDate: "2025-06-01",
      location: "Jawa Barat",
      workType: "onsite"
    }
  ]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>(["P-001", "P-002", "P-003"]);
  const [assignmentResult, setAssignmentResult] = useState<WorkforceAssignmentResult | null>(null);

  const availablePersonnel = useMemo(() =>
    MOCK_PERSONNEL.filter(p => selectedPersonnel.includes(p.id)),
    [selectedPersonnel]
  );

  const handleRunAnalysis = () => {
    const result = analyzeWorkforceAssignment(
      project.id,
      project.name,
      positions,
      availablePersonnel
    );
    setAssignmentResult(result);
    setCurrentStep(STEPS.length - 1);
  };

  const updatePosition = (index: number, field: string, value: any) => {
    setPositions(prev => prev.map((pos, i) =>
      i === index ? { ...pos, [field]: value } : pos
    ));
  };

  const updatePositionSkills = (index: number, skills: any[]) => {
    setPositions(prev => prev.map((pos, i) =>
      i === index ? { ...pos, skillRequirements: skills } : pos
    ));
  };

  const updatePositionCertifications = (index: number, certifications: any[]) => {
    setPositions(prev => prev.map((pos, i) =>
      i === index ? { ...pos, certificationRequirements: certifications } : pos
    ));
  };

  const addPosition = () => {
    const newPosition: ProjectPosition = {
      id: `POS-${positions.length + 1}`,
      projectId: project.id,
      positionName: "",
      positionCode: "",
      requiredCount: 1,
      skillRequirements: [],
      certificationRequirements: [],
      experienceRequirements: [],
      availabilityRequirements: [{
        availabilityType: "full_time",
        workHoursPerWeek: 40,
        noticePeriodDays: 30,
        locationPreference: [project.location]
      }],
      priority: "medium",
      startDate: project.startDate,
      endDate: project.endDate,
      location: project.location,
      workType: "onsite"
    };
    setPositions(prev => [...prev, newPosition]);
  };

  const removePosition = (index: number) => {
    setPositions(prev => prev.filter((_, i) => i !== index));
  };

  const renderProjectStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Informasi Proyek</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nama Proyek *
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sektor
            </label>
            <select
              value={project.sector}
              onChange={(e) => setProject(prev => ({ ...prev, sector: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="konstruksi">Konstruksi</option>
              <option value="ketenagalistrikan">Ketenagalistrikan</option>
              <option value="minyak_gas">Minyak & Gas</option>
              <option value="pertambangan">Pertambangan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Lokasi
            </label>
            <input
              type="text"
              value={project.location}
              onChange={(e) => setProject(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={project.startDate}
              onChange={(e) => setProject(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={project.endDate}
              onChange={(e) => setProject(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPositionsStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Kebutuhan Posisi</h3>
          <button
            onClick={addPosition}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
          >
            + Tambah Posisi
          </button>
        </div>

        <div className="space-y-6">
          {positions.map((position, index) => (
            <div key={position.id} className="border border-slate-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nama Posisi *
                    </label>
                    <input
                      type="text"
                      value={position.positionName}
                      onChange={(e) => updatePosition(index, 'positionName', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                      placeholder="Kepala Proyek, Pengawas Lapangan, dll"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Kode SKK
                    </label>
                    <input
                      type="text"
                      value={position.positionCode}
                      onChange={(e) => updatePosition(index, 'positionCode', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                      placeholder="03.01.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Jumlah Dibutuhkan
                    </label>
                    <input
                      type="number"
                      value={position.requiredCount}
                      onChange={(e) => updatePosition(index, 'requiredCount', Number(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Prioritas
                    </label>
                    <select
                      value={position.priority}
                      onChange={(e) => updatePosition(index, 'priority', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="low">Rendah</option>
                      <option value="medium">Sedang</option>
                      <option value="high">Tinggi</option>
                    </select>
                  </div>
                </div>

                {positions.length > 1 && (
                  <button
                    onClick={() => removePosition(index)}
                    className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Skills Requirements */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kebutuhan Kompetensi
                </label>
                <div className="space-y-2">
                  {position.skillRequirements.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <select
                        value={skill.skillName}
                        onChange={(e) => {
                          const newSkills = [...position.skillRequirements];
                          newSkills[skillIndex] = { ...skill, skillName: e.target.value };
                          updatePositionSkills(index, newSkills);
                        }}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
                      >
                        {SKILL_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <select
                        value={skill.proficiencyLevel}
                        onChange={(e) => {
                          const newSkills = [...position.skillRequirements];
                          newSkills[skillIndex] = { ...skill, proficiencyLevel: e.target.value as any };
                          updatePositionSkills(index, newSkills);
                        }}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                      <input
                        type="number"
                        value={skill.yearsRequired}
                        onChange={(e) => {
                          const newSkills = [...position.skillRequirements];
                          newSkills[skillIndex] = { ...skill, yearsRequired: Number(e.target.value) };
                          updatePositionSkills(index, newSkills);
                        }}
                        className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
                        placeholder="Years"
                      />
                      <button
                        onClick={() => {
                          const newSkills = position.skillRequirements.filter((_, i) => i !== skillIndex);
                          updatePositionSkills(index, newSkills);
                        }}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newSkills = [...position.skillRequirements, {
                        skillName: SKILL_OPTIONS[0],
                        proficiencyLevel: 'intermediate' as const,
                        mandatory: true,
                        yearsRequired: 3
                      }];
                      updatePositionSkills(index, newSkills);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    + Tambah Skill
                  </button>
                </div>
              </div>

              {/* Certification Requirements */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kebutuhan Sertifikasi
                </label>
                <div className="space-y-2">
                  {position.certificationRequirements.map((cert, certIndex) => (
                    <div key={certIndex} className="flex items-center gap-2">
                      <select
                        value={cert.certificationType}
                        onChange={(e) => {
                          const newCerts = [...position.certificationRequirements];
                          newCerts[certIndex] = { ...cert, certificationType: e.target.value };
                          updatePositionCertifications(index, newCerts);
                        }}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
                      >
                        {CERTIFICATION_TYPES.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={cert.certificationLevel}
                        onChange={(e) => {
                          const newCerts = [...position.certificationRequirements];
                          newCerts[certIndex] = { ...cert, certificationLevel: e.target.value };
                          updatePositionCertifications(index, newCerts);
                        }}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
                        placeholder="Level"
                      />
                      <input
                        type="number"
                        value={cert.expiryBuffer}
                        onChange={(e) => {
                          const newCerts = [...position.certificationRequirements];
                          newCerts[certIndex] = { ...cert, expiryBuffer: Number(e.target.value) };
                          updatePositionCertifications(index, newCerts);
                        }}
                        className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 text-sm"
                        placeholder="Buffer (months)"
                      />
                      <button
                        onClick={() => {
                          const newCerts = position.certificationRequirements.filter((_, i) => i !== certIndex);
                          updatePositionCertifications(index, newCerts);
                        }}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newCerts = [...position.certificationRequirements, {
                        certificationType: CERTIFICATION_TYPES[0],
                        certificationLevel: 'Umum',
                        mandatory: true,
                        expiryBuffer: 6
                      }];
                      updatePositionCertifications(index, newCerts);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    + Tambah Sertifikasi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPersonnelStep = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Database Personel</h3>
        <p className="text-slate-400 text-sm mb-6">
          Pilih personel yang tersedia untuk assignment matching. Sistem akan mencocokkan berdasarkan kompetensi, sertifikasi, pengalaman, dan availability.
        </p>

        <div className="space-y-4">
          {MOCK_PERSONNEL.map((personnel) => (
            <div key={personnel.id} className="border border-slate-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-slate-100 font-medium">{personnel.name}</h4>
                  <p className="text-slate-400 text-sm">{personnel.currentPosition}</p>
                  <p className="text-slate-500 text-xs">{personnel.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    personnel.availability.status === 'available' ? 'bg-green-500/20 text-green-400' :
                    personnel.availability.status === 'partially_available' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {personnel.availability.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedPersonnel.includes(personnel.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPersonnel(prev => [...prev, personnel.id]);
                      } else {
                        setSelectedPersonnel(prev => prev.filter(id => id !== personnel.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">SKK Score:</span>
                  <span className="text-slate-100 ml-2">{personnel.skkReadinessScore}%</span>
                </div>
                <div>
                  <span className="text-slate-400">Performance:</span>
                  <span className="text-slate-100 ml-2">{personnel.performanceRating}/5</span>
                </div>
                <div>
                  <span className="text-slate-400">Sertifikasi:</span>
                  <span className="text-slate-100 ml-2">{personnel.certifications.length} aktif</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-slate-400 text-sm">Top Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {personnel.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {skill.skillName} ({skill.proficiencyLevel})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <h4 className="text-slate-100 font-medium mb-2">Ringkasan Seleksi:</h4>
          <p className="text-slate-300 text-sm">
            {selectedPersonnel.length} personel dipilih dari {MOCK_PERSONNEL.length} tersedia
          </p>
        </div>
      </div>
    </div>
  );

  const renderAnalysisStep = () => {
    if (!assignmentResult) return null;

    const statusConfig = {
      eligible: { label: "Ready", color: "bg-green-500/20 text-green-400 border-green-500/40" },
      conditionally_eligible: { label: "Conditional", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
      not_eligible: { label: "Not Ready", color: "bg-red-500/20 text-red-400 border-red-500/40" }
    };

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Hasil Analisis Workforce Assignment</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                assignmentResult.overallAssignmentScore >= 80 ? 'text-green-400' :
                assignmentResult.overallAssignmentScore >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {assignmentResult.overallAssignmentScore}%
              </div>
              <div className="text-slate-400 text-sm">Assignment Score</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {assignmentResult.summary.filledPositions}
              </div>
              <div className="text-slate-400 text-sm">Posisi Terisi</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {assignmentResult.summary.unfilledPositions}
              </div>
              <div className="text-slate-400 text-sm">Posisi Kosong</div>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                assignmentResult.riskAssessment.overallRisk === 'low' ? 'text-green-400' :
                assignmentResult.riskAssessment.overallRisk === 'medium' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {assignmentResult.riskAssessment.overallRisk.toUpperCase()}
              </div>
              <div className="text-slate-400 text-sm">Risk Level</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-slate-100 font-medium mb-3">Summary:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{assignmentResult.summary.totalPositions}</div>
                <div className="text-slate-400 text-sm">Total Positions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{assignmentResult.summary.filledPositions}</div>
                <div className="text-slate-400 text-sm">Filled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{assignmentResult.summary.partiallyFilledPositions}</div>
                <div className="text-slate-400 text-sm">Partial</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{assignmentResult.summary.unfilledPositions}</div>
                <div className="text-slate-400 text-sm">Unfilled</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Risk Assessment</h3>
          <div className="space-y-3">
            {assignmentResult.riskAssessment.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-slate-600 rounded-lg">
                <span className="text-red-400 mt-1">⚠️</span>
                <span className="text-slate-300">{risk}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="text-slate-100 font-medium mb-2">Mitigation Strategies:</h4>
            <ul className="text-green-400 text-sm space-y-1">
              {assignmentResult.riskAssessment.mitigationStrategies.map((strategy, index) => (
                <li key={index}>• {strategy}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsStep = () => {
    if (!assignmentResult) return null;

    return (
      <div className="space-y-6">
        {assignmentResult.positionRecommendations.map((rec) => (
          <div key={rec.positionId} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{rec.positionName}</h3>
                <p className="text-slate-400 text-sm">Dibutuhkan: {rec.requiredCount} orang</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{rec.bestMatches.length}</div>
                <div className="text-slate-400 text-sm">Best Matches</div>
              </div>
            </div>

            {/* Best Matches */}
            <div className="mb-6">
              <h4 className="text-slate-100 font-medium mb-3">Rekomendasi Utama:</h4>
              <div className="space-y-3">
                {rec.bestMatches.slice(0, rec.requiredCount).map((match: AssignmentMatch) => (
                  <div key={match.personnelId} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="text-slate-100 font-medium">{match.personnelName}</h5>
                        <p className="text-slate-400 text-sm">Match Score: {match.matchScore}% ({match.compatibilityLevel})</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        match.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                        match.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {match.riskLevel.toUpperCase()} Risk
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-400">Skills:</span>
                        <span className="text-slate-100 ml-2">{match.matchBreakdown.skills}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Certifications:</span>
                        <span className="text-slate-100 ml-2">{match.matchBreakdown.certifications}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Experience:</span>
                        <span className="text-slate-100 ml-2">{match.matchBreakdown.experience}%</span>
                      </div>
                    </div>

                    {match.strengths.length > 0 && (
                      <div className="mb-2">
                        <span className="text-slate-400 text-sm">Strengths:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.strengths.map((strength: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {match.gaps.length > 0 && (
                      <div className="mb-2">
                        <span className="text-slate-400 text-sm">Gaps:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.gaps.map((gap: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                              {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Analysis */}
            {(rec.gapAnalysis.skillGaps.length > 0 ||
              rec.gapAnalysis.certificationGaps.length > 0 ||
              rec.gapAnalysis.experienceGaps.length > 0) && (
              <div className="mb-6">
                <h4 className="text-slate-100 font-medium mb-3">Gap Analysis:</h4>
                <div className="space-y-2">
                  {rec.gapAnalysis.skillGaps.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-sm">Skill Gaps:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.gapAnalysis.skillGaps.map((gap: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {rec.gapAnalysis.certificationGaps.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-sm">Certification Gaps:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.gapAnalysis.certificationGaps.map((gap: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Recommendations */}
            <div>
              <h4 className="text-slate-100 font-medium mb-3">Rekomendasi Tindakan:</h4>
              <div className="space-y-2">
                {rec.recommendations.trainingRecommendations.map((rec, index) => (
                  <div key={`training-${index}`} className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">📚</span>
                    <span className="text-slate-300 text-sm">{rec}</span>
                  </div>
                ))}
                {rec.recommendations.hiringRecommendations.map((rec, index) => (
                  <div key={`hiring-${index}`} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">👥</span>
                    <span className="text-slate-300 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Overall Actions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Action Timeline</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-slate-100 font-medium mb-2">Immediate Actions (1-7 days):</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                {assignmentResult.timeline.immediateActions.map((action, index) => (
                  <li key={index}>• {action}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-slate-100 font-medium mb-2">Short-term Actions (1-4 weeks):</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                {assignmentResult.timeline.shortTermActions.map((action, index) => (
                  <li key={index}>• {action}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-slate-100 font-medium mb-2">Long-term Actions (1-6 months):</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                {assignmentResult.timeline.longTermActions.map((action, index) => (
                  <li key={index}>• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return project.name && project.sector && project.location;
      case 1: return positions.every(p => p.positionName && p.requiredCount > 0);
      case 2: return selectedPersonnel.length > 0;
      case 3: return true; // Analysis can always run
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">👷 Workforce Assignment</h1>
          <p className="text-slate-400">Matching personel dengan kebutuhan proyek berdasarkan kompetensi dan availability</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-600 text-slate-400'
              }`}>
                {step.icon}
              </div>
              <span className={`ml-2 text-sm ${
                index <= currentStep ? 'text-slate-100' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700 pb-4">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === index
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 0 && renderProjectStep()}
        {currentStep === 1 && renderPositionsStep()}
        {currentStep === 2 && renderPersonnelStep()}
        {currentStep === 3 && renderAnalysisStep()}
        {currentStep === 4 && renderResultsStep()}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep === STEPS.length - 2 && (
              <button
                onClick={handleRunAnalysis}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Run Assignment Analysis
              </button>
            )}

            {currentStep < STEPS.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}

            {currentStep === STEPS.length - 1 && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                New Assignment Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}