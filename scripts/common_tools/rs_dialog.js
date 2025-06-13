class RS_Dialog {
    root_element;
    content_element;

    /**
     * Construit une boîte de de dialogue, centrtée sur un bloc de fond
     * @param {MV_LanguageManager} language_manager 
     * @param {string} title_key 
     * @param {string} urlHtmlContent 
     * @param {function} onAfterContentLoad 
     */
    constructor(language_manager, title_key, urlHtmlContent, onAfterContentLoad) {
        this.root_element = document.createElement("DIV");
        this.root_element.classList.add("rs-modal-bg");
        this.#initPopup(language_manager, title_key, urlHtmlContent, onAfterContentLoad);
    }

    /**
     * Ferme la fenêtre modale, puis exécute la fonction passée en paramètre, si présente
     * @param {function} onPopupClosed 
     */
    closeModal(onPopupClosed) {
        const popup = this.root_element.querySelector(".rs-modal");
        popup.classList.add("rs-closed");

        setTimeout(() => {
            popup.parentNode.remove();
            if (onPopupClosed)
                onPopupClosed();
        }, 500);
    }

    /**
     * Initialise la boîte de dialogue, l'injecte dans le fond, puis la rend visible
     * @param {MV_LanguageManager} language_manager 
     * @param {string} title_key 
     * @param {string} urlHtmlContent 
     * @param {function} onAfterContentLoad 
     */
    #initPopup(language_manager, title_key, urlHtmlContent, onAfterContentLoad) {
        const popup = document.createElement("DIV");
        popup.classList.add("rs-modal");
        popup.classList.add("rs-closed");

        popup.appendChild(this.#getHeaderElement(language_manager, title_key));
        this.#initContentElement()
        popup.appendChild(this.content_element);
        this.#applyTemplateParams(urlHtmlContent, onAfterContentLoad);

        this.root_element.appendChild(popup);
        setTimeout(() => { popup.classList.remove("rs-closed") }, 25);
    }

    /**
     * Construit et retourne l'élément d'entête de la popup
     * @param {MV_LanguageManager} language_manager 
     * @param {string} title_key 
     * @returns HTMLDivElement
     */
    #getHeaderElement(language_manager, title_key) {
        const header = document.createElement("DIV");
        header.classList.add("rs-modal-title");
        language_manager.setTranslatedContent(header, title_key, "innerHTML");
        return header;
    }

    /**
     * Construit l'élément de corps de la popup dans la propriété `content_element` de l'objet
     */
    #initContentElement() {
        this.content_element = document.createElement("DIV");
        this.content_element.classList.add("rs-modal-content");
    }

    /**
     * Applique le template HTML et la fonction d'initialisation, au corps de la popup 
     * @param {string} urlHtmlContent 
     * @param {function} onAfterContentLoad
     */
     #applyTemplateParams(urlHtmlContent, onAfterContentLoad) {
        if (urlHtmlContent)
            routage(urlHtmlContent, onAfterContentLoad, this.content_element);
    }

    appendToContent(elt) { this.content_element.appendChild(elt); }
    removeFromContent(elt) { this.content_element.removeChild(elt); }
    setContentInnerHTML(html) { this.content_element.innerHTML = html; }
}

/**
 * Construit et injecte dans la page, une "alert popup"
 * @param {MV_LanguageManager} language_manager 
 * @param {string} content_key 
 * @param {string} title_key 
 * @param {string} lbl_btn_key 
 * @param {function} callback 
 */
function RS_Alert(language_manager, content_key, title_key, lbl_btn_key, callback) {
    const popup = new RS_Dialog(language_manager, title_key);
    popup.appendToContent(getDialogBodyElement(language_manager, content_key));
    popup.appendToContent(
        getPopupFooter(language_manager,
            [{
                text_key: lbl_btn_key,
                on_click: () => {
                    popup.closeModal();
                    if (callback)
                        callback();
                }
            }]
        )
    );

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
    const popup = new RS_Dialog(language_manager, title_key);
    popup.appendToContent(getDialogBodyElement(language_manager, question_key));
    popup.appendToContent(
        getPopupFooter(language_manager, [{
            text_key: lbl_yes_key,
            on_click: () => {
                popup.closeModal();
                if (fn_yes)
                    fn_yes();
            }
        }, {
            text_key: lbl_no_key,
            on_click: () => {
                popup.closeModal();
                if (fn_no)
                    fn_no();
            }
        }]
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
    language_manager.setTranslatedContent(div_body, text_key, "innerHTML");
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
    language_manager.setTranslatedContent(button, text_key, "value");
    button.addEventListener("click", () => { on_click(); });
    return button;
}

/**
 * Construit et retourne un footer contenant deux boutons
 * @param {MV_LanguageManager} language_manager 
 * @param {array} buttons_params_list
 * @returns HTMLDivElement
 */
function getPopupFooter(language_manager, buttons_params_list) {
    const footer = document.createElement("DIV");
    footer.classList.add("dialog-footer");

    for (const button_params of buttons_params_list)
        footer.appendChild(getButton(language_manager, button_params.text_key, () => { button_params.on_click(); }));

    return footer;
}