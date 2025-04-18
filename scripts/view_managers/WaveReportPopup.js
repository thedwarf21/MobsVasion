class WaveReportPopup {
    static show(message, friend_face_url, onShopClose) {
		MainController.scope.controls.paused = true;
		MainController.report_popup = new RS_Dialog("report_dialog", "La bataille est terminée...", [], [], [], false, "tpl_report.html", function() {  
            MainController.report_popup.root_element.querySelector("#message").innerHTML = message;  
            MainController.report_popup.root_element.querySelector("#friend-face").src = friend_face_url;

			MainController.report_popup.root_element.querySelector("#btn_close").addEventListener("click", function() {
                WaveReportPopup.__close(onShopClose);
			});
		});
		document.body.appendChild(MainController.report_popup.root_element);
	}

    static __close(onShopClose) {
        MainController.report_popup.closeModal();
        MainController.report_popup = null;
        ShopPopup.show(onShopClose);
    }
}