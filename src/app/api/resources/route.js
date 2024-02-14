import { NextResponse } from "next/server";
import Resources from "../../(models)/resources";

export async function GET() {
  try {
    const resources = await Resources.find();

    return NextResponse.json({ resources }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}