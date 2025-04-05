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
		}

		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	__applyControls() {
		this.__applyKeyboardControls();
		this.__applyTouchScreenControls();

		if (this.gamepad_mapper) 
			this.__applyGamepadControls();
		else MV_GameInitializer.clearGamepadControlsState(this.controls_state);  // évite les bugs en cas de déconnexion sauvage de la manette
	}

	__moveEverything() {
	}

	__testCollides() {
	}

	__applyKeyboardControls() {
		if (!this.controls_state.paused) {

		} else {
			let popup = MainController.openedModal;  	// actions à la modale près
		}
	}

	__applyTouchScreenControls() {
		if (!this.controls_state.paused) {

		} else {
			let popup = MainController.openedModal;		// actions à la modale près
		}
	}

	__applyGamepadControls() {
		let popup = MainController.openedModal;		// actions à la modale près
		this.gamepad_mapper.updateJoysticksStates();
		this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);
		
		if (!this.controls_state.paused) {
			this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire);
			this.__applyJoysticksControls();
		} else if (popup) {
			this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire, true);
		}
	}

	__applyJoysticksControls() {
		let character = MainController.character;
		let leftJoystick = MainController.timer.gamepad_mapper.leftJoystick;
		let rightJoystick = MainController.timer.gamepad_mapper.rightJoystick;
		character.deltaX = leftJoystick.intensity * CHARACTER_SPEED * Math.cos(leftJoystick.angle);
		character.deltaY = leftJoystick.intensity * CHARACTER_SPEED * Math.sin(leftJoystick.angle);
		if (leftJoystick.intensity !== 0)
			character.angle = leftJoystick.angle * 180 / Math.PI;
		
		character.move();
	}
}

