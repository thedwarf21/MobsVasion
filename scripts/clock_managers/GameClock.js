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

		GamepadControls.clearGamepadControlsState(this.controls_state);
		setTimeout(() => { this.letsPlay(); }, TIME_INTERVAL);
	}

	__updateControlsObject() {
		KeyboardAndMouseControls.applyControlsObject();
		this.__applyTouchScreenControls();

		if (this.gamepad_mapper)
			GamepadControls.applyMenuControls();
	}

	__performControlsObjectChanges() {
		let character = MainController.UI.character;
		if (character)
			this.__characterActions(character);

		let shots = MainController.UI.shots;
		for (let i = shots.length - 1; i >= 0; i--) {
			let shot = shots[i];
			shot.move(()=> {
				shots.splice(i, 1);
				shot.root_element.remove();
			});
		} 

		for (let monster of MainController.UI.monsters)
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
			let dash_interval = Abilities.getSecondaryReloadInterval();
			MainController.scope.game.waiting_counter.dash = dash_interval;
			let gauge = new MV_Gauge("secondary-reload", dash_interval, 0);
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

	launchReloadingAction() {
		if (!MainController.UI.primaryReloadGauge && MainController.scope.game.clip_ammo < CLIP_SIZE) {
			let reload_time = Abilities.getPrimaryReloadInterval();
			MainController.scope.game.waiting_counter.clip = reload_time;
			
			let gauge = new MV_Gauge("primary-reload", reload_time, 0);
			MainController.UI.primaryReloadGauge = gauge;
			MainController.UI.addToGameWindow(gauge.root_element);
		}
	}

	__testCollides() {
		let monsters = MainController.UI.monsters;

		for (let i = monsters.length - 1; i >= 0; i--) {
			let monster = monsters[i];
			this.__performMonsterAttacks(monster);
			this.__performMonsterWounds(i, monster);
		}
	}

	__performMonsterAttacks(monster) {
		let character = MainController.UI.character;

		if (monster.hitbox.checkCollide(character.hitbox)) {
			AnimationsHelper.hitEffect();
			HealthBarHelper.characterHit(MONSTER_STRENGTH);
		}
	}

	__performMonsterWounds(index, monster) {
		let shots = MainController.UI.shots;
		
		for (let i = shots.length - 1; i >=0; i--) {
			let shot = shots[i];

			if (monster.hitbox.checkCollide(shot.hitbox)) {
				shots.splice(i, 1);
				shot.root_element.remove();
				monster.wound(Abilities.getShotPower(), ()=> {
					MainController.UI.monsters.splice(index, 1);
					MainController.monsterSlayed();
				});
			}					
		}
	}

	/** Contrôles clavier et écran tactile => seront déplacés dans des classes dédiées */
	__applyTouchScreenControls() {
		if (!this.controls_state.paused) {

		} else {
		}
	}
}

