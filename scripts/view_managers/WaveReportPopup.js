class WaveReportPopup {
    static show(message, friend_face_url) {
		MainController.scope.controls.paused = true;
		MainController.report_popup = new RS_Dialog(MainController.language_manager, "wave_report_title", "tpl_report.html", function() {  
            const message_element = MainController.report_popup.root_element.querySelector("#message");
            MainController.language_manager.setTranslatedContent(message_element, message, "innerHTML");
            MainController.report_popup.root_element.querySelector("#friend-face").src = friend_face_url;

            const close_button = MainController.report_popup.root_element.querySelector("#btn_close");
            MainController.language_manager.setTranslatedContent(close_button, "popup_close", "value");
			close_button.addEventListener("click", function() {
                WaveReportPopup.close();
			});
		});
		document.body.appendChild(MainController.report_popup.root_element);
	}

    static close() {
        MainController.report_popup.closeModal();
        MainController.report_popup = null;
        MainController.popups_stack.push(ShopPopup);
    }
}