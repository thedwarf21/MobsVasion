class MV_MonsterVoracious extends MV_Monster {
  
    constructor(viewport, x, y) {
        super(viewport, x, y, "voracious");
    }

    attack() {
        const character = MainController.UI.character;

		if (this.hitbox.checkCollide(character.hitbox)) {
			JuiceHelper.hitEffect();
			HealthBarHelper.characterHit(this.monster_type.strength);
		}
    }
}