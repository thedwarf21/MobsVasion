class WaveReportPopup extends AbstractPopup {
    rs_dialog_instance;

    #friend_face_url;
    #message

    constructor(options) {
        super();
        this.#friend_face_url = options.friend_face_url;
        this.#message = options.message;
    }

    show(onPopupOpened) {
		this.rs_dialog_instance = new RS_Dialog(MainController.language_manager, "wave_report_title", "tpl_report.html", ()=> {

            MainController.language_manager.setTranslatedContent(this.querySelector("#message"), this.#message, "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#btn_close"), "popup_close", "value");
            
            this.querySelector("#friend-face").src = this.#friend_face_url;

            if (onPopupOpened)
                onPopupOpened();
		});

		document.body.appendChild(this.rs_dialog_instance.root_element);
        MainController.report_popup = this.rs_dialog_instance;
	}

    close() {
        super.close();
        MainController.report_popup = null;
        MainController.popups_stack.push(ShopPopup);
    }
}