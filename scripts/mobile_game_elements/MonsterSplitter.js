class MV_MonsterSpitter extends MV_Monster {
    ATTACK_TIME = 25;
    TOXIC_CLOUD_RADIUS = 50;
    HITBOX_RATIO = 0.6;  // => rayon de la hitbox = 30
  
    constructor(viewport, x, y) {
        super(viewport, x, y, "spitter");
    }

    attack() {
        if (this.#canAttack())
            super.timedAttack( JuiceHelper.prepareSpitting );
    }

    performAttack() {
        JuiceHelper.spit();
        super.resetAttackCounter();
        const shot = this.#createShot();
		MainController.UI.addToGameWindow(shot);
        MainController.UI.monster_shots.push(shot);
    }

    specificDeathEffect() {  // appelée par MV_Monster à la mort du monstre, si la méthode est présente (comme c'est le cas pour cette classe enfant)
        const toxic_cloud = document.createElement("DIV");
        toxic_cloud.classList.add("toxic-cloud");
        toxic_cloud.hitbox = this.hitbox;
        toxic_cloud.hitbox.radius = this.TOXIC_CLOUD_RADIUS * this.HITBOX_RATIO;

        const radius_delta = this.TOXIC_CLOUD_RADIUS - this.pixel_size/2;
        toxic_cloud.style.left = MainController.viewport.getCssValue(this.x - radius_delta);
        toxic_cloud.style.top = MainController.viewport.getCssValue(this.y - radius_delta);
        toxic_cloud.style.width = MainController.viewport.getCssValue(this.TOXIC_CLOUD_RADIUS * 2);
        toxic_cloud.style.height = MainController.viewport.getCssValue(this.TOXIC_CLOUD_RADIUS * 2);
        MainController.UI.addToGameWindow(toxic_cloud);
    }

    #canAttack() { 
        if (this.isAttacking() || this.carried)
            return false;

        const character = MainController.UI.character;
        return this.hitbox.getDistance(character.hitbox) < this.monster_type.attack_range;
    }
    
    #createShot() {
        const front_spot = this.frontSpotPosition();
        
        const deltaX = SHOT_VELOCITY/2 * Math.cos(this.aiming_angle);
        const deltaY = SHOT_VELOCITY/2 * Math.sin(this.aiming_angle);
        
        const shot = MV_Shot.getInstance(this.viewport, front_spot.x, front_spot.y, deltaX, deltaY, this.aiming_angle);
        shot.root_element.classList.add("monster");
        shot.strength = this.monster_type.strength;
        return shot;
    }
}