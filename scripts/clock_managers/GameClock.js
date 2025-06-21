class GameClock {
	#controls_state;
	#UI;
	#game_scope;

	/**
	 * Constructeur attendant les références au mapper de manette, ainsi qu'au dictionnaire de contrôles
	 * @param {object} 	controls_state	Objet mis à jour périodiquement par écoute des différents périphériques de contrôle
	 * @param {object} 	UI				Objet gérant l'UI du jeu
	 * @param {object} 	game_scope		Dictionnaire des données concernant l'état du jeu
	 */
	constructor(controls_state, UI, game_scope) {
		this.#UI = UI;
		this.#controls_state = controls_state;
		this.#game_scope = game_scope;
		
		this.gamepad_mapper = null;
	}

	/** Exécution d'un TIK d'horlage (paramétré à 50ms, pour le moment => 20 FPS) */
	letsPlay() {
		document.body.scrollTo(0, 0);
		this.#updateControlsObject();

		if (!this.#controls_state.paused) {
			if (this.gamepad_mapper)
				GamepadControls.updateControlsObject();
			
			this.#performControlsObjectChanges();
			this.#testCollides();
			WaitingCounters.decrementWaitingCounters();

			if (this.#game_scope.wave_pop.timeouts)
				WaitingCounters.applyWavePopScheduling();
			
			if (MainController.isWaveComplete())
				MainController.waveDefeated();
		}

		GamepadControls.clearState(this.#controls_state);
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	launchReloadingAction() {
		if (!this.#UI.primaryReloadGauge && this.#game_scope.clip_ammo < Abilities.getClipSize()) {
			const reload_time = Abilities.getPrimaryReloadInterval();
			this.#game_scope.waiting_counter.clip = reload_time;
			
			const gauge = MV_Gauge.getInstance("primary-reload", reload_time, 0);
			this.#UI.primaryReloadGauge = gauge;
			this.#UI.character.appendChild(gauge);

			JuiceHelper.reload();
		}
	}

	#updateControlsObject() {
		KeyboardAndMouseControls.applyControlsObject();
		TouchScreenControls.applyControls();

		if (this.gamepad_mapper)
			GamepadControls.applyMenuControls();
	}

	#performControlsObjectChanges() {
		if (this.#UI.character)
			this.#characterActions();

		this.#moveShots(this.#UI.shots);

		for (let i = 0; i < this.#UI.monsters.length; i++) {
			const monster = this.#UI.monsters[i];
			monster.follow(this.#UI.character);
		}
	}

	#moveShots() {
		for (let i = 0; i < this.#UI.shots.length; i++) {
			const shot = this.#UI.shots[i];
			shot.move(()=> { shot.remove(); });
		}
	}

	#characterActions() {
		if (this.#mustReload())
			this.launchReloadingAction();

		if (this.#controls_state.firing_primary && !this.#UI.primaryReloadGauge)
			this.#UI.character.shoot();

		if (this.#controls_state.firing_secondary && !this.#UI.secondaryReloadGauge) {
			this.#UI.character.dash();
			this.#controls_state.firing_secondary = false;
			const dash_interval = Abilities.getSecondaryReloadInterval();
			this.#game_scope.waiting_counter.dash = dash_interval;
			const gauge = MV_Gauge.getInstance("secondary-reload", dash_interval, 0);
			this.#UI.secondaryReloadGauge = gauge;
			this.#UI.character.appendChild( gauge );
		}
	}

	#mustReload() {
		if (this.#controls_state.reloading)
			return true;
		if (!this.#controls_state.firing_primary && !this.#game_scope.clip_ammo)
			return true;
		return false;
	}

	#testCollides() {
		this.#UI.refreshMonstersList();
		this.#monstersAttacksAndWounds();
		this.#testCollidesShotsOnCharacter();
		this.#testCollidesToxicClouds();
	}
	
	#monstersAttacksAndWounds() {
		for (let i = 0; i < this.#UI.monsters.length; i++) {
			const monster = this.#UI.monsters[i];
			monster.attack();
			this.#performMonsterWounds(monster, this.#UI.shots);
		}
	}
	
	#testCollidesShotsOnCharacter() {
		for (let i = 0; i < this.#UI.monster_shots.length; i++) {
			const shot = this.#UI.monster_shots[i];

			if (shot.hitbox.checkCollide(this.#UI.character.hitbox)) {
				HealthBarHelper.characterHit(shot.strength);
				shot.remove();
			}
		}
	}
	
	#testCollidesToxicClouds() {
		for (let i = 0; i < this.#UI.toxic_clouds.length; i++) {
			const toxic_cloud = this.#UI.toxic_clouds[i];

			if (this.#UI.character.hitbox.checkCollide(toxic_cloud.hitbox))
				HealthBarHelper.characterHit(1);
		}
	}

	#performMonsterWounds(monster, shots) {
		for (let i = shots.length - 1; i >=0; i--) {
			const shot = shots[i];

			if (!monster.carried && monster.hitbox.checkCollide(shot.hitbox)) {
				shot.remove();
				shots.splice(i, 1);
				monster.wound(shot.strength, shot.angle);
			}					
		}
	}
}

