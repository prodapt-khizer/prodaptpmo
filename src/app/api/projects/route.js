import { NextResponse } from "next/server";
import Projects from "../../(models)/projects";

export async function GET() {
  try {
    const projects = await Projects.find();

    return NextResponse.json({ projects }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}