class MV_Character extends MobileGameElement {
    aiming_angle;

    constructor() { super(); }

	static getInstance(viewport) { 
        const instance = document.createElement("rs-game-character");
        instance.init(viewport);
        return instance;
    }

    init(viewport) {
        super.init(viewport, "css/character.css");
        this.classList.add("character");
        this.#init();
    }
  
    shoot() {
        if (!MainController.scope.game.waiting_counter.shot) {
            MainController.scope.game.waiting_counter.shot = Abilities.getShotInterval();

			if (MainController.scope.game.clip_ammo) {
				MainController.scope.game.clip_ammo--;

				const shot = this.#createShot();
                MainController.UI.shots.push(shot);
				MainController.UI.addToGameWindow(shot);
			} else JuiceHelper.emptyClipPercussion();
		}
    }

    walk() {
        const character_speed = Abilities.getCharacterSpeed();
        this.deltaX = character_speed * Math.cos(this.angle);
        this.deltaY = character_speed * Math.sin(this.angle);
        this.move();
    }
  
    dash() {
        this.deltaX = DASH_LENGTH * Math.cos(this.angle);
        this.deltaY = DASH_LENGTH * Math.sin(this.angle);
        this.move();

        JuiceHelper.dashSound();
    }

    applyAngles() {
        if (MainController.scope.controls.firing_primary) {
            this.rotate(this.aiming_angle);
        }
    }
  
    #init() {
        this.angle = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.pixel_size = CHARACTER_SIZE;
        this.aiming_angle = 0;
    
        this.#moveCenter();
        this.addImageElt("spinning-image");
        this.addVisualHitBox(MainController.scope.game.showHitboxes);
    }
  
    #moveCenter() {
        this.x = (this.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE) / 2;
        this.y = (this.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE) / 2;
        this.style.top = this.viewport.getCssValue(this.y);
        this.style.left = this.viewport.getCssValue(this.x);
    }

    #createShot() {
        const front_spot = this.frontSpotPosition();
        JuiceHelper.shoot(front_spot.x, front_spot.y, this.aiming_angle);
        
        const deltaX = SHOT_VELOCITY * Math.cos(this.aiming_angle);
        const deltaY = SHOT_VELOCITY * Math.sin(this.aiming_angle);
        return MV_Shot.getInstance(this.viewport, front_spot.x, front_spot.y, deltaX, deltaY, this.aiming_angle, Abilities.getShotPower());
    }
}
customElements.define("rs-game-character", MV_Character);