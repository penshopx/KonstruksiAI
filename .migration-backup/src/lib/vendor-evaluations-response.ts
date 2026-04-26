/**
 * Vendor Evaluations Response Generator
 * 
 * Integrates vendor evaluations functionality with chat API
 */

import { 
  vendorCategories, 
  evaluationCriteria, 
  scoringGuide,
  weightSummary,
  complianceRequirements,
  siteVisitChecklist,
  referenceCheckQuestions,
  minimumScores,
  createEvaluationReport,
  calculateVendorScore,
  type VendorCategory,
  type EvaluationCriteria,
  type VendorEvaluationReport,
  type VendorInfo,
  type VendorScore
} from './vendor-evaluations';

interface ResponseContext {
  query: string;
  language: 'id' | 'en';
}

interface CategoryInfo {
  category: VendorCategory;
  matchScore: number;
}

interface CriteriaInfo {
  criteria: EvaluationCriteria;
  matchScore: number;
}

// Detect language from query
function detectLanguage(query: string): 'id' | 'en' {
  const indonesianPatterns = [
    'evaluasi vendor',
    'vendor',
    'penilaian',
    'supplier',
    'pesaing',
    'kontrak',
    'pengadaan',
    'harga',
    'kualitas',
    'pengiriman',
    'transformator',
    'switchgear',
    'kabel',
    'generator',
    'renewable',
    'energi',
    'listrik'
  ];
  
  const lowerQuery = query.toLowerCase();
  const matchCount = indonesianPatterns.filter(pattern => 
    lowerQuery.includes(pattern.toLowerCase())
  ).length;
  
  return matchCount >= 2 ? 'id' : 'en';
}

// Find relevant vendor categories
function findRelevantCategories(query: string): CategoryInfo[] {
  const lowerQuery = query.toLowerCase();
  
  const scored = vendorCategories.map(category => {
    let score = 0;
    
    // Check category name
    if (lowerQuery.includes(category.name.toLowerCase())) {
      score += 10;
    }
    
    // Check subcategories
    category.subcategories.forEach(sub => {
      if (lowerQuery.includes(sub.toLowerCase())) {
        score += 5;
      }
    });
    
    // Check description
    if (lowerQuery.includes(category.description.toLowerCase())) {
      score += 3;
    }
    
    return { category, matchScore: score };
  });
  
  return scored
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

// Find relevant evaluation criteria
function findRelevantCriteria(query: string): CriteriaInfo[] {
  const lowerQuery = query.toLowerCase();
  
  const scored = evaluationCriteria.map(criteria => {
    let score = 0;
    
    // Check criteria name
    if (lowerQuery.includes(criteria.name.toLowerCase())) {
      score += 10;
    }
    
    // Check description
    if (lowerQuery.includes(criteria.description.toLowerCase())) {
      score += 3;
    }
    
    // Check subcriteria
    criteria.subcriteria.forEach(sub => {
      if (lowerQuery.includes(sub.name.toLowerCase())) {
        score += 5;
      }
      sub.questions.forEach(q => {
        if (lowerQuery.includes(q.toLowerCase())) {
          score += 1;
        }
      });
    });
    
    return { criteria, matchScore: score };
  });
  
  return scored
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

// Generate vendor evaluation response
export function generateVendorEvaluationResponse(
  query: string,
  context?: ResponseContext
): string {
  const language = context?.language || detectLanguage(query);
  const relevantCategories = findRelevantCategories(query);
  const relevantCriteria = findRelevantCriteria(query);
  
  const sections: string[] = [];
  
  // Header
  if (language === 'id') {
    sections.push('# 📋 Evaluasi Vendor - Panduan Lengkap\n');
  } else {
    sections.push('# 📋 Vendor Evaluation - Complete Guide\n');
  }
  
  // Categories Section
  if (relevantCategories.length > 0) {
    if (language === 'id') {
      sections.push('## Kategori Vendor yang Relevan\n');
      sections.push('Berikut adalah kategori vendor yang relevan dengan pertanyaan Anda:\n');
    } else {
      sections.push('## Relevant Vendor Categories\n');
      sections.push('Here are the vendor categories relevant to your query:\n');
    }
    
    relevantCategories.forEach(({ category, matchScore }) => {
      sections.push(`### ${category.name}`);
      sections.push(category.description);
      sections.push(`_Relevansi: ${matchScore}/10_\n`);
      
      if (language === 'id') {
        sections.push('**Subkategori:**');
      } else {
        sections.push('**Subcategories:**');
      }
      category.subcategories.forEach(sub => {
        sections.push(`- ${sub}`);
      });
      sections.push('');
    });
  }
  
  // Evaluation Criteria Section
  if (relevantCriteria.length > 0) {
    if (language === 'id') {
      sections.push('## Kriteria Evaluasi yang Relevan\n');
    } else {
      sections.push('## Relevant Evaluation Criteria\n');
    }
    
    relevantCriteria.forEach(({ criteria, matchScore }) => {
      sections.push(`### ${criteria.name} (${criteria.weight}%)`);
      sections.push(criteria.description);
      sections.push(`_Relevansi: ${matchScore}/10_\n`);
      
      if (language === 'id') {
        sections.push('**Subkriteria:**');
      } else {
        sections.push('**Subcriteria:**');
      }
      criteria.subcriteria.forEach(sub => {
        sections.push(`- ${sub.name} (${sub.weight}%)`);
      });
      sections.push('');
    });
  }
  
  // Weight Summary
  sections.push('## Weight Distribution Summary');
  sections.push('| Kriteria | Bobot |');
  sections.push('|----------|-------|');
  Object.entries(weightSummary).forEach(([key, value]) => {
    if (key !== 'total') {
      sections.push(`| ${key.charAt(0).toUpperCase() + key.slice(1)} | ${value}% |`);
    }
  });
  sections.push(`| **Total** | **${weightSummary.total}%** |`);
  sections.push('');
  
  // Scoring Guide
  if (language === 'id') {
    sections.push('## Panduan Penilaian\n');
  } else {
    sections.push('## Scoring Guide\n');
  }
  sections.push('| Skor | Deskripsi |');
  sections.push('|------|-----------|');
  Object.entries(scoringGuide).forEach(([score, description]) => {
    sections.push(`| ${score} | ${description} |`);
  });
  sections.push('');
  
  // Compliance Requirements
  sections.push('## Compliance Requirements (Indonesia)');
  if (language === 'id') {
    sections.push('**Wajib:**');
  } else {
    sections.push('**Required:**');
  }
  complianceRequirements.required.forEach(req => {
    sections.push(`- ${req}`);
  });
  
  if (language === 'id') {
    sections.push('\n**Direkomendasikan:**');
  } else {
    sections.push('\n**Recommended:**');
  }
  complianceRequirements.recommended.forEach(req => {
    sections.push(`- ${req}`);
  });
  
  sections.push('\n**Testing Standards:**');
  complianceRequirements.testingStandards.forEach(std => {
    sections.push(`- ${std}`);
  });
  sections.push('');
  
  // Site Visit Checklist
  sections.push('## Site Visit Checklist');
  if (language === 'id') {
    sections.push('**Manufaktur:**');
  } else {
    sections.push('**Manufacturing:**');
  }
  siteVisitChecklist.manufacturing.forEach(item => {
    sections.push(`- [ ] ${item}`);
  });
  
  if (language === 'id') {
    sections.push('\n**Gudang:**');
  } else {
    sections.push('\n**Warehouse:**');
  }
  siteVisitChecklist.warehouse.forEach(item => {
    sections.push(`- [ ] ${item}`);
  });
  
  if (language === 'id') {
    sections.push('\n**Kantor:**');
  } else {
    sections.push('\n**Office:**');
  }
  siteVisitChecklist.office.forEach(item => {
    sections.push(`- [ ] ${item}`);
  });
  sections.push('');
  
  // Reference Check Questions
  sections.push('## Reference Check Questions');
  if (language === 'id') {
    sections.push('Gunakan pertanyaan berikut saat melakukan verifikasi referensi:\n');
  } else {
    sections.push('Use the following questions when conducting reference checks:\n');
  }
  referenceCheckQuestions.forEach((q, i) => {
    sections.push(`${i + 1}. ${q}`);
  });
  
  // Footer
  if (language === 'id') {
    sections.push('\n---\n');
    sections.push('_Dokumen ini dibuat berdasarkan best practices dari:_');
    sections.push('- Joseph A. Fleming (2018) - The Vendor Management Handbook');
    sections.push('- David E. Schwab (2019) - The Vendor Selection Process');
    sections.push('- Sherry R. Gordon (2014) - Vendor Evaluation and Selection');
  } else {
    sections.push('\n---\n');
    sections.push('_This document is based on best practices from:_');
    sections.push('- Joseph A. Fleming (2018) - The Vendor Management Handbook');
    sections.push('- David E. Schwab (2019) - The Vendor Selection Process');
    sections.push('- Sherry R. Gordon (2014) - Vendor Evaluation and Selection');
  }
  
  return sections.join('\n');
}

// Export main function
export default generateVendorEvaluationResponse;
