class GamepadConfigPopup {
	constructor(game_controls_mapper, language_manager, onPopupClose) {
		this.controls_mapper = game_controls_mapper;
		this.language_manager = language_manager;
		this.show(onPopupClose);
	}

	show(onPopupClose) {
		this.popup = new RS_Dialog(this.language_manager, "gamepad_config_title", "tpl_gamepad_config.html", ()=> {
			const container = this.popup.root_element.querySelector("#controls-gui-container");
			for (let i=0; i<this.controls_mapper.controls.length; i++) {
				container.appendChild(this.#getConfigInterfaceItem(i));
			}
			const btn_close = this.popup.root_element.querySelector("#btn_close");
			btn_close.value = this.language_manager.getText("popup_close");
			btn_close.addEventListener("click", ()=> { this.closeModal(onPopupClose) });
			document.body.appendChild(this.popup.root_element);
		});
	}

	closeModal(onPopupClose) {
		this.controls_mapper.calibrate();
		this.popup.closeModal(onPopupClose);
	}

	#getConfigInterfaceItem(control_index) {
		const control_mapping_item = this.controls_mapper.controls[control_index]
		const config_interface_item = this.#getItemContainer();
		config_interface_item.appendChild(this.#getItemNameDiv(control_mapping_item.name));
		const button_mapped = this.#getItemMapDiv(control_mapping_item.buttonIndex);
		config_interface_item.appendChild(button_mapped);
		config_interface_item.addEventListener("click", ()=> { this.#itemClicked(button_mapped, control_index); });
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
		control_name.innerHTML = this.language_manager.getText(name);
		return control_name;
	}

	#getItemMapDiv(buttonIndex) {
		const button_mapped = document.createElement("DIV");
		button_mapped.classList.add("button-mapped");
		button_mapped.innerHTML = buttonIndex 
								? this.language_manager.getText("gamepad_config_mapped_lib") + " " + buttonIndex 
								: "-";
		return button_mapped;
	}

	#itemClicked(button_mapped, control_index) {
		button_mapped.innerHTML = this.language_manager.getText("gamepad_config_press_button_lib");
		this.#captureButtonPressed((button_index)=> {
			this.controls_mapper.setControlMapping(control_index, button_index);
			button_mapped.innerHTML = this.language_manager.getText("gamepad_config_mapped_lib") + " " + button_index;
		});
	}

	#captureButtonPressed(fnThen) {
		const interval_id = setInterval(()=> {
			const gamepad = GamepadGenericAdapter.getConnectedGamepad();
			for (let i=0; i<gamepad.buttons.length; i++) {
				if (gamepad.buttons[i].pressed) {
					clearInterval(interval_id);
					fnThen(i);
				}
			}
		}, this.#CAPTURE_INTERVAL);
	}

	get #CAPTURE_INTERVAL() { return 35; }
}