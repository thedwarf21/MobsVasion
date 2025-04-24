class PopupsStack {
    __popups;

    constructor () {
        this.__popups = [];
    }

    push(popup_manager) {
        MainController.scope.controls.paused = true;
        
        let popup = new popup_manager();
        popup.show(); 
        
        return this.__popups.unshift(popup);
    }

    pop() { 
        let foreground_popup = this.__popups.shift();
        foreground_popup.close();
        MainController.scope.controls.paused = !!this.__popups.length;
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

        this.__registerMenuItems();
    }

    close() {
        this.__checkRequiredProperties();
        this.rs_dialog_instance.closeModal();
        this.rs_dialog_instance = null;
    }

    trigger() { 
        for (let menu_item of this.navigable_items) {
            if (menu_item.id === this.active_item_id) {
                menu_item.onValidate();
                return;
            }
        }
    }

    __querySelector(selector) {
        this.__checkRequiredProperties();
        return this.rs_dialog_instance.root_element.querySelector(selector);
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

    /** Méthodes abstraites **/
    navigateUp()            { throw new Error(`Implementing ${this.name}.navigateUp() is mandatory`); }
    navigateDown()          { throw new Error(`Implementing ${this.name}.navigateDown() is mandatory`); }
    navigateLeft()          { throw new Error(`Implementing ${this.name}.navigateLeft() is mandatory`); }
    navigateRight()         { throw new Error(`Implementing ${this.name}.navigateRight() is mandatory`); }
    __registerMenuItems()   { throw new Error(`Implementing ${this.name}.__registerMenuItems() is mandatory`); }
}