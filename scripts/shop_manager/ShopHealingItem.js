class ShopHealingItem {
    price;
    hp_recover;
    root_element;
    price_element;
    description_element;

    constructor(name, price, hp_recover, nav_id) {
        this.price = price;
        this.hp_recover = hp_recover;

        this.__initRootElement(name, nav_id);
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
            this.price_element.innerHTML = `<b>Prix:</b> ${this.price}`;
        }
    }

    __initRootElement(name, nav_id) {
        this.root_element = document.createElement("DIV");
        this.root_element.classList.add("shop-item");
        this.root_element.classList.add("healing-item");
        this.root_element.setAttribute("nav-ident", nav_id);
        this.root_element.appendChild( ShopItem.getHtmlElement("shop-item-name", name) );

        this.description_element = ShopItem.getHtmlElement("shop-item-desc", `Rend ${this.hp_recover} points de vie`);
        this.price_element = ShopItem.getHtmlElement("shop-item-price", `<b>Prix:</b> ${this.price}`);
        this.refresh();

        this.root_element.addEventListener('click', ()=> {
            if (this.__isAffordable() && !this.__isMaxed()) {
                MainController.scope.game.money -= this.price;
                HealthBarHelper.healPlayer( this.hp_recover );

                MainController.shop_manager.refreshAllShopItems();

                JuiceHelper.popupValidate();
            }
        });

        this.root_element.addEventListener('mouseenter', ()=> {
            let item_description_container = MainController.shop_manager.shop_item_description_element;
            item_description_container.innerHTML = "";
            item_description_container.appendChild( this.description_element );
            item_description_container.appendChild( this.price_element );
        });
    }

    __isAffordable() { return MainController.scope.game.money >= this.price; }
    __isMaxed() { return MainController.scope.game.health_points == Abilities.getMaxPlayerHealth(); }
}