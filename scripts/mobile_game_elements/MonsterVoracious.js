class MV_MonsterVoracious extends MV_Monster {

    constructor() { super(); }

	static getInstance(viewport, x, y) { 
        const instance = document.createElement("rs-game-monster-voracious");
        instance.init(viewport, x, y);
        return instance;
    }

    init(viewport, x, y) {
        super.init(viewport, x, y, "voracious");
    }

    attack() {
        if (this.carried)
            return;

		if (this.hitbox.checkCollide(MainController.UI.character.hitbox))
			HealthBarHelper.characterHit(this.monster_type.strength);
    }
}
customElements.define("rs-game-monster-voracious", MV_MonsterVoracious);