class MV_Shot extends MobileGameElement {
    constructor(viewport, x, y, deltaX, deltaY) {
        super(viewport, x ,y);
        this.classList.add("shot");
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
}
customElements.define('mv-js-shot', MV_Shot, { extends: 'div' });