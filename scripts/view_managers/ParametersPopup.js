class ParametersPopup extends AbstractPopup {

    static show() {
		MainController.parameters_popup = new RS_Dialog("parameters_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", function() {
            ParametersPopup.__removeUnnecessaryContent();
            ParametersPopup.__bindShowHitboxesOption();

			MainController.parameters_popup.root_element.querySelector("#btn_close").addEventListener("click", function() {
                MainController.popups_stack.pop();
			});
		});
		document.body.appendChild(MainController.parameters_popup.root_element);
	}

    static __removeUnnecessaryContent() {
        if(!MainController.timer.gamepad_mapper)
            MainController.parameters_popup.root_element.querySelector("#btn_gamepad_controls").remove();
    }

    static __bindShowHitboxesOption() {
        new RS_Binding({
            object: MainController.scope.game,
            property: "showHitboxes"
        }).addBinding(MainController.parameters_popup.root_element.querySelector("#show_hitboxes"), "checked", "change", function() {
            MainController.UI.refreshAllHitboxesVisibility();
        });
    }

    static close() {
        MainController.parameters_popup.closeModal();
        MainController.parameters_popup = null;
    }
}