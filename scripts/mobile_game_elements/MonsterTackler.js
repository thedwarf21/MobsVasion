class MV_MonsterTackler extends MV_Monster {
    ATTACK_TIME = 20;
    TACKLE_LENGTH_RATIO = 1.25;
    aiming_locked_while_attacking = true;

    constructor() { super(); }

	static getInstance(viewport, x, y) { 
        const instance = document.createElement("rs-game-monster-tackler");
        instance.init(viewport, x, y);
        return instance;
    }

    init(viewport, x, y) {
        super.init(viewport, x, y, "tackler");
    }

    attack() {
        if (this.#canAttack())
            super.timedAttack( JuiceHelper.prepareTackling );
    }

    performAttack() {
        super.resetAttackCounter();
        
        const tackle_length = this.TACKLE_LENGTH_RATIO * this.monster_type.attack_range;
        JuiceHelper.tackle();
        TrailAttackHelper.performAttack(this, this, tackle_length);

        this.shock();
    }

    #canAttack() { 
        if (this.isAttacking() || this.carried)
            return false;

        const character = MainController.UI.character;
        return this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }
}
customElements.define("rs-game-monster-tackler", MV_MonsterTackler);