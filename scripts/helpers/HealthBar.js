class HealthBarHelper {
    
    static create() {
        return new MV_Gauge("character-health-bar", Abilities.getMaxPlayerHealth(), MainController.scope.game.health_points);
    }

    static characterHit(damage) {
        MainController.scope.game.health_points -= damage;
		MainController.UI.checkPanicMode();

        if (MainController.scope.game.health_points <= 0) {
            MainController.waveLost();
        }
    }

    static healPlayer(amount) {
        MainController.scope.game.health_points += amount;

        let max_hp = Abilities.getMaxPlayerHealth();
        if (MainController.scope.game.health_points > max_hp)
            MainController.scope.game.health_points = max_hp;
    }
}