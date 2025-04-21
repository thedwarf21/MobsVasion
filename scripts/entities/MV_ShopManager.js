class MV_ShopManager {
    __shop_items;
    __shop_items_container;

    constructor(shop_scope) {
        this.__shop_items = [];
        for (let shop_item of shop_scope) {
            this.__shop_items.push( new MV_ShopItem(shop_item) );
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

    __attachHealingItems() {
        this.__shop_items_container.appendChild( this.__getHealingItem("Verre d'eau", 2, 5) );
        this.__shop_items_container.appendChild( this.__getHealingItem("Repas chaud", 8, 25) );
    }

    __getHealingItem(name, price, hp_recover) {
        let html_element = document.createElement("DIV");
        html_element.classList.add("shop-item");
        html_element.classList.add("healing-item");

        html_element.appendChild( MV_ShopItem.getHtmlElement("shop-item-name", name) );
        html_element.appendChild( MV_ShopItem.getHtmlElement("shop-item-desc", `Rend ${hp_recover} points de vie`) );

        let price_element = MV_ShopItem.getHtmlElement("shop-item-price", `<b>Prix:</b> ${price}`);
        price_element.price = price;
        html_element.appendChild( price_element );

        html_element.addEventListener('click', ()=> {
            if (MainController.scope.game.money >= price && MainController.scope.game.health_points < CHARACTER_MAX_LIFE) {
                MainController.scope.game.money -= price;
                MainController.scope.game.health_points += hp_recover;
    
                if (MainController.scope.game.health_points > CHARACTER_MAX_LIFE)
                    MainController.scope.game.health_points = CHARACTER_MAX_LIFE;

                MainController.shop_manager.refreshAllShopItems();
            }
        });

        return html_element;
    }

    __refreshHealingItems() {
        let healing_items_price_element = document.querySelectorAll(".shop-item.healing-item .shop-item-price");
        for (let price_element of healing_items_price_element) {
            if (price_element.price > MainController.scope.game.money)
                price_element.classList.add("too-expensive");
            else price_element.classList.remove("too-expensive");
        }
    }
}