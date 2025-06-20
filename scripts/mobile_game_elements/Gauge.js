class MV_Gauge extends MobileGameElement {
    #main_container;
    #progress_improvement_element;
    #progress_element;
    #current_value;
    #max_value;

    constructor() { super(); }

	static getInstance(css_class_name, max_value, initial_value) { 
        const instance = document.createElement("rs-game-gauge")
        instance.init(css_class_name, max_value, initial_value);
        return instance;
    }

    init(css_class_name, max_value, initial_value) {
        super.init(MainController.viewport, "css/gauges.css");
        this.#main_container = document.createElement("DIV");
        this.#main_container.classList.add("gauge");
        this.#main_container.classList.add(css_class_name);
        this.appendChild(this.#main_container);
        
        this.#max_value = max_value;
        this.#createProgressElements();
        this.assignValue(initial_value);
    }

    setMaxValue(new_max_value) { 
        this.#max_value = new_max_value;
    }

    assignValue(new_value) {
        this.#current_value = new_value;
        this.#progress_element.style.width = (new_value / this.#max_value * 100) + "%";
    }

    displayImprovement(amount) {
        if (this.#current_value + amount > this.#max_value)
            amount = this.#max_value - this.#current_value;

        this.#progress_improvement_element.style.width = (amount / this.#max_value * 100) + "%";
    }

    #createProgressElements() {
        this.#progress_element = document.createElement("DIV");
        this.#progress_element.classList.add("progress");
        this.#main_container.appendChild(this.#progress_element);
        
        this.#progress_improvement_element = document.createElement("DIV");
        this.#progress_improvement_element.classList.add("progress-improvement");
        this.#progress_improvement_element.style.width = 0;
        this.#main_container.appendChild(this.#progress_improvement_element);
    }
}
customElements.define("rs-game-gauge", MV_Gauge);