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
		}

		GamepadControls.clearState(this.#controls_state);
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	launchReloadingAction() {
		if (!this.#UI.primaryReloadGauge && this.#game_scope.clip_ammo < Abilities.getClipSize()) {
			const reload_time = Abilities.getPrimaryReloadInterval();
			this.#game_scope.waiting_counter.clip = reload_time;
			
			const gauge = new MV_Gauge("primary-reload", reload_time, 0);
			this.#UI.primaryReloadGauge = gauge;
			this.#UI.character.root_element.appendChild(gauge.root_element);

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
		this.#moveShots(this.#UI.monster_shots);

		for (const monster of this.#UI.monsters)
			monster.follow(this.#UI.character);
	}

	#moveShots(shots_list) {
		for (let i = shots_list.length - 1; i >= 0; i--) {
			const shot = shots_list[i];
			shot.move(()=> {
				shots_list.splice(i, 1);
				shot.root_element.remove();
			});
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
			const gauge = new MV_Gauge("secondary-reload", dash_interval, 0);
			this.#UI.secondaryReloadGauge = gauge;
			this.#UI.character.root_element.appendChild( gauge.root_element );
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
		this.#testCollidesShotsOnMonsters();
		this.#testCollidesShotsOnCharacter();
		this.#testCollidesToxicClouds();
	}
	
	#testCollidesShotsOnMonsters() {
		for (let i = this.#UI.monsters.length - 1; i >= 0; i--) {
			const monster = this.#UI.monsters[i];
			monster.attack();
			this.#performMonsterWounds(i, monster, this.#UI.shots, Abilities.getShotPower());
			this.#performMonsterWounds(i, monster, this.#UI.monster_shots);
		}
	}
	
	#testCollidesShotsOnCharacter() {
		for (let i = this.#UI.monster_shots.length - 1; i >= 0; i--) {
			const monster_shot = this.#UI.monster_shots[i];
			if (monster_shot.hitbox.checkCollide(this.#UI.character.hitbox)) {
				HealthBarHelper.characterHit(monster_shot.strength);
				monster_shot.root_element.remove();
				this.#UI.monster_shots.splice(i, 1);
			}
		}
	}
	
	#testCollidesToxicClouds() {
		for (const toxic_cloud of this.#UI.toxic_clouds) {
			if (this.#UI.character.hitbox.checkCollide(toxic_cloud.hitbox))
				HealthBarHelper.characterHit(1);
		}
	}

	#performMonsterWounds(index, monster, shots, shot_power) {
		for (let i = shots.length - 1; i >=0; i--) {
			const shot = shots[i];

			if (!monster.carried && monster.hitbox.checkCollide(shot.hitbox)) {
				shots.splice(i, 1);
				shot.root_element.remove();
				monster.wound(shot_power || shot.strength, index, shot.angle);
			}					
		}
	}
}

