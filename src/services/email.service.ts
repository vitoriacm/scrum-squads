import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type EmailParams = {
  userEmail: string;
  pdfBase64: string;
};

const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || "";
const RECIPIENTS = (process.env.SCRUM_MASTER_EMAIL || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export const sendDailyEmail = async ({
  userEmail,
  pdfBase64,
}: EmailParams): Promise<void> => {
  const formattedDate = getFormattedDate();

  const msg = {
    to: RECIPIENTS,
    from: DEFAULT_FROM_EMAIL,
    replyTo: userEmail,
    subject: `[PB ABR25] Registro Daily - ${formattedDate}`,
    text: `Relatório enviado por: ${userEmail}`,
    attachments: [
      {
        content: pdfBase64,
        filename: `daily_${normalizeFileName(userEmail)}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email enviado para: ${RECIPIENTS.join(", ")}`);
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    throw new Error("Falha no serviço de email");
  }
};

const normalizeFileName = (email: string): string => {
  return email.split("@")[0].replace(/\./g, "_").toLowerCase();
};

const getFormattedDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
};
