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
				let shot = this.__createShot();
				MainController.UI.addToGameWindow(shot.root_element);
                MainController.UI.shots.push(shot);
				MainController.scope.game.clip_ammo--;
			} else JuiceHelper.emptyClipPercussion();
		}
    }

    walk(rad_angle) {
        let character_speed = Abilities.getCharacterSpeed();
        this.deltaX = character_speed * Math.cos(rad_angle);
        this.deltaY = character_speed * Math.sin(rad_angle);
        this.move();
    }

    centralSpotPosition() {
        return {
            x: this.x + CHARACTER_SIZE/2,
            y: this.y + CHARACTER_SIZE/2
        };
    }
  
    dash() {
        this.deltaX = DASH_LENGTH * Math.cos(this.angle * Math.PI / 180);
        this.deltaY = DASH_LENGTH * Math.sin(this.angle * Math.PI / 180);
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
        let aiming_rad_angle = this.aiming_angle * Math.PI / 180;
        let center_spot = this.centralSpotPosition();
        let cos_angle = Math.cos(aiming_rad_angle);
        let sin_angle = Math.sin(aiming_rad_angle);

        let shot_start_x = center_spot.x + CHARACTER_SIZE/2 * cos_angle;
        let shot_start_y = center_spot.y + CHARACTER_SIZE/2 * sin_angle;
 
        JuiceHelper.shoot(shot_start_x, shot_start_y, this.aiming_angle);
        
        let deltaX = SHOT_VELOCITY * cos_angle;
        let deltaY = SHOT_VELOCITY * sin_angle;
        return new MV_Shot(this.viewport, shot_start_x, shot_start_y, deltaX, deltaY);
    }
}