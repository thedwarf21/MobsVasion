class ShopPopup {
    static show() {
		MainController.shop_popup = new RS_Dialog("shop_dialog", "Pense à faire le plein, avant d'y retourner", [], [], [], false, "tpl_shop.html", function() {  
            let this_popup_dom = MainController.shop_popup.root_element;

            let shop_items_container = this_popup_dom.querySelector("#items-container"); 
            MainController.shop_manager.setShopItemsContainer( shop_items_container );
			
            ShopPopup.switchToMoneyShop();
            MainController.shop_manager.refreshAllShopItems();

            ShopPopup.__initMoneyDisplay();
            ShopPopup.__initKnowledgeDisplay();

            let close_button = this_popup_dom.querySelector("#btn_close");
            close_button.value = `Vague ${MainController.scope.game.wave_number}`;
			close_button.addEventListener("click", function() {
                ShopPopup.close();
			});
		});
		document.body.appendChild(MainController.shop_popup.root_element);
	}

    static switchToMoneyShop() {
        MainController.shop_manager.displayMoneyShop();
        MainController.shop_popup.root_element.querySelector("#money_selector").classList.add("active");
        MainController.shop_popup.root_element.querySelector("#knowledge_selector").classList.remove("active");
    }

    static switchToTrainingRoom() {
        MainController.shop_manager.displayTrainingRoom();
        MainController.shop_popup.root_element.querySelector("#money_selector").classList.remove("active");
        MainController.shop_popup.root_element.querySelector("#knowledge_selector").classList.add("active");
    }

    static close() {
        MainController.shop_popup.closeModal();
        MainController.shop_popup = null;
        MainController.startWave();
    }

    static __initMoneyDisplay() {
        let player_money_element = MainController.shop_popup.root_element.querySelector("#player_money");
        player_money_element.innerHTML = MainController.scope.game.human_readable_money;
        // Binding géré dans MainUI.__prepareWaveSwagAutoRefresh()
    }

    static __initKnowledgeDisplay() {
        let knowledge_element = MainController.shop_popup.root_element.querySelector("#knowledge_points");
        knowledge_element.innerHTML = MainController.scope.game.knowledge_points;
        new RS_Binding({
            object: MainController.scope.game,
            property: "knowledge_points"
        }).addBinding(knowledge_element, "innerHTML");
    }
}