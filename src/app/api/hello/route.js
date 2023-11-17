import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({name:'Khizer Hussain'}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}