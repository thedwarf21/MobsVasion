class GamepadControls {

	static prepareControls(controller) {
		window.addEventListener('gamepadconnected', (event)=> {
			console.log("Manette connectée");

			let controls = controller.scope.controls;
			let gamepad = new GamepadGenericAdapter();
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.pause, "Pause", ()=> { controller.togglePause(); });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.secondary_fire, "Tir secondaire", ()=> { controls.firing_secondary = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.reload, "Recharger", ()=> { controls.reloading = true; });
			controller.timer.gamepad_mapper = gamepad;
			
			let was_paused = controls.paused;
			controls.paused = true;
			controller.scope.gamepadControlsUI = new GamepadConfigUI(gamepad, ()=> { controls.paused = was_paused; });
		});

		window.addEventListener('gamepaddisconnected', (event)=> {
			controller.scope.gamepadControlsUI = null;
			controller.timer.gamepad_mapper = null;
			GamepadControls.clearGamepadControlsState(controller.scope.controls);
			controller.togglePause();
		});
	}

	static clearGamepadControlsState(controls_state) {
		if (!MainController.scope.controls.mouse_aiming)
			controls_state.firing_primary = false;
		controls_state.firing_secondary = false;
		controls_state.reloading = false;
	}

	static applyMenuControls() {
		MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);
		if (MainController.timer.controls_state.paused) {
			// application des commandes de manettes relatives aux menus (le true en second paramètre indique au mapper qu'il doit exécuter l'action secondaire de la commande)
			// ex: this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire, true);
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