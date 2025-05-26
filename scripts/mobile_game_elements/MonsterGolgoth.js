class MV_MonsterGolgoth extends MV_Monster {
    CARRIED_OFFSETS = { x: 6, y: 18 };
    ATTACK_TIME = 15;
    THROW_LENGTH_RATIO = 1.25;
    THROWN_MONSTER_MAX_INJURIES = 5;
    aiming_locked_while_attacking = true;

    current_target;
    carried_monster;

    constructor(viewport, x, y) {
        super(viewport, x, y, "golgoth");
    }

    choseFollowTarget() {     // méthode appelée par MV_Monster, si elle est implémentée, afin de redéfinir la cible à suivre
        if (this.carried_monster)
            return MainController.UI.character;

        const targetables = MainController.UI.pickableMonsters();
        targetables.push(MainController.UI.character);
        this.current_target = this.hitbox.getNearest(targetables);
        return this.current_target;
    }
    
    specificDeathEffect() {  // appelée par MV_Monster à la mort du monstre, si la méthode est présente
        if (this.carried_monster)
            this.__dropMonster();
    }

    attack() {
        if (this.__isAttacking())
            return;

        if (this.carried_monster && this.__canThrow())
            super.timedAttack( JuiceHelper.prepareThrowing );

        if (this.current_target.monster_type)
            return this.__pickUpIfPossible();

        if (this.hitbox.checkCollide(MainController.UI.character.hitbox)) {
			JuiceHelper.hitEffect();
			HealthBarHelper.characterHit(this.monster_type.strength);
		}
    }

    performAttack() {
        super.resetAttackCounter();
        
        const throw_length = this.THROW_LENGTH_RATIO * this.monster_type.attack_range;
        JuiceHelper.throw();
        TrailAttackHelper.performAttack(this, this.carried_monster, throw_length);

        this.__dropMonster(true);
    }

    __processThrowSection(section_length, player_already_hit) {
        this.carried_monster.deltaX = section_length * Math.cos(this.aiming_angle);
        this.carried_monster.deltaY = section_length * Math.sin(this.aiming_angle);
        this.carried_monster.move();

        if (player_already_hit)
            return true;

        if ( this.carried_monster.hitbox.checkCollide(MainController.UI.character.hitbox) ) {
            JuiceHelper.hitEffect();
            HealthBarHelper.characterHit( this.monster_type.strength );
            return true;
        }

        return false;
    }

    __pickUpIfPossible() {
        if (!this.hitbox.checkCollide(this.current_target.hitbox))
            return;

        this.carried_monster = this.current_target;
        this.carried_monster.carried = true;
        this.carried_monster.resetAttackCounter();

        const carried_monster_radius = this.carried_monster.pixel_size / 2;
        const carried_monster_element = this.carried_monster.root_element;
        this.rotate_element.appendChild(carried_monster_element);
        carried_monster_element.style.top = null;
        carried_monster_element.style.left = null;
        carried_monster_element.style.right = MainController.viewport.getCssValue(this.CARRIED_OFFSETS.x - carried_monster_radius);
        carried_monster_element.style.bottom = MainController.viewport.getCssValue(this.CARRIED_OFFSETS.y - carried_monster_radius);
    }

    __dropMonster(was_thrown) {
        if (!was_thrown) {
            this.carried_monster.x = this.x;
            this.carried_monster.y = this.y;
            this.applyPosition();
        }
        
        MainController.UI.addToGameWindow(this.carried_monster.root_element);
        this.__performDroppedMonsterInjuries();
        this.carried_monster.carried = false;
        this.carried_monster = null;
    }

    __performDroppedMonsterInjuries() {
        this.carried_monster.health_points -= this.THROWN_MONSTER_MAX_INJURIES;
        
        if (this.carried_monster.health_points <= 0)
            this.carried_monster.health_points = 0.1;
        
        this.carried_monster.life_bar.assignValue(this.carried_monster.health_points);
        this.carried_monster.shock();
    }

    __canThrow() {
        const character = MainController.UI.character;
        return this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }
}