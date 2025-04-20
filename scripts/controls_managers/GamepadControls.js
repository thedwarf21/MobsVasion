class GamepadControls {

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
			character.deltaX = joystick.intensity * CHARACTER_SPEED * Math.cos(joystick.angle);
			character.deltaY = joystick.intensity * CHARACTER_SPEED * Math.sin(joystick.angle);
			character.move();
		}
	}

	static __applyFireJoystick(joystick, character) {
		if (joystick.intensity !== 0) {
			MainController.scope.controls.firing_primary = true;
			character.aiming_angle = joystick.angle * 180 / Math.PI;
		}
	}
}