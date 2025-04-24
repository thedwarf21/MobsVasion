class ParametersPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() {
        super();
    }

    show() {
        this.rs_dialog_instance = new RS_Dialog("parameters_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", ()=> {
            this.__removeUnnecessaryContent();
            this.__bindShowHitboxesOption();
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
        console.info("ParametersPopup: up");
    }

    navigateDown() {
        console.info("ParametersPopup: down");
    }

    navigateLeft() {
        console.info("ParametersPopup: left");
    }

    navigateRight() {
        console.info("ParametersPopup: right");
    }

    __registerMenuItems() {

    }
}