class WaveReportPopup {
    static show(was_paused) {
		MainController.scope.controls.paused = true;
		MainController.report_popup = new RS_Dialog("report_dialog", "La bataille est terminée...", [], [], [], false, "tpl_report.html", function() {
			MainController.report_popup.querySelector("#btn_close").addEventListener("click", function() {
                WaveReportPopup.__close(was_paused);
			});
		});
		document.body.appendChild(MainController.report_popup);
	}

    static __bindShowHitboxesOption() {
        new RS_Binding({
            object: MainController.scope.game,
            property: "showHitboxes"
        }).addBinding(MainController.parameters_popup.querySelector("#show_hitboxes"), "checked", "change", function() {
            MainController.UI.refreshAllHitboxesVisibility();
        });
    }

    static __close(was_paused) {
        MainController.report_popup.closeModal();
        MainController.report_popup = null;
        if (!was_paused)
            MainController.scope.controls.paused = false;
    }
}