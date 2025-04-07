// Alors là, franchement, dans un "vrai" langage objet, j'aurais fait une classe abstraite, avec 
//   + letsPlay implémentée 
//   + les méthodes que letsPlay appelle, abstraites : comme ça, ça aurait été utilisable n'importe où, en létat, en héritant de ma classe abstraite, tout en laissant toute liberté dans l'implémentation du code spécifique...

class MV_Timer {

	/**
	 * Constructeur attendant les références au mapper de manette, ainsi qu'au dictionnaire de contrôles
	 * @param {object} 	controls_state	Objet mis à jour périodiquement par écoute des différents périphériques de contrôle
	 */
	constructor(controls_state) {
		this.controls_state = controls_state;
		this.gamepad_mapper = null;
	}

	/**
	 * Lance le timer
	 */
	letsPlay() {
		document.body.scrollTo(0, 0);
		this.__applyControls();

		if (!this.controls_state.paused) {
			this.__moveEverything();
			this.__testCollides();

			if (this.gamepad_mapper) 
				this.__applyGamepadControls();
		}

		if (MainController.scope.game.beforeNextShot)
			MainController.scope.game.beforeNextShot--;

		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	__applyControls() {
		this.__applyKeyboardControls();
		this.__applyTouchScreenControls();

		if (this.gamepad_mapper) 
			this.__applyGamepadMenuControls();
		else MV_GameInitializer.clearGamepadControlsState(this.controls_state);  // évite les bugs en cas de déconnexion sauvage de la manette
	}

	__moveEverything() {
		for (let shot of MainController.shots)
			shot.move(true);
	}

	__testCollides() {
	}

	__applyKeyboardControls() {
		if (!this.controls_state.paused) {

		} else {
		}
	}

	__applyTouchScreenControls() {
		if (!this.controls_state.paused) {

		} else {
		}
	}

	__applyGamepadMenuControls() {
		this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);
		if (this.controls_state.paused) {
			// application des commandes de manettes relatives aux menus (le true en second paramètre indique au mapper qu'il doit exécuter l'action secondaire de la commande)
			this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire, true);
		}

	}

	__applyGamepadControls() {
		this.gamepad_mapper.updateJoysticksStates();
		this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire);
		this.__applyJoysticksControls();
	}

	__applyJoysticksControls() {
		let character = MainController.character;
		let leftJoystick = MainController.timer.gamepad_mapper.leftJoystick;
		character.deltaX = leftJoystick.intensity * CHARACTER_SPEED * Math.cos(leftJoystick.angle);
		character.deltaY = leftJoystick.intensity * CHARACTER_SPEED * Math.sin(leftJoystick.angle);
		
		let rightJoystick = MainController.timer.gamepad_mapper.rightJoystick;
		if (rightJoystick.intensity !== 0 && !MainController.scope.game.beforeNextShot) {
			let shot = character.shoot(SHOT_VELOCITY, rightJoystick.angle);
			MainController.addToGameWindow(shot);
			MainController.scope.game.beforeNextShot = SHOT_RELOAD_TIME;
		}
		
		if (rightJoystick.intensity !== 0) // Le personnage regarde où il tire, ou là où il va, dans le cas contraire
			character.angle = rightJoystick.angle * 180 / Math.PI;
		else if (leftJoystick.intensity !== 0)
			character.angle = leftJoystick.angle * 180 / Math.PI;
		character.move();
	}
}

