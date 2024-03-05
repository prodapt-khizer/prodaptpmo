import Movies from "../../(models)/movies";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const movies = await Movies.find();
    return NextResponse.json({ movies }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
