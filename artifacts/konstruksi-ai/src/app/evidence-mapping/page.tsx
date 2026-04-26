"use client";

import { useState, useMemo } from "react";
import {
  processDocument,
  mapEvidenceToRequirements,
  analyzeEvidenceCompliance,
  validateEvidenceMapping,
  type DocumentMetadata,
  type EvidenceMapping,
  type EvidenceMappingResult,
  getDocumentStatusColor,
  getValidationStatusColor
} from "@/lib/evidence-mapping";
import NavbarAuth from "@/components/NavbarAuth";

const TABS = [
  { id: "upload", label: "📤 Upload Documents", icon: "📤" },
  { id: "documents", label: "📄 Document Library", icon: "📄" },
  { id: "mappings", label: "🔗 Evidence Mappings", icon: "🔗" },
  { id: "compliance", label: "✅ Compliance Analysis", icon: "✅" }
];

// Mock requirements for demonstration
const MOCK_REQUIREMENTS = [
  {
    id: 'sbu-admin-1',
    type: 'sbu',
    text: 'Akta Pendirian Perusahaan yang masih berlaku',
    requiredEvidence: ['Akta Pendirian', 'SK Menkumham']
  },
  {
    id: 'sbu-admin-2',
    type: 'sbu',
    text: 'NPWP Perusahaan aktif',
    requiredEvidence: ['NPWP']
  },
  {
    id: 'skk-edu-1',
    type: 'skk',
    text: 'Ijazah pendidikan sesuai jabatan',
    requiredEvidence: ['Ijazah', 'Transkrip Nilai']
  },
  {
    id: 'skk-cert-1',
    type: 'skk',
    text: 'Sertifikat kompetensi kerja',
    requiredEvidence: ['SKK', 'Sertifikat Kompetensi']
  }
];

export default function EvidenceMappingPage() {
  const [currentTab, setCurrentTab] = useState("upload");
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [mappings, setMappings] = useState<EvidenceMapping[]>([]);
  const [selectedEntity, setSelectedEntity] = useState({
    id: "entity-001",
    type: "business_entity" as const,
    name: "PT Konstruksi Maju Jaya"
  });
  const [requirementType, setRequirementType] = useState("sbu");
  const [complianceResult, setComplianceResult] = useState<EvidenceMappingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setIsProcessing(true);
    const newDocuments: DocumentMetadata[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const processedDoc = await processDocument(files[i]);
        newDocuments.push(processedDoc);
      } catch (error) {
        console.error(`Error processing ${files[i].name}:`, error);
      }
    }

    setDocuments(prev => [...prev, ...newDocuments]);
    setIsProcessing(false);
  };

  const handleAutoMapping = () => {
    const requirements = MOCK_REQUIREMENTS.filter(req => req.type === requirementType);
    const newMappings = mapEvidenceToRequirements(
      documents.filter(doc => doc.status === 'processed'),
      requirements,
      selectedEntity.id,
      selectedEntity.type
    );

    setMappings(prev => [...prev, ...newMappings]);
  };

  const handleValidateMapping = (mappingId: string, status: 'valid' | 'invalid' | 'partial', notes: string) => {
    setMappings(prev => prev.map(mapping => {
      if (mapping.id === mappingId) {
        return validateEvidenceMapping(
          mapping,
          'reviewer-001',
          'Reviewer Name',
          status,
          notes
        );
      }
      return mapping;
    }));
  };

  const handleComplianceAnalysis = () => {
    const requirements = MOCK_REQUIREMENTS.filter(req => req.type === requirementType);
    const result = analyzeEvidenceCompliance(
      selectedEntity.id,
      selectedEntity.type,
      requirementType,
      mappings,
      requirements
    );

    setComplianceResult(result);
    setCurrentTab("compliance");
  };

  const renderUploadTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Documents</h3>
        <p className="text-slate-400 text-sm mb-6">
          Upload dokumen pendukung untuk mapping eviden otomatis. Sistem akan mengekstrak teks dan mencocokkan dengan persyaratan.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Pilih File
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              disabled={isProcessing}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none disabled:opacity-50"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            <p className="text-slate-500 text-xs mt-1">
              Format: PDF, DOCX, JPG, PNG, TXT. Maksimal 10MB per file.
            </p>
          </div>

          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <span className="text-blue-400">Memproses dokumen...</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Entity & Requirement Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Entity Type
            </label>
            <select
              value={selectedEntity.type}
              onChange={(e) => setSelectedEntity(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="business_entity">Badan Usaha</option>
              <option value="personnel">Personel</option>
              <option value="tender">Tender</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Requirement Type
            </label>
            <select
              value={requirementType}
              onChange={(e) => setRequirementType(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="sbu">SBU (Sertifikat Badan Usaha)</option>
              <option value="skk">SKK (Sertifikat Keahlian Kerja)</option>
              <option value="legal">Legal & Licensing</option>
              <option value="certification">Certification</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Entity ID/Name
            </label>
            <input
              type="text"
              value={selectedEntity.name}
              onChange={(e) => setSelectedEntity(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Nama entity yang akan dianalisis"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAutoMapping}
          disabled={documents.length === 0}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Auto-Map Evidence
        </button>

        <button
          onClick={handleComplianceAnalysis}
          disabled={mappings.length === 0}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Compliance
        </button>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Document Library</h3>
        <p className="text-slate-400 text-sm mb-6">
          Library dokumen yang telah diupload dan diproses. Total: {documents.length} dokumen
        </p>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-slate-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-slate-100 font-medium">{doc.originalName}</h4>
                  <p className="text-slate-400 text-sm">
                    {doc.mimeType} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-slate-500 text-xs">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                  {doc.status.toUpperCase()}
                </span>
              </div>

              {doc.extractedText && (
                <div className="mt-3">
                  <h5 className="text-slate-300 text-sm font-medium mb-2">Extracted Text Preview:</h5>
                  <div className="bg-slate-700/50 p-3 rounded text-slate-300 text-sm max-h-32 overflow-y-auto">
                    {doc.extractedText.substring(0, 300)}...
                  </div>
                </div>
              )}

              {doc.processingError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <p className="text-red-400 text-sm">Error: {doc.processingError}</p>
                </div>
              )}
            </div>
          ))}

          {documents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Belum ada dokumen yang diupload</p>
              <button
                onClick={() => setCurrentTab("upload")}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Upload Dokumen Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMappingsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Evidence Mappings</h3>
        <p className="text-slate-400 text-sm mb-6">
          Mapping otomatis antara dokumen dan persyaratan. Total: {mappings.length} mappings
        </p>

        <div className="space-y-4">
          {mappings.map((mapping) => {
            const document = documents.find(doc => doc.id === mapping.documentId);
            const requirement = MOCK_REQUIREMENTS.find(req => req.id === mapping.requirementId);

            return (
              <div key={mapping.id} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-slate-100 font-medium">
                      {requirement?.text || mapping.requirementId}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Dokumen: {document?.originalName || mapping.documentId}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Confidence: {mapping.mappingConfidence}% • Mapped: {new Date(mapping.mappedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValidationStatusColor(mapping.validationStatus)}`}>
                      {mapping.validationStatus.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleValidateMapping(mapping.id, 'valid', 'Validated by reviewer')}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                      >
                        ✓ Valid
                      </button>
                      <button
                        onClick={() => handleValidateMapping(mapping.id, 'partial', 'Needs manual review')}
                        className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded"
                      >
                        ? Review
                      </button>
                      <button
                        onClick={() => handleValidateMapping(mapping.id, 'invalid', 'Evidence does not match requirement')}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                      >
                        ✗ Invalid
                      </button>
                    </div>
                  </div>
                </div>

                {mapping.extractedEvidence.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-slate-300 text-sm font-medium mb-2">Extracted Evidence:</h5>
                    <div className="space-y-2">
                      {mapping.extractedEvidence.map((evidence, index) => (
                        <div key={index} className="bg-slate-700/50 p-3 rounded text-slate-300 text-sm">
                          {evidence}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mapping.validationNotes && (
                  <div className="p-3 bg-slate-700/50 rounded">
                    <p className="text-slate-300 text-sm">{mapping.validationNotes}</p>
                  </div>
                )}
              </div>
            );
          })}

          {mappings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Belum ada evidence mappings</p>
              <button
                onClick={() => setCurrentTab("upload")}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Buat Mapping Otomatis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderComplianceTab = () => {
    if (!complianceResult) return null;

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Compliance Analysis Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {complianceResult.complianceScore}%
              </div>
              <div className="text-slate-400 text-sm">Compliance Score</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {complianceResult.evidenceCompleteness}%
              </div>
              <div className="text-slate-400 text-sm">Evidence Completeness</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {complianceResult.mappings.length}
              </div>
              <div className="text-slate-400 text-sm">Total Mappings</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {complianceResult.gaps.length}
              </div>
              <div className="text-slate-400 text-sm">Evidence Gaps</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-slate-100 font-medium mb-3">Requirements Summary:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{complianceResult.totalRequirements}</div>
                <div className="text-slate-400 text-sm">Total Requirements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{complianceResult.mappedRequirements}</div>
                <div className="text-slate-400 text-sm">Mapped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{complianceResult.validatedRequirements}</div>
                <div className="text-slate-400 text-sm">Validated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{complianceResult.auditSummary.requiresReview}</div>
                <div className="text-slate-400 text-sm">Needs Review</div>
              </div>
            </div>
          </div>
        </div>

        {complianceResult.gaps.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Evidence Gaps</h3>
            <div className="space-y-4">
              {complianceResult.gaps.map((gap) => (
                <div key={gap.requirementId} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-slate-100 font-medium">{gap.requirementText}</h4>
                      <p className="text-slate-400 text-sm">
                        Priority: {gap.priority.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300 text-sm">
                        Est. Cost: Rp {(gap.estimatedCost / 1000000).toFixed(0)}M
                      </div>
                      <div className="text-slate-400 text-xs">
                        Est. Time: {gap.estimatedTime} days
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 text-sm">Missing Evidence:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {gap.missingEvidence.map((evidence, index) => (
                          <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-sm">Suggested Documents:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {gap.suggestedDocuments.map((doc, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Recommendations</h3>
          <div className="space-y-2">
            {complianceResult.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">💡</span>
                <span className="text-slate-300">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <NavbarAuth />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">🔗 Evidence Mapping</h1>
          <p className="text-slate-400">Centralized document management dan mapping eviden otomatis</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {currentTab === "upload" && renderUploadTab()}
        {currentTab === "documents" && renderDocumentsTab()}
        {currentTab === "mappings" && renderMappingsTab()}
        {currentTab === "compliance" && renderComplianceTab()}
      </div>
    </div>
  );
}