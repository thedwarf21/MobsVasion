class XpBarHelper {

    static create() {
		return new MV_Gauge("xp-bar", XpBarHelper.levelUpAt(), MainController.scope.game.current_level_xp);
    }

    static addXp(xp_amount) {
        let level_up_at = XpBarHelper.levelUpAt();
        let game_scope = MainController.scope.game;
        game_scope.current_level_xp += xp_amount;
        
        if (game_scope.current_level_xp >= level_up_at) {
            game_scope.current_level_xp -= level_up_at;
            game_scope.player_level++;
            game_scope.knowledge_points += KP_PER_LEVEL;

            JuiceHelper.levelUp();
        }
    }

    static levelUpAt() {
        return Tools.getFibonacciValue(BASE_LEVEL_UP_XP, LEVEL_UP_XP_COEF, MainController.scope.game.player_level);
    }
}