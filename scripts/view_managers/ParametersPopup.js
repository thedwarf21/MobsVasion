class ParametersPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() {
        super();
    }

    show() {
        this.rs_dialog_instance = new RS_Dialog("parameters_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", ()=> {
            this.__removeUnnecessaryContent();
            this.__bindShowHitboxesOption();

			this.__querySelector("#btn_close").addEventListener("click", ()=> {
                MainController.popups_stack.pop();
			});
		});
        
		document.body.appendChild(this.rs_dialog_instance.root_element);
		MainController.parameters_popup = this.rs_dialog_instance;
	}

    __removeUnnecessaryContent() {
        if(!MainController.timer.gamepad_mapper)
            this.__querySelector("#btn_gamepad_controls").remove();
    }

    __bindShowHitboxesOption() {
        new RS_Binding({
            object: MainController.scope.game,
            property: "showHitboxes"
        }).addBinding(this.__querySelector("#show_hitboxes"), "checked", "change", ()=> {
            MainController.UI.refreshAllHitboxesVisibility();
        });
    }

    /*********  AbstractPopup methods implementation  *********/
    navigateUp() {

    }

    navigateDown() {
        
    }

    navigateLeft() {
        
    }

    navigateRight() {

    }

    trigger(item_ident) {
        
    }

    __registerMenuItems() {

    }
}