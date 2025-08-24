import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailParams = {
  userEmail: string;
  pdfBase64: string;
};

const RECIPIENTS = (process.env.SCRUM_MASTER_EMAIL || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

const getEmailSubject = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `[PB ABR25] Registro Daily - ${day}/${month}`;
};

export const sendDailyEmail = async ({ userEmail, pdfBase64 }: EmailParams) => {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "",
      to: RECIPIENTS,
      replyTo: userEmail,
      subject: getEmailSubject(),
      text: `Relatório enviado por: ${userEmail}`,
      attachments: [
        {
          filename: `daily_${normalizeFileName(userEmail)}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    console.log(`✅ Email enviado para: ${RECIPIENTS.join(", ")}`);
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    throw new Error("Falha no envio com Resend");
  }
};

const normalizeFileName = (email: string) =>
  email.split("@")[0].replace(/\./g, "_").toLowerCase();
