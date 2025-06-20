class ParametersPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() { super(); }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog(MainController.language_manager, "params_title", "tpl_parameters.html", ()=> {
            MainController.language_manager.setTranslatedContent(this.querySelector("#language_lbl"), "params_language_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#music_on_lbl"), "params_music_on_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#music_volume_lbl"), "params_music_volume_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#sound_fx_on_lbl"), "params_sound_fx_on_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#sound_fx_volume_lbl"), "params_sound_fx_volume_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#keyboard_type_lbl"), "params_keyboard_type_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#show_hitboxes_lbl"), "params_show_hitboxes_lbl", "innerHTML");
            MainController.language_manager.setTranslatedContent(this.querySelector("#btn_gamepad_controls"), "params_gamepad_config", "value");
            MainController.language_manager.setTranslatedContent(this.querySelector("#btn_close"), "popup_close", "value");

            this.#removeUnnecessaryContent();
            this.#bindOptions();

            if (onPopupOpened)
                onPopupOpened();
		});
        
		document.body.appendChild(this.rs_dialog_instance.root_element);
		MainController.parameters_popup = this.rs_dialog_instance;
	}

    close() {
        super.close();
        MainController.parameters_popup = null;
    }

    static languageSelectionChanged(value) {
        MainController.language_manager.setLanguage(value);
        MainController.shop_manager.refreshAllShopItems(true);
    }

    #removeUnnecessaryContent() {
        if(!MainController.timer.gamepad_mapper)
            this.querySelector("#btn_gamepad_controls").remove();

        if(Tools.isMediaStadalone()) 
            this.querySelector("#keyboard_type").parentElement.remove();
    }

    #bindOptions() {
        new RS_Binding({
            object: MainController.scope.game,
            property: "showHitboxes"
        }).addBinding(this.querySelector("#show_hitboxes"), "checked", "change", ()=> {
            MainController.UI.refreshAllHitboxesVisibility();
            JuiceHelper.emptyClipPercussion();
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "music_on"
        }).addBinding(this.querySelector("#music_on"), "checked", "change", ()=> {
            JuiceHelper.emptyClipPercussion();
            
            if (MainController.audio_manager.sound_settings.music_on) {
                if (MainController.popups_stack.isShopOpened())
                    JuiceHelper.startShopMusic();
                else JuiceHelper.startWaveMusic();
            } else MainController.audio_manager.stopMusic();
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "sound_fx_on"
        }).addBinding(this.querySelector("#sound_fx_on"), "checked", "change", ()=> {
            JuiceHelper.emptyClipPercussion();
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "music_volume"
        }).addBinding(this.querySelector("#music_volume"), "value", "change", (volume)=> {
            MainController.audio_manager.setMusicVolume(volume);
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "sound_fx_volume"
        }).addBinding(this.querySelector("#sound_fx_volume"), "value", "change", (volume)=> {
            MainController.audio_manager.setSoundFxVolume(volume);
        });
    }

    get FOOTER_LINE() { return 7; }
    #isSelectorInput(line) { return [4, 5].includes(line); }
    #isRangeInput(line) { return [1, 3].includes(line); }
    #setRangeInputValue(input, value) {
        input.value = value;
        input.dispatchEvent(new Event("change"));
        JuiceHelper.popupNavigate();
    }


    /*********  AbstractPopup methods implementation  *********/
    navigateUp() {
        const active_item_position = this.getLineAndColumnNumbers();
        const new_line = active_item_position.line - 1;
        const new_active_ident = `0_${new_line}`;
        this.setActiveItem(new_active_ident);
    }

    navigateDown() {
        const active_item_position = this.getLineAndColumnNumbers();
        const new_line = active_item_position.line + 1;
        const new_col = new_line === this.FOOTER_LINE && this.querySelector("#btn_gamepad_controls") 
                      ? 1 : 0;    // Le bouton de configuration de la manette est prioritaire sur le bouton de fermeture de la fenêtre (UX)
        const new_active_ident = `${new_col}_${new_line}`;
        this.setActiveItem(new_active_ident);
    }

    navigateLeft() {
        const active_item_position = this.getLineAndColumnNumbers();

        if (active_item_position.line === this.FOOTER_LINE) {  // Navigation dans les boutons de pied de popup
            const new_col = active_item_position.column - 1;
            const new_active_ident = `${new_col}_${active_item_position.line}`;
            this.setActiveItem(new_active_ident);
        }

        const input = this.getActiveItem().html_element;

        if (this.#isRangeInput(active_item_position.line)) {   // Réglage des volumes
            if (input.value > input.min)
                this.#setRangeInputValue(input, parseFloat(input.value) - parseFloat(input.step));
        }

        if (this.#isSelectorInput(active_item_position.line))
            input.select_previous();
    }

    navigateRight() {
        const active_item_position = this.getLineAndColumnNumbers();

        if (active_item_position.line === this.FOOTER_LINE) {  // Navigation dans les boutons de pied de popup
            const new_col = active_item_position.column + 1;
            const new_active_ident = `${new_col}_${active_item_position.line}`;
            this.setActiveItem(new_active_ident);
        }

        const input = this.getActiveItem().html_element;
        
        if (this.#isRangeInput(active_item_position.line)) {   // Réglage des volumes
            if (input.value < input.max)
                this.#setRangeInputValue(input, parseFloat(input.value) + parseFloat(input.step));
        }

        if (this.#isSelectorInput(active_item_position.line))
            input.select_next();
    }
}