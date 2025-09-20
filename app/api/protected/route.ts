export const runtime = "nodejs";
import { createClient } from "../../../lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  // Minimal placeholder
  return NextResponse.json({ message: "Protected route OK" });
}







 
