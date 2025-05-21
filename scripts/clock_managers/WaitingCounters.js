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

		this.__decrementMonsterAttackCounter();
	}

	static clear() {
		const counters_object = MainController.scope.game.waiting_counter;
		const counters_names_list = Object.keys(counters_object);
		for (const counter_key of counters_names_list)
			counters_object[counter_key] = 0;

		MainController.scope.game.attacking_monsters = [];
	}

	static removeAttackCounter(monster) {
		const attacks = MainController.scope.game.attacking_monsters;
		for (let i = 0; i < attacks.length; i++) {
			const attacking_monster = attacks[i];

			if (attacking_monster.monster === monster)
				attacks.splice(i, 1);
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

	static __decrementMonsterAttackCounter() {
		for (const attacking_monster of MainController.scope.game.attacking_monsters) {
			const monster = attacking_monster.monster;
			monster.aimPlayer();
			
			attacking_monster.time--;
			if (!attacking_monster.time)
				monster.performAttack();
			else monster.attack_bar.assignValue(attacking_monster.time);
		}
	}
}