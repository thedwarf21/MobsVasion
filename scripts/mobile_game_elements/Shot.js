class MV_Shot extends MobileGameElement {
    constructor(viewport, x, y, deltaX, deltaY) {
        super(viewport, x ,y);
        this.root_element.classList.add("shot");
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
}