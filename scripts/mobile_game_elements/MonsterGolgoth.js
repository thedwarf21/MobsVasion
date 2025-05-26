class MV_MonsterGolgoth extends MV_Monster {
    CARRIED_OFFSETS = { x: 6, y: 18 };

    current_target;
    carried_monster;

    constructor(viewport, x, y) {
        super(viewport, x, y, "golgoth");
    }

    choseFollowTarget() {     // méthode appelée par MV_Monster, si elle est implémentée, afin de redéfinir la cible à suivre
        if (this.carried_monster)
            return MainController.UI.character;

        const targetables = MainController.UI.nonGolgothMonsters();
        targetables.push(MainController.UI.character);
        this.current_target = this.hitbox.getNearest(targetables);
        return this.current_target;
    }

    attack() {
        if (this.__isAttacking())
            return;

        if (this.current_target.monster_type)
            return this.__pickUpIfPossible();

        if (this.carried_monster && this.__canThrow())
            return this.__prepareThrowing();

        if (this.hitbox.checkCollide(MainController.UI.character.hitbox)) {
			JuiceHelper.hitEffect();
			HealthBarHelper.characterHit(this.monster_type.strength);
		}
    }

    performAttack() {
        
    }

    __pickUpIfPossible() {
        if (!this.hitbox.checkCollide(this.current_target.hitbox))
            return;

        this.carried_monster = this.current_target;
        this.carried_monster.carried = true;

        const carried_monster_radius = this.carried_monster.pixel_size / 2;
        const carried_monster_element = this.carried_monster.root_element;
        this.rotate_element.appendChild(carried_monster_element);
        carried_monster_element.style.top = null;
        carried_monster_element.style.left = null;
        carried_monster_element.style.right = MainController.viewport.getCssValue(this.CARRIED_OFFSETS.x - carried_monster_radius);
        carried_monster_element.style.bottom = MainController.viewport.getCssValue(this.CARRIED_OFFSETS.y - carried_monster_radius);
    }

    __canThrow() {

    }

    __prepareThrowing() {

    }
}