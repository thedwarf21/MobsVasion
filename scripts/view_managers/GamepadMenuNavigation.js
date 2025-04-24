class PopupsStack {
    __popups;

    constructor () {
        this.__popups = [];
    }

    push(popup_manager) {
        MainController.scope.controls.paused = true;
        popup_manager.show(); 
        return this.__popups.unshift(popup_manager); 
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
    }

    static close() { throw new Error(`${this.name}.close(): implementation is mandatory`); }

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

    registerMenuItem(item_position, html_element, onValidate) {
        this.menu_items.push({
            page : item_position.page,
            line : item_position.line,
            column : item_position.column,
            html_element : html_element,
            onValidate : onValidate
        });
    }

    triggerActiveItemAction() {
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
        return menu_item.page === this.active_item.page
            && menu_item.line === this.active_item.line
            && menu_item.column === this.active_item.column;
    }
    
    __getActivePopup() { return MainController.popups_stack.activePopup(); }
}