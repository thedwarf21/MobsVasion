class MV_MonsterVoracious extends MV_Monster {
  
    constructor(viewport, x, y) {
        super(viewport, x, y, "voracious");
    }

    attack() {
        if (this.carried)
            return;

		if (this.hitbox.checkCollide(MainController.UI.character.hitbox))
			HealthBarHelper.characterHit(this.monster_type.strength);
    }
}