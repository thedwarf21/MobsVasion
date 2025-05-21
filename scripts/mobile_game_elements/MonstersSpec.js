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


class MV_MonsterSpitter extends MV_Monster {
    __monster_type;
    ATTACK_TIME = 10;
  
    constructor(viewport, x, y) {
        super(viewport, x, y);
        this.root_element.classList.add("spitter");

        this.__monster_type = MainController.wave_generator.bestiary.spitter;        
        super.init();
    }

    attack() {
        if (this.__canAttack())
            this.prepareSpitting();
    }

    prepareSpitting() {
        //TODO enregistrer le son correspondant et écrire JuiceHelper.prepareSpitting();
        this.attack_bar = new MV_Gauge("monster-attack-bar", this.ATTACK_TIME, 0);
        this.root_element.appendChild(this.attack_bar.root_element);
        
        MainController.scope.game.attacking_monsters.push({
            monster: this,
            time: this.ATTACK_TIME
        });
    }

    performAttack() {
        //TODO enregistrer le son correspondant et écrire JuiceHelper.spit();
        super.interruptAttack();
        const shot = this.__createShot();
		MainController.UI.addToGameWindow(shot.root_element);
        MainController.UI.monster_shots.push(shot);
    }

    __canAttack() { 
        const character = MainController.UI.character;
        return !this.__isAttacking() && this.hitbox.getDistance(character.hitbox) < this.__monster_type.attack_range;
    }
    
    __createShot() {
        const center_spot = this.centralSpotPosition();
        const cos_angle = Math.cos(this.aiming_angle);
        const sin_angle = Math.sin(this.aiming_angle);

        const shot_start_x = center_spot.x + this.__monster_type.size/2 * cos_angle;
        const shot_start_y = center_spot.y + this.__monster_type.size/2 * sin_angle;
        
        const deltaX = SHOT_VELOCITY/2 * cos_angle;
        const deltaY = SHOT_VELOCITY/2 * sin_angle;
        
        const shot = new MV_Shot(this.viewport, shot_start_x, shot_start_y, deltaX, deltaY);
        shot.root_element.classList.add("monster");
        shot.strength = this.__monster_type.strength;
        return shot;
    }
}