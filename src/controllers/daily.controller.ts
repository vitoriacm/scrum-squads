import { Request, Response } from "express";
import { sendDailyEmail } from "../services/email.service";

export const sendReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pdfBase64, userEmail, squadName } = req.body;

    if (!pdfBase64 || !userEmail || !squadName) {
      res.status(400).json({ error: "Dados incompletos" });
      return;
    }
    await sendDailyEmail({
      userEmail,
      pdfBase64,
    });

    res.json({ success: true, message: "Relatório enviado!" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao enviar relatório" });
  }
};
