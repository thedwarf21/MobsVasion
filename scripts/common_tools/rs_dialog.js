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
    for (let classe of bgClassList)
      this.root_element.classList.add(classe);

    // Ensuite on construit la boîte de dialogue en elle-même
    let popup = document.createElement("DIV");
    popup.id = name + "_container";
    popup.classList.add("rs-modal");
    popup.classList.add("rs-closed");
    for (let classe of containerClassList)
      popup.classList.add(classe);

    // Création et ajout à la boîte de dialogue du header
    let header = document.createElement("DIV");
    header.innerHTML = title;
    header.classList.add("rs-modal-title");
    popup.appendChild(header);
    
    // On ajoute un bouton de fermeture de la boîte de dialogue (si besoin)
    if (showCloseBtn) {
      let btn = document.createElement("INPUT");
      btn.setAttribute("type", "button");
      btn.value = "X";
      btn.classList.add("rs-close-btn");
      btn.addEventListener("click", ()=> { this.closeModal(); });
      header.appendChild(btn);
    }
    
    // Création et ajout à la boîte de dialogue de la div de contenu
    let content = document.createElement("DIV");
    content.id = name;
    content.classList.add("rs-modal-content");
    for (let classe of classList)
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
    let popup = this.root_element.getElementsByClassName("rs-modal")[0];
    let close_btn_col = popup.getElementsByClassName("rs-close-btn");
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
  let popup = new RS_Dialog("confirm_box", titre, [], [], [], false);
  
  // Ajout de la question au contenu de la popup
  let div_msg = document.createElement("DIV");
  div_msg.style.height = "calc(100% - 60px)";
  div_msg.style.display = "flex";
  div_msg.style.flexDirection = "column";
  div_msg.style.justifyContent = "space-around";
  div_msg.innerHTML = msg;
  popup.appendToContent(div_msg);

  // Création de la <div> contenant les boutons
  let div_btn = document.createElement("DIV");
  div_btn.style.height = "60px";
  div_btn.style.display = "flex";
  div_btn.style.flexDirection = "row";
  div_btn.style.justifyContent = "space-around";

  // Création du bouton "Oui"
  let btn = document.createElement("INPUT");
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

/*********************************************************************************
 * Génère une boîte de dialogue demandant confirmation pour une action donnée    *
 *********************************************************************************
 * @param | {string}   | question | Message à afficher dans la boîte de dialogue *
 * @param | {string}   | titre    | Titre de la boîte de dialogue                *
 * @param | {string}   | lbl_yes  | Libellé du bouton "Oui"                      *
 * @param | {string}   | lbl_no   | Libellé du bouton "Non"                      *
 * @param | {function} | fn_yes   | Fonction à exécuter si "Oui"                 *
 * @param | {function} | fn_no    | Fonction à exécuter si "Non"                 *
 *********************************************************************************/
function RS_Confirm(question, titre, lbl_yes, lbl_no, fn_yes, fn_no) {
  let popup = new RS_Dialog("confirm_box", titre, [], [], [], false);
  
  // Ajout de la question au contenu de la popup
  let div_msg = document.createElement("DIV");
  div_msg.classList.add("dialog-body");
  div_msg.innerHTML = question;
  popup.appendToContent(div_msg);

  // Création de la <div> contenant les boutons
  let div_btn = document.createElement("DIV");
  div_btn.classList.add("dialog-footer");

  // Création du bouton "Oui"
  let btn_yes = document.createElement("INPUT");
  btn_yes.setAttribute("type", "button");
  btn_yes.classList.add("rs-btn-action");
  btn_yes.classList.add("rs-btn-create");
  btn_yes.classList.add("main-form");
  btn_yes.value = lbl_yes;
  btn_yes.addEventListener("click", ()=> {
    popup.closeModal();
    if (fn_yes)
      fn_yes();
  });

  // Création du bouton "Non"
  let btn_no = document.createElement("INPUT");
  btn_no.setAttribute("type", "button");
  btn_no.classList.add("rs-btn-action");
  btn_no.classList.add("rs-btn-suppr");
  btn_no.classList.add("main-form");
  btn_no.value = lbl_no;
  btn_no.addEventListener("click", ()=> {
    popup.closeModal();
    if (fn_no)
      fn_no();
  });

  // Ajout des boutons à la boîte de dialogue et affichage
  div_btn.appendChild(btn_yes);
  div_btn.appendChild(btn_no);
  popup.appendToContent(div_btn);
  document.body.appendChild(popup.root_element);
}
