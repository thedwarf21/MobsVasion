class ShopPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() {
        super();
    }

    show() {
        this.rs_dialog_instance = new RS_Dialog("shop_dialog", "Pense à faire le plein, avant d'y retourner", [], [], [], false, "tpl_shop.html", ()=> {  
            
            let shop_items_container = this.__querySelector("#items-container"); 
            MainController.shop_manager.setShopItemsContainer( shop_items_container );
			
            this.switchToMoneyShop();
            MainController.shop_manager.refreshAllShopItems();

            this.__initMoneyDisplay();
            this.__initKnowledgeDisplay();

            this.__querySelector("#btn_close").value = `Vague ${MainController.scope.game.wave_number}`;
		});

		document.body.appendChild(this.rs_dialog_instance.root_element);
		MainController.shop_popup = this.rs_dialog_instance;
	}

    switchToMoneyShop() {
        MainController.shop_manager.displayMoneyShop();
        this.__querySelector("#money_selector").classList.add("active");
        this.__querySelector("#knowledge_selector").classList.remove("active");
    }

    switchToTrainingRoom() {
        MainController.shop_manager.displayTrainingRoom();
        this.__querySelector("#money_selector").classList.remove("active");
        this.__querySelector("#knowledge_selector").classList.add("active");
    }

    __initMoneyDisplay() {
        this.__querySelector("#player_money").innerHTML = MainController.scope.game.human_readable_money;
        // Binding géré dans MainUI.__prepareWaveSwagAutoRefresh()
    }

    __initKnowledgeDisplay() {
        let knowledge_element = this.__querySelector("#knowledge_points");
        knowledge_element.innerHTML = MainController.scope.game.knowledge_points;
        new RS_Binding({
            object: MainController.scope.game,
            property: "knowledge_points"
        }).addBinding(knowledge_element, "innerHTML");
    }

    /*********  AbstractPopup methods implementation  *********/
    close() {
        super.close();
        MainController.startWave();
    }
    
    navigateUp() {
        console.info("ShopPopup: up");
    }

    navigateDown() {
        console.info("ShopPopup: down");
    }

    navigateLeft() {
        console.info("ShopPopup: left");
    }

    navigateRight() {
        console.info("ShopPopup: right");
    }

    __registerMenuItems() {

    }
}