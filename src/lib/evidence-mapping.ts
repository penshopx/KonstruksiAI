/**
 * Evidence Mapping Library
 * Comprehensive document-to-requirement mapping and compliance validation
 * Supports automated evidence extraction, validation, and audit trails
 */

export interface DocumentMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  checksum: string;
  extractedText?: string;
  ocrText?: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  processingError?: string;
}

export interface EvidenceMapping {
  id: string;
  documentId: string;
  requirementId: string;
  requirementType: 'sbu' | 'skk' | 'legal' | 'tender' | 'certification';
  entityType: 'business_entity' | 'personnel' | 'tender';
  entityId: string;
  mappingConfidence: number; // 0-100
  extractedEvidence: string[];
  validationStatus: 'pending' | 'valid' | 'invalid' | 'partial' | 'requires_review';
  validationNotes: string;
  mappedBy: string;
  mappedAt: string;
  lastReviewedBy?: string;
  lastReviewedAt?: string;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: 'created' | 'updated' | 'validated' | 'rejected' | 'reviewed';
  userId: string;
  userName: string;
  previousValue?: any;
  newValue?: any;
  notes: string;
}

export interface RequirementEvidence {
  requirementId: string;
  requirementType: string;
  requirementText: string;
  requiredEvidence: string[];
  availableEvidence: EvidenceMapping[];
  complianceStatus: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
  gapAnalysis: {
    missingEvidence: string[];
    partialEvidence: string[];
    validEvidence: string[];
    recommendations: string[];
  };
  lastUpdated: string;
}

export interface EvidenceMappingResult {
  entityId: string;
  entityType: string;
  requirementType: string;
  totalRequirements: number;
  mappedRequirements: number;
  validatedRequirements: number;
  complianceScore: number;
  evidenceCompleteness: number;
  mappings: EvidenceMapping[];
  gaps: EvidenceGap[];
  recommendations: string[];
  auditSummary: {
    totalMappings: number;
    pendingValidations: number;
    requiresReview: number;
    lastAuditDate: string;
  };
}

export interface EvidenceGap {
  requirementId: string;
  requirementText: string;
  missingEvidence: string[];
  suggestedDocuments: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  estimatedTime: number;
}

// Document processing functions
export async function processDocument(file: File): Promise<DocumentMetadata> {
  const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate checksum
  const checksum = await calculateFileChecksum(file);

  const metadata: DocumentMetadata = {
    id: documentId,
    filename: `${documentId}.${file.name.split('.').pop()}`,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'system', // In real implementation, get from auth context
    checksum,
    status: 'uploaded'
  };

  // Extract text based on file type
  try {
    metadata.status = 'processing';

    if (file.type === 'application/pdf') {
      metadata.extractedText = await extractTextFromPDF(file);
    } else if (file.type.includes('word') || file.type.includes('document')) {
      metadata.extractedText = await extractTextFromDOCX(file);
    } else if (file.type.startsWith('image/')) {
      metadata.ocrText = await extractTextFromImage(file);
    } else if (file.type === 'text/plain') {
      metadata.extractedText = await file.text();
    }

    metadata.status = 'processed';
  } catch (error) {
    metadata.status = 'failed';
    metadata.processingError = error instanceof Error ? error.message : 'Unknown error';
  }

  return metadata;
}

// Mock text extraction functions (in real implementation, use actual libraries)
async function extractTextFromPDF(file: File): Promise<string> {
  // Mock implementation - in real app, use pdf-parse or similar
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Extracted text from PDF: ${file.name}\n\nThis is mock extracted content from the PDF document. In a real implementation, this would contain the actual text extracted from the PDF using a library like pdf-parse or PDF.js.`);
    }, 1000);
  });
}

async function extractTextFromDOCX(file: File): Promise<string> {
  // Mock implementation - in real app, use mammoth or similar
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Extracted text from DOCX: ${file.name}\n\nThis is mock extracted content from the Word document. In a real implementation, this would contain the actual text extracted from the DOCX file using a library like mammoth.`);
    }, 800);
  });
}

async function extractTextFromImage(file: File): Promise<string> {
  // Mock implementation - in real app, use Tesseract.js or similar
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`OCR text from image: ${file.name}\n\nThis is mock OCR extracted content from the image. In a real implementation, this would contain text recognized from the image using OCR technology like Tesseract.`);
    }, 1200);
  });
}

async function calculateFileChecksum(file: File): Promise<string> {
  // Mock checksum calculation - in real app, use crypto API
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Evidence mapping functions
export function mapEvidenceToRequirements(
  documents: DocumentMetadata[],
  requirements: Array<{ id: string; type: string; text: string; requiredEvidence: string[] }>,
  entityId: string,
  entityType: string
): EvidenceMapping[] {
  const mappings: EvidenceMapping[] = [];

  requirements.forEach(requirement => {
    const relevantDocuments = findRelevantDocuments(documents, requirement);

    relevantDocuments.forEach(doc => {
      const extractedEvidence = extractEvidenceFromDocument(doc, requirement);
      const confidence = calculateMappingConfidence(extractedEvidence, requirement);

      if (confidence > 30) { // Only create mappings with reasonable confidence
        const mapping: EvidenceMapping = {
          id: `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          documentId: doc.id,
          requirementId: requirement.id,
          requirementType: requirement.type as any,
          entityType: entityType as any,
          entityId,
          mappingConfidence: confidence,
          extractedEvidence,
          validationStatus: confidence > 80 ? 'valid' : 'requires_review',
          validationNotes: confidence > 80 ? 'Auto-validated with high confidence' : 'Requires manual review',
          mappedBy: 'system',
          mappedAt: new Date().toISOString(),
          auditTrail: [{
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'created',
            userId: 'system',
            userName: 'AI Mapping Engine',
            notes: `Auto-mapped with ${confidence}% confidence`
          }]
        };

        mappings.push(mapping);
      }
    });
  });

  return mappings;
}

function findRelevantDocuments(
  documents: DocumentMetadata[],
  requirement: { text: string; requiredEvidence: string[] }
): DocumentMetadata[] {
  return documents.filter(doc => {
    const text = doc.extractedText || doc.ocrText || '';
    const lowerText = text.toLowerCase();
    const lowerRequirement = requirement.text.toLowerCase();

    // Check if document contains relevant keywords
    const relevantKeywords = requirement.requiredEvidence.concat(
      requirement.text.split(' ').filter(word => word.length > 3)
    );

    return relevantKeywords.some(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );
  });
}

function extractEvidenceFromDocument(
  document: DocumentMetadata,
  requirement: { text: string; requiredEvidence: string[] }
): string[] {
  const text = document.extractedText || document.ocrText || '';
  const evidence: string[] = [];

  // Simple keyword-based extraction (in real implementation, use NLP)
  requirement.requiredEvidence.forEach(required => {
    if (text.toLowerCase().includes(required.toLowerCase())) {
      // Extract sentence containing the evidence
      const sentences = text.split(/[.!?]+/);
      const relevantSentence = sentences.find(sentence =>
        sentence.toLowerCase().includes(required.toLowerCase())
      );
      if (relevantSentence) {
        evidence.push(relevantSentence.trim());
      }
    }
  });

  return evidence;
}

function calculateMappingConfidence(
  extractedEvidence: string[],
  requirement: { requiredEvidence: string[] }
): number {
  if (extractedEvidence.length === 0) return 0;

  const foundEvidence = requirement.requiredEvidence.filter(required =>
    extractedEvidence.some(evidence =>
      evidence.toLowerCase().includes(required.toLowerCase())
    )
  );

  return Math.round((foundEvidence.length / requirement.requiredEvidence.length) * 100);
}

// Compliance analysis functions
export function analyzeEvidenceCompliance(
  entityId: string,
  entityType: string,
  requirementType: string,
  mappings: EvidenceMapping[],
  requirements: Array<{ id: string; text: string; requiredEvidence: string[] }>
): EvidenceMappingResult {
  const totalRequirements = requirements.length;
  const mappedRequirements = new Set(mappings.map(m => m.requirementId)).size;
  const validatedMappings = mappings.filter(m => m.validationStatus === 'valid');
  const validatedRequirements = new Set(validatedMappings.map(m => m.requirementId)).size;

  const complianceScore = totalRequirements > 0 ?
    Math.round((validatedRequirements / totalRequirements) * 100) : 0;

  const evidenceCompleteness = totalRequirements > 0 ?
    Math.round((mappedRequirements / totalRequirements) * 100) : 0;

  const gaps = identifyEvidenceGaps(requirements, mappings);
  const recommendations = generateEvidenceRecommendations(gaps, requirementType);

  const pendingValidations = mappings.filter(m => m.validationStatus === 'pending' || m.validationStatus === 'requires_review').length;
  const requiresReview = mappings.filter(m => m.validationStatus === 'requires_review').length;

  return {
    entityId,
    entityType,
    requirementType,
    totalRequirements,
    mappedRequirements,
    validatedRequirements,
    complianceScore,
    evidenceCompleteness,
    mappings,
    gaps,
    recommendations,
    auditSummary: {
      totalMappings: mappings.length,
      pendingValidations,
      requiresReview,
      lastAuditDate: new Date().toISOString()
    }
  };
}

function identifyEvidenceGaps(
  requirements: Array<{ id: string; text: string; requiredEvidence: string[] }>,
  mappings: EvidenceMapping[]
): EvidenceGap[] {
  const gaps: EvidenceGap[] = [];

  requirements.forEach(requirement => {
    const requirementMappings = mappings.filter(m => m.requirementId === requirement.id);
    const mappedEvidence = requirementMappings.flatMap(m => m.extractedEvidence);
    const missingEvidence = requirement.requiredEvidence.filter(required =>
      !mappedEvidence.some(evidence =>
        evidence.toLowerCase().includes(required.toLowerCase())
      )
    );

    if (missingEvidence.length > 0) {
      const priority = missingEvidence.length === requirement.requiredEvidence.length ? 'high' :
                      missingEvidence.length > requirement.requiredEvidence.length / 2 ? 'medium' : 'low';

      gaps.push({
        requirementId: requirement.id,
        requirementText: requirement.text,
        missingEvidence,
        suggestedDocuments: generateSuggestedDocuments(missingEvidence),
        priority,
        estimatedCost: missingEvidence.length * 100000, // Rough estimate
        estimatedTime: missingEvidence.length * 7 // Rough estimate in days
      });
    }
  });

  return gaps;
}

function generateSuggestedDocuments(missingEvidence: string[]): string[] {
  const suggestions: string[] = [];

  missingEvidence.forEach(evidence => {
    const lowerEvidence = evidence.toLowerCase();

    if (lowerEvidence.includes('akta') || lowerEvidence.includes('pendirian')) {
      suggestions.push('Akta Pendirian Perusahaan');
    } else if (lowerEvidence.includes('npwp')) {
      suggestions.push('NPWP Perusahaan');
    } else if (lowerEvidence.includes('sertifikat') && lowerEvidence.includes('kompetensi')) {
      suggestions.push('Sertifikat Keahlian Kerja (SKK)');
    } else if (lowerEvidence.includes('ijazah') || lowerEvidence.includes('pendidikan')) {
      suggestions.push('Ijazah/Dokumen Pendidikan');
    } else if (lowerEvidence.includes('pengalaman') || lowerEvidence.includes('riwayat')) {
      suggestions.push('Daftar Riwayat Pekerjaan');
    } else if (lowerEvidence.includes('sbu')) {
      suggestions.push('Sertifikat Badan Usaha (SBU)');
    } else {
      suggestions.push(`${evidence} - Dokumen terkait`);
    }
  });

  return [...new Set(suggestions)]; // Remove duplicates
}

function generateEvidenceRecommendations(gaps: EvidenceGap[], requirementType: string): string[] {
  const recommendations: string[] = [];

  if (gaps.length === 0) {
    recommendations.push('Semua persyaratan sudah memiliki eviden yang memadai.');
    return recommendations;
  }

  const highPriorityGaps = gaps.filter(g => g.priority === 'high');
  if (highPriorityGaps.length > 0) {
    recommendations.push(`Prioritaskan pengumpulan eviden untuk ${highPriorityGaps.length} persyaratan kritis.`);
  }

  recommendations.push('Upload dokumen pendukung yang masih kurang ke sistem.');
  recommendations.push('Pastikan dokumen dalam format yang dapat diproses (PDF, DOCX, gambar).');

  if (requirementType === 'sbu' || requirementType === 'skk') {
    recommendations.push('Koordinasikan dengan tim legal dan SDM untuk melengkapi eviden sertifikasi.');
  }

  return recommendations;
}

// Validation functions
export function validateEvidenceMapping(
  mapping: EvidenceMapping,
  reviewerId: string,
  reviewerName: string,
  validationStatus: 'valid' | 'invalid' | 'partial',
  notes: string
): EvidenceMapping {
  const updatedMapping = {
    ...mapping,
    validationStatus,
    validationNotes: notes,
    lastReviewedBy: reviewerId,
    lastReviewedAt: new Date().toISOString(),
    auditTrail: [
      ...mapping.auditTrail,
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'validated' as const,
        userId: reviewerId,
        userName: reviewerName,
        previousValue: mapping.validationStatus,
        newValue: validationStatus,
        notes
      }
    ]
  };

  return updatedMapping;
}

// Utility functions
export function getDocumentStatusColor(status: DocumentMetadata['status']): string {
  switch (status) {
    case 'uploaded': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'processed': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
}

export function getValidationStatusColor(status: EvidenceMapping['validationStatus']): string {
  switch (status) {
    case 'valid': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'invalid': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'requires_review': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
}