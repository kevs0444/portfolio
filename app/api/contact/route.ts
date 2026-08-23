import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill out all fields." },
        { status: 400 }
      );
    }

    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass) {
      console.error("EMAIL_PASS is not configured in .env");
      return NextResponse.json(
        { error: "Server email configuration is missing." },
        { status: 500 }
      );
    }

    // Configure the transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "markevinalcantara40@gmail.com",
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: "markevinalcantara40@gmail.com", // Authenticated user
      to: "markevinalcantara40@gmail.com",   // Send to yourself
      replyTo: email,                        // Reply to the user's email
      subject: `Portfolio Contact: ${subject}`,
      text: `You have received a new message from your portfolio contact form.\n\nSender Email: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
