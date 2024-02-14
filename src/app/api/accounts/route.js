import { NextResponse } from "next/server";
import Accounts from "../../(models)/accounts";

export async function GET() {
  try {
    const accounts = await Accounts.find();

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}