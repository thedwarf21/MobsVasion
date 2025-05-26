class MV_Monster extends MobileGameElement {
    monster_type;
    speed;
    life_bar;
    health_points;
    shocked;
    carried;
  
    constructor(viewport, x, y, monster_key) {
        super(viewport, x, y);
        this.root_element.classList.add("monster");
        this.root_element.classList.add(monster_key);
        this.monster_type = MainController.wave_generator.bestiary[monster_key];
        this.init();
    }
  
    wound(injury_amount, monster_index) {
        this.health_points -= injury_amount;
        this.life_bar.assignValue(this.health_points);
        this.resetAttackCounter();
        this.__dieOrBleed(monster_index);
    }
  
    follow(target) {
        if (!this.__canMove())
            return;
        
        if (this.choseFollowTarget)
            target = this.choseFollowTarget();

        this.angle = Math.atan( (target.y - this.y) / (target.x - this.x) );
        if (target.x < this.x)
            this.angle += Math.PI;
        
        this.deltaX = this.speed * Math.cos(this.angle);
        this.deltaY = this.speed * Math.sin(this.angle);
        this.move();
    }
  
    init() {
        this.angle = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.__initFromMonsterType();
        this.__addLifeBar();
        super.addImageElt("spinning-image");
        super.addVisualHitBox(MainController.scope.game.showHitboxes);
    }

    resetAttackCounter() {
        if (this.__isAttacking()) {
            this.attack_bar.root_element.remove();
            this.attack_bar = null;
            WaitingCounters.removeAttackCounter(this);
        }
    }

    aimPlayer() {
        const character = MainController.UI.character;
        this.aiming_angle = this.hitbox.getDirection(character.hitbox);
        this.__rotate( this.aiming_angle );
    }

    shock() {
        this.shocked = true;
        this.root_element.classList.add("shocked");
        setTimeout(()=> {
            this.root_element.classList.remove("shocked");
            this.shocked = false;
        }, WOUND_SHOCK_TIME);
    }

    __isAttacking() { return !!this.attack_bar; }

    __canMove() { return !this.shocked && !this.carried && !this.__isAttacking(); }
  
    __initFromMonsterType() {
        this.pixel_size = this.monster_type.size;
        this.health_points = MainController.wave_generator.healthPoints(this.monster_type);
        this.speed = MainController.wave_generator.randomSpeed(this.monster_type);
    }
  
    __addLifeBar() {
        this.life_bar = new MV_Gauge("monster-health-bar", this.health_points, this.health_points);
        this.root_element.appendChild(this.life_bar.root_element);
    }

    __dieOrBleed(monster_index) {
        if (this.health_points <= 0) {
            this.root_element.remove();
            this.__createBloodPuddle(this.x + this.pixel_size/2, this.y + this.pixel_size/2, true);
            this.__monsterSlayed(monster_index);
        } else {
            this.shock();
            this.__bleed();
        }
    }

    __bleed() {
        const x_splash = this.x + this.pixel_size/2 + ( this.pixel_size/2 * Math.cos(this.angle) );
        const y_splash = this.y + this.pixel_size/2 + ( this.pixel_size/2 * Math.sin(this.angle) );  
        const x_puddle = x_splash + BLOOD_SPLASH_LENGTH * Math.cos(this.angle);
        const y_puddle = y_splash + BLOOD_SPLASH_LENGTH * Math.sin(this.angle);  
        JuiceHelper.bloodSplash(x_splash, y_splash, this.angle, ()=> {
            this.__createBloodPuddle(x_puddle, y_puddle, false);
        });
    }

    __monsterSlayed(monster_index) {
        JuiceHelper.monsterSlayed();
        MainController.UI.monsters.splice(monster_index, 1);

        const monster_swag = Tools.radomValueInRange(this.monster_type.swag_range[0], this.monster_type.swag_range[1] + Abilities.getSwagUpgrade());
		MainController.scope.game.money += monster_swag;

		XpBarHelper.addXp( this.monster_type.battle_value );

        if (this.specificDeathEffect)
            this.specificDeathEffect();
		
        if (MainController.__isWaveComplete())
			MainController.__waveDefeated();
    }

    __createBloodPuddle(x, y, isBig) {
        const puddle_element = document.createElement("DIV");
        puddle_element.classList.add("blood-puddle");
        
        puddle_element.style.backgroundImage = `url("images/blood_puddle_${Tools.radomValueInRange(0, 5)}.png")`;
        puddle_element.style.left = this.viewport.getCssValue(x);
        puddle_element.style.top = this.viewport.getCssValue(y);
        
        if (isBig) {
            puddle_element.style.width = this.viewport.getCssValue(this.pixel_size);
            puddle_element.style.height = this.viewport.getCssValue(this.pixel_size);
        }
        MainController.UI.addToGameWindow(puddle_element);
    }
}