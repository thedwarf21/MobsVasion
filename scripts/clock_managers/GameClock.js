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

	__updateControlsObject() {
		KeyboardAndMouseControls.applyControlsObject();
		TouchScreenControls.applyControls();

		if (this.gamepad_mapper)
			GamepadControls.applyMenuControls();
	}

	__performControlsObjectChanges() {
		const character = MainController.UI.character;
		if (character)
			this.__characterActions(character);

		const shots = MainController.UI.shots;
		for (let i = shots.length - 1; i >= 0; i--) {
			const shot = shots[i];
			shot.move(()=> {
				shots.splice(i, 1);
				shot.root_element.remove();
			});
		} 

		for (const monster of MainController.UI.monsters)
			monster.follow(character);
	}

	__characterActions(character) {
		if (this.__mustReload())
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

	__mustReload() {
		if (this.controls_state.reloading)
			return true;
		if (!this.controls_state.firing_primary && !MainController.scope.game.clip_ammo)
			return true;
		return false;
	}

	__testCollides() {
		const monsters = MainController.UI.monsters;

		for (let i = monsters.length - 1; i >= 0; i--) {
			const monster = monsters[i];
			this.__performMonsterAttacks(monster);
			this.__performMonsterWounds(i, monster);
		}
	}

	__performMonsterAttacks(monster) {
		const character = MainController.UI.character;

		if (monster.hitbox.checkCollide(character.hitbox)) {
			JuiceHelper.hitEffect();
			HealthBarHelper.characterHit(MONSTER_STRENGTH);
		}
	}

	__performMonsterWounds(index, monster) {
		const shots = MainController.UI.shots;
		
		for (let i = shots.length - 1; i >=0; i--) {
			const shot = shots[i];

			if (monster.hitbox.checkCollide(shot.hitbox)) {
				shots.splice(i, 1);
				shot.root_element.remove();
				monster.wound(Abilities.getShotPower(), index);
			}					
		}
	}
}

