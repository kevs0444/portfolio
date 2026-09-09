import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const maxDuration = 30;

const defaultContactEmail = "markevinalcantara40@gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const email = clean(payload.email, 254);
  const subject = clean(payload.subject, 120).replace(/[\r\n]+/g, " ");
  const message = clean(payload.message, 5000);

  if (!email || !subject || !message) {
    return NextResponse.json({ error: "Please fill out all fields." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const emailUser = process.env.EMAIL_USER?.trim() || defaultContactEmail;
  const emailTo = process.env.CONTACT_TO_EMAIL?.trim() || defaultContactEmail;
  const emailPass = process.env.EMAIL_PASS?.trim();
  if (!emailPass) {
    return NextResponse.json({ error: "Contact email is unavailable right now." }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    await transporter.sendMail({
      from: { name: "Mar Kevin Portfolio", address: emailUser },
      to: emailTo,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: [
        "You received a new message from your portfolio contact form.",
        "",
        `Sender: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    const details = error && typeof error === "object"
      ? { name: "name" in error ? String(error.name) : "Error", code: "code" in error ? String(error.code) : "unknown" }
      : { name: "Error", code: "unknown" };
    console.error("Portfolio contact delivery failed", details);
    return NextResponse.json({ error: "Message could not be sent. Please email Mar Kevin directly." }, { status: 502 });
  }
}
