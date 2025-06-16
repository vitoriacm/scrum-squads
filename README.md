# Daily Scrum - Quadro por Squads

Aplicação web para registro de atividades diárias em squads de desenvolvimento, com exportação para PDF.

## Funcionalidades

✔ **Seleção de Squad e Membro**  
✔ **Registro de tarefas concluídas e impedimentos**  
✔ **Visualização em cards organizados por squad**  
✔ **Exportação para PDF** (com `html2pdf.js`)  
✔ **Exclusão de registros individuais**

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Bibliotecas**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)

## Fluxo de Uso

- Selecione um Squad (ex: `Squad 1 - NodeBrakers`)
- Escolha um Membro (lista carregada automaticamente)
- Preencha:
  - ✅ **O que fez hoje?** (obrigatório)
  - 🚧 **Impedimentos** (opcional)
- Clique em **Adicionar** → Registro aparece no quadro!
- Exporte para PDF quando necessário.

---

## Código Principal

### HTML (`index.html`)

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <!-- Metadados e imports -->
  </head>
  <body>
    <div class="container">
      <form id="dailyForm">
        <!-- Dropdowns de Squad/Membro e campos de input -->
      </form>
      <button id="exportPdf">Exportar para PDF</button>
      <div id="squadsContainer"></div>
      <!-- Quadro dinâmico -->
    </div>
    <script src="js/script.js"></script>
  </body>
</html>
```

### JavaScript (`script.js`)

```javascript
const squadsData = {
  1: [{ id: "Ana", nome: "Ana Vitoria xxxx xxxx " } /* ... */],
  // ... (Squads 2-5, Arrays)
};

// Eventos:
selectSquad.onchange = () => {
  /* Carrega membros */
};
form.onsubmit = (e) => {
  /* Adiciona registro */
};
btnPDF.onclick = () => {
  /* Gera PDF */
};
```

---

## Estrutura de Dados

```javascript
{
  squadId: [
    { id: "membro1", nome: "Nome Completo" },
    // ...
  ];
}
```

---

## Exportação para PDF

Usa a biblioteca `html2pdf.js`.

Configurações:

```javascript
{
  margin: 10,
  filename: `daily-${new Date().toLocaleDateString("pt-BR")}.pdf`,
  html2canvas: { scale: 2 },
  jsPDF: { unit: "mm", format: "a4" }
}
```

---

## Tratamento de Erros

- **Validação:** Verifica se Squad, Membro e Tarefa estão preenchidos.
- **PDF:** Exibe alerta se não houver registros.

---

## Como Executar

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/daily-scrum.git
```

Abra `index.html` no navegador.

---

## Exemplo de Uso

```
1. Selecione: `Squad 3 - Os Refatoradores`
2. Membro: `Fernando xxxxx xxxxx`
3. Tarefa: "Refatoração do módulo de login"
4. Impedimento: "Problema com CORS"
```
