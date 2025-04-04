/**
 * Classe gérant le personnage, en tant qu'élément graphique
 */
class MV_Character extends MobileGameElement {

  constructor(viewport) {
    super(viewport);
    this.classList.add("character");
    this.__init();
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
customElements.define('ah-js-spaceship', MV_Character, { extends: 'div' });