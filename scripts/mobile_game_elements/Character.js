class MV_Character extends MobileGameElement {
    aiming_angle;
  
    constructor(viewport) {
        super(viewport);
        this.root_element.classList.add("character");
        this.__init();
    }
  
    shoot() {
        if (!MainController.scope.game.waiting_counter.shot) {
            MainController.scope.game.waiting_counter.shot = Abilities.getShotInterval();

			if (MainController.scope.game.clip_ammo) {
				const shot = this.__createShot();
				MainController.UI.addToGameWindow(shot.root_element);
                MainController.UI.shots.push(shot);
				MainController.scope.game.clip_ammo--;
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
            this.__rotate(this.aiming_angle);
        }
    }
  
    __init() {
        this.angle = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.pixel_size = CHARACTER_SIZE;
        this.aiming_angle = 0;
    
        this.__moveCenter();
        this.addImageElt("spinning-image");
        this.addVisualHitBox(MainController.scope.game.showHitboxes);
    }
  
    __moveCenter() {
        this.x = (this.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE) / 2;
        this.y = (this.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE) / 2;
        this.root_element.style.top = this.viewport.getCssValue(this.y);
        this.root_element.style.left = this.viewport.getCssValue(this.x);
    }

    __createShot() {
        const front_spot = this.frontSpotPosition();
        JuiceHelper.shoot(front_spot.x, front_spot.y, this.aiming_angle);
        
        const deltaX = SHOT_VELOCITY * Math.cos(this.aiming_angle);
        const deltaY = SHOT_VELOCITY * Math.sin(this.aiming_angle);
        return new MV_Shot(this.viewport, front_spot.x, front_spot.y, deltaX, deltaY, this.aiming_angle);
    }
}