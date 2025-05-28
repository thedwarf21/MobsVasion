class WaitingCounters {
    static applyWavePopScheduling() {
		const wave_pop_params = MainController.scope.game.wave_pop;
		const next_entry = wave_pop_params.timeouts[0];
		
		if (wave_pop_params.elapsed === next_entry.ticks_number) {
			MainController.wave_generator.popMonsterRandomly( next_entry.monster_type );
			wave_pop_params.timeouts.shift();
			
			if (!wave_pop_params.timeouts.length) {
				MainController.scope.game.wave_pop.timeouts = null;
			}
		}
		wave_pop_params.elapsed++;
	}

	static decrementWaitingCounters() {
		const counters_object = MainController.scope.game.waiting_counter;
		const counters_names_list = Object.keys(counters_object);
		for (const counter_key of counters_names_list) {
			if (counters_object[counter_key]) {
				counters_object[counter_key]--;
				if (!counters_object[counter_key])
					WaitingCounters.__performCounterEndAction(counter_key);
				else WaitingCounters.__performValueChangeAction(counter_key, counters_object[counter_key]);
			}
		}

		this.__decrementMonsterAttackCounters();
		this.__animateFlyingMonsters();
	}

	static clear() {
		const counters_object = MainController.scope.game.waiting_counter;
		const counters_names_list = Object.keys(counters_object);
		for (const counter_key of counters_names_list)
			counters_object[counter_key] = 0;

		MainController.scope.game.attacking_monsters = [];
		MainController.scope.game.flying_monsters = [];
	}

	static removeAttackCounter(monster) {
		const attacks = MainController.scope.game.attacking_monsters;
		for (let i = 0; i < attacks.length; i++) {
			const attacking_monster = attacks[i];

			if (attacking_monster.monster === monster)
				attacks.splice(i, 1);
		}
	}

	static removeFlyingMonster(monster) {
		const animations = MainController.scope.game.flying_monsters;
		for (let i = 0; i < animations.length; i++) {
			const flying_monster = animations[i];

			if (flying_monster.monster === monster)
				animations.splice(i, 1);
		}
	}

	static __performValueChangeAction(counter_key, counter_value) {
		switch(counter_key) {
			case "clip":
				MainController.UI.primaryReloadGauge.assignValue(Abilities.getPrimaryReloadInterval() - counter_value);
				break;
			case "dash":
				MainController.UI.secondaryReloadGauge.assignValue(Abilities.getSecondaryReloadInterval() - counter_value);
				break;
			default:
				break;	
		}
	}

	static __performCounterEndAction(counter_key) {
		switch(counter_key) {
			case "clip":
				MainController.scope.game.clip_ammo = Abilities.getClipSize();
				MainController.UI.primaryReloadGauge.root_element.remove();
				MainController.UI.primaryReloadGauge = null;
				break;
			case "dash":
				MainController.UI.secondaryReloadGauge.root_element.remove();
				MainController.UI.secondaryReloadGauge = null;
				break;
			default:
				break;	
		}
	}

	static __decrementMonsterAttackCounters() {
		for (const attacking_monster of MainController.scope.game.attacking_monsters) {
			const monster = attacking_monster.monster;

			if (!monster.aiming_locked_while_attacking)
				monster.aimPlayer();
			
			attacking_monster.time--;
			if (!attacking_monster.time)
				monster.performAttack();
			else monster.attack_bar.assignValue(attacking_monster.time);
		}
	}

	static __animateFlyingMonsters() {
		for (const flying_monster of MainController.scope.game.flying_monsters) {
			WaitingCounters.__updateFlyingFramesCounter(flying_monster);
			
			const monster = flying_monster.monster;
			monster.angle += flying_monster.deltaAngle;
			monster.move();

			WaitingCounters.__applyFlyingScale(flying_monster);

			if (flying_monster.frames_counter === flying_monster.frames) {
				monster.root_element.style.transform = null;
				monster.root_element.classList.remove("flying");
				flying_monster.onAnimationEnd();
			}
		}
	}

	static __updateFlyingFramesCounter(flying_monster) {
		if (!flying_monster.frames_counter) {
			flying_monster.frames_counter = 1;

			const monster = flying_monster.monster;
			monster.deltaX = flying_monster.deltaX;
			monster.deltaY = flying_monster.deltaY;
			monster.root_element.classList.add("flying");
		} else flying_monster.frames_counter++;
	}

	static __applyFlyingScale(flying_monster) {
		const apogee_frame = flying_monster.frames / 2;
		const frames_from_apogee = Math.abs(flying_monster.frames_counter - apogee_frame);
		const from_apogee_ratio = frames_from_apogee / apogee_frame;
		const scale_diff = (flying_monster.max_scale - 1) * from_apogee_ratio;
		const scale = flying_monster.max_scale - scale_diff;
		flying_monster.monster.root_element.style.transform = `scale(${scale})`;
	}
}