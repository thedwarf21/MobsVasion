class MV_AnimatedFrame extends MobileGameElement {
    constructor() {
        super();
        this.classList.add("animation-container");
    }

    static create(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd) {
        let new_object = new MV_AnimatedFrame();
        new_object.setup(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd);
        return new_object;
    }

    setup(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd) {
        super.setup(viewport, x ,y);
        this.style.width = this.viewport.getCssValue(width);
        this.style.height = this.viewport.getCssValue(height);

        this.__addAnimationElement(animationCssClass);
        setTimeout(() => { this.__animationEnded(onAnimationEnd) }, animationDuration);
    }

    __addAnimationElement(animationCssClass) {
        let animationElement = document.createElement("div");
        this.appendChild(animationElement);
        animationElement.classList.add(animationCssClass);
    }

    __animationEnded(onAnimationEnd) {
        this.remove();
        if (onAnimationEnd)
            onAnimationEnd();
    }
}
customElements.define('mv-js-animation', MV_AnimatedFrame, { extends: 'div' });