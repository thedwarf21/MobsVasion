class PopupsStack {
    #popups;

    constructor () {
        this.#popups = [];
    }

    push(popup_manager, options) {
        MainController.scope.controls.paused = true;
        
        const popup = new popup_manager(options);
        popup.show(()=> {
            popup.registerMenuItems();
            popup.highlightActiveItem();
        });

        JuiceHelper.popupOpening();
        
        return this.#popups.unshift(popup);
    }

    pop() { 
        const foreground_popup = this.#popups.shift();
        foreground_popup.close();
        MainController.scope.controls.paused = !!this.#popups.length;

        JuiceHelper.popupClosing();
    }

    activePopup() { return this.#popups.length ? this.#popups[0] : null; }

    isShopOpened() {
        for (const popup of this.#popups)
            if (popup.switchToMoneyShop)
                return true;

        return false;
    }

    closeAll() {
        while(this.#popups.length)
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
        this.active_item_id = "0_0";
    }

    close() {
        this.#checkRequiredProperties();
        this.leaveActiveItem();
        this.rs_dialog_instance.closeModal();
        this.rs_dialog_instance = null;
    }

    trigger() {
        const active_item = this.getActiveItem();
        active_item.html_element.click();

        if (active_item.onValidate)
            active_item.onValidate(); 
    }

    highlightActiveItem() { 
        if (MainController.timer.gamepad_mapper) {
            const active_item_html_element = this.getActiveItem().html_element;
            active_item_html_element.classList.add("active");
            active_item_html_element.dispatchEvent(new Event('mouseenter'));
        }
    }

    leaveActiveItem() {
        const active_item = this.getActiveItem().html_element;
        active_item.classList.remove("active");
        active_item.dispatchEvent(new Event('mouseleave'));
    }

    setActiveItem(new_active_ident) {
        if ( !this.querySelector(`[nav-ident='${new_active_ident}']`) )
            return false;

        this.leaveActiveItem();
        this.active_item_id = new_active_ident;
        this.highlightActiveItem();

        JuiceHelper.popupNavigate();
        return true;
    }

    getLineAndColumnNumbers() {
        const position = this.active_item_id.split("_");
        return {
            column: parseInt(position[0]),
            line: parseInt(position[1])
        };
    }

    getActiveItem() {
        for (const menu_item of this.navigable_items)
            if(menu_item.id === this.active_item_id)
                return menu_item;
    }

    querySelector(selector) {
        this.#checkRequiredProperties();
        return this.rs_dialog_instance.root_element.querySelector(selector);
    }

    querySelectorAll(selector) {
        this.#checkRequiredProperties();
        return this.rs_dialog_instance.root_element.querySelectorAll(selector);
    }

    registerMenuItems() { 
        const navigable_elements = this.querySelectorAll("[nav-ident]");
        for (const html_element of navigable_elements) {
            this.#registerMenuItem(html_element.getAttribute("nav-ident"), html_element);
        } 
    }

    #checkRequiredProperties() {
        if (!this.rs_dialog_instance)
            throw new Error(`A "rs_dialog_instance" property is needed for this feature to work`);
    }

    #registerMenuItem(item_ident, html_element, onValidate) {
        this.navigable_items.push({
            id: item_ident,
            html_element: html_element,
            onValidate: onValidate
        });

        if (!this.active_item_id)
            this.active_item_id = item_ident;
    }

    /** Méthodes abstraites **/
    show(onPopupOpened)     { throw new Error(`Implementing ${this.name}.show() is mandatory`); }
    navigateUp()            { throw new Error(`Implementing ${this.name}.navigateUp() is mandatory`); }
    navigateDown()          { throw new Error(`Implementing ${this.name}.navigateDown() is mandatory`); }
    navigateLeft()          { throw new Error(`Implementing ${this.name}.navigateLeft() is mandatory`); }
    navigateRight()         { throw new Error(`Implementing ${this.name}.navigateRight() is mandatory`); }
}