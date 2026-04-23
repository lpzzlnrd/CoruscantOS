export class NotesApp {
  constructor() {
    this.text = localStorage.getItem("coruscant_notes") || "";
  }
  render() {
    return `
      <div style="display:flex; flex-direction:column; height: 100%;">
        <h2 style="margin-top:0;">Bloc de Notas</h2>
        <textarea class="js-notes-input" style="flex:1; background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:15px; font-family:inherit; resize:none;" placeholder="Escribe tus secretos aquí...">${this.text}</textarea>
        <button class="js-notes-save" type="button" style="margin-top:15px; padding:12px; border-radius:12px; background:var(--accent); color:black; border:none; font-weight:bold; cursor:pointer;">Guardar Nota</button>
      </div>
    `;
  }
  handleAction(target) {
    if (target.classList.contains("js-notes-save")) {
      const input = document.querySelector(".js-notes-input");
      if (input) {
        this.text = input.value;
        localStorage.setItem("coruscant_notes", this.text);
        target.textContent = "¡Guardado!";
        setTimeout(() => target.textContent = "Guardar Nota", 2000);
      }
    }
  }
}
