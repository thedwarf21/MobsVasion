class MV_WaveGenerator {
    bestiary;
    battle_value;

    constructor() {
        this.bestiary = MONSTERS_TYPES;
    }

    scheduleLevelMonstersPop() {
		MainController.scope.game.wave_pop.elapsed = 0;
		MainController.scope.game.wave_pop.timeouts = [];
        this.battle_value = 0;
        this.__initScheduleCounters();

		let timeout = this.__getMandatoryPop();
		while (this.remaining_battle_value) {
			MainController.scope.game.wave_pop.timeouts.push({
                ticks_number: timeout,
                monster_type: this.__randomMonster()
            });

			timeout += this.time_before_next_pop;
		}
	}

    __initScheduleCounters() {
        for (const key in this.bestiary)
            this.bestiary[key].count = 0;
    }

    __randomMonster() {
        const available_bestiary = this.__filteredBestiary();
        const monster_type = Tools.getRandomArrayElement( available_bestiary );
        
        this.battle_value += monster_type.battle_value;
        monster_type.count++;

        return monster_type;
    }

    __filteredBestiary() {
        const result_list = [];
        
        for (const key in this.bestiary)
            if (this.__canMonsterTypePop(key))
                result_list.push(this.bestiary[key]);

        return result_list;
    }

    __canMonsterTypePop(monster_key) {
        const wave_number = MainController.scope.game.wave_number;
        const monster_type = this.bestiary[monster_key];

        if (monster_type.appear_from_wave > wave_number)
            return false;

        if (monster_type.battle_value > this.remaining_battle_value)
            return false;

        if (this.__occursLimitReached(monster_type))
            return false;

        return true;
    }

    __occursLimitReached(monster_type) {
        if (!monster_type.appear_limiter)
            return false;

        const limit = Math.ceil( MainController.scope.game.wave_number / monster_type.appear_limiter );
        return monster_type.count === limit;
    }

    __getMandatoryPop() {
        for (const key in this.bestiary) {
            const monster_type = this.bestiary[key];

            if (monster_type.appear_from_wave === MainController.scope.game.wave_number) {
                this.battle_value += monster_type.battle_value;
                monster_type.count++;
                
                MainController.scope.game.wave_pop.timeouts.push({
                    ticks_number: TIMEOUTS.before_pop,
                    monster_type: monster_type
                });

                return TIMEOUTS.before_pop + this.time_before_next_pop;
            }
        }

        return TIMEOUTS.before_pop;
    }

    popMonsterRandomly(monster_type) {
		const max_x_value = MainController.viewport.VIRTUAL_WIDTH - monster_type.size;
		const max_y_value = MainController.viewport.VIRTUAL_HEIGHT - monster_type.size;
		let x_monster, y_monster;

		switch ( Math.floor(Math.random() * 4) ) { // selon la bordure choisie aléatoirement pour faire apparaître le monstre
			case 0: // haut
				x_monster = Tools.radomValueInRange(0, max_x_value);
				y_monster = 0;
				break;
			case 1: // bas
				x_monster = Tools.radomValueInRange(0, max_x_value);
				y_monster = max_y_value;
				break;
			case 2: // gauche
				x_monster = 0;
				y_monster = Tools.radomValueInRange(0, max_y_value);
				break;
			case 3: // droite
				x_monster = max_x_value;
				y_monster = Tools.radomValueInRange(0, max_y_value);
				break;
		}

		JuiceHelper.monsterPop(x_monster, y_monster, monster_type);
	}

    
    healthPoints(monster_type) {
        const wave_number = MainController.scope.game.wave_number;
        return monster_type.base_hp + (wave_number - 1) * monster_type.hp_inc_per_wave;
    }

    randomSpeed(monster_type) {
        const min_value = monster_type.speed_range[0];
        const max_value = monster_type.speed_range[1];
        return Math.floor( Math.random() * (max_value - min_value + 1) ) + min_value;
    }

    get remaining_battle_value() {
        const wave_number = MainController.scope.game.wave_number;
        const current_wave_battle_value = FIRST_WAVE_BATTLE_VALUE + (wave_number - 1) * BATTLE_VALUE_ADD_PER_WAVE;
        return current_wave_battle_value - this.battle_value;
    }

    get time_before_next_pop() { return Tools.radomValueInRange(TIMEOUTS.min_pop_interval, TIMEOUTS.max_pop_interval); }
}