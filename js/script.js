const form = document.getElementById("dailyForm");
const selectSquad = document.getElementById("squadSelect");
const selectMembro = document.getElementById("memberSelect");
const inputTarefa = document.getElementById("doneInput");
const inputModulo = document.getElementById("moduleInput");
const inputSecao = document.getElementById("sectionInput");
const inputItem = document.getElementById("itemInput");
const inputBloqueio = document.getElementById("blockerInput");
const container = document.getElementById("squadsContainer");
const btnPDF = document.getElementById("exportPdf");

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

  selectMembro.innerHTML =
    '<option value="" disabled selected>Selecione...</option>';

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

function toggleInputs() {
  const tarefaPreenchida = inputTarefa.value.trim().length > 0;
  const moduloPreenchido = inputModulo.value.trim().length > 0;
  const secaoPreenchido = inputSecao.value.trim().length > 0;
  const itemPreenchido = inputItem.value.trim().length > 0;

  // Se tarefa estiver preenchida, desabilita os outros
  if (tarefaPreenchida) {
    inputModulo.disabled = true;
    inputModulo.classList.add("disabled-input");
    inputSecao.disabled = true;
    inputSecao.classList.add("disabled-input");
    inputItem.disabled = true;
    inputItem.classList.add("disabled-input");
  } else if (moduloPreenchido || secaoPreenchido || itemPreenchido) {
    // Se qualquer um dos outros estiver preenchido, desabilita tarefa
    inputTarefa.disabled = true;
    inputTarefa.classList.add("disabled-input");
    inputModulo.disabled = false;
    inputModulo.classList.remove("disabled-input");
    inputSecao.disabled = false;
    inputSecao.classList.remove("disabled-input");
    inputItem.disabled = false;
    inputItem.classList.remove("disabled-input");
  } else {
    // Se nada estiver preenchido, tudo habilitado
    inputTarefa.disabled = false;
    inputModulo.disabled = false;
    inputSecao.disabled = false;
    inputItem.disabled = false;
    inputTarefa.classList.remove("disabled-input");
    inputModulo.classList.remove("disabled-input");
    inputSecao.classList.remove("disabled-input");
    inputItem.classList.remove("disabled-input");
  }
}

inputTarefa.addEventListener("input", toggleInputs);
inputModulo.addEventListener("input", toggleInputs);
inputSecao.addEventListener("input", toggleInputs);
inputItem.addEventListener("input", toggleInputs);

// Ao submeter, limpa e reabilita todos os campos
form.addEventListener("submit", e => {
  e.preventDefault();

  const squadId = selectSquad.value;
  const membroId = selectMembro.value;
  const tarefa = String(inputTarefa.value).trim();
  const modulo = String(inputModulo.value).trim();
  const secao = parseInt(inputSecao.value.trim());
  const item = parseInt(inputItem.value.trim());

  if (!squadId || !membroId) {
    alert("Precisa selecionar squad e membro!");
    return;
  }

  if (!(tarefa || (modulo && secao))) {
    alert("Precisa descrever a tarefa ou informar módulo e seção!");
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
        <span>Squad ${squadId}</span>
      </div>
      <div class="entries"></div>
    `;
    container.appendChild(squadEl);
  }

  const membro = squadsData[squadId].find((m) => m.id === membroId);
  const bloqueio = inputBloqueio.value.trim();
  const entriesContainer = squadEl.querySelector(".entries");

  const card = document.createElement("div");
  let doneMessage = [...(tarefa && [tarefa])];
  if (modulo) {
    doneMessage.push(`Módulo ${modulo}`);
  }
  if (secao) {
    doneMessage.push(`Seção ${secao}`);
  }
  if (item) {
    doneMessage.push(`Item ${item}`);
  }
  doneMessage = doneMessage.join(" - ");
  card.className = "entry";
  card.innerHTML = `
    <div class="entry-name">${membro.nome}</div>
    ${membro.email ? `<div class="member-email">${membro.email}</div>` : ""}
    <div class="entry-done">✅ Feito: ${doneMessage}</div>
    <div class="entry-${bloqueio && 'blocker' || 'done'}">${bloqueio && ('🚧 Impedimento: '+ bloqueio) || '✅ Sem bloqueios'}</div>
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

  inputTarefa.value = "";
  inputModulo.value = "";
  inputSecao.value = "";
  inputItem.value = "";
  inputBloqueio.value = "";
  selectMembro.value = "";
  inputTarefa.focus();
  inputTarefa.disabled = false;
  inputModulo.disabled = false;
  inputSecao.disabled = false;
  inputItem.disabled = false;
  inputTarefa.classList.remove("disabled-input");
  inputModulo.classList.remove("disabled-input");
  inputSecao.classList.remove("disabled-input");
  inputItem.classList.remove("disabled-input");
});

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
  const jsConfetti = new JSConfetti()

  await jsConfetti.addConfetti(/* {
    emojis: ["🎉", "✨", "💖", "🌈", "🚀"],
    emojiSize: 50,
    confettiNumber: 20,
  } */);
  jsConfetti.clearCanvas()
};

window.addEventListener("DOMContentLoaded", () => {
  selectSquad.value = "";
  selectMembro.disabled = true;
});
