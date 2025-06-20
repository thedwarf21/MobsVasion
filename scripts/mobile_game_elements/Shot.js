class MV_Shot extends MobileGameElement {
    #main_container;

    constructor() { super(); }

	static getInstance(viewport, x, y, deltaX, deltaY, angle) { 
        const instance = document.createElement("rs-game-shot")
        instance.init(viewport, x, y, deltaX, deltaY, angle);
        return instance;
    }

    init(viewport, x, y, deltaX, deltaY, angle) {
        super.init(viewport, "css/shot.css", x - SHOT_SIZE/2 ,y - SHOT_SIZE/2);
        this.classList.add("shot");
        
        this.#main_container = document.createElement("DIV");
        this.#main_container.classList.add("shot");
        this.appendChild(this.#main_container);

        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.angle = angle;
        this.pixel_size = SHOT_SIZE;
    }
}
customElements.define("rs-game-shot", MV_Shot);