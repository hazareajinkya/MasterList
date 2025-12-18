import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, password } = body;

    // Get v2 credentials from environment variables
    const v2AdminId = process.env.V2_ADMIN_ID;
    const v2Password = process.env.V2_PASSWORD;

    if (!v2AdminId || !v2Password) {
      console.error('V2_ADMIN_ID or V2_PASSWORD environment variable not set');
      return NextResponse.json(
        { error: 'V2 authentication not configured', success: false },
        { status: 500 }
      );
    }

    if (!adminId || !password) {
      return NextResponse.json(
        { error: 'Admin ID and password are required', success: false },
        { status: 400 }
      );
    }

    if (adminId !== v2AdminId || password !== v2Password) {
      return NextResponse.json(
        { error: 'Invalid admin ID or password', success: false },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, adminId });
  } catch (error) {
    console.error('Error in v2 auth:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

