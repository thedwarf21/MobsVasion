class MV_MonsterTackler extends MV_Monster {
    ATTACK_TIME = 20;
    TACKLE_LENGTH_RATIO = 1.25;
    TACKLE_SEGMENTATION = 4;
    aiming_locked_while_attacking = true;
  
    constructor(viewport, x, y) {
        super(viewport, x, y, "tackler");
    }

    attack() {
        if (this.__canAttack())
            this.prepareTackle();
    }

    prepareTackle() {
        this.aiming_angle = this.angle;

        JuiceHelper.prepareTackling();
        this.attack_bar = new MV_Gauge("monster-attack-bar", this.ATTACK_TIME, 0);
        this.root_element.appendChild(this.attack_bar.root_element);
        
        MainController.scope.game.attacking_monsters.push({
            monster: this,
            time: this.ATTACK_TIME
        });
    }

    performAttack() {
        super.resetAttackCounter();
        
        const tackle_length = this.TACKLE_LENGTH_RATIO * this.monster_type.attack_range;
        JuiceHelper.tackle();
        JuiceHelper.tackleTrail(this, tackle_length);
        
        let player_already_hit = false;
        const section_length = tackle_length / this.TACKLE_SEGMENTATION;

        for (let i = 0; i < this.TACKLE_SEGMENTATION; i++)
            player_already_hit = this.__processTackleSection(section_length, player_already_hit);

        this.__shock();
    }

    __processTackleSection(section_length, player_already_hit) {
        this.deltaX = section_length * Math.cos(this.aiming_angle);
        this.deltaY = section_length * Math.sin(this.aiming_angle);
        this.move();

        if (player_already_hit)
            return true;

        if ( this.hitbox.checkCollide(MainController.UI.character.hitbox) ) {
            JuiceHelper.hitEffect();
            HealthBarHelper.characterHit( this.monster_type.strength );
            return true;
        }

        return false;
    }

    __canAttack() { 
        const character = MainController.UI.character;
        return !this.__isAttacking() && this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }
}