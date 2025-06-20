class TutorialPopup extends AbstractPopup {
    rs_dialog_instance;

    #fn_on_close;
    #friend_face_url;
    #message

    constructor(options) {
        super();
        this.#fn_on_close = options.on_close || function() {};
        this.#friend_face_url = options.friend_face_url;
        this.#message = options.message;
    }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog(MainController.language_manager, "tutorial_title", "tpl_tutorial.html", ()=> {
            this.#initDisplay();

            this.querySelector("#btn_skip").addEventListener("click", ()=> {
                RS_Confirm(MainController.language_manager, "skip_tuto_confirm", "skip_tuto_title", "skip_tuto_yes", "skip_tuto_no", ()=> {
                        MainController.scope.game.skip_tutorial = true;
                        this.querySelector("#btn_next").dispatchEvent(new Event('click'));
                    }
                );
            })

            onPopupOpened();
		});
        
		document.body.appendChild(this.rs_dialog_instance.root_element);
        MainController.tuto_popup = this.rs_dialog_instance;
	}

    close() {
        super.close();
        MainController.tuto_popup = null;
        this.#fn_on_close();
    }

    #initDisplay() {
        this.querySelector("#friend-face").src = this.#friend_face_url;

        MainController.language_manager.setTranslatedContent(this.querySelector("#message"), this.#message, "innerHTML");
        MainController.language_manager.setTranslatedContent(this.querySelector("#btn_next"), "tutorial_next", "value");
        MainController.language_manager.setTranslatedContent(this.querySelector("#btn_skip"), "tutorial_skip", "value");
    }

    /*********  AbstractPopup methods implementation  *********/
    navigateLeft() {
        const active_item_position = this.getLineAndColumnNumbers();
        const new_col = active_item_position.column - 1;
        const new_active_ident = `${new_col}_${active_item_position.line}`;
        this.setActiveItem(new_active_ident);
    }

    navigateRight() {
        const active_item_position = this.getLineAndColumnNumbers();
        const new_col = active_item_position.column + 1;
        const new_active_ident = `${new_col}_${active_item_position.line}`;
        this.setActiveItem(new_active_ident);
    }
    
    navigateUp() {}
    navigateDown() {}
}