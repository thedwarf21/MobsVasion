class ParametersPopup {
    static show(was_paused) {
		MainController.scope.controls.paused = true;
		MainController.parameters_popup = new RS_Dialog("parameters_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", function() {
            ParametersPopup.__removeUnnecessaryContent();
            ParametersPopup.__bindShowHitboxesOption();

			MainController.parameters_popup.querySelector("#btn_close").addEventListener("click", function() {
                ParametersPopup.__close(was_paused);
			});
		});
		document.body.appendChild(MainController.parameters_popup);
	}

    static __removeUnnecessaryContent() {
        if(!MainController.timer.gamepad_mapper)
            MainController.parameters_popup.querySelector("#btn_gamepad_controls").remove();
    }

    static __bindShowHitboxesOption() {
        new RS_Binding({
            object: MainController.scope.game,
            property: "showHitboxes"
        }).addBinding(MainController.parameters_popup.querySelector("#show_hitboxes"), "checked", "change", function() {
            MainController.refreshAllHitboxesVisibility();
        });
    }

    static __close(was_paused) {
        MainController.parameters_popup.closeModal();
        MainController.parameters_popup = null;
        if (!was_paused)
            MainController.scope.controls.paused = false;
    }
}