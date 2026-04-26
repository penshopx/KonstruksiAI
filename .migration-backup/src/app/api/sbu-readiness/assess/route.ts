import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { BusinessEntityService } from '@/lib/database-service';

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { entityId, targetClassification, assessmentDate } = body;

    if (!entityId || !targetClassification) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'entityId and targetClassification are required'
          }
        },
        { status: 400 }
      );
    }

    // Verify entity exists
    const entity = await BusinessEntityService.findById(entityId);
    if (!entity) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Business entity not found'
          }
        },
        { status: 404 }
      );
    }

    // Get entity with related data
    const entityWithData = await BusinessEntityService.getWithRelatedData(entityId);

    if (!entityWithData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Entity data not found'
          }
        },
        { status: 404 }
      );
    }

    // SBU Classification Requirements (based on PP No. 28 Tahun 2025)
    const sbuRequirements = {
      'Kualifikasi Besar': {
        personnel: {
          manajerKonstruksi: 5,
          supervisor: 10,
          teknisi: 20,
          administrasi: 3
        },
        experience: {
          minYears: 10,
          completedProjects: 20,
          minProjectValue: 100000000000 // IDR 100M
        },
        equipment: {
          heavyEquipment: 15,
          lightEquipment: 30
        },
        financial: {
          minCapital: 5000000000, // IDR 5B
          bankGuarantee: 10000000000 // IDR 10B
        }
      },
      'Kualifikasi Menengah': {
        personnel: {
          manajerKonstruksi: 3,
          supervisor: 5,
          teknisi: 10,
          administrasi: 2
        },
        experience: {
          minYears: 7,
          completedProjects: 10,
          minProjectValue: 25000000000 // IDR 25M
        },
        equipment: {
          heavyEquipment: 8,
          lightEquipment: 15
        },
        financial: {
          minCapital: 1500000000, // IDR 1.5B
          bankGuarantee: 3000000000 // IDR 3B
        }
      },
      'Kualifikasi Kecil': {
        personnel: {
          manajerKonstruksi: 1,
          supervisor: 2,
          teknisi: 5,
          administrasi: 1
        },
        experience: {
          minYears: 3,
          completedProjects: 5,
          minProjectValue: 5000000000 // IDR 5M
        },
        equipment: {
          heavyEquipment: 3,
          lightEquipment: 8
        },
        financial: {
          minCapital: 300000000, // IDR 300M
          bankGuarantee: 750000000 // IDR 750M
        }
      }
    };

    const requirements = sbuRequirements[targetClassification as keyof typeof sbuRequirements];
    if (!requirements) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid target classification'
          }
        },
        { status: 400 }
      );
    }

    // Current state analysis (mock data - in real implementation, calculate from database)
    const currentState = {
      personnel: {
        manajerKonstruksi: 3,
        supervisor: 6,
        teknisi: 12,
        administrasi: 3
      },
      experience: {
        years: 8,
        completedProjects: 15,
        avgProjectValue: 75000000000
      },
      equipment: {
        heavyEquipment: 10,
        lightEquipment: 20
      },
      financial: {
        capital: 3000000000,
        bankGuarantee: 6000000000
      }
    };

    // Calculate readiness scores
    const personnelScore = Math.min(100, (
      (currentState.personnel.manajerKonstruksi / requirements.personnel.manajerKonstruksi) * 25 +
      (currentState.personnel.supervisor / requirements.personnel.supervisor) * 25 +
      (currentState.personnel.teknisi / requirements.personnel.teknisi) * 25 +
      (currentState.personnel.administrasi / requirements.personnel.administrasi) * 25
    ));

    const experienceScore = Math.min(100, (
      (currentState.experience.years / requirements.experience.minYears) * 33 +
      (currentState.experience.completedProjects / requirements.experience.completedProjects) * 33 +
      (currentState.experience.avgProjectValue / requirements.experience.minProjectValue) * 34
    ));

    const equipmentScore = Math.min(100, (
      (currentState.equipment.heavyEquipment / requirements.equipment.heavyEquipment) * 50 +
      (currentState.equipment.lightEquipment / requirements.equipment.lightEquipment) * 50
    ));

    const financialScore = Math.min(100, (
      (currentState.financial.capital / requirements.financial.minCapital) * 50 +
      (currentState.financial.bankGuarantee / requirements.financial.bankGuarantee) * 50
    ));

    const overallScore = (personnelScore * 0.4) + (experienceScore * 0.3) + (equipmentScore * 0.15) + (financialScore * 0.15);

    // Generate gaps and recommendations
    const gaps: any[] = [];
    const recommendations: any[] = [];

    // Personnel gaps
    Object.entries(requirements.personnel).forEach(([role, required]) => {
      const current = currentState.personnel[role as keyof typeof currentState.personnel];
      if (current < required) {
        gaps.push({
          category: 'personnel',
          role: role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          current,
          required,
          gap: required - current
        });
        recommendations.push({
          priority: 'high',
          action: `Recruit ${required - current} additional ${role.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          timeline: '3-6 months',
          estimatedCost: (required - current) * 50000000 // Rough estimate per person
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        currentClassification: 'Kualifikasi Menengah', // Mock - would be calculated
        targetClassification,
        overallScore: Math.round(overallScore),
        domainScores: {
          personnel: Math.round(personnelScore),
          experience: Math.round(experienceScore),
          equipment: Math.round(equipmentScore),
          financial: Math.round(financialScore)
        },
        requirements,
        currentState,
        gaps,
        recommendations,
        assessmentDate: assessmentDate || new Date().toISOString(),
        assessedBy: user.email
      }
    });

  } catch (error) {
    console.error('SBU readiness assessment error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to perform SBU readiness assessment'
        }
      },
      { status: 500 }
    );
  }
});