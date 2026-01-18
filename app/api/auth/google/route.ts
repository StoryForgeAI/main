import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const { credential } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // fontos: service_key kell
  );

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: credential,
  });

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}
