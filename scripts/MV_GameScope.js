class MV_GameScope {
    static addXp(xp_amount) {
        let level_up_at = MV_GameScope.levelUpAt();
        let game_scope = MainController.scope.game;
        game_scope.current_level_xp += xp_amount;
        
        if (game_scope.current_level_xp >= level_up_at) {
            game_scope.current_level_xp -= level_up_at;
            game_scope.player_level++;
            game_scope.knowledge_points += KP_PER_LEVEL;
        }
    }

    static levelUpAt() {
        return MainController.getFibonacciValue(BASE_LEVEL_UP_XP, LEVEL_UP_XP_COEF, MainController.scope.game.player_level);
    }

    static monsterSlayed() {
        let monster_swag = MainController.radomValueInRange(MIN_MONSTER_SWAG, MAX_MONSTER_SWAG);
		MainController.scope.game.money += monster_swag;
		MV_GameScope.addXp(XP_PER_MONSTER);
		if (!MainController.scope.game.wave_pop.timeouts && MainController.UI.monsters.length === 0)
			MV_GameScope.__waveDefeated();
    }

    static characterHit(damage) {
        let flash_effect = new MV_AnimatedFrame( MainController.viewport, 0, 0, 0, 0, 
            ANIMATIONS.hit_effect.css_class, ANIMATIONS.hit_effect.duration, 
            ()=> { flash_effect.root_element.remove(); }
        );
        MainController.UI.addToGameWindow(flash_effect.root_element);

        MainController.scope.game.health_points -= damage;
		MainController.UI.checkPanicMode();

        if (!MainController.scope.game.health_points) {
            MV_GameScope.__waveLost();
        }
    }

    static __waveDefeated() {
        console.info("J'y crois pas... t'as vraiment gagné ? :o");
        MainController.scope.game.wave_number++;
        MainController.UI.endOfWave();
    }

    static __waveLost() {
        console.info("On dirait bien que tu es mort...");
        
        MV_GameScope.__characterRescueFees();
        MainController.scope.game.wave_number = 1;
        MainController.UI.checkPanicMode();
        MainController.UI.endOfWave();
    }

    static __characterRescueFees() {
        let scope = MainController.scope.game;
        if (CHARACTER_MAX_LIFE > scope.money * HP_PRICE) {
            scope.health_points = scope.money * HP_PRICE;
            scope.money = 0;
        } else {
            scope.health_points = CHARACTER_MAX_LIFE;
            scope.money -= CHARACTER_MAX_LIFE / HP_PRICE;
        }
    }
}