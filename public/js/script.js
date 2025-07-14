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
    { id: "Livia", nome: "Livia Santos Alves de Souza" },
    { id: "William", nome: "William Douglas Barreto da Conceição" },
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

  while (selectMembro.options.length > 0) {
    selectMembro.remove(0);
  }

  const defaultOption = new Option("Selecione...", "", false, false);
  defaultOption.disabled = true;
  selectMembro.add(defaultOption);
  selectMembro.selectedIndex = 0;
  selectMembro.value = "";

  if (!squadId) {
    selectMembro.disabled = true;
    return;
  }

  selectMembro.disabled = false;
  const membros = squadsData[squadId] || [];
  membros.forEach((m) => {
    const opt = new Option(m.nome, m.id);
    selectMembro.add(opt);
  });

  resetCampos();
};

function resetCampos() {
  inputTarefa.value = "";
  inputModulo.value = "";
  inputSecao.value = "";
  inputItem.value = "";
  inputBloqueio.value = "";

  inputTarefa.disabled = false;
  inputModulo.disabled = false;
  inputSecao.disabled = false;
  inputItem.disabled = false;

  inputTarefa.classList.remove("disabled-input");
  inputModulo.classList.remove("disabled-input");
  inputSecao.classList.remove("disabled-input");
  inputItem.classList.remove("disabled-input");

  inputTarefa.focus();
}

function toggleInputs() {
  inputTarefa.disabled = false;
  inputModulo.disabled = false;
  inputSecao.disabled = false;
  inputItem.disabled = false;

  inputTarefa.classList.remove("disabled-input");
  inputModulo.classList.remove("disabled-input");
  inputSecao.classList.remove("disabled-input");
  inputItem.classList.remove("disabled-input");
}

inputTarefa.addEventListener("input", toggleInputs);
inputModulo.addEventListener("input", toggleInputs);
inputSecao.addEventListener("input", toggleInputs);
inputItem.addEventListener("input", toggleInputs);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("emailEstagiario");
  const toggleEmailBtn = document.getElementById("toggleEmail");
  const emailEstagiario = emailInput?.value.trim();

  if (!emailEstagiario || !emailEstagiario.includes("@")) {
    alert("Por favor, preencha seu e-mail antes de registrar a Daily!");

    if (emailInput.style.display === "none") {
      emailInput.style.display = "block";
      if (toggleEmailBtn) toggleEmailBtn.textContent = "Ocultar";
    }

    emailInput.focus();
    return;
  }

  const squadId = selectSquad.value;
  const membroId = selectMembro.value;
  const tarefa = String(inputTarefa.value).trim();
  const modulo = String(inputModulo.value).trim();
  const secao = parseInt(inputSecao.value.trim());
  const item = parseInt(inputItem.value.trim());
  const bloqueio = String(inputBloqueio.value).trim();

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
        <span>${squadNames[squadId]}</span>
      </div>
      <div class="entries"></div>
    `;
    container.appendChild(squadEl);
  }

  const membro = squadsData[squadId].find((m) => m.id === membroId);
  const entriesContainer = squadEl.querySelector(".entries");

  const card = document.createElement("div");
  let doneMessage = [...(tarefa && [tarefa])];
  if (modulo) doneMessage.push(`Módulo ${modulo}`);
  if (secao) doneMessage.push(`Seção ${secao}`);
  if (item) doneMessage.push(`Item ${item}`);
  doneMessage = doneMessage.join(" - ");
  card.className = "entry";
  card.innerHTML = `
    <div class="entry-name">${membro.nome}</div>
    <div class="entry-done">✅ Feito: ${doneMessage}</div>
    <div class="entry-${(bloqueio && "blocker") || "done"}">${
    (bloqueio && "🚧 Impedimento: " + bloqueio) || "✔️ Sem bloqueios"
  }</div>
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

  const cards = [...entriesContainer.querySelectorAll(".entry")];
  const nomes = cards.map((el) =>
    el.querySelector(".entry-name").textContent.trim()
  );
  const posicao = nomes.findIndex((n) => n.localeCompare(membro.nome) > 0);
  if (posicao === -1) {
    entriesContainer.appendChild(card);
  } else {
    entriesContainer.insertBefore(card, cards[posicao]);
  }

  try {
    await fetch("https://scrum-squads.onrender.com/squad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(",")[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

btnPDF.onclick = async function () {
  const emailEstagiario = document.getElementById("emailEstagiario")?.value;
  if (!emailEstagiario || !emailEstagiario.includes("@")) {
    alert("Por favor, insira um e-mail válido!");
    return;
  }

  if (
    container.children.length === 0 ||
    (container.children.length === 1 && container.querySelector(".empty-state"))
  ) {
    alert("Adicione registros antes!");
    return;
  }

  this.disabled = true;
  const textoOriginal = this.textContent;
  this.textContent = "Enviando...";

  try {
    const config = {
      margin: 10,
      filename: `daily-${new Date().toLocaleDateString("pt-BR")}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" },
    };

    const clone = container.cloneNode(true);
    clone.querySelectorAll(".squad").forEach((squadEl) => {
      const entriesContainer = squadEl.querySelector(".entries");
      const entries = Array.from(entriesContainer.children);
      const sorted = entries.sort((a, b) => {
        const nomeA = a
          .querySelector(".entry-name")
          ?.textContent.trim()
          .toLowerCase();
        const nomeB = b
          .querySelector(".entry-name")
          ?.textContent.trim()
          .toLowerCase();
        return nomeA.localeCompare(nomeB);
      });
      entriesContainer.innerHTML = "";
      sorted.forEach((el) => entriesContainer.appendChild(el));
    });

    const pdfBlob = await html2pdf().from(clone).set(config).output("blob");
    const pdfBase64 = await blobToBase64(pdfBlob);

    const squadName = selectSquad.options[selectSquad.selectedIndex].text;

    const response = await fetch(
      "https://scrum-squads.onrender.com/api/daily/report",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64,
          userEmail: emailEstagiario,
          squadName,
        }),
      }
    );

    if (!response.ok) throw new Error("Falha no envio");

    await html2pdf().from(clone).set(config).save();

    alert("PDF gerado e enviado com sucesso!");
  } catch (e) {
    console.error("Erro:", e);
    alert("Erro: " + e.message);
  } finally {
    this.disabled = false;
    this.textContent = textoOriginal;
    new JSConfetti().addConfetti();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const toggleEmailBtn = document.getElementById("toggleEmail");
  const emailInput = document.getElementById("emailEstagiario");

  if (toggleEmailBtn && emailInput) {
    toggleEmailBtn.addEventListener("click", function () {
      if (emailInput.style.display === "none") {
        emailInput.style.display = "block";
        toggleEmailBtn.textContent = "Ocultar";
      } else {
        emailInput.style.display = "none";
        toggleEmailBtn.textContent = " Mostrar";
      }
    });
  }
});

window.addEventListener("DOMContentLoaded", () => {
  selectSquad.value = "";
  selectMembro.disabled = true;
});
