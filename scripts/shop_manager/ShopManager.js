class ShopManager {
    __shop_items;
    __shop_items_container;
    __healing_items;

    constructor(shop_scope) {
        this.__shop_items = [];
        this.__healing_items = [];
        
        this.__createHealingItems();

        for (let shop_item of shop_scope) {
            this.__shop_items.push( new ShopItem(shop_item) );
        }
    }

    setShopItemsContainer(container_element) { this.__shop_items_container = container_element; }

	refreshAllShopItems() {
        this.__refreshHealingItems();

		for (let shop_item of this.__shop_items)
            shop_item.refreshHtmlDetails();
	}

    displayMoneyShop() {
        this.__shop_items_container.innerHTML = "";
        this.__attachHealingItems();
        
        for (let shop_item of this.__shop_items) {
            if (shop_item.is_money_priced_item)
                this.__shop_items_container.appendChild(shop_item.html_element);
        }
    }

    displayTrainingRoom() {
        this.__shop_items_container.innerHTML = "";

        for (let shop_item of this.__shop_items) {
            if (!shop_item.is_money_priced_item)
                this.__shop_items_container.appendChild(shop_item.html_element);
        }
    }

    forceItemLevel(code, value) { this.__getShopItemByCode(code).current_level = value; }

    __getShopItemByCode(code) {
        for (const shop_item of this.__shop_items) {
            if (shop_item.code === code)
                return shop_item;
        }
    }

    __createHealingItems() {        
        let small_heal =  new ShopHealingItem("Verre d'eau", 2, 5, "0_0");
        this.__healing_items.push(small_heal);

        let large_heal = new ShopHealingItem("Repas chaud", 8, 25, "1_0");
        this.__healing_items.push(large_heal);
    }

    __attachHealingItems() {
        for (let healing_item of this.__healing_items)
            this.__shop_items_container.appendChild(healing_item.root_element);
    }

    __refreshHealingItems() {
        for (let shop_item of this.__healing_items) {
            shop_item.refresh();
        }
    }
}