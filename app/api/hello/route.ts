import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Env TEST:', process.env.TEST); // ✅ logs to terminal during request
  return NextResponse.json({ success: true });
}