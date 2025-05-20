class SelectorInput extends HTMLBaseElement {
    TEMPLATE_LOCATION = "scripts/common_tools/tpl_rs_selector.html";

    shadow;             // shadow DOM
    options;            // liste des options sélectionnables
    on_change;          // fonction appelée lorsque la valeur sélectionnée change
    selected_index;     // indice dans `options`, de la valeur sélectionnée

    constructor() { super(); }

    // Appelle `this.childrenAvailableCallback()` lorsque le navigateur à terminé de parser le DOM interne de la balise
    connectedCallback() { super.setup(); }

    childrenAvailableCallback() {
        this.__initOptions();
        this.__setSelectedValue( eval(this.getAttribute("value")) );
        this.on_change = ()=> { eval(this.getAttribute("onchange")); };

        this.__initShadowDOM();
    }

    select_previous() {
        if (this.selected_index === 0)
            return;

        this.selected_index--;
        this.__applySelectedIndex();
        JuiceHelper.dashSound();
    }

    select_next() {
        if (this.selected_index === this.options.length - 1)
            return;

        this.selected_index++;
        this.__applySelectedIndex();
        JuiceHelper.dashSound();
    }

    __initOptions() {
        this.options = [];
        
        for (const option of this.getElementsByTagName("option"))
            this.__addOption(option);

        if (this.options.length === 0)
            throw new Error("The <rs-selector> custom element needs <option> tags in its body, to work");
    }

    __addOption(html_element) {
        this.options.push({
            value: html_element.getAttribute("value"),
            display: html_element.innerHTML,
            infos: html_element.getAttribute("infos")
        });
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

    __initShadowDOM() {
        this.shadow = this.attachShadow({ mode: SHADOW_MODE });
        routage(this.TEMPLATE_LOCATION, ()=> {
            this.button_next.addEventListener('click', ()=> { this.select_next(); });
            this.button_previous.addEventListener('click', ()=> { this.select_previous(); });
            this.__applySelectedIndex();
        }, this.shadow);
    }

    __applySelectedIndex() {
        this.value_display_element.innerHTML = this.__selected_option.display;
        this.infos_display_element.innerHTML = this.__selected_option.infos;
        this.on_change();
    }

    get button_next()           { return this.shadow.querySelector(".next"); }
    get button_previous()       { return this.shadow.querySelector(".previous"); }
    get value_display_element() { return this.shadow.querySelector(".displayed-value"); }
    get infos_display_element() { return this.shadow.querySelector(".displayed-infos"); }

    get __selected_option() { return this.options[ this.selected_index ]; }
    get selected_value() { return this.__selected_option.value; }
}
customElements.define('rs-selector', SelectorInput);
