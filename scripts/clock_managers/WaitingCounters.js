class WaitingCounters {
    static applyWavePopScheduling() {
		let wave_pop_params = MainController.scope.game.wave_pop;
		
		if (wave_pop_params.elapsed == wave_pop_params.timeouts[0]) {
			MainController.popMonsterRandomly();
			wave_pop_params.timeouts.shift();
			
			if (!wave_pop_params.timeouts.length) {
				MainController.scope.game.wave_pop.timeouts = null;
			}
		}
		wave_pop_params.elapsed++;
	}

	static decrementWaitingCounters() {
		let counters_object = MainController.scope.game.waiting_counter;
		let counters_names_list = Object.keys(counters_object);
		for (let counter_key of counters_names_list) {
			if (counters_object[counter_key]) {
				counters_object[counter_key]--;
				if (!counters_object[counter_key])
					WaitingCounters.__performCounterEndAction(counter_key);
				else WaitingCounters.__performValueChangeAction(counter_key, counters_object[counter_key]);
			}
		}
	}

	static clear() {
		let counters_object = MainController.scope.game.waiting_counter;
		let counters_names_list = Object.keys(counters_object);
		for (let counter_key of counters_names_list)
			counters_object[counter_key] = 0;
	}

	static __performValueChangeAction(counter_key, counter_value) {
		switch(counter_key) {
			case "clip":
				MainController.UI.primaryReloadGauge.assignValue(TIMEOUTS.reload_time - counter_value);
				break;
			case "dash":
				MainController.UI.secondaryReloadGauge.assignValue(TIMEOUTS.dash_interval - counter_value);
				break;
			default:
				break;	
		}
	}

	static __performCounterEndAction(counter_key) {
		switch(counter_key) {
			case "clip":
				MainController.scope.game.clip_ammo = CLIP_SIZE;
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
}