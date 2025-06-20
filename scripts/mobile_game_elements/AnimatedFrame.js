class MV_AnimatedFrame extends MobileGameElement {

    constructor() { super(); }

	static getInstance(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd) { 
        const instance = document.createElement("rs-game-animation");
        instance.init(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd);
        return instance;
    }

    init(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd) {
        super.init(viewport, "css/animations.css", x ,y);
        this.classList.add("animation-container");

        this.style.width = this.viewport.getCssValue(width);
        this.style.height = this.viewport.getCssValue(height);

        this.#addAnimationElement(animationCssClass);
        setTimeout(() => { this.#animationEnded(onAnimationEnd) 
        }, animationDuration);
    }

    #addAnimationElement(animationCssClass) {
        const animationElement = document.createElement("div");
        this.appendChild(animationElement);
        animationElement.classList.add(animationCssClass);
    }

    #animationEnded(onAnimationEnd) {
        this.remove();
        if (onAnimationEnd)
            onAnimationEnd();
    }
}
customElements.define("rs-game-animation", MV_AnimatedFrame);