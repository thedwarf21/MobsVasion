class SelectorInput extends HTMLBaseElement {
    options;
    selected_index;
    value_display_element;

    constructor() { super(); }

    // Appelle `this.childrenAvailableCallback()` lorsque le navigateur à terminé de parser le DOM interne de la balise
    connectedCallback() { super.setup(); }

    childrenAvailableCallback() {
        this.options = [];
        this.selected_index = 0;
        
        for (const option of this.getElementsByTagName("option"))
            this.__addOption(option);

        if (this.options.length === 0)
            throw new Error("<rs-selector> elements need <option> tags in its body, to work");

        this.__setSelectedValue( eval(this.getAttribute("value")) );
        this.on_change = ()=> { eval(this.getAttribute("onchange")); };

        // Génération du shadow DOM
        let shadow = this.attachShadow({ mode: SHADOW_MODE });
        RS_WCL.styleShadow(shadow, 'css/rs_selector.css');
        shadow.appendChild( this.__getShadowDomContent() );
    }

    __setSelectedValue(value) {
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            if (option.value === value) {
                this.selected_index = i;
                return;
            }
        }
    }

    __addOption(html_element) {
        this.options.push({
            value: html_element.getAttribute("value"),
            display: html_element.innerHTML
        });
    }

    __getShadowDomContent() {
        const root_container = document.createElement("DIV");
        root_container.classList.add("root-container");

        this.__addButton("previous", root_container, ()=> { this.__select_previous(); });
        this.__addValueDisplayElement(root_container);
        this.__addButton("next", root_container, ()=> { this.__select_next(); });

        this.__applySelectedIndex();

        return root_container;
    }

    __addButton(css_class, container, on_click) {
        const button = document.createElement("BUTTON");
        button.classList.add(css_class);
        button.addEventListener('click', on_click);
        container.appendChild(button);
    }

    __addValueDisplayElement(container) {
        this.value_display_element = document.createElement("DIV");
        this.value_display_element.classList.add("displayed-value");
        container.appendChild(this.value_display_element);
    }

    __select_previous() {
        if (this.selected_index === 0)
            return;

        this.selected_index--;
        this.__applySelectedIndex();
        JuiceHelper.dashSound();
    }

    __select_next() {
        if (this.selected_index === this.options.length - 1)
            return;

        this.selected_index++;
        this.__applySelectedIndex();
        JuiceHelper.dashSound();
    }

    __applySelectedIndex() { 
        this.value_display_element.innerHTML = this.__selected_option.display;
        this.on_change();
    }

    get __selected_option() { return this.options[ this.selected_index ]; }
    get selected_value() { return this.__selected_option.value; }
}
customElements.define('rs-selector', SelectorInput);
