class GamepadConfigPopup extends AbstractPopup {
    rs_dialog_instance;

    #controls_mapper;

	get #CAPTURE_INTERVAL() { return 35; }
    get #FOOTER_LINE() { return this.#controls_mapper.controls.length; }

	constructor(game_controls_mapper) {
        super();
		this.#controls_mapper = game_controls_mapper;
	}

	show(onPopupOpened) {
		this.rs_dialog_instance = new RS_Dialog(MainController.language_manager, "gamepad_config_title", "tpl_gamepad_config.html", ()=> {
			const container = this.querySelector("#controls-gui-container");

            for (let i=0; i<this.#controls_mapper.controls.length; i++)
				container.appendChild(this.#getConfigInterfaceItem(i));

            const btn_close = this.querySelector("#btn_close");
			btn_close.value = MainController.language_manager.getText("popup_close");
            btn_close.setAttribute("nav-ident", `0_${this.#FOOTER_LINE}`);
            onPopupOpened();
		});

		document.body.appendChild(this.rs_dialog_instance.root_element);
        MainController.gamepad_config_popup = this.rs_dialog_instance;
	}

	close() {
        super.close();
		this.#controls_mapper.calibrate();
        MainController.gamepad_config_popup = null;
	}

	#getConfigInterfaceItem(control_index) {
		const control_mapping_item = this.#controls_mapper.controls[control_index]
		const config_interface_item = this.#getItemContainer();
		config_interface_item.appendChild(this.#getItemNameDiv(control_mapping_item.name));
		const button_mapped = this.#getItemMapDiv(control_mapping_item.buttonIndex);
		config_interface_item.appendChild(button_mapped);
		config_interface_item.addEventListener("click", ()=> { this.#itemClicked(button_mapped, control_index); });
        config_interface_item.setAttribute("nav-ident", `0_${control_index}`);
		return config_interface_item;
	}

	#getItemContainer() {
		const config_interface_item = document.createElement("DIV");
		config_interface_item.classList.add("control-item-container");
		return config_interface_item;
	}

	#getItemNameDiv(name) {
		const control_name = document.createElement("DIV");
		control_name.classList.add("control-name");
		control_name.innerHTML = MainController.language_manager.getText(name);
		return control_name;
	}

	#getItemMapDiv(buttonIndex) {
		const button_mapped = document.createElement("DIV");
		button_mapped.classList.add("button-mapped");
		button_mapped.innerHTML = buttonIndex 
								? MainController.language_manager.getText("gamepad_config_mapped_lib") + " " + buttonIndex 
								: "-";
		return button_mapped;
	}

	#itemClicked(button_mapped, control_index) {
		button_mapped.innerHTML = MainController.language_manager.getText("gamepad_config_press_button_lib");
		this.#captureButtonPressed((button_index)=> {
			this.#controls_mapper.setControlMapping(control_index, button_index);
			button_mapped.innerHTML = MainController.language_manager.getText("gamepad_config_mapped_lib") + " " + button_index;
		});
	}

	#captureButtonPressed(fnThen) {
		const interval_id = setInterval(()=> {
			const gamepad = GamepadGenericAdapter.getConnectedGamepad();
			for (let i=0; i<gamepad.buttons.length; i++) {
				if (gamepad.buttons[i].pressed && !this.#isValidationButton(i)) {
					clearInterval(interval_id);
					fnThen(i);
				}
			}
		}, this.#CAPTURE_INTERVAL);
	}

	#isValidationButton(button_index) {
		for (const action of this.#controls_mapper.controls)
			if (action.buttonIndex === button_index)
				return action.code === GAMEPAD_ACTION_CODES.menu_validate;
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
        const new_active_ident = `0_${new_line}`;
        this.setActiveItem(new_active_ident);
    }
    
    navigateLeft() {}
    navigateRight() {}
}