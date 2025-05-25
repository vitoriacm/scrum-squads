const form = document.getElementById("dailyForm");
const selectSquad = document.getElementById("squadSelect");
const selectMembro = document.getElementById("memberSelect");
const inputTarefa = document.getElementById("doneInput");
const inputBloqueio = document.getElementById("blockerInput");
const container = document.getElementById("squadsContainer");
const btnPDF = document.getElementById("exportPdf");

const squadNames = {
  1: "Squad 1 - NodeBreakers",
  2: "Squad 2 - NorthSolutions",
  3: "Squad 3 - Os Refatoradores",
  4: "Squad 4 - Push Masters",
  5: "Squad 5 - Hi5",
};

const squadsData = {
  1: [
    { id: "Ana", nome: "Ana Vitoria Cezar Macedo" },
    { id: "David", nome: "David Camargo Rech" },
    { id: "Felipe", nome: "Felipe Lohan Farias dos Santos" },
    { id: "Livia ", nome: "Livia Santos Alves de Souza" },
    { id: "William ", nome: "William Douglas Barreto da Conceição" },
  ],
  2: [
    { id: "erick", nome: "Erick Barros Ferreira Gomes" },
    { id: "pedro", nome: "Pedro Henrique Fernandes Santos" },
    { id: "gustavo-s", nome: "Gustavo de Souza da Silva" },
    { id: "khayan", nome: "Khayan Godinho Ferreira Chagas" },
    { id: "miszael", nome: "Miszael Nunes da Costa" },
  ],
  3: [
    { id: "glenda", nome: "Glenda Souza Fernandes dos Santos" },
    { id: "vitor", nome: "Vitor Pio Vieira" },
    { id: "matheus", nome: "Matheus Lacerda Macedo" },
    { id: "fernando", nome: "Fernando Canabarro Ahnert" },
  ],
  4: [
    { id: "andre", nome: "Andre Luis Almeida Alves" },
    { id: "michael", nome: "Michael Nascimento de Bastos" },
    { id: "gustavo-santos", nome: "Gustavo Souto dos Santos" },
    { id: "sarah", nome: "Sarah Rafaella Feitosa dos Santos" },
    { id: "gabriel", nome: "Gabriel Vinicios de Oliveira" },
  ],
  5: [
    { id: "anderson", nome: "Anderson Moreira Amaral" },
    { id: "luis", nome: "Luis Vinicius Cerqueira Oliveira" },
    { id: "lorraine", nome: "Lorraine Lacerda Brasil Souza" },
    { id: "lucio", nome: "Lucio Filipe Albuquerque do Espirito Santo" },
    { id: "diego", nome: "Diego Wobeto Maglia Muller" },
  ],
};

selectSquad.onchange = function () {
  const squadId = this.value;
  selectMembro.innerHTML = '<option value="" disabled selected>Selecione...</option>';
  if (!squadId) {
    selectMembro.disabled = true;
    return;
  }
  selectMembro.disabled = false;
  const membros = squadsData[squadId] || [];
  for (let i = 0; i < membros.length; i++) {
    const m = membros[i];
    selectMembro.innerHTML += `<option value="${m.id}">${m.nome}</option>`;
  }
};

form.onsubmit = async function (e) {
  e.preventDefault();
  const squadId = selectSquad.value;
  const membroId = selectMembro.value;
  const tarefa = inputTarefa.value.trim();
  const bloqueio = inputBloqueio.value.trim();

  if (!squadId || !membroId || !tarefa) {
    alert("Precisa selecionar squad, membro e descrever a tarefa!");
    return;
  }

  const msgVazio = container.querySelector(".empty-state");
  if (msgVazio) container.removeChild(msgVazio);

  let squadEl = container.querySelector(`.squad-${squadId}`);
  if (!squadEl) {
    squadEl = document.createElement("div");
    squadEl.className = `squad squad-${squadId}`;
    squadEl.innerHTML = `
      <div class="squad-header">
        <span>👥</span>
        <span>${squadNames[squadId]}</span>
      </div>
      <div class="entries"></div>
    `;
    container.appendChild(squadEl);
  }

  const membro = squadsData[squadId].find((m) => m.id === membroId);
  const entriesContainer = squadEl.querySelector(".entries");

  const card = document.createElement("div");
  card.className = "entry";
  card.innerHTML = `
    <div class="entry-name">${membro.nome}</div>
    ${membro.email ? `<div class="member-email">${membro.email}</div>` : ""}
    <div class="entry-done">✅ Feito: ${tarefa}</div>
    ${
      bloqueio
        ? `<div class="entry-blocker">🚧 Impedimento: ${bloqueio}</div>`
        : ""
    }
    <button class="delete-btn">🗑️</button>
  `;

  card.querySelector(".delete-btn").onclick = function () {
    if (confirm("Remover este registro?")) {
      card.remove();
      if (entriesContainer.children.length === 0) {
        squadEl.remove();
        if (container.children.length === 0) {
          container.innerHTML =
            '<div class="empty-state">Nenhum registro ainda</div>';
        }
      }
    }
  };

  entriesContainer.appendChild(card);

  try {
    await fetch("http://localhost:3000/squad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        squad: squadNames[squadId],
        tarefas: tarefa,
        impedimentos: bloqueio,
        membros: membro.nome,
      }),
    });
  } catch (error) {
    console.error("Erro ao salvar no servidor:", error);
  }

  inputTarefa.value = "";
  inputBloqueio.value = "";
  selectMembro.value = "";
  inputTarefa.focus();
};

btnPDF.onclick = async function () {
  if (
    container.children.length === 0 ||
    (container.children.length === 1 && container.querySelector(".empty-state"))
  ) {
    alert("Adicione registros antes!");
    return;
  }

  this.disabled = true;
  const textoOriginal = this.textContent;
  this.textContent = "Gerando...";

  try {
    const config = {
      margin: 10,
      filename: `daily-${new Date().toLocaleDateString("pt-BR")}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" },
    };

    await html2pdf().from(container).set(config).save();
  } catch (e) {
    console.error("Erro ao gerar PDF:", e);
    alert("Opa, algo deu errado!");
  } finally {
    this.disabled = false;
    this.textContent = textoOriginal;
  }
};

window.addEventListener("DOMContentLoaded", () => {
  selectSquad.value = "";
  selectMembro.disabled = true;
});
