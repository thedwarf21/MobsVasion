class MV_Monster extends MobileGameElement {
    __image_elt;
    __speed;
    __life_bar;
    __health_points;
  
    constructor(viewport, x, y) {
        super(viewport, x, y);
        this.classList.add("monster");
        this.__init();
    }
  
    follow(character) {
        let rad_angle = Math.atan( (character.y - this.y) / (character.x - this.x) );
        if (character.x < this.x)
            rad_angle += Math.PI;
        this.angle = rad_angle * 180 / Math.PI;
        this.deltaX = this.__speed * Math.cos(rad_angle);
        this.deltaY = this.__speed * Math.sin(rad_angle);
        this.move();
    }
  
    wound(injury_amount, onMonsterDeath) {
        this.__health_points -= injury_amount;
        this.__life_bar.assignValue(this.__health_points);
        if (!this.__health_points) {
            this.remove();
            if (onMonsterDeath)
                onMonsterDeath();
        }
    }
  
    __init() {
        this.angle = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.pixel_size = MONSTER_SIZE;
        this.__health_points = MONSTER_MAX_HEALTH;
    
        this.__setRadomSpeed(MIN_MONSTER_SPEED, MAX_MONSTER_SPEED);
        this.__addLifeBar();
        this.addImageElt("spinning-image");
        this.addVisualHitBox();
    }
  
    __setRadomSpeed(min_value, max_value) {
        this.__speed = Math.floor( Math.random() * (max_value - min_value + 1) ) + min_value;
    }
  
    __addLifeBar() {
        this.__life_bar = new MV_Gauge("monster-health-bar", MONSTER_MAX_HEALTH, this.__health_points);
        this.appendChild(this.__life_bar);
    }
}
customElements.define('mv-js-monster', MV_Monster, { extends: 'div' });