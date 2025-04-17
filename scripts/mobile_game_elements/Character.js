class MV_Character extends MobileGameElement {
    __image_elt;
    aiming_angle;
  
    constructor(viewport) {
        super(viewport);
        this.classList.add("character");
    }

    static create(viewport) {
        let new_object = new MV_Character();
        new_object.setup(viewport);
        new_object.__init();
        return new_object;
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
        this.style.top = this.viewport.getCssValue(this.y);
        this.style.left = this.viewport.getCssValue(this.x);
    }
  
    shoot() {
        if (!MainController.scope.game.waiting_counter.shot) {
			if (MainController.scope.game.clip_ammo) {
				let shot = this.__createShot();
				MainUI.addToGameWindow(shot);
				MainController.scope.game.waiting_counter.shot = TIMEOUTS.shot_interval;
				MainController.scope.game.clip_ammo--;
			}  // En isolant ce if, il suffira d'écrire un else pour jouer un son (CLIC !) avertissant l'utilisateur que son chargeur est vide, d'où l'imbrication
		}
    }

    __createShot() {
        let aiming_rad_angle = this.aiming_angle * Math.PI / 180;
        let center_spot = this.centralSpotPosition();
        let cos_angle = Math.cos(aiming_rad_angle);
        let sin_angle = Math.sin(aiming_rad_angle);

        let shot_start_x = center_spot.x + CHARACTER_SIZE/2 * cos_angle;
        let shot_start_y = center_spot.y + CHARACTER_SIZE/2 * sin_angle;
 
        this.__showFire(shot_start_x, shot_start_y);
        
        let deltaX = SHOT_VELOCITY * cos_angle;
        let deltaY = SHOT_VELOCITY * sin_angle;
        return MV_Shot.create(this.viewport, shot_start_x, shot_start_y, deltaX, deltaY);
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
    }

    applyAngles() {
        if (MainController.scope.controls.firing_primary) {
            this.__rotate(this.aiming_angle);
        }
    }

    __showFire(x, y) {
        let weapon_flame = document.createElement("DIV");
        weapon_flame.classList.add("fire");

        weapon_flame.style.left = this.viewport.getCssValue(x);
        weapon_flame.style.top = this.viewport.getCssValue(y - FIRE_SIZE/2);
        weapon_flame.style.transform = `rotate(${this.aiming_angle}deg)`;
        MainUI.addToGameWindow(weapon_flame);

        setTimeout(()=> {
            weapon_flame.remove();
        }, 50);
    }
  }
  customElements.define('mv-js-character', MV_Character, { extends: 'div' });