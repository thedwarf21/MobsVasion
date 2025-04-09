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

    this.x = (this.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE) / 2;
    this.y = (this.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE) / 2;
    this.style.top = this.viewport.getCssValue(this.y, true);
    this.style.left = this.viewport.getCssValue(this.x, false);

    this.__image_elt = document.createElement("DIV");
    this.__image_elt.classList.add("spinning-image");
    this.appendChild(this.__image_elt);

    this.rotate_element = this.__image_elt;

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


class MV_Gauge extends HTMLDivElement {
  __progress_element;

  constructor(css_class_name, max_value, initial_value) {
    super();
    this.classList.add("gauge");
    this.classList.add(css_class_name);

    this.__max_value = max_value;
    
    this.__createProgressElement();
    this.assignValue(initial_value);
  }

  assignValue(new_value) {
    this.__progress_element.style.width = (new_value / this.__max_value * 100) + "%";
  }

  __createProgressElement() {
    this.__progress_element = document.createElement("DIV");
    this.__progress_element.classList.add("progress");
    this.appendChild(this.__progress_element);
  }
}
customElements.define('mv-js-gauge', MV_Gauge, { extends: 'div' });


class MV_Monster extends MobileGameElement {
  __image_elt;

  constructor(viewport, x, y) {
    super(viewport, x, y);
    this.classList.add("monster");
    this.__init();
  }

  __init() {
    this.angle = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.pixel_size = MONSTER_SIZE;

    this.__image_elt = document.createElement("DIV");
    this.__image_elt.classList.add("spinning-image");
    this.appendChild(this.__image_elt);

    this.rotate_element = this.__image_elt;

    super.addVisualHitBox();
  }
}
customElements.define('mv-js-monster', MV_Monster, { extends: 'div' });