class RS_Toast {

  constructor(html_content) {
    this.root_element = document.createElement("DIV");
    this.root_element.classList.add("toast");
    this.root_element.innerHTML = html_content;
  }

  /** Cache le toast, puis le retire du DOM, à la fin de l'animation */
  hide() {
    this.root_element.classList.add("hide");
    setTimeout(()=> { this.root_element.remove(); }, 500);
  }

  /**
   * Crée un toast afin de l'ajouter au corps de document.
   * Quand <lasting_time> ms sont écoulées, fait disparaître le toast.
   *
   * @param      {string}  html_content  Contenu à afficher (au format HTML)
   * @param      {number}  lasting_time  Temps d'affichage du toast (en ms)
   */
  static show(html_content, lasting_time) {
    const toast = new RS_Toast(html_content);
    document.body.appendChild(toast.root_element);
    setTimeout(()=> { toast.hide(); }, lasting_time);
  }
}
