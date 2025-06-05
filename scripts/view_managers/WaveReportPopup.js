class WaveReportPopup {
    static show(message, friend_face_url) {
		MainController.scope.controls.paused = true;
		MainController.report_popup = new RS_Dialog(MainController.language_manager, "wave_report_title", "tpl_report.html", function() {  
            const message_element = MainController.report_popup.root_element.querySelector("#message");
            setTranslatedContent(MainController.language_manager, message_element, message, "innerHTML");
            MainController.report_popup.root_element.querySelector("#friend-face").src = friend_face_url;

            const close_button = MainController.report_popup.root_element.querySelector("#btn_close");
            setTranslatedContent(MainController.language_manager, close_button, "popup_close", "value");
			close_button.addEventListener("click", function() {
                WaveReportPopup.__close();
			});
		});
		document.body.appendChild(MainController.report_popup.root_element);
	}

    static __close() {
        MainController.report_popup.closeModal();
        MainController.report_popup = null;
        MainController.popups_stack.push(ShopPopup);
    }
}