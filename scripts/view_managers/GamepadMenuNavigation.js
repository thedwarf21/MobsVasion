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
    
    constructor() {
        if (this.constructor === AbstractPopup)
            throw new TypeError('Abstract class "AbstractPopup" cannot be instantiated, directly');

        this.gamepad_navigation = new GamepadMenuNavigation();
        this.__registerMenuItems();
    }

    close() {
        this.__checkRequiredProperties();
        this.rs_dialog_instance.closeModal();
        this.rs_dialog_instance = null;
    }

    __querySelector(selector) {
        this.__checkRequiredProperties();
        return this.rs_dialog_instance.root_element.querySelector(selector);
    }

    __checkRequiredProperties() {
        if (!this.rs_dialog_instance)
            throw new Error(`A "rs_dialog_instance" property is needed for this feature to work`);
    }

    /** Méthodes abstraites **/
    navigateUp()            { throw new Error(`Implementing ${this.name}.navigateUp() is mandatory`); }
    navigateDown()          { throw new Error(`Implementing ${this.name}.navigateDown() is mandatory`); }
    navigateLeft()          { throw new Error(`Implementing ${this.name}.navigateLeft() is mandatory`); }
    navigateRight()         { throw new Error(`Implementing ${this.name}.navigateRight() is mandatory`); }
    trigger(item_ident)     { throw new Error(`Implementing ${this.name}.trigger(item_ident) is mandatory`); }
    __registerMenuItems()   { throw new Error(`Implementing ${this.name}.__registerMenuItems() is mandatory`); }
}

/**
 * Le mieux (plus souple) sera d'embarquer un gestionnaire de navigation par popup.
 * 
 */
class GamepadMenuNavigation {
    active_item;    // structure de données, permettant d'identifier l'élément actuellement actif
    menu_items;     // liste des éléments navigables, associés à leur position (page, line, column)

    constructor() {
        this.active_item = this.__defaultActiveItem();
        this.menu_items = [];
    }

    registerMenuItem(item_ident, html_element, onValidate) {
        this.menu_items.push({
            id : item_ident,
            html_element : html_element,
            onValidate : onValidate
        });
    }

    triggerActiveItem() {
        for (menu_item of this.menu_items) {
            if (this.__isActive(menu_item)) {
                menu_item.onValidate();
                return;
            }
        }
    }




    

    __defaultActiveItem() {
        return {
            line: 0,
            column: 0
        };
    }

    __isActive(menu_item) {
        return menu_item.line === this.active_item.line
            && menu_item.column === this.active_item.column;
    }
    
    __getActivePopup() { return MainController.popups_stack.activePopup(); }
}