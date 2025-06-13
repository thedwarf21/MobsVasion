class ShopManager {
    #shop_items;
    #healing_items;
    #shop_items_container;
    shop_item_description_element;

    constructor(shop_scope) {
        this.#shop_items = [];
        this.#healing_items = [];
        
        this.#createHealingItems();

        for (const shop_item of shop_scope) {
            this.#shop_items.push( new ShopItem(shop_item) );
        }
    }

    setShopItemsContainer(container_element) { this.#shop_items_container = container_element; }
    setShopItemDescriptionElement(element) { this.shop_item_description_element = element; }

	refreshAllShopItems(must_translate) {
        for (const shop_item of this.#healing_items)
            shop_item.refresh(must_translate);

		for (const shop_item of this.#shop_items)
            shop_item.refreshHtmlDetails(must_translate);
	}

    displayMoneyShop() {
        this.#shop_items_container.innerHTML = "";
        this.#attachHealingItems();
        
        for (const shop_item of this.#shop_items) {
            if (shop_item.is_money_priced_item)
                this.#shop_items_container.appendChild(shop_item.html_element);
        }
    }

    displayTrainingRoom() {
        this.#shop_items_container.innerHTML = "";

        for (const shop_item of this.#shop_items) {
            if (!shop_item.is_money_priced_item)
                this.#shop_items_container.appendChild(shop_item.html_element);
        }
    }

    forceItemLevel(code, value) { 
        const shop_item = this.#getShopItemByCode(code);
        this.#getShopItemByCode(code).current_level = value;
        
        // Contourner le binding (sinon, charger la sauvegarde augmente le total de points vie)
        if (code === "CON")
            MainController.scope.game.health_points -= value * shop_item.upgrade_value;
    }

    #getShopItemByCode(code) {
        for (const shop_item of this.#shop_items) {
            if (shop_item.code === code)
                return shop_item;
        }
    }

    #createHealingItems() {        
        const small_heal =  new ShopHealingItem("shop_heal_name_0", 2, 5, "0_0");
        this.#healing_items.push(small_heal);

        const large_heal = new ShopHealingItem("shop_heal_name_1", 8, 25, "0_1");
        this.#healing_items.push(large_heal);
    }

    #attachHealingItems() {
        for (const healing_item of this.#healing_items)
            this.#shop_items_container.appendChild(healing_item.root_element);
    }
}