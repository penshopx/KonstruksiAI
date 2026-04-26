import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { PersonnelService } from '@/lib/database-service';

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { personnelId, targetCompetency, includeDetailedAnalysis = true } = body;

    if (!personnelId || !targetCompetency) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'personnelId and targetCompetency are required'
          }
        },
        { status: 400 }
      );
    }

    // Verify personnel exists
    const personnel = await PersonnelService.findById(personnelId);
    if (!personnel) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Personnel not found'
          }
        },
        { status: 404 }
      );
    }

    // Get personnel with competencies
    const personnelWithCompetencies = await PersonnelService.getWithCompetencies(personnelId);
    if (!personnelWithCompetencies) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Personnel competencies not found'
          }
        },
        { status: 404 }
      );
    }

    // SKK Competency Requirements (based on SK Dirjen Bina Konstruksi No. 114 Tahun 2024)
    const skkRequirements = {
      'SKK Ahli Struktur': {
        education: { required: 'S1 Teknik Sipil', minimum: 'D3 Teknik Sipil' },
        experience: { required: 7, minimum: 5 },
        training: { required: 'Pelatihan Ahli Struktur', hours: 200 },
        certification: { required: 'Sertifikat Kompetensi Ahli Struktur' },
        assessment: { required: true, type: 'Uji Kompetensi' },
        portfolio: { required: true, projects: 3 }
      },
      'SKK Ahli MEP': {
        education: { required: 'S1 Teknik Elektro/Mesin', minimum: 'D3 Teknik Elektro/Mesin' },
        experience: { required: 7, minimum: 5 },
        training: { required: 'Pelatihan Ahli MEP', hours: 200 },
        certification: { required: 'Sertifikat Kompetensi Ahli MEP' },
        assessment: { required: true, type: 'Uji Kompetensi' },
        portfolio: { required: true, projects: 3 }
      },
      'SKK Pengawas': {
        education: { required: 'D3 Teknik Sipil', minimum: 'SMK Teknik Sipil' },
        experience: { required: 3, minimum: 2 },
        training: { required: 'Pelatihan Pengawas', hours: 100 },
        certification: { required: 'Sertifikat Kompetensi Pengawas' },
        assessment: { required: true, type: 'Uji Kompetensi' },
        portfolio: { required: true, projects: 2 }
      }
    };

    const requirements = skkRequirements[targetCompetency as keyof typeof skkRequirements];
    if (!requirements) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid target competency'
          }
        },
        { status: 400 }
      );
    }

    // Current state analysis (mock data - in real implementation, calculate from database)
    const currentState = {
      education: personnel.educationLevel || 'D3 Teknik Sipil',
      experience: personnel.yearsExperience || 4,
      training: {
        completed: 150, // hours
        relevantCourses: ['Pelatihan Struktur Dasar', 'Safety Training']
      },
      certification: personnelWithCompetencies.certifications.length > 0,
      assessment: false, // Mock - would check assessment records
      portfolio: {
        projects: 2,
        relevantExperience: true
      }
    };

    // Calculate competency scores
    const educationScore = (() => {
      const levels = { 'S1': 100, 'D3': 80, 'SMK': 60, 'SMA': 40 };
      const currentLevel = currentState.education.split(' ')[0];
      const requiredLevel = requirements.education.minimum.split(' ')[0];
      return Math.min(100, levels[currentLevel as keyof typeof levels] || 0);
    })();

    const experienceScore = Math.min(100, (currentState.experience / requirements.experience.required) * 100);

    const trainingScore = Math.min(100, (currentState.training.completed / requirements.training.hours) * 100);

    const certificationScore = currentState.certification ? 100 : 0;

    const assessmentScore = currentState.assessment ? 100 : 0;

    const portfolioScore = Math.min(100, (currentState.portfolio.projects / (requirements.portfolio as any).projects) * 100);

    const overallScore = (
      educationScore * 0.2 +
      experienceScore * 0.25 +
      trainingScore * 0.15 +
      certificationScore * 0.15 +
      assessmentScore * 0.15 +
      portfolioScore * 0.1
    );

    // Generate gaps and recommendations
    const gaps: any[] = [];
    const recommendations: any[] = [];

    // Education gap
    if (educationScore < 80) {
      gaps.push({
        category: 'education',
        current: currentState.education,
        required: requirements.education.required,
        gap: true
      });
      recommendations.push({
        priority: 'high',
        action: 'Pursue higher education qualification',
        timeline: '1-2 years',
        estimatedCost: 50000000
      });
    }

    // Experience gap
    if (experienceScore < 80) {
      const expGap = requirements.experience.required - currentState.experience;
      gaps.push({
        category: 'experience',
        current: currentState.experience,
        required: requirements.experience.required,
        gap: expGap
      });
      recommendations.push({
        priority: 'high',
        action: `Gain ${expGap} more years of relevant experience`,
        timeline: `${expGap} years`,
        estimatedCost: 0
      });
    }

    // Training gap
    if (trainingScore < 80) {
      const trainingGap = requirements.training.hours - currentState.training.completed;
      gaps.push({
        category: 'training',
        current: currentState.training.completed,
        required: requirements.training.hours,
        gap: trainingGap
      });
      recommendations.push({
        priority: 'medium',
        action: `Complete ${trainingGap} hours of additional training`,
        timeline: '6-12 months',
        estimatedCost: trainingGap * 500000 // IDR per hour
      });
    }

    // Certification gap
    if (!currentState.certification) {
      gaps.push({
        category: 'certification',
        current: false,
        required: true,
        gap: true
      });
      recommendations.push({
        priority: 'high',
        action: 'Obtain required competency certification',
        timeline: '3-6 months',
        estimatedCost: 5000000
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        personnelName: personnel.fullName,
        currentCompetency: 'SKT Struktur', // Mock - would be calculated
        targetCompetency,
        overallScore: Math.round(overallScore),
        domainScores: {
          education: Math.round(educationScore),
          experience: Math.round(experienceScore),
          training: Math.round(trainingScore),
          certification: certificationScore,
          assessment: assessmentScore,
          portfolio: Math.round(portfolioScore)
        },
        requirements,
        currentState,
        gaps,
        recommendations,
        roadmap: [
          {
            phase: 'Preparation',
            duration: '1-3 months',
            activities: ['Education assessment', 'Training gap analysis', 'Documentation preparation']
          },
          {
            phase: 'Skill Development',
            duration: '3-6 months',
            activities: ['Additional training', 'Experience building', 'Certification preparation']
          },
          {
            phase: 'Assessment',
            duration: '1-2 months',
            activities: ['Competency assessment', 'Portfolio review', 'Final certification']
          }
        ],
        assessmentDate: new Date().toISOString(),
        assessedBy: user.email
      }
    });

  } catch (error) {
    console.error('SKK readiness assessment error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to perform SKK readiness assessment'
        }
      },
      { status: 500 }
    );
  }
});