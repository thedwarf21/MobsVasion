class GamepadControls {

	static prepareControls(controller) {
		window.addEventListener('gamepadconnected', (event)=> {
			console.info("Manette connectée");

			let controls = controller.scope.controls;
			let gamepad = new GamepadGenericAdapter();
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.pause, "Pause", ()=> { controller.togglePause(); });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.secondary_fire, "Tir secondaire", ()=> { controls.firing_secondary = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.reload, "Recharger", ()=> { controls.reloading = true; });

			let menu_controls = controls.gamepad_menu_nav;
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_up, "Menu : haut", ()=> { menu_controls.up = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_down, "Menu : bas", ()=> { menu_controls.down = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_left, "Menu : gauche", ()=> { menu_controls.left = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_right, "Menu : droite", ()=> { menu_controls.right = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_validate, "Menu : valider", ()=> { menu_controls.validate = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.menu_cancel, "Menu : annuler", ()=> { menu_controls.cancel = true; });
			controller.timer.gamepad_mapper = gamepad;
			
			let was_paused = controls.paused;
			controls.paused = true;
			controller.scope.gamepadControlsUI = new GamepadConfigUI(gamepad, ()=> { controls.paused = was_paused; });
		});

		window.addEventListener('gamepaddisconnected', (event)=> {
			controller.scope.gamepadControlsUI = null;
			controller.timer.gamepad_mapper = null;
			GamepadControls.clearState(controller.scope.controls);
			controller.togglePause();
		});
	}

	static clearState(controls_state) {
		if (!MainController.scope.controls.mouse_aiming)
			controls_state.firing_primary = false;
		controls_state.firing_secondary = false;
		controls_state.reloading = false;
	}

	static applyMenuControls() {
		MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);

		let active_menu = MainController.timer.getActiveMenu();
		if (MainController.timer.isSomeMenuOpened()) { 
			// on va avoir besoin d'un classe pour abstraire la navigation ;) 
			// mais pour ça, il faut identifier la popup active (au premier plan), pour aiguiller les commandes	
		}
	}
	
	static updateControlsObject() {
		if ( MainController.UI.character ) {
			MainController.timer.gamepad_mapper.updateJoysticksStates();
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.reload);
			GamepadControls.__applyJoysticksControls();
		}
	}

	static __applyJoysticksControls() {
		let character = MainController.UI.character;
		let leftJoystick = MainController.timer.gamepad_mapper.leftJoystick;
		let rightJoystick = MainController.timer.gamepad_mapper.rightJoystick;

		GamepadControls.__applyMoveJoystick(leftJoystick, character);
		GamepadControls.__applyFireJoystick(rightJoystick, character);

		if (rightJoystick.intensity === 0 && !MainController.scope.game.clip_ammo) { // Rechargement automatique si chargeur vide et pas de visée
			MainController.timer.launchReloadingAction();
		}
		
		character.applyAngles();
	}

	static __applyMoveJoystick(joystick, character) {
		if (joystick.intensity !== 0) {
			character.angle = joystick.angle * 180 / Math.PI;
			character.walk(joystick.angle);
		}
	}

	static __applyFireJoystick(joystick, character) {
		if (joystick.intensity !== 0) {
			MainController.scope.controls.firing_primary = true;
			character.aiming_angle = joystick.angle * 180 / Math.PI;
		}
	}
}