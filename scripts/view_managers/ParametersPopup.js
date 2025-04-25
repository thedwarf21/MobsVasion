class ParametersPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() {
        super();
        this.active_item_id = "0_0";
    }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog("parameters_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", ()=> {
            this.__removeUnnecessaryContent();
            this.__bindShowHitboxesOption();

            if (onPopupOpened)
                onPopupOpened();
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
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_line = active_item_position.line - 1;
        let new_active_ident = `0_${new_line}`;
        this.__setActiveItem(new_active_ident);
    }

    navigateDown() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_line = active_item_position.line + 1;
        let new_active_ident = `1_${new_line}`;
        this.__setActiveItem(new_active_ident);
    }

    navigateLeft() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_col = active_item_position.column - 1;
        let new_active_ident = `${new_col}_${active_item_position.line}`;
        this.__setActiveItem(new_active_ident);
    }

    navigateRight() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_col = active_item_position.column + 1;
        let new_active_ident = `${new_col}_${active_item_position.line}`;
        this.__setActiveItem(new_active_ident);
    }

    __registerMenuItems() {
        let navigable_elements = this.__querySelectorAll("[nav-ident]");
        for (let html_element of navigable_elements) {
            this.__registerMenuItem(html_element.getAttribute("nav-ident"), html_element);
        }
    }
}