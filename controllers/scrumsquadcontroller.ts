import { Request, Response } from "express";
import { getScrumSquads, saveScrumSquad } from "../services/scrumsquadservice";

export const fetchScrumSquads = async (_req: Request, res: Response): Promise<void> => {
  try {
    const squadsDB = await getScrumSquads();

    const squads = squadsDB.map((registro) => ({
      id: registro.Id,
      squad: registro.Squad,
      tarefas: registro.Tarefas,
      impedimentos: registro.Impedimentos,
      membros: registro.Membros,
      dataRegistro: registro.data_registro,
    }));

    res.status(200).json(squads);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao buscar os Scrum Squads", error: error.message });
  }
};

export const postSquad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { squad, tarefas, impedimentos, membros } = req.body;

    if (!squad || !tarefas || !membros) {
      res.status(400).json({ message: "Squad, tarefas e membros são obrigatórios." });
      return;
    }

    await saveScrumSquad({
      Squad: squad,
      Tarefas: tarefas,
      Impedimentos: impedimentos,
      Membros: membros,
    });

    res.status(201).json({ message: "Registro adicionado com sucesso!" });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao adicionar o registro", error: error.message });
  }
};
