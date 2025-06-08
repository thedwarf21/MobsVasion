class Abilities {

    static setCurrentLevel(code, value) { Abilities.__getShopEntryByCode(code).current_level = value; }
    
    static getSwagUpgrade()     { return 1 + Abilities.__getValueOf( Abilities.__getShopEntryByCode("DET") ); }
    static getClipSize()        { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("CHC") ); }
    static getShotInterval()    { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("RAT") ); }
    static getShotPower()       { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("POW") ); }
    static getMaxPlayerHealth() { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("CON") ); }
    static getCharacterSpeed()  { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("AGI") ); }
    static getPrimaryReloadInterval()   { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("RLD") ); }
    static getSecondaryReloadInterval() { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("DAR") ); }

    static setMaxHealthBinding(character_health_bar, html_element) {
        const max_health_shop_entry = Abilities.__getShopEntryByCode("CON");

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
        const clip_size_shop_entry = Abilities.__getShopEntryByCode("CHC");

        new RS_Binding({
            object: clip_size_shop_entry,
            property: "current_level",
            callback: () => { html_element.innerHTML = Abilities.getClipSize(); }
        });
    }

    static __getShopEntryByCode(code) {
        for (const shop_entry of MainController.scope.shop) {
            if (shop_entry.code === code)
                return shop_entry;
        }
    }

    static __getValueOf(shop_entry) {
        return shop_entry.level_0_effect + (shop_entry.current_level * shop_entry.upgrade_value);
    }
}