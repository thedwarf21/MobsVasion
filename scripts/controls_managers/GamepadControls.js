class GamepadControls {

	static applyMenuControls() {
		MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);
		if (MainController.timer.controls_state.paused) {
			// application des commandes de manettes relatives aux menus (le true en second paramètre indique au mapper qu'il doit exécuter l'action secondaire de la commande)
			// ex: this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire, true);
		}
	}
	static updateControlsObject() {
		if ( MainController.character ) {
			MainController.timer.gamepad_mapper.updateJoysticksStates();
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire);
			MainController.timer.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.reload);
			GamepadControls.__applyJoysticksControls();
		}
	}

	static __applyJoysticksControls() {
		let character = MainController.character;
		let leftJoystick = MainController.timer.gamepad_mapper.leftJoystick;
		let rightJoystick = MainController.timer.gamepad_mapper.rightJoystick;

		GamepadControls.__applyMoveJoystick(leftJoystick, character);
		if (!MainController.primaryReloadGauge)
			GamepadControls.__applyFireJoystick(rightJoystick, character);

		if (rightJoystick.intensity === 0 && !MainController.scope.game.clip_ammo) { // Rechargement automatique si chargeur vide et pas de visée
			MainController.timer.launchReloadingAction();
		}
		
		if (rightJoystick.intensity !== 0) // Le personnage regarde où il vise, ou là où il va s'il ne vise pas
			character.angle = rightJoystick.angle * 180 / Math.PI;
		else if (leftJoystick.intensity !== 0)
			character.angle = leftJoystick.angle * 180 / Math.PI;
		character.move();
	}

	static __applyMoveJoystick(joystick, character) {
		character.deltaX = joystick.intensity * CHARACTER_SPEED * Math.cos(joystick.angle);
		character.deltaY = joystick.intensity * CHARACTER_SPEED * Math.sin(joystick.angle);
	}

	static __applyFireJoystick(joystick, character) {
		MainController.scope.controls.firing_primary = true;
		if (joystick.intensity !== 0 && !MainController.scope.game.waiting_counter.shot) {
			if (MainController.scope.game.clip_ammo) {
				let shot = character.shoot(SHOT_VELOCITY, joystick.angle);
				MainUI.addToGameWindow(shot);
				MainController.scope.game.waiting_counter.shot = TIMEOUTS.shot_interval;
				MainController.scope.game.clip_ammo--;
			}  // En isolant ce if, il suffira d'écrire un else pour jouer un son (CLIC !) avertissant l'utilisateur que son chargeur est vide
		}
	}
}