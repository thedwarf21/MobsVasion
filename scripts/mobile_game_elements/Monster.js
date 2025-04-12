class MV_Monster extends MobileGameElement {
    __image_elt;
    __speed;
    __life_bar;
    __health_points;
    __shocked;
  
    constructor(viewport, x, y) {
        super(viewport, x, y);
        this.classList.add("monster");
        this.__init();
    }
  
    follow(character) {
        if (!this.__shocked) {
            let rad_angle = Math.atan( (character.y - this.y) / (character.x - this.x) );
            if (character.x < this.x)
                rad_angle += Math.PI;
            this.angle = rad_angle * 180 / Math.PI;
            this.deltaX = this.__speed * Math.cos(rad_angle);
            this.deltaY = this.__speed * Math.sin(rad_angle);
            this.move();
        }
    }
  
    wound(injury_amount, onMonsterDeath) {
        this.__health_points -= injury_amount;
        this.__life_bar.assignValue(this.__health_points);
        this.__dieOrBleed(onMonsterDeath);
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

    __dieOrBleed(onMonsterDeath) {
        if (!this.__health_points) {
            this.remove();
            this.__createBloodPuddle(this.x + MONSTER_SIZE/2, this.y + MONSTER_SIZE/2, true);

            if (onMonsterDeath) 
                onMonsterDeath();
        } else {
            this.__shock(WOUND_SHOCK_TIME);
            this.__bleed();
        }
    }

    __shock(WOUND_SHOCK_TIME) {
        this.__shocked = true;
        this.rotate_element.classList.add("shocked");
        setTimeout(()=> {
            this.rotate_element.classList.remove("shocked");
            this.__shocked = false;
        }, WOUND_SHOCK_TIME);
    }

    __bleed() {
        let rad_angle = this.angle * Math.PI / 180;
        let x_splash = this.x + MONSTER_SIZE/2 + ( MONSTER_SIZE/2 * Math.cos(rad_angle) );
        let y_splash = this.y + MONSTER_SIZE/2 + ( MONSTER_SIZE/2 * Math.sin(rad_angle) );
    
        let blood_splash = new MV_AnimatedFrame( this.viewport, x_splash, y_splash, 0, 0, "blood-splash", 500, ()=> {
            blood_splash.remove();
            let x_puddle = x_splash + BLOOD_SPLASH_LENGTH * Math.cos(rad_angle);
            let y_puddle = y_splash + BLOOD_SPLASH_LENGTH * Math.sin(rad_angle);
            this.__createBloodPuddle(x_puddle, y_puddle);
        });
        blood_splash.style.transform = `rotate(${this.angle}deg)`;
        MainUI.addToGameWindow(blood_splash);
    }

    __createBloodPuddle(x_puddle, y_puddle, isBig) {
        let puddle_element = document.createElement("DIV");
        puddle_element.classList.add("blood-puddle");
        
        puddle_element.style.backgroundImage = `url("../images/blood_puddle_${MainController.radomValueInRange(0, 5)}.png")`;
        puddle_element.style.left = this.viewport.getCssValue(x_puddle);
        puddle_element.style.top = this.viewport.getCssValue(y_puddle);
        
        if (isBig) {
            puddle_element.style.width = this.viewport.getCssValue(MONSTER_SIZE);
            puddle_element.style.height = this.viewport.getCssValue(MONSTER_SIZE);
        }
        MainUI.addToGameWindow(puddle_element);
    }
}
customElements.define('mv-js-monster', MV_Monster, { extends: 'div' });