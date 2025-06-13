class MV_Gauge extends MobileGameElement {
    #progress_improvement_element;
    #progress_element;
    #current_value;
    #max_value;

    constructor(css_class_name, max_value, initial_value) {
        super(MainController.viewport);
        this.root_element.classList.add("gauge");
        this.root_element.classList.add(css_class_name);
        
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
        this.root_element.appendChild(this.#progress_element);
        
        this.#progress_improvement_element = document.createElement("DIV");
        this.#progress_improvement_element.classList.add("progress-improvement");
        this.#progress_improvement_element.style.width = 0;
        this.root_element.appendChild(this.#progress_improvement_element);
    }
}