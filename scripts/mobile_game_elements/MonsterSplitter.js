class MV_MonsterSpitter extends MV_Monster {
    ATTACK_TIME = 25;
    TOXIC_CLOUD_RADIUS = 30;
  
    constructor(viewport, x, y) {
        super(viewport, x, y, "spitter");
    }

    attack() {
        if (this.__canAttack())
            this.prepareSpitting();
    }

    prepareSpitting() {
        JuiceHelper.prepareSpitting();
        this.attack_bar = new MV_Gauge("monster-attack-bar", this.ATTACK_TIME, 0);
        this.root_element.appendChild(this.attack_bar.root_element);
        
        MainController.scope.game.attacking_monsters.push({
            monster: this,
            time: this.ATTACK_TIME
        });
    }

    performAttack() {
        JuiceHelper.spit();
        super.resetAttackCounter();
        const shot = this.__createShot();
		MainController.UI.addToGameWindow(shot.root_element);
        MainController.UI.monster_shots.push(shot);
    }

    specificDeathEffect() {  // appelée par MV_Monster à la mort du monstre, si la méthode est présente (comme c'est le cas pour cette classe enfant)
        const toxic_cloud = document.createElement("DIV");
        toxic_cloud.classList.add("toxic-cloud");
        toxic_cloud.hitbox = this.hitbox;
        toxic_cloud.hitbox.radius = this.TOXIC_CLOUD_RADIUS;

        const radius_delta = this.TOXIC_CLOUD_RADIUS - this.pixel_size/2;
        toxic_cloud.style.left = MainController.viewport.getCssValue(this.x - radius_delta);
        toxic_cloud.style.top = MainController.viewport.getCssValue(this.y - radius_delta);
        MainController.UI.addToGameWindow(toxic_cloud);
    }

    __canAttack() { 
        const character = MainController.UI.character;
        return !this.__isAttacking() && this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }
    
    __createShot() {
        const center_spot = this.centralSpotPosition();
        const cos_angle = Math.cos(this.aiming_angle);
        const sin_angle = Math.sin(this.aiming_angle);

        const shot_start_x = center_spot.x + this.monster_type.size/2 * cos_angle;
        const shot_start_y = center_spot.y + this.monster_type.size/2 * sin_angle;
        
        const deltaX = SHOT_VELOCITY/2 * cos_angle;
        const deltaY = SHOT_VELOCITY/2 * sin_angle;
        
        const shot = new MV_Shot(this.viewport, shot_start_x, shot_start_y, deltaX, deltaY);
        shot.root_element.classList.add("monster");
        shot.strength = this.monster_type.strength;
        return shot;
    }
}