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
				GamepadControls.updateControlsObject();
			
			this.__performControlsObjectChanges();
			this.__testCollides();
			WaitingCounters.decrementWaitingCounters();

			if (MainController.scope.game.wave_pop.timeouts)
				WaitingCounters.applyWavePopScheduling();
		}

		MV_GameInitializer.clearGamepadControlsState(this.controls_state);
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	__updateControlsObject() {
		this.__applyKeyboardControls();
		this.__applyTouchScreenControls();

		if (this.gamepad_mapper)
			GamepadControls.applyMenuControls();
	}

	__performControlsObjectChanges() {
		let character = MainController.character;

		if (this.__mustReload())
			this.launchReloadingAction();

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

	launchReloadingAction() {
		if (!MainController.primaryReloadGauge && MainController.scope.game.clip_ammo < CLIP_SIZE) {
			MainController.scope.game.waiting_counter.clip = TIMEOUTS.reload_time;
			
			let gauge = new MV_Gauge("primary-reload", TIMEOUTS.reload_time, 0);
			MainUI.addToGameWindow(gauge);
		}
	}

	__testCollides() {
		let monsters = MainController.monsters;

		for (let monster of monsters) {
			this.__performMonsterAttacks(monster);
			this.__performMonsterWounds(monster);
		}
	}

	__performMonsterAttacks(monster) {
		let character = MainController.character;

		if (monster.hitbox.checkCollide(character.hitbox)) {
			MainController.scope.game.health_points--;
			MainUI.checkPanicMode();

			if (!MainController.scope.game.health_points)
				console.info("On dirait bien que tu es mort... mais pour l'instant, c'est pas géré")
		}
	}

	__performMonsterWounds(monster) {
		let shots = MainController.shots;
		for (let shot of shots) {
			if (monster.hitbox.checkCollide(shot.hitbox)) {
				shot.remove();
				monster.wound(1, MV_GameScope.monsterSlayed);
			}					
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
}

