# JSON Schema Formal untuk Agent Contracts

Berikut adalah spesifikasi JSON Schema formal untuk semua 11 agent contracts, yang bisa langsung digunakan untuk validasi input/output di backend.

## A. Base Schemas (Reusable Components)

### 1. Common Field Definitions
```json
{
  "$defs": {
    "task_id": {
      "type": "string",
      "pattern": "^[A-Z]{4}-[A-Z]{3}-[0-9]{13}-[A-F0-9]{9}$",
      "description": "Unique task identifier in format AGENT-TYPE-TIMESTAMP-RANDOM"
    },
    "request_id": {
      "type": "string",
      "pattern": "^REQ-[0-9]{13}-[A-F0-9]{6}$",
      "description": "Request identifier"
    },
    "agent_name": {
      "type": "string",
      "enum": [
        "orchestrator",
        "document_intake",
        "tender_agent",
        "legal_agent",
        "licensing_agent",
        "business_certification_agent",
        "competency_agent",
        "training_cpd_agent",
        "evidence_mapping_agent",
        "verifier_agent",
        "final_aggregator"
      ]
    },
    "status": {
      "type": "string",
      "enum": ["completed", "partial", "failed"],
      "description": "Agent execution status"
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Agent confidence score (0-1)"
    },
    "evidence_status": {
      "type": "string",
      "enum": ["available", "partial", "missing", "expired", "invalid"]
    },
    "match_status": {
      "type": "string",
      "enum": ["match", "partial_match", "mismatch", "not_applicable"]
    },
    "risk_level": {
      "type": "string",
      "enum": ["low", "medium", "high", "critical"]
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "entity_type": {
      "type": "string",
      "enum": ["business_entity", "personnel", "tender", "project"]
    },
    "requirement_category": {
      "type": "string",
      "enum": ["administrative", "technical", "legal", "personnel", "certification", "experience", "financial"]
    }
  }
}
```

### 2. Reusable Object Definitions
```json
{
  "$defs": {
    "metadata": {
      "type": "object",
      "properties": {
        "priority": { "$ref": "#/$defs/priority" },
        "risk_level": { "$ref": "#/$defs/risk_level" },
        "requires_citation": { "type": "boolean", "default": true },
        "requires_human_review": { "type": "boolean", "default": false }
      },
      "required": ["priority", "risk_level"],
      "additionalProperties": false
    },
    "source_reference": {
      "type": "object",
      "properties": {
        "document_id": { "type": "string", "format": "uuid" },
        "page": { "type": "integer", "minimum": 1 },
        "excerpt": { "type": "string", "maxLength": 500 },
        "table_index": { "type": "integer", "minimum": 0 },
        "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
      },
      "required": ["document_id"],
      "additionalProperties": false
    },
    "requirement_item": {
      "type": "object",
      "properties": {
        "requirement_id": { "type": "string", "pattern": "^REQ-[0-9]{3}$" },
        "category": { "$ref": "#/$defs/requirement_category" },
        "description": { "type": "string", "minLength": 10, "maxLength": 500 },
        "mandatory": { "type": "boolean" },
        "evidence_required": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1
        },
        "priority": { "$ref": "#/$defs/priority" },
        "evaluation_type": {
          "type": "string",
          "enum": ["document_check", "classification_match", "personnel_match", "calculation"]
        }
      },
      "required": ["requirement_id", "category", "description", "mandatory", "evidence_required"],
      "additionalProperties": false
    },
    "compliance_finding": {
      "type": "object",
      "properties": {
        "requirement_id": { "type": "string" },
        "status": { "$ref": "#/$defs/evidence_status" },
        "evidence_found": {
          "type": "array",
          "items": { "type": "string" }
        },
        "evidence_missing": {
          "type": "array",
          "items": { "type": "string" }
        },
        "notes": { "type": "string", "maxLength": 1000 },
        "severity": { "$ref": "#/$defs/risk_level" }
      },
      "required": ["requirement_id", "status"],
      "additionalProperties": false
    }
  }
}
```

---

## B. Input Schema Specifications

### 1. Orchestrator Agent Input Schema
```json
{
  "$id": "orchestrator_input_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "request_id": { "$ref": "#/$defs/request_id" },
    "agent_name": { "const": "orchestrator" },
    "objective": {
      "type": "string",
      "pattern": "^Tentukan rencana eksekusi",
      "description": "Must start with 'Tentukan rencana eksekusi'"
    },
    "context": {
      "type": "object",
      "properties": {
        "user_id": { "type": "string", "format": "uuid" },
        "business_entity_id": { "type": "string", "format": "uuid" },
        "project_domain": {
          "type": "string",
          "enum": ["konstruksi", "ketenagalistrikan", "minyak_gas", "pertambangan"]
        },
        "request_type": {
          "type": "string",
          "enum": ["tender_eligibility_check", "certification_readiness", "compliance_audit"]
        }
      },
      "required": ["business_entity_id", "request_type"],
      "additionalProperties": false
    },
    "inputs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "enum": ["user_request", "document_ids", "entity_profile"] },
          "value": {
            "oneOf": [
              { "type": "string", "minLength": 10 },
              { "type": "array", "items": { "type": "string", "format": "uuid" } },
              { "type": "object" }
            ]
          }
        },
        "required": ["type", "value"],
        "additionalProperties": false
      },
      "minItems": 1
    },
    "constraints": {
      "type": "array",
      "items": { "type": "string", "minLength": 5 },
      "maxItems": 10
    },
    "expected_output_schema": { "const": "orchestrator_plan_v1" },
    "metadata": { "$ref": "#/$defs/metadata" }
  },
  "required": ["task_id", "request_id", "agent_name", "objective", "context", "inputs", "constraints", "expected_output_schema", "metadata"],
  "additionalProperties": false
}
```

### 2. Document Intake Agent Input Schema
```json
{
  "$id": "document_intake_input_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "request_id": { "$ref": "#/$defs/request_id" },
    "agent_name": { "const": "document_intake" },
    "objective": {
      "type": "string",
      "pattern": "^Proses dokumen.*ekstrak",
      "description": "Must contain document processing objective"
    },
    "context": {
      "type": "object",
      "properties": {
        "document_domain": {
          "type": "string",
          "enum": ["tender", "legal", "certification", "personnel", "compliance"]
        }
      },
      "required": ["document_domain"],
      "additionalProperties": false
    },
    "inputs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "document_id": { "type": "string", "format": "uuid" },
          "file_type": { "type": "string", "enum": ["pdf", "docx", "xlsx", "jpg", "png"] },
          "priority": { "$ref": "#/$defs/priority" }
        },
        "required": ["document_id", "file_type"],
        "additionalProperties": false
      },
      "minItems": 1,
      "maxItems": 10
    },
    "constraints": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "gunakan OCR jika scan",
          "ekstrak tabel persyaratan",
          "jaga referensi halaman",
          "validate file integrity",
          "extract metadata"
        ]
      }
    },
    "expected_output_schema": { "const": "document_intake_result_v1" },
    "metadata": { "$ref": "#/$defs/metadata" }
  },
  "required": ["task_id", "request_id", "agent_name", "objective", "context", "inputs", "constraints", "expected_output_schema", "metadata"],
  "additionalProperties": false
}
```

### 3. Tender Agent Input Schema
```json
{
  "$id": "tender_analysis_input_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "request_id": { "$ref": "#/$defs/request_id" },
    "agent_name": { "const": "tender_agent" },
    "objective": {
      "type": "string",
      "pattern": "^Ekstrak.*persyaratan tender",
      "description": "Must focus on tender requirement extraction"
    },
    "context": {
      "type": "object",
      "properties": {
        "sector": {
          "type": "string",
          "enum": ["konstruksi", "ketenagalistrikan", "minyak_gas", "pertambangan"]
        },
        "project_type": {
          "type": "string",
          "enum": ["gedung", "jembatan", "jalan", "gardu_induk", "substation", "pipeline"]
        },
        "value_range": {
          "type": "string",
          "enum": ["small", "medium", "large", "mega"]
        }
      },
      "required": ["sector"],
      "additionalProperties": false
    },
    "inputs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "const": "document_structure" },
          "value": {
            "type": "object",
            "properties": {
              "document_id": { "type": "string", "format": "uuid" },
              "text_index_ref": { "type": "string", "pattern": "^IDX-[0-9]{3}$" },
              "sections": {
                "type": "array",
                "items": { "type": "string" },
                "minItems": 1
              }
            },
            "required": ["document_id", "text_index_ref"],
            "additionalProperties": false
          }
        },
        "required": ["type", "value"],
        "additionalProperties": false
      },
      "minItems": 1
    },
    "constraints": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "pisahkan syarat legal, administrasi, teknis, personel, pengalaman, sertifikasi",
          "setiap syarat harus punya source reference",
          "kategorikan berdasarkan mandatory/optional",
          "extract evaluation criteria",
          "identify dependencies between requirements"
        ]
      }
    },
    "expected_output_schema": { "const": "tender_requirements_v1" },
    "metadata": { "$ref": "#/$defs/metadata" }
  },
  "required": ["task_id", "request_id", "agent_name", "objective", "context", "inputs", "constraints", "expected_output_schema", "metadata"],
  "additionalProperties": false
}
```

### 4. Legal Agent Input Schema
```json
{
  "$id": "legal_compliance_input_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "request_id": { "$ref": "#/$defs/request_id" },
    "agent_name": { "const": "legal_agent" },
    "objective": {
      "type": "string",
      "pattern": "^Periksa.*legalitas",
      "description": "Must focus on legal compliance assessment"
    },
    "context": {
      "type": "object",
      "properties": {
        "business_entity_id": { "type": "string", "format": "uuid" },
        "assessment_date": { "type": "string", "format": "date" },
        "jurisdiction": {
          "type": "string",
          "enum": ["national", "provincial", "regency", "municipal"]
        }
      },
      "required": ["business_entity_id"],
      "additionalProperties": false
    },
    "inputs": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "type": { "const": "business_profile" },
              "value": {
                "type": "object",
                "properties": {
                  "entity_id": { "type": "string", "format": "uuid" },
                  "sector": { "type": "string" },
                  "business_type": { "type": "string" }
                },
                "required": ["entity_id"],
                "additionalProperties": true
              }
            },
            "required": ["type", "value"],
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "type": { "const": "legal_documents" },
              "value": {
                "type": "array",
                "items": { "type": "string", "format": "uuid" },
                "minItems": 1
              }
            },
            "required": ["type", "value"],
            "additionalProperties": false
          }
        ]
      },
      "minItems": 1
    },
    "constraints": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "periksa masa berlaku",
          "periksa kecocokan sektor dan wilayah",
          "tandai dokumen yang hilang",
          "validate document authenticity",
          "check regulatory compliance",
          "identify renewal requirements"
        ]
      }
    },
    "expected_output_schema": { "const": "legal_status_result_v1" },
    "metadata": { "$ref": "#/$defs/metadata" }
  },
  "required": ["task_id", "request_id", "agent_name", "objective", "context", "inputs", "constraints", "expected_output_schema", "metadata"],
  "additionalProperties": false
}
```

---

## C. Output Schema Specifications

### 1. Orchestrator Agent Output Schema
```json
{
  "$id": "orchestrator_plan_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "agent_name": { "const": "orchestrator" },
    "status": { "$ref": "#/$defs/status" },
    "summary": {
      "type": "string",
      "minLength": 10,
      "maxLength": 500,
      "description": "Brief summary of orchestration plan"
    },
    "result": {
      "type": "object",
      "properties": {
        "intent": {
          "type": "string",
          "enum": ["tender_eligibility_check", "certification_readiness", "compliance_audit"]
        },
        "subdomains": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["legal", "licensing", "business_certification", "personnel_competency", "evidence_mapping", "training", "environmental"]
          },
          "minItems": 1,
          "uniqueItems": true
        },
        "execution_plan": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "task_id": { "type": "string", "pattern": "^T[0-9]+$" },
              "agent": { "$ref": "#/$defs/agent_name" },
              "depends_on": {
                "type": "array",
                "items": { "type": "string", "pattern": "^T[0-9]+$" }
              },
              "estimated_duration": { "type": "integer", "minimum": 1, "maximum": 3600 },
              "priority": { "$ref": "#/$defs/priority" }
            },
            "required": ["task_id", "agent", "depends_on"],
            "additionalProperties": false
          },
          "minItems": 1
        },
        "estimated_total_duration": { "type": "integer", "minimum": 10 },
        "requires_human_review": { "type": "boolean" },
        "risk_assessment": {
          "type": "string",
          "enum": ["low", "medium", "high", "critical"]
        }
      },
      "required": ["intent", "subdomains", "execution_plan", "requires_human_review"],
      "additionalProperties": false
    },
    "sources": {
      "type": "array",
      "items": { "$ref": "#/$defs/source_reference" },
      "maxItems": 10
    },
    "issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "severity": { "$ref": "#/$defs/risk_level" },
          "description": { "type": "string", "minLength": 5, "maxLength": 200 }
        },
        "required": ["severity", "description"],
        "additionalProperties": false
      },
      "maxItems": 20
    },
    "confidence": { "$ref": "#/$defs/confidence" },
    "recommended_next_actions": {
      "type": "array",
      "items": { "type": "string", "minLength": 5, "maxLength": 100 },
      "maxItems": 10
    }
  },
  "required": ["task_id", "agent_name", "status", "summary", "result", "sources", "issues", "confidence", "recommended_next_actions"],
  "additionalProperties": false
}
```

### 2. Document Intake Agent Output Schema
```json
{
  "$id": "document_intake_result_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "agent_name": { "const": "document_intake" },
    "status": { "$ref": "#/$defs/status" },
    "summary": {
      "type": "string",
      "minLength": 10,
      "maxLength": 300,
      "description": "Summary of document processing results"
    },
    "result": {
      "type": "object",
      "properties": {
        "documents": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "document_id": { "type": "string", "format": "uuid" },
              "document_type": {
                "type": "string",
                "enum": ["tender_document", "legal_document", "certificate", "personnel_record", "compliance_report"]
              },
              "ocr_used": { "type": "boolean" },
              "pages": { "type": "integer", "minimum": 1, "maximum": 1000 },
              "sections": {
                "type": "array",
                "items": { "type": "string", "minLength": 3 },
                "maxItems": 50
              },
              "tables_extracted": { "type": "integer", "minimum": 0, "maximum": 100 },
              "text_index_ref": { "type": "string", "pattern": "^IDX-[0-9]{3}$" },
              "quality_score": { "type": "number", "minimum": 0, "maximum": 1 },
              "processing_warnings": {
                "type": "array",
                "items": { "type": "string" },
                "maxItems": 10
              }
            },
            "required": ["document_id", "document_type", "pages", "sections"],
            "additionalProperties": false
          },
          "minItems": 1,
          "maxItems": 10
        },
        "processing_stats": {
          "type": "object",
          "properties": {
            "total_documents": { "type": "integer", "minimum": 1 },
            "successful_processing": { "type": "integer", "minimum": 0 },
            "failed_processing": { "type": "integer", "minimum": 0 },
            "average_processing_time": { "type": "number", "minimum": 0 },
            "total_text_extracted": { "type": "integer", "minimum": 0 }
          },
          "required": ["total_documents", "successful_processing", "failed_processing"],
          "additionalProperties": false
        }
      },
      "required": ["documents", "processing_stats"],
      "additionalProperties": false
    },
    "sources": {
      "type": "array",
      "items": { "$ref": "#/$defs/source_reference" },
      "maxItems": 20
    },
    "issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "document_id": { "type": "string", "format": "uuid" },
          "severity": { "$ref": "#/$defs/risk_level" },
          "description": { "type": "string", "minLength": 5, "maxLength": 200 },
          "suggested_action": { "type": "string", "minLength": 5, "maxLength": 100 }
        },
        "required": ["document_id", "severity", "description"],
        "additionalProperties": false
      },
      "maxItems": 50
    },
    "confidence": { "$ref": "#/$defs/confidence" },
    "recommended_next_actions": {
      "type": "array",
      "items": { "type": "string", "minLength": 5, "maxLength": 100 },
      "maxItems": 10
    }
  },
  "required": ["task_id", "agent_name", "status", "summary", "result", "sources", "issues", "confidence", "recommended_next_actions"],
  "additionalProperties": false
}
```

### 3. Tender Agent Output Schema
```json
{
  "$id": "tender_requirements_v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "task_id": { "$ref": "#/$defs/task_id" },
    "agent_name": { "const": "tender_agent" },
    "status": { "$ref": "#/$defs/status" },
    "summary": {
      "type": "string",
      "minLength": 10,
      "maxLength": 300,
      "description": "Summary of tender requirement extraction"
    },
    "result": {
      "type": "object",
      "properties": {
        "tender_metadata": {
          "type": "object",
          "properties": {
            "title": { "type": "string", "minLength": 5 },
            "owner": { "type": "string", "minLength": 3 },
            "sector": { "type": "string" },
            "estimated_value": { "type": "number", "minimum": 0 },
            "deadline": { "type": "string", "format": "date" },
            "evaluation_method": {
              "type": "string",
              "enum": ["administrative", "technical", "price", "combined"]
            }
          },
          "required": ["title", "sector", "estimated_value"],
          "additionalProperties": true
        },
        "requirements": {
          "type": "array",
          "items": { "$ref": "#/$defs/requirement_item" },
          "minItems": 1,
          "maxItems": 100
        },
        "requirements_summary": {
          "type": "object",
          "properties": {
            "total_requirements": { "type": "integer", "minimum": 0 },
            "mandatory_requirements": { "type": "integer", "minimum": 0 },
            "high_priority_requirements": { "type": "integer", "minimum": 0 },
            "categories_covered": {
              "type": "array",
              "items": { "$ref": "#/$defs/requirement_category" },
              "uniqueItems": true
            }
          },
          "required": ["total_requirements", "mandatory_requirements"],
          "additionalProperties": false
        },
        "extraction_quality": {
          "type": "object",
          "properties": {
            "completeness_score": { "type": "number", "minimum": 0, "maximum": 1 },
            "confidence_score": { "type": "number", "minimum": 0, "maximum": 1 },
            "sections_processed": { "type": "integer", "minimum": 0 },
            "tables_processed": { "type": "integer", "minimum": 0 },
            "extraction_warnings": {
              "type": "array",
              "items": { "type": "string" },
              "maxItems": 20
            }
          },
          "required": ["completeness_score", "confidence_score"],
          "additionalProperties": false
        }
      },
      "required": ["requirements", "requirements_summary", "extraction_quality"],
      "additionalProperties": false
    },
    "sources": {
      "type": "array",
      "items": { "$ref": "#/$defs/source_reference" },
      "minItems": 1,
      "maxItems": 100
    },
    "issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "section": { "type": "string" },
          "severity": { "$ref": "#/$defs/risk_level" },
          "description": { "type": "string", "minLength": 5, "maxLength": 300 },
          "suggested_resolution": { "type": "string", "minLength": 5, "maxLength": 200 }
        },
        "required": ["severity", "description"],
        "additionalProperties": false
      },
      "maxItems": 50
    },
    "confidence": { "$ref": "#/$defs/confidence" },
    "recommended_next_actions": {
      "type": "array",
      "items": { "type": "string", "minLength": 5, "maxLength": 100 },
      "maxItems": 10
    }
  },
  "required": ["task_id", "agent_name", "status", "summary", "result", "sources", "issues", "confidence", "recommended_next_actions"],
  "additionalProperties": false
}
```

---

## D. Schema Validation Examples

### 1. Orchestrator Input Validation Example
```json
{
  "task_id": "ORCH-DEC-2024121300000-A1B2C3D4E",
  "request_id": "REQ-1702400000000-1A2B3C",
  "agent_name": "orchestrator",
  "objective": "Tentukan rencana eksekusi untuk memeriksa kelayakan tender",
  "context": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "business_entity_id": "550e8400-e29b-41d4-a716-446655440001",
    "project_domain": "ketenagalistrikan",
    "request_type": "tender_eligibility_check"
  },
  "inputs": [
    {
      "type": "user_request",
      "value": "Cek apakah PT Konstruksi Maju Jaya layak ikut tender Gardu Induk 150 kV"
    },
    {
      "type": "document_ids",
      "value": ["550e8400-e29b-41d4-a716-446655440002"]
    }
  ],
  "constraints": [
    "gunakan agent spesialis sesuai domain",
    "sertakan source trace",
    "tandai high-risk output"
  ],
  "expected_output_schema": "orchestrator_plan_v1",
  "metadata": {
    "priority": "high",
    "risk_level": "medium",
    "requires_citation": true,
    "requires_human_review": false
  }
}
```

### 2. Document Intake Input Validation Example
```json
{
  "task_id": "DINT-DEC-2024121300000-F5G6H7I8J",
  "request_id": "REQ-1702400000000-1A2B3C",
  "agent_name": "document_intake",
  "objective": "Proses dokumen tender dan ekstrak struktur kontennya",
  "context": {
    "document_domain": "tender"
  },
  "inputs": [
    {
      "document_id": "550e8400-e29b-41d4-a716-446655440002",
      "file_type": "pdf",
      "priority": "high"
    }
  ],
  "constraints": [
    "gunakan OCR jika scan",
    "ekstrak tabel persyaratan",
    "jaga referensi halaman"
  ],
  "expected_output_schema": "document_intake_result_v1",
  "metadata": {
    "priority": "medium",
    "risk_level": "low",
    "requires_citation": false,
    "requires_human_review": false
  }
}
```

---

## E. Schema Registry Structure

### 1. Schema Registry JSON
```json
{
  "registry_version": "1.0.0",
  "last_updated": "2024-12-13T00:00:00Z",
  "schemas": {
    "input_schemas": {
      "orchestrator_input_v1": {
        "file": "orchestrator_input_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Orchestrator agent input schema"
      },
      "document_intake_input_v1": {
        "file": "document_intake_input_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Document intake agent input schema"
      },
      "tender_analysis_input_v1": {
        "file": "tender_analysis_input_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Tender agent input schema"
      },
      "legal_compliance_input_v1": {
        "file": "legal_compliance_input_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Legal agent input schema"
      }
    },
    "output_schemas": {
      "orchestrator_plan_v1": {
        "file": "orchestrator_plan_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Orchestrator agent output schema"
      },
      "document_intake_result_v1": {
        "file": "document_intake_result_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Document intake agent output schema"
      },
      "tender_requirements_v1": {
        "file": "tender_requirements_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Tender agent output schema"
      },
      "legal_status_result_v1": {
        "file": "legal_status_result_v1.json",
        "version": "1.0.0",
        "status": "active",
        "description": "Legal agent output schema"
      }
    }
  },
  "validation_rules": {
    "strict_mode": true,
    "allow_additional_properties": false,
    "validate_references": true,
    "schema_version_check": true
  }
}
```

### 2. Schema Versioning Strategy
```
- Major version (X.y.z): Breaking changes in structure
- Minor version (x.Y.z): New optional fields, backward compatible
- Patch version (x.y.Z): Bug fixes, documentation updates

Version format: {agent_name}_{schema_type}_v{major}.{minor}.{patch}
Example: orchestrator_input_v1.2.3
```

---

## F. TypeScript Interface Generation

### Generated from Schemas
```typescript
// Auto-generated from JSON Schema
export interface OrchestratorInput {
  task_id: TaskId;
  request_id: RequestId;
  agent_name: "orchestrator";
  objective: string;
  context: {
    user_id: string;
    business_entity_id: string;
    project_domain: "konstruksi" | "ketenagalistrikan" | "minyak_gas" | "pertambangan";
    request_type: "tender_eligibility_check" | "certification_readiness" | "compliance_audit";
  };
  inputs: Array<{
    type: "user_request" | "document_ids" | "entity_profile";
    value: string | string[] | object;
  }>;
  constraints: string[];
  expected_output_schema: "orchestrator_plan_v1";
  metadata: Metadata;
}

export interface OrchestratorOutput {
  task_id: TaskId;
  agent_name: "orchestrator";
  status: Status;
  summary: string;
  result: {
    intent: "tender_eligibility_check" | "certification_readiness" | "compliance_audit";
    subdomains: string[];
    execution_plan: Array<{
      task_id: string;
      agent: AgentName;
      depends_on: string[];
      estimated_duration?: number;
      priority?: Priority;
    }>;
    estimated_total_duration?: number;
    requires_human_review: boolean;
    risk_assessment?: RiskLevel;
  };
  sources: SourceReference[];
  issues: Array<{
    severity: RiskLevel;
    description: string;
  }>;
  confidence: Confidence;
  recommended_next_actions: string[];
}
```

---

## G. Schema Validation Implementation

### 1. Node.js Validation Example
```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);

// Load schema
const orchestratorInputSchema = require('./schemas/orchestrator_input_v1.json');
const validate = ajv.compile(orchestratorInputSchema);

// Validate input
const valid = validate(inputData);
if (!valid) {
  console.error('Validation errors:', validate.errors);
  throw new Error('Input validation failed');
}
```

### 2. Python Validation Example
```python
import jsonschema
from jsonschema import validate, ValidationError

# Load schema
with open('schemas/orchestrator_input_v1.json', 'r') as f:
    schema = json.load(f)

# Validate input
try:
    validate(instance=input_data, schema=schema)
    print("Input is valid")
except ValidationError as e:
    print(f"Validation error: {e.message}")
    raise
```

### 3. Schema Testing Strategy
```json
{
  "test_cases": {
    "orchestrator_input_v1": [
      {
        "name": "valid_minimal_input",
        "input": { /* minimal valid input */ },
        "expected": "valid"
      },
      {
        "name": "invalid_missing_required",
        "input": { /* input missing required field */ },
        "expected": "invalid",
        "error_path": "task_id"
      },
      {
        "name": "invalid_wrong_enum",
        "input": { /* input with wrong enum value */ },
        "expected": "invalid",
        "error_path": "context.request_type"
      }
    ]
  }
}
```

Schema JSON formal ini memberikan **validation layer enterprise-grade** yang memastikan semua agent contracts mematuhi spesifikasi yang ketat, mendukung versioning, dan memberikan error messages yang jelas untuk debugging.