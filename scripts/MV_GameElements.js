class MV_Character extends MobileGameElement {

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

  __init() {
    this.angle = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.pixel_size = CHARACTER_SIZE;

    let viewport = MainController.viewport;
    this.x = (viewport.VIRTUAL_WIDTH - CHARACTER_SIZE) / 2;
    this.y = (viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE) / 2;
    this.style.top = viewport.getCssValue(this.y, true);
    this.style.left = viewport.getCssValue(this.x, false);

    super.addVisualHitBox();
  }
}
customElements.define('mv-js-character', MV_Character, { extends: 'div' });


class MV_Shot extends MobileGameElement {
  constructor(viewport, x, y, deltaX, deltaY) {
    super(viewport, x ,y);
    this.classList.add("shot");
    this.deltaX = deltaX;
    this.deltaY = deltaY;
  }
}
customElements.define('mv-js-shot', MV_Shot, { extends: 'div' });