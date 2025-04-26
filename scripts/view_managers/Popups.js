class PopupsStack {
    __popups;

    constructor () {
        this.__popups = [];
    }

    push(popup_manager) {
        MainController.scope.controls.paused = true;
        
        let popup = new popup_manager();
        popup.show(()=> {
            popup.__registerMenuItems();
            popup.highlightActiveItem();
        });

        JuiceHelper.popupOpening();
        
        return this.__popups.unshift(popup);
    }

    pop() { 
        let foreground_popup = this.__popups.shift();
        foreground_popup.close();
        MainController.scope.controls.paused = !!this.__popups.length;

        JuiceHelper.popupClosing();
    }

    activePopup() { return this.__popups.length ? this.__popups[0] : null; }

    closeAll() {
        while(this.__popups.length)
            this.pop();
    }
}


class AbstractPopup {
    rs_dialog_instance;
    navigable_items;
    active_item_id;
    
    constructor() {
        if (this.constructor === AbstractPopup)
            throw new TypeError('Abstract class "AbstractPopup" cannot be instantiated, directly');

        this.navigable_items = [];
    }

    close() {
        this.__checkRequiredProperties();
        this.rs_dialog_instance.closeModal();
        this.rs_dialog_instance = null;
    }

    trigger() {
        let active_item = this.__getActiveItem();
        active_item.html_element.click();

        if (active_item.onValidate)
            active_item.onValidate(); 
    }

    highlightActiveItem() { 
        if (MainController.timer.gamepad_mapper)
            this.__getActiveItem().html_element.classList.add("active");
    }

    __getLineAndColumnNumbers() {
        let position = this.active_item_id.split("_");
        return {
            column: parseInt(position[0]),
            line: parseInt(position[1])
        };
    }

    __setActiveItem(new_active_ident) {
        if (this.__querySelector(`[nav-ident='${new_active_ident}']`)) {
            this.__getActiveItem().html_element.classList.remove("active");
            this.active_item_id = new_active_ident;
            this.highlightActiveItem();

            JuiceHelper.popupNavigate();
        }
    }

    __getActiveItem() {
        for (let menu_item of this.navigable_items)
            if(menu_item.id === this.active_item_id)
                return menu_item;
    }

    __querySelector(selector) {
        this.__checkRequiredProperties();
        return this.rs_dialog_instance.root_element.querySelector(selector);
    }

    __querySelectorAll(selector) {
        this.__checkRequiredProperties();
        return this.rs_dialog_instance.root_element.querySelectorAll(selector);
    }

    __checkRequiredProperties() {
        if (!this.rs_dialog_instance)
            throw new Error(`A "rs_dialog_instance" property is needed for this feature to work`);
    }

    __registerMenuItem(item_ident, html_element, onValidate) {
        this.navigable_items.push({
            id: item_ident,
            html_element: html_element,
            onValidate: onValidate
        });

        if (!this.active_item_id)
            this.active_item_id = item_ident;
    }

    __registerMenuItems() { 
        let navigable_elements = this.__querySelectorAll("[nav-ident]");
        for (let html_element of navigable_elements) {
            this.__registerMenuItem(html_element.getAttribute("nav-ident"), html_element);
        } 
    }

    /** Méthodes abstraites **/
    show(onPopupOpened)     { throw new Error(`Implementing ${this.name}.show() is mandatory`); }
    navigateUp()            { throw new Error(`Implementing ${this.name}.navigateUp() is mandatory`); }
    navigateDown()          { throw new Error(`Implementing ${this.name}.navigateDown() is mandatory`); }
    navigateLeft()          { throw new Error(`Implementing ${this.name}.navigateLeft() is mandatory`); }
    navigateRight()         { throw new Error(`Implementing ${this.name}.navigateRight() is mandatory`); }
}