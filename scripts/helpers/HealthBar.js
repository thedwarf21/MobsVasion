class HealthBarHelper {
    
    static create() {
        MainController.health_bar = new MV_Gauge("character-health-bar", Abilities.getMaxPlayerHealth(), MainController.scope.game.health_points);
        return MainController.health_bar;
    }

    static characterHit(damage) {
        JuiceHelper.hitEffect();
        MainController.scope.game.health_points -= damage;

        if (MainController.scope.game.health_points <= 0) {
            MainController.waveLost();
        }
    }

    static healPlayer(amount) {
        MainController.scope.game.health_points += amount;

        const max_hp = Abilities.getMaxPlayerHealth();
        if (MainController.scope.game.health_points > max_hp)
            MainController.scope.game.health_points = max_hp;
    }

    static displayHealingEffect(amount) {
        MainController.health_bar.displayImprovement(amount);
    }
}