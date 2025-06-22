class MV_Monster extends MobileGameElement {
    monster_type;
    speed;
    life_bar;
    health_points;
    shocked;
    carried;

    #bonus_reward_ratio;

    constructor() { super(); }

	static getInstance(viewport, x, y, monster_key) { 
        const instance = document.createElement("rs-game-monster");
        instance.init(viewport, x, y, monster_key);
        return instance;
    }

    init(viewport, x, y, monster_key) {
        super.init(viewport, "css/monster.css", x, y);
        this.classList.add("monster");
        this.classList.add(monster_key);

        this.monster_type = MainController.wave_generator.bestiary[monster_key];
        this.#bonus_reward_ratio = 1 + (MainController.scope.game.wave_number / 100);
        
        this.#init(monster_key);
    }
  
    wound(injury_amount, angle) {
        this.health_points -= injury_amount;
        this.life_bar.assignValue(this.health_points);
        this.resetAttackCounter();
        this.#dieOrBleed(angle);
    }
  
    follow(target) {
        if (!this.#canMove())
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
  
    #init(monster_key) {
        this.angle = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.#initFromMonsterType();
        this.#addLifeBar();
        super.addImageElt("spinning-image");
        this.rotate_element.classList.add(monster_key);
        super.addVisualHitBox(MainController.scope.game.showHitboxes);
    }

    resetAttackCounter() {
        if (this.isAttacking()) {
            this.classList.remove("attack-animation");
            this.attack_bar.remove();
            this.attack_bar = null;
            WaitingCounters.removeAttackCounter(this);
        }
    }

    aimPlayer() {
        const character = MainController.UI.character;
        this.aiming_angle = this.hitbox.getDirection(character.hitbox);
        this.rotate( this.aiming_angle );
    }

    shock() {
        this.shocked = true;
        this.classList.add("shocked");
        setTimeout(()=> {
            this.classList.remove("shocked");
            this.shocked = false;
        }, WOUND_SHOCK_TIME);
    }

    timedAttack(fn_sound_fx) {
        this.aimPlayer();
        this.attack_bar = MV_Gauge.getInstance("monster-attack-bar", this.ATTACK_TIME, 0);
        this.appendChild(this.attack_bar);
        this.classList.add("attack-animation");

        MainController.scope.game.attacking_monsters.push({
            monster: this,
            time: this.ATTACK_TIME
        });

        if (fn_sound_fx)
            fn_sound_fx();
    }

    isPickable() { return !this.carried; }

    isAttacking() { return !!this.attack_bar; }

    #canMove() { return !this.shocked && !this.carried && !this.isAttacking(); }
  
    #initFromMonsterType() {
        this.pixel_size = this.monster_type.size;
        this.health_points = MainController.wave_generator.healthPoints(this.monster_type);
        this.speed = MainController.wave_generator.randomSpeed(this.monster_type);
    }
  
    #addLifeBar() {
        this.life_bar = MV_Gauge.getInstance("monster-health-bar", this.health_points, this.health_points);
        this.appendChild(this.life_bar);
    }

    #dieOrBleed(angle) {
        if (this.health_points <= 0) {
            this.remove();
            this.#createBloodPuddle(this.x + this.pixel_size/2, this.y + this.pixel_size/2, true);
            this.#monsterSlayed();
        } else {
            this.shock();
            this.#bleed(angle);
        }
    }

    #bleed(angle) {
        if (angle)
            angle += Math.PI;
        else angle = this.angle;

        const x_splash = this.x + this.pixel_size/2 + ( this.pixel_size/2 * Math.cos(angle) );
        const y_splash = this.y + this.pixel_size/2 + ( this.pixel_size/2 * Math.sin(angle) );  
        const x_puddle = x_splash + BLOOD_SPLASH_LENGTH * Math.cos(angle);
        const y_puddle = y_splash + BLOOD_SPLASH_LENGTH * Math.sin(angle);  
        JuiceHelper.bloodSplash(x_splash, y_splash, angle, ()=> {
            this.#createBloodPuddle(x_puddle, y_puddle, false);
        });
    }

    #monsterSlayed() {
        JuiceHelper.monsterSlayed();
        
        if (this.specificDeathEffect)
            this.specificDeathEffect();
        
        MainController.scope.game.money += this.#getSwagAmount();
		XpBarHelper.addXp( this.#getXpAmount() );
        
        MainController.UI.refreshMonstersList();
    }

    #getSwagAmount() {
        let swag = Tools.radomValueInRange(this.monster_type.swag_range[0], this.monster_type.swag_range[1]);
        swag *= Abilities.getSwagUpgrade();
        return Math.floor(swag * Abilities.getSwagUpgrade() * this.#bonus_reward_ratio);
    }
    #getXpAmount() { return Math.floor(this.monster_type.battle_value * this.#bonus_reward_ratio); }

    #createBloodPuddle(x, y, isBig) {
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
        setTimeout(()=> { puddle_element.remove(); }, 15000);
    }
}
customElements.define("rs-game-monster", MV_Monster);