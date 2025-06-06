class ShopItem {
    name;
    code;
    description;
    lbl_effect;
    max_level;
    show_multiplicator;
    level_0_effect;
    upgrade_value;
    level_1_price;
    level_2_price_coef;
    current_level;
    nav_id;
    
    is_money_priced_item;

    html_element;
    description_html_element;
    price_html_element;
    effect_html_element;

    constructor(shop_scope_item) {
        for (const property in shop_scope_item)
            this[ property ] = shop_scope_item[ property ];

        this.is_money_priced_item = !!this.level_1_price;  // initialisation du flag permettant de différencier les items "Ravitaillement" de "Salle d'entrainement"
        this.__initHtmlElement();
    }

    refreshHtmlDetails(must_translate) {
        if (must_translate)
            this.__translateStaticContents();

		this.__refreshPriceElement();
		this.__refreshEffectElement();
	}

    static getHtmlElement(css_class, content_key, templated_values) {
        const html_element = document.createElement("DIV");
		html_element.classList.add(css_class);

        if (content_key)
            MainController.language_manager.setTranslatedContent(html_element, content_key, "innerHTML", templated_values);

        return html_element;
    }

    __initHtmlElement() {
		this.html_element = document.createElement("DIV");
		this.html_element.classList.add("shop-item");
        this.html_element.setAttribute("nav-ident", this.nav_id);

        this.html_element.appendChild( ShopItem.getHtmlElement("shop-item-name", this.name) );

        this.description_html_element = ShopItem.getHtmlElement("shop-item-desc", this.description);
        this.price_html_element = ShopItem.getHtmlElement("shop-item-price");
        this.effect_html_element = ShopItem.getHtmlElement("shop-item-effet");
        this.refreshHtmlDetails();
		
        this.html_element.addEventListener('click', (event)=> {
            if (this.__isAffordable() && !this.__isMaxed()) {
                this.__performBuying();
                JuiceHelper.popupValidate();
            }
        });

        this.html_element.addEventListener('mouseenter', ()=> {
            const item_description_container = MainController.shop_manager.shop_item_description_element;
            item_description_container.innerHTML = "";
            item_description_container.appendChild( this.description_html_element );
            item_description_container.appendChild( this.price_html_element );
            item_description_container.appendChild( this.effect_html_element );
        });
	}

    __performBuying() {
        if (this.is_money_priced_item)
            MainController.scope.game.money -= this.__getPrice();
        else
            MainController.scope.game.knowledge_points -= this.__getPrice();
        
        this.current_level++;
        Abilities.setCurrentLevel(this.code, this.current_level);

        MainController.shop_manager.refreshAllShopItems();
    }

    __refreshPriceElement() {
        if (!this.__isAffordable())
			this.price_html_element.classList.add("too-expensive");
        else this.price_html_element.classList.remove("too-expensive"); 
        
        if (this.__isMaxed()) {
            this.price_html_element.classList.add("maxed");
            MainController.language_manager.setTranslatedContent(this.price_html_element, "shop_item_maxed", "innerHTML");
        } else {
            this.price_html_element.classList.remove("maxed");
            MainController.language_manager.setTranslatedContent(this.price_html_element, "shop_item_price", "innerHTML", [Tools.intToHumanReadableString( this.__getPrice() )]);
        }
    }

    __refreshEffectElement() {
		const present_val = this.__getEffectValueAtLevel(this.current_level);
		const increased_val = this.__getEffectValueAtLevel(this.current_level + 1);

		const displayPresentValue	= Tools.prepareFloatForDisplay ( 
                                    ( this.show_multiplicator 
				                        ? present_val * this.show_multiplicator
							            : present_val 
                                    ), this.display_unit || "");
		const displayIncreasedValue	= Tools.prepareFloatForDisplay (
                                    ( this.show_multiplicator
							            ? increased_val * this.show_multiplicator
							            : increased_val 
                                    ), this.display_unit || "");

        const text_key = this.__isMaxed()
                        ? this.lbl_effect + "_maxed"
                        : this.lbl_effect;
        MainController.language_manager.setTranslatedContent(this.effect_html_element, text_key, "innerHTML", [displayPresentValue, displayIncreasedValue]);
    }

    __translateStaticContents() {
        const language_manager = MainController.language_manager;
        language_manager.setTranslatedContent(this.html_element.querySelector(".shop-item-name"), this.name, "innerHTML");
        language_manager.setTranslatedContent(this.description_html_element, this.description, "innerHTML");
    }

    __isAffordable() {
        return this.is_money_priced_item 
            ?  this.__getPrice() <= MainController.scope.game.money 
            :  !!MainController.scope.game.knowledge_points;
    }

    __getPrice() { 
        return this.is_money_priced_item 
            ?  Tools.getFibonacciValue(this.level_1_price, this.level_2_price_coef, this.current_level)
            :  1; 
    }

    __getEffectValueAtLevel(level)  { return this.level_0_effect + (this.upgrade_value * level); }
    __isMaxed()                     { return (this.max_level && this.current_level === this.max_level); }
}