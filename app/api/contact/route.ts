import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, rateLimitHeaders } from "../../lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const defaultContactEmail = "markevinalcantara40@gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requestId() {
  return crypto.randomUUID().slice(0, 8);
}

function deliveryErrorCode(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";
  const responseCode = error && typeof error === "object" && "responseCode" in error
    ? Number(error.responseCode)
    : undefined;
  if (code === "EAUTH" || responseCode === 535) return "EMAIL_AUTH_FAILED";
  if (["ETIMEDOUT", "ESOCKET", "ECONNECTION", "ECONNRESET"].includes(code)) return "EMAIL_CONNECTION_FAILED";
  return "EMAIL_DELIVERY_FAILED";
}

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  const id = requestId();
  const requestLimit = await rateLimit(request, {
    namespace: "contact",
    limit: 3,
    windowSeconds: 30 * 60,
  });
  if (!requestLimit.allowed) {
    return NextResponse.json({
      error: `Too many messages were submitted. Please try again in ${requestLimit.retryAfter} seconds.`,
      code: "EMAIL_RATE_LIMITED",
      requestId: id,
    }, { status: 429, headers: rateLimitHeaders(requestLimit) });
  }
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
  // Gmail displays app passwords in four groups. Removing whitespace makes values
  // pasted into Vercel behave the same as values loaded by local dotenv files.
  const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");
  if (!emailPass) {
    console.error("Portfolio contact email is not configured", { requestId: id });
    return NextResponse.json({
      error: "Contact email is not configured in this deployment.",
      code: "EMAIL_NOT_CONFIGURED",
      requestId: id,
    }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
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
    const publicCode = deliveryErrorCode(error);
    const details = error && typeof error === "object"
      ? {
          name: "name" in error ? String(error.name) : "Error",
          code: "code" in error ? String(error.code) : "unknown",
          responseCode: "responseCode" in error ? Number(error.responseCode) : undefined,
        }
      : { name: "Error", code: "unknown" };
    console.error("Portfolio contact delivery failed", { requestId: id, ...details });
    const errorMessage = publicCode === "EMAIL_AUTH_FAILED"
      ? "Contact email authentication failed in this deployment."
      : publicCode === "EMAIL_CONNECTION_FAILED"
        ? "The contact email service could not be reached."
        : "Message could not be sent. Please email Mar Kevin directly.";
    return NextResponse.json({ error: errorMessage, code: publicCode, requestId: id }, { status: 502 });
  }
}
