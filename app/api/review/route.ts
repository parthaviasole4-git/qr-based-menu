import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, rating, comment } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid rating (1-5) is required' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error('Supabase credentials missing in /api/review');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Use PostgREST to UPDATE the row where phone=eq.[phone]
    const endpoint = `${url}/rest/v1/users?phone=eq.${encodeURIComponent(phone)}`;
    
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ rating, comment: comment || null })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update review:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to save review to database' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Error in /api/review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
