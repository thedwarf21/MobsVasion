class MV_LanguageManager {
    __game_scope;

    constructor(game_scope) {
        this.__game_scope = game_scope;
        this.__initLanguageFromNavigator();
    }

    setLanguage(language) { this.__game_scope.language = language; }

    getText(text_key) { return this.TEXTS[text_key][this.__game_scope.language]; }

    __initLanguageFromNavigator() {
        const language = navigator.language.split("-")[0];
        
        if (language !== "fr") // Pour l'instant, on ne gère que français et anglais
            language = "en";

        this.setLanguage(language);
    }

    TEXTS = {
        test_1: {
            fr: "truc",
            en: "stuff"
        },
        test_2: {
            fr: "j'apprécie les fruits au sirop",
            en: "I appreciate sirup fuits"
        }
    }
}