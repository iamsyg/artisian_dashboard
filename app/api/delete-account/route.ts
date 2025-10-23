import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PROTECTED_UID = process.env.PROTECTED_UID!; 

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Prevent deletion of account
    if (userId === PROTECTED_UID) {
      return NextResponse.json(
        { error: "Error" },
        { status: 403 }
      );
    }

    // 1️⃣ Delete Auth user
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) throw deleteAuthError;

    // 2️⃣ Delete seller row (products cascade automatically)
    const { error: deleteSellerError } = await supabaseAdmin
      .from("sellers")
      .delete()
      .eq("user_id", userId);

    if (deleteSellerError) throw deleteSellerError;

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting account:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}

