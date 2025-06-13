class ShopHealingItem {
    name;
    price;
    hp_recover;
    root_element;
    price_element;
    description_element;

    constructor(name, price, hp_recover, nav_id) {
        this.name = name;
        this.price = price;
        this.hp_recover = hp_recover;

        this.#initRootElement(nav_id);
    }

    refresh(must_translate) {
        if (must_translate)
            this.#translateStaticContents();

        if (!this.#isAffordable())
            this.price_element.classList.add("too-expensive");
        else this.price_element.classList.remove("too-expensive");

        if (this.#isMaxed()) {
            this.price_element.classList.add("maxed");
            MainController.language_manager.setTranslatedContent(this.price_element, "shop_heal_maxed", "innerHTML");
        } else {
            this.price_element.classList.remove("maxed");
            MainController.language_manager.setTranslatedContent(this.price_element, "shop_item_price", "innerHTML", [this.price]);
        }
    }

    #initRootElement(nav_id) {
        this.root_element = document.createElement("DIV");
        this.root_element.classList.add("shop-item");
        this.root_element.classList.add("healing-item");
        this.root_element.setAttribute("nav-ident", nav_id);
        this.root_element.appendChild( ShopItem.getHtmlElement("shop-item-name", this.name) );

        this.description_element = ShopItem.getHtmlElement("shop-item-desc", "shop_heal_desc", [this.hp_recover]);
        this.price_element = ShopItem.getHtmlElement("shop-item-price");
        this.refresh();

        this.root_element.addEventListener('click', ()=> {
            if (this.#isAffordable() && !this.#isMaxed()) {
                MainController.scope.game.money -= this.price;
                HealthBarHelper.healPlayer( this.hp_recover );

                this.root_element.dispatchEvent(new Event('mouseleave'));
                this.root_element.dispatchEvent(new Event('mouseenter'));

                MainController.shop_manager.refreshAllShopItems();

                JuiceHelper.popupValidate();
            }
        });

        this.root_element.addEventListener('mouseenter', ()=> {
            const item_description_container = MainController.shop_manager.shop_item_description_element;
            item_description_container.innerHTML = "";
            item_description_container.appendChild( this.description_element );
            item_description_container.appendChild( this.price_element );
            HealthBarHelper.displayHealingEffect( this.hp_recover );
        });

        this.root_element.addEventListener('mouseleave', ()=> {
            HealthBarHelper.displayHealingEffect(0);
        });
    }

    #translateStaticContents() {
        const language_manager = MainController.language_manager;
        language_manager.setTranslatedContent(this.root_element.querySelector(".shop-item-name"), this.name, "innerHTML");
        language_manager.setTranslatedContent(this.description_element, "shop_heal_desc", "innerHTML", [this.hp_recover]);
    }

    #isAffordable() { return MainController.scope.game.money >= this.price; }
    #isMaxed() { return MainController.scope.game.health_points === Abilities.getMaxPlayerHealth(); }
}