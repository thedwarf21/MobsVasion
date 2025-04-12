class MV_AnimatedFrame extends MobileGameElement {
    constructor(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd) {
        super(viewport, x ,y);
        this.classList.add("animation-container");

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