class MV_Gauge extends MobileGameElement {
    __progress_improvement_element;
    __progress_element;
    __current_value;
    __max_value;

    constructor(css_class_name, max_value, initial_value) {
        super(MainController.viewport);
        this.root_element.classList.add("gauge");
        this.root_element.classList.add(css_class_name);
        
        this.__max_value = max_value;
        this.__createProgressElements();
        this.assignValue(initial_value);
    }

    setMaxValue(new_max_value) { 
        this.__max_value = new_max_value;
    }

    assignValue(new_value) {
        this.__current_value = new_value;
        this.__progress_element.style.width = (new_value / this.__max_value * 100) + "%";
    }

    displayImprovement(amount) {
        if (this.__current_value + amount > this.__max_value)
            amount = this.__max_value - this.__current_value;

        this.__progress_improvement_element.style.width = (amount / this.__max_value * 100) + "%";
    }

    __createProgressElements() {
        this.__progress_element = document.createElement("DIV");
        this.__progress_element.classList.add("progress");
        this.root_element.appendChild(this.__progress_element);
        
        this.__progress_improvement_element = document.createElement("DIV");
        this.__progress_improvement_element.classList.add("progress-improvement");
        this.__progress_improvement_element.style.width = 0;
        this.root_element.appendChild(this.__progress_improvement_element);
    }
}