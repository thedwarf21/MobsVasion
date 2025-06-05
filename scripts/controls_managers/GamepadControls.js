class GamepadControls {

	static prepareControls(controller) {
		window.addEventListener('gamepadconnected', (event)=> {
			console.info("Manette connectée");

			const controls = controller.scope.controls;
			const gamepad = new GamepadGenericAdapter();
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.pause, "gamepad_config_pause", ()=> { controller.togglePause(); });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.primary_auto_fire, "gamepad_config_auto_aim", 
										()=> { GamepadControls.__autoAim(); }, 
										()=> { controls.firing_primary = false; }, true);
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.secondary_fire, "gamepad_config_rush", 
										()=> { controls.firing_secondary = true; }, 
										()=> { controls.firing_secondary = false; }, true);
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.reload, "gamepad_config_reload", 
										()=> { controls.reloading = true; },
										()=> { controls.reloading = false; });

			const menu_controls = controls.gamepad_menu_nav;
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_up, 		"gamepad_config_up", 		()=> { menu_controls.up = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_down, 	"gamepad_config_down", 		()=> { menu_controls.down = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_left, 	"gamepad_config_left", 		()=> { menu_controls.left = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_right, 	"gamepad_config_right", 	()=> { menu_controls.right = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_validate, "gamepad_config_validate", 	()=> { menu_controls.validate = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_cancel, 	"gamepad_config_abort", 	()=> { menu_controls.cancel = true; });
			controller.timer.gamepad_mapper = gamepad;
			
			const was_paused = controls.paused;
			controls.paused = true;
			controller.scope.gamepadControlsUI = new GamepadConfigUI(gamepad, controller.language_manager, ()=> { controls.paused = was_paused; });

			const active_popup = controller.popups_stack.activePopup();
			if (active_popup)
				active_popup.highlightActiveItem();
		});

		window.addEventListener('gamepaddisconnected', (event)=> {
			controller.scope.gamepadControlsUI = null;
			controller.timer.gamepad_mapper = null;
			GamepadControls.clearState(controller.scope.controls);
			controller.togglePause();
		});
	}

	static clearState(controls_state) {
		for (const key in controls_state.gamepad_menu_nav)
			controls_state.gamepad_menu_nav[ key ] = false;
	}

	static applyMenuControls() {
		MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);

		const active_popup = MainController.popups_stack.activePopup();
		if (active_popup) {

			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.menu_up);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.menu_down);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.menu_left);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.menu_right);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.menu_validate);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.menu_cancel);
			
			const menu_controls = MainController.scope.controls.gamepad_menu_nav;
			if (menu_controls.up) 			active_popup.navigateUp();
			if (menu_controls.down) 		active_popup.navigateDown();
			if (menu_controls.left) 		active_popup.navigateLeft();
			if (menu_controls.right) 		active_popup.navigateRight();
			if (menu_controls.validate) 	active_popup.trigger();
			if (menu_controls.cancel) 		MainController.popups_stack.pop();
		}
	}
	
	static updateControlsObject() {
		if ( MainController.UI.character ) {
			MainController.timer.gamepad_mapper.updateJoysticksStates();
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.primary_auto_fire);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.reload);
			GamepadControls.__applyJoysticksControls();
		}
	}

	static __autoAim() {
		MainController.scope.controls.firing_primary = true;
		AutoAimHelper.proceed();
	}

	static __applyJoysticksControls() {
		const character = MainController.UI.character;
		const leftJoystick = MainController.timer.gamepad_mapper.leftJoystick;
		const rightJoystick = MainController.timer.gamepad_mapper.rightJoystick;

		GamepadControls.__applyMoveJoystick(leftJoystick, character);
		GamepadControls.__applyFireJoystick(rightJoystick, character);

		if (rightJoystick.intensity === 0 
		  && !MainController.scope.game.clip_ammo 
		  && !MainController.scope.controls.firing_primary) { // Rechargement automatique si chargeur vide et pas de visée
			MainController.timer.launchReloadingAction();
		}
		
		character.applyAngles();
	}

	static __applyMoveJoystick(joystick, character) {
		if (joystick.intensity !== 0) {
			character.angle = joystick.angle;
			character.walk();
		}
	}

	static __applyFireJoystick(joystick, character) {
		if (joystick.intensity !== 0) {
			MainController.scope.controls.firing_primary = true;
			character.aiming_angle = joystick.angle;
		}
	}
}