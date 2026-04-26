import { db } from '../db';
import { eq, and, or, sql, desc, asc } from 'drizzle-orm';
import {
  users,
  businessEntities,
  licensesPermits,
  businessCertifications,
  personnel,
  personCompetencies,
  personCertifications,
  trainingPrograms,
  trainingRecords,
  cpdRecords,
  regulations,
  regulatoryObligations,
  tenders,
  projects,
  documents,
  complianceFindings,
  agentRequests,
  workflowRuns,
  agentTasks,
  agentTaskOutputs,
  toolCalls,
  agentRuns,
  evidenceMappings,
  auditEvents,
  requirementItems,
  requirementEvaluations,
  evidenceLinks,
  readinessScores,
  verificationResults,
  finalAssessments,
  type User,
  type BusinessEntity,
  type LicensePermit,
  type BusinessCertification,
  type Personnel,
  type PersonCompetency,
  type PersonCertification,
  type TrainingProgram,
  type TrainingRecord,
  type CpdRecord,
  type Regulation,
  type RegulatoryObligation,
  type Tender,
  type Project,
  type Document,
  type ComplianceFinding,
  type AgentRequest,
  type WorkflowRun,
  type AgentTask,
  type AgentTaskOutput,
  type ToolCall,
  type AgentRun,
  type EvidenceMapping,
  type AuditEvent,
  type RequirementItem,
  type RequirementEvaluation,
  type EvidenceLink,
  type ReadinessScore,
  type VerificationResult,
  type FinalAssessment
} from '../db/schema';

// ============================================================================
// User Management
// ============================================================================

export class UserService {
  static async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  static async findById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  static async create(data: { name: string; email: string; password: string; role?: string }): Promise<User> {
    const result = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'user'
    }).returning();
    return result[0];
  }

  static async update(id: number, data: Partial<Pick<User, 'name' | 'role'>>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}

// ============================================================================
// Business Entity Management
// ============================================================================

export class BusinessEntityService {
  static async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ data: BusinessEntity[]; total: number }> {
    const { page = 1, limit = 20, search } = options;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
      whereClause = or(
        sql`${businessEntities.entityName} LIKE ${`%${search}%`}`,
        sql`${businessEntities.registrationNumber} LIKE ${`%${search}%`}`
      );
    }

    const data = await db.select()
      .from(businessEntities)
      .where(whereClause)
      .orderBy(desc(businessEntities.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(businessEntities)
      .where(whereClause);

    return { data, total: count };
  }

  static async findById(id: number): Promise<BusinessEntity | undefined> {
    const result = await db.select().from(businessEntities).where(eq(businessEntities.id, id)).limit(1);
    return result[0];
  }

  static async create(data: Omit<BusinessEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessEntity> {
    const result = await db.insert(businessEntities).values(data).returning();
    return result[0];
  }

  static async update(id: number, data: Partial<Omit<BusinessEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BusinessEntity | undefined> {
    const result = await db.update(businessEntities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(businessEntities.id, id))
      .returning();
    return result[0];
  }

  static async getWithRelatedData(id: number) {
    const entity = await this.findById(id);
    if (!entity) return null;

    const [licenses, certifications, personnelList, projectList] = await Promise.all([
      db.select().from(licensesPermits).where(eq(licensesPermits.entityId, id)),
      db.select().from(businessCertifications).where(eq(businessCertifications.entityId, id)),
      db.select().from(personnel).where(eq(personnel.entityId, id)),
      db.select().from(projects).where(eq(projects.entityId, id))
    ]);

    return {
      ...entity,
      licenses,
      certifications,
      personnel: personnelList,
      projects: projectList
    };
  }
}

// ============================================================================
// Personnel Management
// ============================================================================

export class PersonnelService {
  static async findByEntityId(entityId: number, options: {
    page?: number;
    limit?: number;
    search?: string;
    competency?: string;
  } = {}): Promise<{ data: Personnel[]; total: number }> {
    const { page = 1, limit = 20, search, competency } = options;
    const offset = (page - 1) * limit;

    let whereClause: any = eq(personnel.entityId, entityId);
    if (search) {
      whereClause = and(
        whereClause,
        sql`${personnel.fullName} LIKE ${`%${search}%`}`
      );
    }

    const data = await db.select()
      .from(personnel)
      .where(whereClause)
      .orderBy(desc(personnel.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(personnel)
      .where(whereClause);

    return { data, total: count };
  }

  static async findById(id: number): Promise<Personnel | undefined> {
    const result = await db.select().from(personnel).where(eq(personnel.id, id)).limit(1);
    return result[0];
  }

  static async getWithCompetencies(personnelId: number) {
    const person = await this.findById(personnelId);
    if (!person) return null;

    const [competencies, certifications] = await Promise.all([
      db.select().from(personCompetencies).where(eq(personCompetencies.personnelId, personnelId)),
      db.select().from(personCertifications).where(eq(personCertifications.personnelId, personnelId))
    ]);

    return {
      ...person,
      competencies,
      certifications
    };
  }
}

// ============================================================================
// Agent Orchestration
// ============================================================================

export class AgentOrchestrationService {
  static async createWorkflowRequest(data: {
    requestType: string;
    agentType: string;
    inputData: any;
  }): Promise<AgentRequest> {
    const result = await db.insert(agentRequests).values(data).returning();
    return result[0];
  }

  static async createWorkflowRun(data: {
    requestId: number;
    workflowType: string;
    workflowState?: any;
  }): Promise<WorkflowRun> {
    const result = await db.insert(workflowRuns).values(data).returning();
    return result[0];
  }

  static async updateWorkflowStatus(workflowId: number, status: string, workflowState?: any): Promise<WorkflowRun | undefined> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (workflowState) {
      updateData.workflowState = JSON.stringify(workflowState);
    }

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const result = await db.update(workflowRuns)
      .set(updateData)
      .where(eq(workflowRuns.id, workflowId))
      .returning();
    return result[0];
  }

  static async getWorkflowStatus(workflowId: number) {
    const workflow = await db.select().from(workflowRuns).where(eq(workflowRuns.id, workflowId)).limit(1);
    if (!workflow[0]) return null;

    const tasks = await db.select().from(agentTasks).where(eq(agentTasks.workflowRunId, workflowId));
    const taskOutputs = await db.select().from(agentTaskOutputs).where(
      sql`${agentTaskOutputs.agentTaskId} IN (${tasks.map(t => t.id).join(',')})`
    );

    return {
      ...workflow[0],
      tasks: tasks.map(task => ({
        ...task,
        outputs: taskOutputs.filter(output => output.agentTaskId === task.id)
      }))
    };
  }
}

// ============================================================================
// Tender Eligibility Service
// ============================================================================

export class TenderEligibilityService {
  static async assessEligibility(entityId: number, tenderId: number, includeGapAnalysis = false) {
    // This would orchestrate the agent workflow for tender eligibility assessment
    // For now, return a mock result structure

    const entity = await BusinessEntityService.findById(entityId);
    const tender = await TenderService.findById(tenderId);

    if (!entity || !tender) {
      throw new Error('Entity or tender not found');
    }

    // Mock assessment result - in real implementation, this would trigger agent workflow
    return {
      eligibility: {
        overall: 'conditionally_eligible',
        score: 78,
        confidence: 'high'
      },
      domains: {
        legal: { status: 'compliant', score: 95 },
        certification: { status: 'compliant', score: 85 },
        personnel: { status: 'gap', score: 65 },
        experience: { status: 'compliant', score: 90 },
        financial: { status: 'compliant', score: 80 }
      },
      gaps: [
        {
          domain: 'personnel',
          requirement: 'SKK Ahli Struktur',
          current: 2,
          required: 3,
          gap: 1
        }
      ],
      recommendations: [
        {
          priority: 'high',
          action: 'Hire additional SKK Ahli Struktur',
          timeline: '3 months',
          cost: 'IDR 50M'
        }
      ]
    };
  }
}

// ============================================================================
// Document Management
// ============================================================================

export class DocumentService {
  static async create(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const result = await db.insert(documents).values(data).returning();
    return result[0];
  }

  static async findByEntityId(entityId: number, options: {
    page?: number;
    limit?: number;
    type?: string;
  } = {}): Promise<{ data: Document[]; total: number }> {
    const { page = 1, limit = 20, type } = options;
    const offset = (page - 1) * limit;

    // This would need a join with business entities to filter by entity
    // For now, return all documents (in real implementation, add proper filtering)
    const data = await db.select()
      .from(documents)
      .orderBy(desc(documents.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(documents);

    return { data, total: count };
  }
}

// ============================================================================
// Tender Service
// ============================================================================

export class TenderService {
  static async findById(id: number): Promise<Tender | undefined> {
    const result = await db.select().from(tenders).where(eq(tenders.id, id)).limit(1);
    return result[0];
  }

  static async findAll(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<{ data: Tender[]; total: number }> {
    const { page = 1, limit = 20, status } = options;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (status) {
      whereClause = eq(tenders.status, status);
    }

    const data = await db.select()
      .from(tenders)
      .where(whereClause)
      .orderBy(desc(tenders.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(tenders)
      .where(whereClause);

    return { data, total: count };
  }
}

// ============================================================================
// Audit & Compliance
// ============================================================================

export class AuditService {
  static async logEvent(data: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<AuditEvent> {
    const result = await db.insert(auditEvents).values(data).returning();
    return result[0];
  }

  static async getEntityHistory(entityId: number, entityType: string, options: {
    page?: number;
    limit?: number;
    dateFrom?: Date;
  } = {}): Promise<{ data: AuditEvent[]; total: number }> {
    const { page = 1, limit = 20, dateFrom } = options;
    const offset = (page - 1) * limit;

    let whereClause = and(
      eq(auditEvents.entityId, entityId),
      eq(auditEvents.entityType, entityType)
    );

    if (dateFrom) {
      whereClause = and(whereClause, sql`${auditEvents.createdAt} >= ${dateFrom}`);
    }

    const data = await db.select()
      .from(auditEvents)
      .where(whereClause)
      .orderBy(desc(auditEvents.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(auditEvents)
      .where(whereClause);

    return { data, total: count };
  }
}