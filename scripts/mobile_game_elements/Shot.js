class MV_Shot extends MobileGameElement {

    constructor() { super(); }

	static getInstance(viewport, x, y, deltaX, deltaY, angle, strength) { 
        const instance = document.createElement("rs-game-shot")
        instance.init(viewport, x, y, deltaX, deltaY, angle, strength);
        return instance;
    }

    init(viewport, x, y, deltaX, deltaY, angle, strength) {
        super.init(viewport, "css/hitbox.css", x - SHOT_SIZE/2 ,y - SHOT_SIZE/2);
        this.classList.add("shot");

        this.strength = strength;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.angle = angle;
        this.pixel_size = SHOT_SIZE;

    }
}
customElements.define("rs-game-shot", MV_Shot);