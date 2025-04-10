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
  __speed;
  __life_bar;
  __health_points;

  constructor(viewport, x, y) {
    super(viewport, x, y);
    this.classList.add("monster");
    this.__init();
  }

  follow(character) {
    let rad_angle = Math.atan( (character.y - this.y) / (character.x - this.x) );
    if (character.x < this.x)
      rad_angle += Math.PI;
    this.angle = rad_angle * 180 / Math.PI;
    this.deltaX = this.__speed * Math.cos(rad_angle);
    this.deltaY = this.__speed * Math.sin(rad_angle);
    this.move();
  }

  wound(injury_amount, onMonsterDeath) {
    this.__health_points -= injury_amount;
    this.__life_bar.assignValue(this.__health_points);
    if (!this.__health_points) {
      this.remove();
      if (onMonsterDeath)
        onMonsterDeath();
    }
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
}
customElements.define('mv-js-monster', MV_Monster, { extends: 'div' });