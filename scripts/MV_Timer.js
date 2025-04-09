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

	/** Exécution d'un TIK d'horlage (paramétré à 50ms, pour le moment => 20 FPS) */
	letsPlay() {
		document.body.scrollTo(0, 0);
		this.__updateControlsObject();

		if (!this.controls_state.paused) {
			if (this.gamepad_mapper)
				this.__updateControlsObjectFromGamepad();
			
			this.__performControlsObjectChanges();
			this.__testCollides();
			this.__decrementWaitingCounters();
		}

		MV_GameInitializer.clearGamepadControlsState(this.controls_state);
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	__decrementWaitingCounters() {
		let counters_object = MainController.scope.game.waiting_counter;
		let counters_names_list = Object.keys(counters_object);
		for (let counter_key of counters_names_list) {
			if (counters_object[counter_key]) {
				counters_object[counter_key]--;
				if (!counters_object[counter_key])
					this.__performCounterEndAction(counter_key);
				else this.__performValueChangeAction(counter_key, counters_object[counter_key]);
			}
		}
	}

	__performValueChangeAction(counter_key, counter_value) {
		switch(counter_key) {
			case "clip":
				MainController.primaryReloadGauge.assignValue(TIMEOUTS.reload_time - counter_value);
				break;
			case "dash":
				MainController.secondaryReloadGauge.assignValue(TIMEOUTS.dash_interval - counter_value);
				break;
			default:
				break;	
		}
	}

	__performCounterEndAction(counter_key) {
		switch(counter_key) {
			case "clip":
				MainController.scope.game.clip_ammo = CLIP_SIZE;
				MainController.primaryReloadGauge.remove();
				break;
			case "dash":
				MainController.secondaryReloadGauge.remove();
				break;
			default:
				break;	
		}
	}

	__updateControlsObject() {
		this.__applyKeyboardControls();
		this.__applyTouchScreenControls();

		if (this.gamepad_mapper)
			this.__applyGamepadMenuControls();
	}

	__performControlsObjectChanges() {
		let character = MainController.character;

		if (this.__mustReload())
			this.__launchReloadingAction();

		if (this.controls_state.firing_secondary && !MainController.secondaryReloadGauge) {
			character.dash();
			this.controls_state.firing_secondary = false;
			MainController.scope.game.waiting_counter.dash = TIMEOUTS.dash_interval;
			MainController.character.appendChild(new MV_Gauge("secondary-reload", TIMEOUTS.dash_interval, 0));
		}

		for (let shot of MainController.shots)
			shot.move(true);

		for (let monster of MainController.monsters)
			monster.follow(character);
	}

	__mustReload() {
		if (this.controls_state.reloading)
			return true;
		if (!this.controls_state.firing_primary && !MainController.scope.game.clip_ammo)
			return true;
		return false;
	}

	__launchReloadingAction() {
		if (!MainController.primaryReloadGauge && MainController.scope.game.clip_ammo < CLIP_SIZE) {
			MainController.scope.game.waiting_counter.clip = TIMEOUTS.reload_time;
			
			let gauge = new MV_Gauge("primary-reload", TIMEOUTS.reload_time, 0);
			MainController.addToGameWindow(gauge);
		}
	}

	__testCollides() {
		let character = MainController.character;
		let monsters = MainController.monsters;
		let shots = MainController.shots;

		for (let monster of monsters) {
			if (monster.hitbox.checkCollide(character.hitbox))
				MainController.scope.game.health_points--;
		}
	}

	/** Contrôles clavier et écran tactile */
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

	/** Contrôles manette */
	__applyGamepadMenuControls() {
		this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.pause);
		if (this.controls_state.paused) {
			// application des commandes de manettes relatives aux menus (le true en second paramètre indique au mapper qu'il doit exécuter l'action secondaire de la commande)
			// ex: this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire, true);
		}
	}
	__updateControlsObjectFromGamepad() {
		this.gamepad_mapper.updateJoysticksStates();
		this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.secondary_fire);
		this.gamepad_mapper.applyControl(GAMEPAD_ACTION_CODES.reload);
		this.__applyJoysticksControls();
	}

	__applyJoysticksControls() {
		let character = MainController.character;
		let leftJoystick = MainController.timer.gamepad_mapper.leftJoystick;
		let rightJoystick = MainController.timer.gamepad_mapper.rightJoystick;

		this.__applyMoveJoystick(leftJoystick, character);
		if (!MainController.primaryReloadGauge)
			this.__applyFireJoystick(rightJoystick, character);

		/** */
		if (rightJoystick.intensity === 0 && !MainController.scope.game.clip_ammo) { // Rechargement automatique si chargeur vide et pas de visée
			this.__launchReloadingAction();
		}
		/** */
		
		if (rightJoystick.intensity !== 0) // Le personnage regarde où il vise, ou là où il va s'il ne vise pas
			character.angle = rightJoystick.angle * 180 / Math.PI;
		else if (leftJoystick.intensity !== 0)
			character.angle = leftJoystick.angle * 180 / Math.PI;
		character.move();
	}

	__applyMoveJoystick(joystick, character) {
		character.deltaX = joystick.intensity * CHARACTER_SPEED * Math.cos(joystick.angle);
		character.deltaY = joystick.intensity * CHARACTER_SPEED * Math.sin(joystick.angle);
	}

	__applyFireJoystick(joystick, character) {
		MainController.scope.controls.firing_primary = true;
		if (joystick.intensity !== 0 && !MainController.scope.game.waiting_counter.shot) {
			if (MainController.scope.game.clip_ammo) {
				let shot = character.shoot(SHOT_VELOCITY, joystick.angle);
				MainController.addToGameWindow(shot);
				MainController.scope.game.waiting_counter.shot = TIMEOUTS.shot_interval;
				MainController.scope.game.clip_ammo--;
			}  // En isolant ce if, il suffira d'écrire un else pour jouer un son (CLIC !) avertissant l'utilisateur que son chargeur est vide
		}
	}
}

