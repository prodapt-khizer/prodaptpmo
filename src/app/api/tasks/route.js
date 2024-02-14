import { NextResponse } from "next/server";
import Tasks from "../../(models)/tasks";

export async function GET() {
  try {
    const tasks = await Tasks.find();

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const body = await req.json();

    const response = await Tasks.create(body);

    return NextResponse.json({ message: "Tasks Created", response }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}