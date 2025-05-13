class ParametersPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() {
        super();
        this.active_item_id = "0_0";
    }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog("parameters_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", ()=> {
            this.__removeUnnecessaryContent();
            this.__bindOptions();

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

    __bindOptions() {
        new RS_Binding({
            object: MainController.scope.game,
            property: "showHitboxes"
        }).addBinding(this.__querySelector("#show_hitboxes"), "checked", "change", ()=> {
            MainController.UI.refreshAllHitboxesVisibility();
            JuiceHelper.emptyClipPercussion();
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "music_on"
        }).addBinding(this.__querySelector("#music_on"), "checked", "change", ()=> {
            MainController.audio_manager.stopMusic();
            JuiceHelper.emptyClipPercussion();
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "sound_fx_on"
        }).addBinding(this.__querySelector("#sound_fx_on"), "checked", "change", ()=> {
            JuiceHelper.emptyClipPercussion();
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "music_volume"
        }).addBinding(this.__querySelector("#music_volume"), "value", "change", (volume)=> {
            MainController.audio_manager.setMusicVolume(volume);
        });
        
        new RS_Binding({
            object: MainController.audio_manager.sound_settings,
            property: "sound_fx_volume"
        }).addBinding(this.__querySelector("#sound_fx_volume"), "value", "change", (volume)=> {
            MainController.audio_manager.setSoundFxVolume(volume);
        });
    }

    /*********  AbstractPopup methods implementation  *********/
    navigateUp() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_line = active_item_position.line - 1;
        let new_active_ident = `0_${new_line}`;
        this.setActiveItem(new_active_ident);
    }

    navigateDown() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_line = active_item_position.line + 1;
        let new_col = new_line === 3 ? 1 : 0;
        let new_active_ident = `${new_col}_${new_line}`;
        this.setActiveItem(new_active_ident);
    }

    navigateLeft() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_col = active_item_position.column - 1;
        let new_active_ident = `${new_col}_${active_item_position.line}`;
        this.setActiveItem(new_active_ident);
    }

    navigateRight() {
        let active_item_position = this.__getLineAndColumnNumbers();
        let new_col = active_item_position.column + 1;
        let new_active_ident = `${new_col}_${active_item_position.line}`;
        this.setActiveItem(new_active_ident);
    }
}