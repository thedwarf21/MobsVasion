class MV_AnimatedFrame extends MobileGameElement {
    constructor(viewport, x, y, width, height, animationCssClass, animationDuration, onAnimationEnd) {
        super(viewport, x ,y);
        this.root_element.classList.add("animation-container");

        this.root_element.style.width = this.viewport.getCssValue(width);
        this.root_element.style.height = this.viewport.getCssValue(height);

        this.#addAnimationElement(animationCssClass);
        setTimeout(() => { this.#animationEnded(onAnimationEnd) }, animationDuration);
    }

    #addAnimationElement(animationCssClass) {
        const animationElement = document.createElement("div");
        this.root_element.appendChild(animationElement);
        animationElement.classList.add(animationCssClass);
    }

    #animationEnded(onAnimationEnd) {
        this.root_element.remove();
        if (onAnimationEnd)
            onAnimationEnd();
    }
}