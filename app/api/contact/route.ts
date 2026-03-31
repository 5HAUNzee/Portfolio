import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_CONTACT_TABLE = "contact_messages";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not configured." },
        { status: 500 }
      );
    }

    if (supabaseKey.length < 20) {
      return NextResponse.json(
        { error: "Supabase key looks invalid or truncated. Please verify your key in .env.local." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const contactTable = process.env.SUPABASE_CONTACT_TABLE || DEFAULT_CONTACT_TABLE;

    const { error } = await supabase.from(contactTable).insert({
      name,
      email,
      message,
    });

    if (error) {
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            error: `Supabase table '${contactTable}' was not found. Create it first in Supabase SQL Editor or set SUPABASE_CONTACT_TABLE to an existing table.`,
            code: error.code,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: `Supabase insert failed: ${error.message}`,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
