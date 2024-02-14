import { NextResponse } from "next/server";
import Tasks from "../../../(models)/tasks";

export async function GET(request, { params }) {
  const { id } = params;
    const tasks = await Tasks.find({ title: id });
    return NextResponse.json({ tasks }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const tasksData = body;
    console.log("coming");

    const updateTaskData = await Tasks.findByIdAndUpdate(id, {
      ...tasksData,
    });

    return NextResponse.json({ message: "Task updated", updatedTask: updateTaskData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Tasks.findByIdAndDelete(id);
    return NextResponse.json({ message: "Task Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
