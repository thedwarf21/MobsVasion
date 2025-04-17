class MV_Shot extends MobileGameElement {
    constructor() {
        super();
        this.classList.add("shot");
    }

    static create(viewport, x, y, deltaX, deltaY) {
        let new_object = new MV_Shot();
        new_object.setup(viewport, x, y, deltaX, deltaY);
        return new_object;
    }

    setup(viewport, x, y, deltaX, deltaY) {
        super.setup(viewport, x ,y);
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
}
customElements.define('mv-js-shot', MV_Shot, { extends: 'div' });