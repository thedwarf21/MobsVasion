class GameClock {

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
		this.#updateControlsObject();

		if (!this.controls_state.paused) {
			if (this.gamepad_mapper)
				GamepadControls.updateControlsObject();
			
			this.#performControlsObjectChanges();
			this.#testCollides();
			WaitingCounters.decrementWaitingCounters();

			if (MainController.scope.game.wave_pop.timeouts)
				WaitingCounters.applyWavePopScheduling();
		}

		GamepadControls.clearState(this.controls_state);
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	launchReloadingAction() {
		if (!MainController.UI.primaryReloadGauge && MainController.scope.game.clip_ammo < Abilities.getClipSize()) {
			const reload_time = Abilities.getPrimaryReloadInterval();
			MainController.scope.game.waiting_counter.clip = reload_time;
			
			const gauge = new MV_Gauge("primary-reload", reload_time, 0);
			MainController.UI.primaryReloadGauge = gauge;
			MainController.UI.character.root_element.appendChild(gauge.root_element);

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
		const character = MainController.UI.character;
		if (character)
			this.#characterActions(character);

		this.#moveShots(MainController.UI.shots);
		this.#moveShots(MainController.UI.monster_shots);

		for (const monster of MainController.UI.monsters)
			monster.follow(character);
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

	#characterActions(character) {
		if (this.#mustReload())
			this.launchReloadingAction();

		if (this.controls_state.firing_primary && !MainController.UI.primaryReloadGauge)
			character.shoot();

		if (this.controls_state.firing_secondary && !MainController.UI.secondaryReloadGauge) {
			character.dash();
			this.controls_state.firing_secondary = false;
			const dash_interval = Abilities.getSecondaryReloadInterval();
			MainController.scope.game.waiting_counter.dash = dash_interval;
			const gauge = new MV_Gauge("secondary-reload", dash_interval, 0);
			MainController.UI.secondaryReloadGauge = gauge;
			MainController.UI.character.root_element.appendChild( gauge.root_element );
		}
	}

	#mustReload() {
		if (this.controls_state.reloading)
			return true;
		if (!this.controls_state.firing_primary && !MainController.scope.game.clip_ammo)
			return true;
		return false;
	}

	#testCollides() {
		const monsters = MainController.UI.monsters;
		const character = MainController.UI.character;
		const monster_shots = MainController.UI.monster_shots;

		for (let i = monsters.length - 1; i >= 0; i--) {
			const monster = monsters[i];
			monster.attack();
			this.#performMonsterWounds(i, monster, MainController.UI.shots, Abilities.getShotPower());
			this.#performMonsterWounds(i, monster, MainController.UI.monster_shots);
		}

		for (let i = monster_shots.length - 1; i >= 0; i--) {
			const monster_shot = monster_shots[i];
			if (monster_shot.hitbox.checkCollide(character.hitbox)) {
				HealthBarHelper.characterHit(monster_shot.strength);
				monster_shot.root_element.remove();
				monster_shots.splice(i, 1);
			}
		}

		for (const toxic_cloud of MainController.UI.toxicClouds) {
			if (character.hitbox.checkCollide(toxic_cloud.hitbox))
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

