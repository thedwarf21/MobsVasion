class MV_Shot extends MobileGameElement {
    constructor(viewport, x, y, deltaX, deltaY, angle) {
        super(viewport, x - SHOT_SIZE/2 ,y - SHOT_SIZE/2);
        this.root_element.classList.add("shot");
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.angle = angle;
        this.pixel_size = SHOT_SIZE;
    }
}