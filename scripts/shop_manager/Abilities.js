class Abilities {

    static setCurrentLevel(code, value) { Abilities.#getShopEntryByCode(code).current_level = value; }
    
    static getSwagUpgrade()     { return 1 + Abilities.#getValueOf( Abilities.#getShopEntryByCode("DET") ); }
    static getClipSize()        { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("CHC") ); }
    static getShotInterval()    { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("RAT") ); }
    static getShotPower()       { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("POW") ); }
    static getMaxPlayerHealth() { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("CON") ); }
    static getCharacterSpeed()  { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("AGI") ); }
    static getPrimaryReloadInterval()   { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("RLD") ); }
    static getSecondaryReloadInterval() { return Abilities.#getValueOf( Abilities.#getShopEntryByCode("DAR") ); }

    static setMaxHealthBinding(character_health_bar, html_element) {
        const max_health_shop_entry = Abilities.#getShopEntryByCode("CON");

        new RS_Binding({
            object: max_health_shop_entry,
            property: "current_level",
            callback: (value, oldValue) => {
                const increasement = value - oldValue;
                character_health_bar.setMaxValue(Abilities.getMaxPlayerHealth());
                MainController.scope.game.health_points += increasement * max_health_shop_entry.upgrade_value; // propriété health_points bound => refresh affichage jauge
                
                html_element.innerHTML = Abilities.getMaxPlayerHealth();
            }
        });
    }

    static setClipSizeBinding(html_element) {
        const clip_size_shop_entry = Abilities.#getShopEntryByCode("CHC");

        new RS_Binding({
            object: clip_size_shop_entry,
            property: "current_level",
            callback: () => { html_element.innerHTML = Abilities.getClipSize(); }
        });
    }

    static #getShopEntryByCode(code) {
        for (const shop_entry of MainController.scope.shop) {
            if (shop_entry.code === code)
                return shop_entry;
        }
    }

    static #getValueOf(shop_entry) {
        return shop_entry.level_0_effect + (shop_entry.current_level * shop_entry.upgrade_value);
    }
}