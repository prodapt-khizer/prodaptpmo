import { NextResponse } from "next/server";
import Prompts from "../../(models)/prompts";

export async function GET() {
  try {
    const prompts = await Prompts.find();

    return NextResponse.json({ prompts }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await Prompts.create(body);

    return NextResponse.json({ message: "Prompt Created", response }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}