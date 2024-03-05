import { NextResponse } from "next/server";
import Messages from "../../../(models)/messages";

export async function GET(request, { params }) {
  const { id } = params;
    const messages = await Messages.find({ _id: id });
    return NextResponse.json({ messages }, { status: 200 });
}

export async function POST(request, { params }) {
  const { id } = params;
    const messages = await Messages.find({ user: id });
    return NextResponse.json({ messages }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const messgaeData = body;

    const updateMessageData = await Messages.findByIdAndUpdate(id, {
      ...messgaeData,
    });

    return NextResponse.json({ message: "Message updated", updatedMessage: updateMessageData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Messages.findByIdAndDelete(id);
    return NextResponse.json({ message: "Message Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
