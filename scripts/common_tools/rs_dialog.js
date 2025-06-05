//---------------------------------------------------------------------------------------------------
//                               Boîte de dialogue personnalisée
//---------------------------------------------------------------------------------------------------
class RS_Dialog {

  /*******************************************************************************************
   * Génère une boîte de dialogue et retourne l'objet destiné à recevoir le contenu          *
   *******************************************************************************************
   * @param | {string}  | id                 | ID à affecter à la popup                      *
   * @param | {string}  | title              | Titre à afficher en entête                    *
   * @param | {Array}   | bgClassList        | Liste des classes CSS du fond                 *
   * @param | {Array}   | containerClassList | Liste des classes CSS de la modale            *
   * @param | {Array}   | classList          | Liste des classes CSS du contenu              *
   * @param | {boolean} | showCloseBtn       | Permet de ne pas mettre de bouton X           *
   * @param | {string}  | urlHtmlContent     | URL du template HTML                          *
   * @param | {Function}| onAfterContentLoad | Hook exécuté après injection du template HTML *
   *******************************************************************************************
   * @return              {DOMElement}               La DIV de contenu                       *
   *******************************************************************************************/
  constructor(id, title, bgClassList, containerClassList, classList, showCloseBtn, urlHtmlContent, onAfterContentLoad) {
    
    this.root_element = document.createElement("DIV");
    this.root_element.id = id;
    this.root_element.classList.add("rs-modal-bg");
    for (const classe of bgClassList)
      this.root_element.classList.add(classe);

    // Ensuite on construit la boîte de dialogue en elle-même
    const popup = document.createElement("DIV");
    popup.classList.add("rs-modal");
    popup.classList.add("rs-closed");
    for (const classe of containerClassList)
      popup.classList.add(classe);

    // Création et ajout à la boîte de dialogue du header
    const header = document.createElement("DIV");
    header.innerHTML = title;
    header.classList.add("rs-modal-title");
    popup.appendChild(header);
    
    // On ajoute un bouton de fermeture de la boîte de dialogue (si besoin)
    if (showCloseBtn) {
      const btn = document.createElement("INPUT");
      btn.setAttribute("type", "button");
      btn.value = "X";
      btn.classList.add("rs-close-btn");
      btn.addEventListener("click", ()=> { this.closeModal(); });
      header.appendChild(btn);
    }
    
    // Création et ajout à la boîte de dialogue de la div de contenu
    const content = document.createElement("DIV");
    content.classList.add("rs-modal-content");
    for (const classe of classList)
      content.classList.add(classe);
    popup.appendChild(content);

    // Si un template est paramétré, on l'utilise comme contenu HTML
    if (urlHtmlContent) {
      if (onAfterContentLoad)
        routage(urlHtmlContent, onAfterContentLoad, content);
      else routage(urlHtmlContent, null, content);
    }

    // Intégration de la boîte de dialogue au corps de document
    this.root_element.appendChild(popup);
    setTimeout(()=> { popup.classList.remove("rs-closed") }, 25);
  }

  /*****************************************
   * Fonction fermant la boîte de dialogue *
   *****************************************/
  closeModal(onPopupClosed) {
    const popup = this.root_element.getElementsByClassName("rs-modal")[0];
    const close_btn_col = popup.getElementsByClassName("rs-close-btn");
    if (close_btn_col.length)
      close_btn_col[0].remove();
    popup.classList.add("rs-closed");

    // On attend la fin de l'animation pour supprimer le nœud et exécuter le hook
    setTimeout(()=> { 
      popup.parentNode.remove(); 
      if (onPopupClosed)
        onPopupClosed();
    }, 500);
  }

  /***************************************************************
   * Accès rapide aux méthodes de manipulation de DOM du content *
   ***************************************************************/
  appendToContent(elt) { this.root_element.getElementsByClassName("rs-modal-content")[0].appendChild(elt); }
  removeFromContent(elt) { this.root_element.getElementsByClassName("rs-modal-content")[0].removeChild(elt); }
  setContentInnerHTML(html) { this.root_element.getElementsByClassName("rs-modal-content")[0].innerHTML = html; }
}

/*******************************************************************
 * Génère une boîte de dialogue permettant de figer le code        *
 * le temps que l'utilisateur ait lu le message                    *
 *******************************************************************
 * @param | {string}   | msg      | Message                        *
 * @param | {string}   | titre    | Titre de la boîte de dialogue  *
 * @param | {string}   | lbl_btn  | Libellé du bouton de fermeture *
 * @param | {Function} | callback | Action différée                *
 *******************************************************************/
function RS_Alert(msg, titre, lbl_btn, callback) {
  const popup = new RS_Dialog("confirm_box", titre, [], [], [], false);
  
  // Ajout de la question au contenu de la popup
  const div_msg = document.createElement("DIV");
  div_msg.style.height = "calc(100% - 60px)";
  div_msg.style.display = "flex";
  div_msg.style.flexDirection = "column";
  div_msg.style.justifyContent = "space-around";
  div_msg.innerHTML = msg;
  popup.appendToContent(div_msg);

  // Création de la <div> contenant les boutons
  const div_btn = document.createElement("DIV");
  div_btn.style.height = "60px";
  div_btn.style.display = "flex";
  div_btn.style.flexDirection = "row";
  div_btn.style.justifyContent = "space-around";

  // Création du bouton "Oui"
  const btn = document.createElement("INPUT");
  btn.setAttribute("type", "button");
  btn.classList.add("rs-btn-action");
  btn.classList.add("rs-btn-create");
  btn.classList.add("main-form");
  btn.value = lbl_btn;
  btn.addEventListener("click", ()=> {
    popup.closeModal();
    if (callback)
      callback();
  });

  // Ajout des boutons à la boîte de dialogue et affichage
  div_btn.appendChild(btn);
  popup.appendToContent(div_btn);
  document.body.appendChild(popup.root_element);
}

/**
 * Construit et injecte dans la page, une "confirm popup"
 * @param {MV_LanguageManager} language_manager 
 * @param {string} question_key 
 * @param {string} title_key 
 * @param {string} lbl_yes_key 
 * @param {string} lbl_no_key 
 * @param {function} fn_yes 
 * @param {function} fn_no 
 */
function RS_Confirm(language_manager, question_key, title_key, lbl_yes_key, lbl_no_key, fn_yes, fn_no) {
  const title = language_manager.getText(title_key);
  const popup = new RS_Dialog("confirm_box", title, [], [], [], false);
  
  popup.appendToContent( getDialogBodyElement(language_manager, question_key) );
  popup.appendToContent(
    getConfirmFooter(language_manager, lbl_yes_key, lbl_no_key, ()=> {
        popup.closeModal();
        if (fn_yes)
          fn_yes();
      }, ()=> {
        popup.closeModal();
        if (fn_no)
          fn_no();
      }
    )
  );

  document.body.appendChild(popup.root_element);
}

/**
 * Construit et retourne un corps de popup
 * @param {MV_LanguageManager} language_manager 
 * @param {string} text_key 
 * @returns HTMLDivElement
 */
function getDialogBodyElement(language_manager, text_key) {
  const div_body = document.createElement("DIV");
  div_body.classList.add("dialog-body");
  setTranslatedContent(language_manager, div_body, text_key, "innerHTML");
  return div_body;
}

/**
 * Construit et retourne un bouton
 * @param {MV_LanguageManager} language_manager 
 * @param {string} text_key 
 * @param {function} on_click 
 * @returns HTMLInputElement
 */
function getButton(language_manager, text_key, on_click) {
  const button = document.createElement("INPUT");
  button.setAttribute("type", "button");
  button.classList.add("rs-btn-action");
  button.classList.add("main-form");
  setTranslatedContent(language_manager, button, text_key, "value");
  button.addEventListener("click", ()=> { on_click(); });
  return button;
}

/**
 * Construit et retourne un footer contenant deux boutons
 * @param {MV_LanguageManager} language_manager 
 * @param {string} lbl_yes_key 
 * @param {string} lbl_no_key 
 * @param {function} fn_yes 
 * @param {function} fn_no 
 * @returns HTMLDivElement
 */
function getConfirmFooter(language_manager, lbl_yes_key, lbl_no_key, fn_yes, fn_no) {
  const footer = document.createElement("DIV");
  footer.classList.add("dialog-footer");
  footer.appendChild( getButton(language_manager, lbl_yes_key, ()=> { fn_yes(); }) );
  footer.appendChild( getButton(language_manager, lbl_no_key, ()=> { fn_no(); }) );
  return footer;
}

/**
 * Prépare un élément pour sa prise en charge par le LanguageManager, et applique la traduction
 * @param {MV_LanguageManager} language_manager 
 * @param {HTMLElement} element 
 * @param {string} text_key 
 * @param {string} target_property 
 */
function setTranslatedContent(language_manager, element, text_key, target_property) {
  element.setAttribute("text-key", text_key);
  element.setAttribute("translated-property", target_property);
  element[target_property] = language_manager.getText(text_key);
}
