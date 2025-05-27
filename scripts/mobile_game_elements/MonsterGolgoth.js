class MV_MonsterGolgoth extends MV_Monster {
    CARRIED_OFFSETS = { x: 6, y: 18 };
    BELL_THROW_OVER_BASIC_THROW = 5;
    THROWN_MONSTER_MAX_INJURIES = 5;
    THROW_TO_PICK_INTERVAL = 50;
        
    ATTACK_TIME = 15;
    THROW_LENGTH_RATIO = 1.25;

    AOE_RADIUS = 135;
    FLYING_MAX_SCALE = 2;
    FLYING_FRAMES_NUMBER = 30;
    FLYING_MAX_DELTA_ANGLE = Math.PI / 8;

    aiming_locked_while_attacking = true;

    current_target;
    carried_monster;

    constructor(viewport, x, y) {
        super(viewport, x, y, "golgoth");
        this.before_next_pick = 0;
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
        if (this.before_next_pick)
            this.before_next_pick--;

        if (this.__isAttacking())
            return;

        if (this.carried_monster && this.__canThrow())
            this.choseThrowMethod();

        if (this.current_target.monster_type)
            return this.__pickUpIfPossible();

        if (this.hitbox.checkCollide(MainController.UI.character.hitbox)) {
			JuiceHelper.hitEffect();
			HealthBarHelper.characterHit(this.monster_type.strength);
		}
    }

    performAttack() {
        this.resetAttackCounter();
        
        const throw_length = this.THROW_LENGTH_RATIO * this.monster_type.attack_range;
        JuiceHelper.throw();
        const thrown_monster = this.setThrownMonsterStartPoition();
        thrown_monster.aiming_angle = this.aiming_angle;
        TrailAttackHelper.performAttack(this, thrown_monster, throw_length);

        this.__dropMonster(thrown_monster);
    }

    isPickable() { return false; }

    choseThrowMethod() {
        const is_bell_throw = !!Math.floor(Math.random() * this.BELL_THROW_OVER_BASIC_THROW);
        this.before_next_pick = this.THROW_TO_PICK_INTERVAL;

        if (is_bell_throw)
            this.bellThrow();
        else this.timedAttack( JuiceHelper.prepareThrowing );
    }

    setThrownMonsterStartPoition() {
        const front_spot = this.frontSpotPosition();
        this.carried_monster.x = front_spot.x;
        this.carried_monster.y = front_spot.y;
        this.carried_monster.applyPosition();
        
        const thrown_monster = this.carried_monster;
        this.carried_monster = null;

        MainController.UI.addToGameWindow(thrown_monster.root_element);
        return thrown_monster;
    }

    bellThrow() { //TODO découper pour remise au propre
        JuiceHelper.throw();
        const thrown_monster = this.setThrownMonsterStartPoition();
        const character = MainController.UI.character;
        const target_position = character.centralSpotPosition();
        
        // Montrer l'AOE
        const aoe_element = new MobileGameElement(this.viewport, target_position.x - this.AOE_RADIUS, target_position.y - this.AOE_RADIUS);
        aoe_element.pixel_size = this.AOE_RADIUS * 2;
        aoe_element.root_element.classList.add("bell-throw-aoe");
        aoe_element.root_element.style.width = this.viewport.getCssValue(this.AOE_RADIUS * 2);
        aoe_element.root_element.style.height = this.viewport.getCssValue(this.AOE_RADIUS * 2);
        
        MainController.UI.addToGameWindow(aoe_element.root_element);

        // animation
        const throw_angle = thrown_monster.hitbox.getDirection(character.hitbox);
        const throw_distance = thrown_monster.hitbox.getDistance(character.hitbox);
        const frame_distance = throw_distance / this.FLYING_FRAMES_NUMBER;

        MainController.scope.game.flying_monsters.push({
            monster: thrown_monster,
            deltaX: frame_distance * Math.cos(throw_angle),
            deltaY: frame_distance * Math.sin(throw_angle), 
            deltaAngle: Math.random(this.FLYING_MAX_DELTA_ANGLE * 2) - this.FLYING_MAX_DELTA_ANGLE,
            frames: this.FLYING_FRAMES_NUMBER,
            max_scale: this.FLYING_MAX_SCALE,
            onAnimationEnd: ()=> {
                WaitingCounters.removeFlyingMonster(thrown_monster);
                this.__dropMonster(thrown_monster);

                aoe_element.root_element.remove();
                if (aoe_element.hitbox.checkCollide(character.hitbox)) {
                    JuiceHelper.hitEffect();
			        HealthBarHelper.characterHit(this.monster_type.strength);
                }
				//TODO effet visuel AOE atterrissage
            }
        });
    }

    __pickUpIfPossible() {
        if (!this.hitbox.checkCollide(this.current_target.hitbox) || this.before_next_pick)
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

    __canThrow() {
        const character = MainController.UI.character;
        return this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }

    __dropMonster(thrown_monster) {
        if (!thrown_monster) {
            MainController.UI.addToGameWindow(this.carried_monster.root_element);
            const position_delta = (this.pixel_size - this.carried_monster.pixel_size) / 2;
            this.carried_monster.x = this.x + position_delta;
            this.carried_monster.y = this.y + position_delta;
            this.applyPosition();

            thrown_monster = this.carried_monster;
            this.carried_monster = null;
        }

        this.__performDroppedMonsterInjuries(thrown_monster);
        thrown_monster.carried = false;
    }

    __performDroppedMonsterInjuries(thrown_monster) {
       thrown_monster.health_points -= this.THROWN_MONSTER_MAX_INJURIES;
        
        if (thrown_monster.health_points <= 0)
            thrown_monster.health_points = 0.1;
        
        thrown_monster.life_bar.assignValue(thrown_monster.health_points);
        thrown_monster.shock();
    }
}