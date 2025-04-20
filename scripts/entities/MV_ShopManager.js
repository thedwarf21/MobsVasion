class MV_ShopManager {
    __shop_items;

    constructor(shop_scope) {
        this.__shop_tiems = [];
        for (let shop_item of shop_scope) {
            this.__shop_tiems.push( new MV_ShopItem(shop_item) );
        }
    }

	refreshAllShopItems() {
		for (let shop_item of this.__shop_items)
            shop_item.refreshHtmlDetails();
	}


    /* je le garde sous le coude, pour mettre à jour ShopPopup*/
	show(onPopupShown) {
		let scope = AH_MainController.scope;
		scope.controls.paused = true;
		AH_AudioManager.startMusicLoop(GAME_MUSIC);

		// Construction de la popup
		let popup = new RS_Dialog("shop", "Magasin", [], [], [], false, "tpl_shop.html", function() {
			popup.querySelector("#player_money").innerHTML = AH_MainController.intToHumanReadableString(scope.game.money) + " Brouzoufs";

			// Parcours des la liste "shop" pour afficher le magasin
			let itemsContainer = popup.querySelector("#items-container");
			for (let shopElem of scope.shop) {
				let shopItem = AH_Shop.__getHtmlShopItem(shopElem);
				shopElem.htmlElement = shopItem;
				itemsContainer.appendChild(shopItem);
			}

			// Libellé et onClick du bouton de fermeture de la popup
			let closeBtn = popup.querySelector("#btn_close")
			closeBtn.value = "Affronter vague " + AH_MainController.scope.game.level;
			closeBtn.addEventListener("click", ()=> {
				popup.closeModal();
				AH_SaveManager.saveGame();
				AH_MainController.startWave();
			});

			// Affichage de la popup
			document.body.appendChild(popup);
			
			// Si une fonction est paramétrée dans onPopupShow, on l'exécute
			if (onPopupShown)
				onPopupShown();
		});
	}
}