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
		MainController.scope.game.wave_swag += monster_swag;
		MV_GameScope.addXp(XP_PER_MONSTER);
		if (!MainController.scope.game.wave_pop.timeouts && MainController.monsters.length === 0)
			MV_GameScope.waveDefeated();
    }

    static waveDefeated() {
        console.info("J'y crois pas... t'as vraiment gagné ? :o");
        MainUI.endOfWave();
    }
}