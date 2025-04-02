class RS_GameTimer {

	/**
	 * Constructeur attendant les références au mapper de manette, ainsi qu'au dictionnaire de contrôles
	 * @param {object} 	gamepad_mapper 	Instance de GamepadControlsMapper (rs_game_engine.js)
	 * @param {object} 	controls 		Objet mis à jour périodiquement par écoute des différents périphériques de contrôle
	 */
	constructor(gamepad_mapper, controls) {
		this.gamepad_mapper = gamepad_mapper;
		this.controls = controls;
	}

	/**
	 * Lance le timer
	 */
	letsPlay() {
		document.body.scrollTo(0, 0);
		if (!this.controls.paused) {
			if (this.gamepad_mapper)
				this.gamepad_mapper.applyControlsMapping();

			this.__applyControls();
			this.__moveEverything();
			this.__testCollides();

			if (this.gamepad_mapper)
				this.clearGamepadControls();
		}
		setTimeout(this.letsPlay, TIME_INTERVAL);
	}

	/**
	 * Applique les commandes actuellement pressées
	 */
	static __applyControls() {
	}

	/**
	 * Déclenche le mouvement de chaque élément
	 */
	static __moveEverything() {
	}

	/**
	 * Effectue les tests de collision
	 */
	static __testCollides() {
	}
}

