import db from "../config/database";

interface ScrumSquad {
  Id?: number;
  Squad: string;
  Tarefas: string | null;
  Impedimentos: string | null;
  data_registro?: string;
}

export function getScrumSquads(): Promise<ScrumSquad[]> {
  return db("registros").select("*");
}

export function saveScrumSquad(squadData: Omit<ScrumSquad, "Id" | "data_registro">) {
  return db("registros").insert({
    Squad: squadData.Squad,
    Tarefas: squadData.Tarefas,
    Impedimentos: squadData.Impedimentos,
    data_registro: new Date().toISOString().split("T")[0],
  });
}

