import { NextResponse } from "next/server";
import Users from "../../(models)/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export async function GET() {
  try {
    const users = await Users.find();

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { email, name, password, password_confirmation } = await req.json();

    if (!Users) {
      console.log(`user not found ${Users}`);
      return NextResponse.json({ error: "User not found" });
    }
    
    // Continue with user registration logic
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" });
    } else {
      if (name && email && password && password_confirmation) {
        if (password === password_confirmation) {
          console.log("name ", {name});
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new Users({
              name: name,
              email: email,
              password: hashPassword,
            });
            await doc.save();
            const saved_user = await Users.findOne({ email: email });
            const token = jwt.sign(
              { userID: saved_user.email },
              "prodaptpmotoolkey"
            );
            return NextResponse.json({
              status: "success",
              message: "Registration Success",
              token: token,
            });
          } catch (error) {
            console.log(error);
            return NextResponse.json({
              status: "failed",
              message: "Unable to Register",
            });
          }
        } else {
          return NextResponse.json({
            status: "failed",
            message: "Password and Confirm Password doesn't match",
          });
        }
      } else {
        return NextResponse.json({
          status: "failed",
          message: "All fields are required",
        });
      }
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return NextResponse.json({ error: "Error during OTP verification" });
  }
}

export async function POST(req, res) {
  try {
    const { email, password } = await req.json();
    if (email && password) {
      const user = await Users.findOne({ email: email });
      console.log("user ", user, email);
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { userID: user.email },
            "prodaptpmotoolkey"
          );
         return NextResponse.json({
            status: "success",
            message: "Login Success",
            token: token,
          });
        } else {
          return NextResponse.json({
            status: "failed",
            message: "Email or Password is not Valid",
          });
        }
      } else {
        return NextResponse.json({
          status: "failed",
          message: "You are not a Registered User",
        });
      }
    } else {
      return NextResponse.json({
        status: "failed",
        message: "All Fields are Required",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Unable to Login" });
  }
}

