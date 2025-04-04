// Alors là, franchement, dans un "vrai" langage objet, j'aurais fait une classe abstraite, avec 
//   + letsPlay implémentée 
//   + les méthodes que letsPlay appelle, abstraites : comme ça, ça aurait été utilisable n'importe où, en létat, en héritant de ma classe abstraite...

class MV_Timer {

	/**
	 * Constructeur attendant les références au mapper de manette, ainsi qu'au dictionnaire de contrôles
	 * @param {object} 	gamepad_mapper 	Instance de GamepadControlsMapper (rs_game_engine.js)
	 * @param {object} 	controls_state	Objet mis à jour périodiquement par écoute des différents périphériques de contrôle
	 */
	constructor(gamepad_mapper, controls_state) {
		this.gamepad_mapper = gamepad_mapper;
		this.controls_state = controls_state;
	}

	/**
	 * Lance le timer
	 */
	letsPlay() {
		document.body.scrollTo(0, 0);
		if (!this.controls_state.paused) {
			if (this.gamepad_mapper)
				this.gamepad_mapper.applyControlsMapping();

			this.__applyControls();
			this.__moveEverything();
			this.__testCollides();

			if (this.gamepad_mapper)
				MV_GameInitializer.clearGamepadControls();
		}
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	__applyControls() {
	}

	__moveEverything() {
	}

	__testCollides() {
	}
}

