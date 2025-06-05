class MV_LanguageManager {
    __game_scope;

    constructor(game_scope) {
        this.__game_scope = game_scope;
        this.__initLanguageFromNavigator();
    }

    setLanguage(language) {
        this.__game_scope.language = language;
        this.__translateAll();
    }

    getText(text_key) { return this.TEXTS[text_key][this.__game_scope.language]; }

    __initLanguageFromNavigator() {
        const language = navigator.language.split("-")[0];
        
        if (language !== "fr") // Pour l'instant, on ne gère que français et anglais
            language = "en";

        this.setLanguage(language);
    }

    __translateAll() {
        for (const element of document.querySelectorAll("[text-key][translated-property]")) {
            const text_key = element.getAttribute("text-key");
            const translated_property = element.getAttribute("translated-property");
            element[translated_property] = this.getText(text_key);
        }
    }

    TEXTS = {
        load_popup_confirm: {
            fr: `<p>Nous avons trouvé une sauvegarde.</p>
				<p>Vous pouvez la charger, ou commencer une nouvelle partie.</p>
				<p><b><u>Attention</u> :</b> Commencer une nouvelle partie implique d'écraser la sauvegarde existante.</p>`,
            en: `<p>A saved game was found.</p>
				<p>You can either load it, or begin a new one.</p>
				<p><b><u>Be careful</u> :</b> Beginning a new game will overwrite the existing save.</p>`
        },
        load_popup_title: {
            fr: "Gestionnaire de sauvegarde",
            en: "Save manager"
        },
        load_popup_yes: {
            fr: "Charger",
            en: "Load"
        },
        load_popup_no: {
            fr: "Nouvelle partie",
            en: "New game"
        },
        skip_tuto_confirm: {
            fr: "<p>Le présent tutoriel ne vous sera présenté qu'une seule fois.</p><p>Souhaitez-vous réellement le passer ?</p>",
            en: "<p>This tutorial will only be shown once.</p><p>Are you really sure you want to skip it ?</p>"
        },
        skip_tuto_title: {
            fr: "Passer l'intro et le tutoriel",
            en: "Skip intro and tutorial"
        },
        skip_tuto_yes: {
            fr: "Bien sûr !",
            en: "Sure !"
        },
        skip_tuto_no: {
            fr: "Euuuuh...",
            en: "Uuuuuh..."
        }
    }
}