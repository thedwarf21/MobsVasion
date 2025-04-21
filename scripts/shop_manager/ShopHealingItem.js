class ShopHealingItem {
    price;
    hp_recover;
    root_element;
    price_element;


    constructor(name, price, hp_recover) {
        this.price = price;
        this.hp_recover = hp_recover;
        this.__initRootElement(name);
    }

    refresh() {
        if (!this.__isAffordable())
            this.price_element.classList.add("too-expensive");
        else this.price_element.classList.remove("too-expensive");

        if (this.__isMaxed()) {
            this.price_element.classList.add("maxed");
            this.price_element.innerHTML = "Santé déjà au maximum"
        } else {
            this.price_element.classList.remove("maxed");
            this.price_element.innerHTML = this.price;
        }
    }

    __initRootElement(name) {
        let html_element = document.createElement("DIV");
        html_element.classList.add("shop-item");
        html_element.classList.add("healing-item");
        this.root_element = html_element;

        html_element.appendChild( ShopItem.getHtmlElement("shop-item-name", name) );
        html_element.appendChild( ShopItem.getHtmlElement("shop-item-desc", `Rend ${this.hp_recover} points de vie`) );

        this.price_element = ShopItem.getHtmlElement("shop-item-price", `<b>Prix:</b> ${this.price}`);
        html_element.appendChild( this.price_element );

        html_element.addEventListener('click', ()=> {
            if (this.__isAffordable() && !this.__isMaxed()) {
                MainController.scope.game.money -= this.price;
                MV_GameScope.healPlayer( this.hp_recover );

                MainController.shop_manager.refreshAllShopItems();
            }
        });
    }

    __isAffordable() { return MainController.scope.game.money >= this.price; }
    __isMaxed() { return MainController.scope.game.health_points == Abilities.getMaxPlayerHealth(); }
}