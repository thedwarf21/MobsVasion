class ShopPopup {
    static show(onShopClose) {
		MainController.shop_popup = new RS_Dialog("shop_dialog", "Pense à faire le plein, avant d'y retourner", [], [], [], false, "tpl_shop.html", function() {  
            
			MainController.shop_popup.root_element.querySelector("#btn_close").addEventListener("click", function() {
                ShopPopup.__close(onShopClose);
			});
		});
		document.body.appendChild(MainController.shop_popup.root_element);
	}

    static __close(onShopClose) {
        MainController.shop_popup.closeModal();
        MainController.shop_popup = null;
        
        if (onShopClose)
            onShopClose();
    }
}