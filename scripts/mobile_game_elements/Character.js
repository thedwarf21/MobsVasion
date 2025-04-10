class MV_Character extends MobileGameElement {
    __image_elt;
  
    constructor(viewport) {
        super(viewport);
        this.classList.add("character");
        this.__init();
    }
  
    shoot(velocity, direction_angle) {
        let self_center_x = this.x + CHARACTER_SIZE/2;
        let self_center_y = this.y + CHARACTER_SIZE/2;
        let cos_angle = Math.cos(direction_angle);
        let sin_angle = Math.sin(direction_angle);
        let shot_start_x = self_center_x + CHARACTER_SIZE * cos_angle;
        let shot_start_y = self_center_y + CHARACTER_SIZE * sin_angle;
        let deltaX = velocity * cos_angle;
        let deltaY = velocity * sin_angle;
        return new MV_Shot(this.viewport, shot_start_x, shot_start_y, deltaX, deltaY);
    }
  
    dash() {
        this.deltaX = DASH_LENGTH * Math.cos(this.angle * Math.PI / 180);
        this.deltaY = DASH_LENGTH * Math.sin(this.angle * Math.PI / 180);
        this.move();
    }
  
    __init() {
        this.angle = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.pixel_size = CHARACTER_SIZE;
    
        this.__centerPosition();
        this.addImageElt("spinning-image");
        this.addVisualHitBox();
    }
  
    __centerPosition() {
        this.x = (this.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE) / 2;
        this.y = (this.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE) / 2;
        this.style.top = this.viewport.getCssValue(this.y);
        this.style.left = this.viewport.getCssValue(this.x);
    }
  }
  customElements.define('mv-js-character', MV_Character, { extends: 'div' });