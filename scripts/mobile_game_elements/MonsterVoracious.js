class MV_MonsterVoracious extends MV_Monster {
    __monster_type;
  
    constructor(viewport, x, y) {
        super(viewport, x, y);
        this.root_element.classList.add("voracious");

        this.__monster_type = MainController.wave_generator.bestiary.voracious;        
        super.init();
    }

    attack() {
        const character = MainController.UI.character;

		if (this.hitbox.checkCollide(character.hitbox)) {
			JuiceHelper.hitEffect();
			HealthBarHelper.characterHit(this.__monster_type.strength);
		}
    }
}