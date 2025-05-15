class ShopPopup extends AbstractPopup {
    rs_dialog_instance;

    constructor() {
        super();
        this.active_item_id = "0_0";
    }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog("shop_dialog", "Pense à faire le plein, avant d'y retourner", [], [], [], false, "tpl_shop.html", ()=> {  
            
            const shop_items_container = this.__querySelector("#items-container"); 
            MainController.shop_manager.setShopItemsContainer( shop_items_container );

            const item_description_element = this.__querySelector("#item-description");
            MainController.shop_manager.setShopItemDescriptionElement( item_description_element );
			
            this.switchToMoneyShop();
            MainController.shop_manager.refreshAllShopItems();

            this.__initMoneyDisplay();
            this.__initKnowledgeDisplay();

            this.__querySelector("#btn_close").value = `Vague ${MainController.scope.game.wave_number}`;

            if (onPopupOpened)
                onPopupOpened();

            JuiceHelper.startShopMusic();
		});

		document.body.appendChild(this.rs_dialog_instance.root_element);
		MainController.shop_popup = this.rs_dialog_instance;
	}

    close() {
        JuiceHelper.stopShopMusic();
        super.close();
        MainController.startWave();
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
        const knowledge_element = this.__querySelector("#knowledge_points");
        knowledge_element.innerHTML = MainController.scope.game.knowledge_points;
        new RS_Binding({
            object: MainController.scope.game,
            property: "knowledge_points"
        }).addBinding(knowledge_element, "innerHTML");
    }

    /*********  AbstractPopup methods implementation  *********/
    
    navigateUp() {
        const active_item_position = this.__getLineAndColumnNumbers();
        const new_line = active_item_position.line - 1;
        const new_active_ident = `${active_item_position.column}_${new_line}`;
        
        if ( this.setActiveItem(new_active_ident) && active_item_position.column === 0 )
            this.__autoScrollUp(new_line);
    }

    navigateDown() {
        const active_item_position = this.__getLineAndColumnNumbers();
        const new_line = active_item_position.line + 1;
        const new_active_ident = `${active_item_position.column}_${new_line}`;
        
        if ( this.setActiveItem(new_active_ident) && active_item_position.column === 0 )
            this.__autoScrollDown(new_line);
    }

    navigateLeft() {
        const active_item_position = this.__getLineAndColumnNumbers();
        const new_col = active_item_position.column - 1;
        const new_active_ident = `${new_col}_${active_item_position.line}`;
        
        if (new_col === 0)
            this.switchToMoneyShop();

        this.setActiveItem(new_active_ident);
    }

    navigateRight() {
        const active_item_position = this.__getLineAndColumnNumbers();
        const new_col = active_item_position.column + 1;
        const new_active_ident = `${new_col}_${active_item_position.line}`;
        
        if (new_col === 1)
            this.switchToTrainingRoom();
        
        this.setActiveItem(new_active_ident);
    }

    __registerMenuItems() { 
        super.__registerMenuItems();
        this.switchToTrainingRoom();
        super.__registerMenuItems();
        this.switchToMoneyShop();
    }

    __autoScrollDown(line) {
        const scroll_needs = line + 1 - 4;
        
        if (scroll_needs > 0) {
            const scroll_y = scroll_needs * this.__itemHeight();
            this.__querySelector("#items-container").scrollTo({
                behavior: "smooth",
                top: scroll_y
            });
        }
    }

    __autoScrollUp(line) {
        const scroll_y = line * this.__itemHeight();
        const items_container = this.__querySelector("#items-container");
        const scroll_needed = scroll_y < items_container.scrollTop;
        
        if (scroll_needed) {
            items_container.scrollTo({
                behavior: "smooth",
                top: scroll_y
            });
        }
    }

    __itemHeight() { return 0.08 * document.body.clientHeight; }
}