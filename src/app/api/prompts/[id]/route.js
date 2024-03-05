import Prompts from "../../../(models)/prompts";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
    const prompts = await Prompts.find({ title: id });
    return NextResponse.json({ prompts }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const promptData = body;
    console.log("coming");

    const updatePromptData = await Prompts.findByIdAndUpdate(id, {
      ...promptData,
    });

    return NextResponse.json({ message: "Prompt updated", updatedPrompt: updatePromptData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Prompts.findByIdAndDelete(id);
    return NextResponse.json({ message: "Message Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
