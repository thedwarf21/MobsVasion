class MV_MonsterTackler extends MV_Monster {
    ATTACK_TIME = 20;
    TACKLE_LENGTH_RATIO = 1.25;
    aiming_locked_while_attacking = true;
  
    constructor(viewport, x, y) {
        super(viewport, x, y, "tackler");
    }

    attack() {
        if (this.__canAttack()) {
            this.root_element.classList.add("duck");
            super.timedAttack( JuiceHelper.prepareTackling );
        }
    }

    performAttack() {
        this.root_element.classList.remove("duck");
        super.resetAttackCounter();
        
        const tackle_length = this.TACKLE_LENGTH_RATIO * this.monster_type.attack_range;
        JuiceHelper.tackle();
        TrailAttackHelper.performAttack(this, this, tackle_length);

        this.shock();
    }

    __canAttack() { 
        if (this.__isAttacking() || this.carried)
            return false;

        const character = MainController.UI.character;
        return this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }
}