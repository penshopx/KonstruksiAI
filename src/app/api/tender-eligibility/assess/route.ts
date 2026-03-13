import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { TenderEligibilityService, BusinessEntityService, TenderService } from '@/lib/database-service';

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { entityId, tenderId, includeGapAnalysis = false, includeRecommendations = true } = body;

    // Validate required fields
    if (!entityId || !tenderId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'entityId and tenderId are required'
          }
        },
        { status: 400 }
      );
    }

    // Verify user has access to the entity (in a real implementation, check ownership/permissions)
    // For now, we'll allow any authenticated user

    // Check if entity and tender exist
    const [entity, tender] = await Promise.all([
      BusinessEntityService.findById(entityId),
      TenderService.findById(tenderId)
    ]);

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

    if (!tender) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tender not found'
          }
        },
        { status: 404 }
      );
    }

    // Perform eligibility assessment
    const assessment = await TenderEligibilityService.assessEligibility(
      entityId,
      tenderId,
      includeGapAnalysis
    );

    // In a real implementation, this would trigger the agent orchestration workflow
    // For now, return the mock assessment result

    return NextResponse.json({
      success: true,
      data: {
        assessment,
        metadata: {
          entityName: entity.entityName,
          tenderName: tender.tenderName,
          assessedAt: new Date().toISOString(),
          assessedBy: user.email
        }
      }
    });

  } catch (error) {
    console.error('Tender eligibility assessment error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to perform eligibility assessment'
        }
      },
      { status: 500 }
    );
  }
});