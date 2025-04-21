class Abilities {

    static getShotInterval()    { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("RAT") ); }
    static getShotPower()       { return Abilities.__getValueOf( Abilities.__getShopEntryByCode("POW") ); }

    static __getShopEntryByCode(code) {
        for (let shop_entry of MainController.scope.shop) {
            if (shop_entry.code === code)
                return shop_entry;
        }
    }

    static __getValueOf(shop_entry) {
        return shop_entry.level_0_effect + (shop_entry.current_level * shop_entry.upgrade_value);
    }
}