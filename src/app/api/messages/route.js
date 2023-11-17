import { NextResponse } from "next/server";
import Messages from "@/app/(models)/messages";

export async function GET() {
  try {
    const messages = await Messages.find();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await Messages.create(body);

    return NextResponse.json({ message: "Messages Created", response }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}