class MV_LanguageManager {
    TEMPLATED_VALUES_SEPARATOR = ",";
    #game_scope;

    constructor(game_scope) {
        this.#game_scope = game_scope;
        this.#initLanguageFromNavigator();
    }

    setLanguage(language) {
        this.#game_scope.language = language;
        this.#translateAll();
    }

    setTranslatedContent(element, text_key, target_property, templated_values) {
        element.setAttribute("text-key", text_key);
        element.setAttribute("translated-property", target_property);

        if (templated_values)
            this.#setTamplatedValuesAttribute(element, templated_values);

        element[target_property] = this.getText(text_key, templated_values);
    }

    getText(text_key, templated_values) { 
        let translated_string = this.TEXTS[text_key][this.#game_scope.language];

        if (templated_values)
            for (const current_value of templated_values)
                translated_string = translated_string.replace("%value%", current_value); 
        
        return translated_string; 
    }

    #initLanguageFromNavigator() {
        let language = navigator.language.split("-")[0];
        
        if ( !["fr", "es", "it", "de"].includes(language ) ) // Si la langue du navigateur n'est pas supportée => anglais
            language = "en";

        this.setLanguage(language);
    }

    #translateAll() {
        for (const element of document.querySelectorAll("[text-key][translated-property]")) {
            const text_key = element.getAttribute("text-key");
            const translated_property = element.getAttribute("translated-property");
            const templated_values = this.#getTemplatedValuesArray(element);

            element[translated_property] = this.getText(text_key, templated_values);
        }
    }

    #setTamplatedValuesAttribute(element, templated_values) {
        let templated_values_string = ""
        for (const val of templated_values)
            templated_values_string += val + this.TEMPLATED_VALUES_SEPARATOR;
        templated_values_string = templated_values_string.substring(0, templated_values_string.length-1);

        element.setAttribute("templated-values", templated_values_string);
    }

    #getTemplatedValuesArray(element) {
        const templated_values_string = element.getAttribute("templated-values");
        
        if (templated_values_string)
            return templated_values_string.split(this.TEMPLATED_VALUES_SEPARATOR);
        else return null;
    }

    TEXTS = {
        popup_close: {
            fr: "Fermer",
            en: "Close",
            es: "Cerca",
            it: "Chiudi",
            de: "Schließen"
        },
        wave_number: {
            fr: "Vague %value%",
            en: "Wave %value%",
            es: "Ola %value%",
            it: "Ondata %value%",
            de: "Welle %value%"
        },

        load_popup_confirm: {
            fr: `<p>Nous avons trouvé une sauvegarde.</p>
				<p>Vous pouvez la charger, ou commencer une nouvelle partie.</p>
				<p><b><u>Attention</u> :</b> Commencer une nouvelle partie implique d'écraser la sauvegarde existante.</p>`,
            en: `<p>A saved game was found.</p>
				<p>You can either load it, or begin a new one.</p>
				<p><b><u>Be careful</u> :</b> Beginning a new game will overwrite the existing save.</p>`,
            es: `<p>Encontramos un archivo guardado.</p>
				<p>Puedes cargarlo o empezar una nueva parte.</p>
				<p><b><u>Advertencia</u> :</b> Al empezar una nueva parte, se sobrescribirá el archivo guardado.</p>`,
            it: `<p>Abbiamo trovato un salvataggio.</p>
				<p>Puoi caricarlo o iniziare una nuova partita.</p>
				<p><b><u>Attenzione</u> :</b> Iniziare una nuova partita sovrascriverà il salvataggio esistente.</p>`,
            de: `<p>Ein gespeichertes Spiel wurde gefunden.</p>
				<p>Du kannst es laden oder ein neues Spiel beginnen.</p>
				<p><b><u>Achtung</u> :</b> Ein neues Spiel überschreibt den bestehenden Spielstand.</p>`
        },
        load_popup_title: {
            fr: "Gestionnaire de sauvegarde",
            en: "Save manager",
            es: "Administrador de archivo guardado",
            it: "Gestore salvataggi",
            de: "Speicherverwaltung"
        },
        load_popup_yes: {
            fr: "Charger",
            en: "Load",
            es: "Carga",
            it: "Carica",
            de: "Laden"
        },
        load_popup_no: {
            fr: "Nouvelle partie",
            en: "New game",
            es: "Nueva parte",
            it: "Nuova partita",
            de: "Neues Spiel"
        },

        skip_tuto_confirm: {
            fr: "<p>Le présent tutoriel ne vous sera présenté qu'une seule fois.</p><p>Souhaitez-vous réellement le passer ?</p>",
            en: "<p>This tutorial will only be shown once.</p><p>Are you really sure you want to skip it ?</p>",
            es: "<p>Este tutorial solo se te presentará una vez.</p><p>¿Realmente quieres omitirlo?</p>",
            it: "<p>Questo tutorial verrà mostrato solo una volta.</p><p>Sei sicuro di volerlo saltare?</p>",
            de: "<p>Dieses Tutorial wird nur einmal angezeigt.</p><p>Bist du sicher, dass du es überspringen möchtest?</p>"
        },
        skip_tuto_title: {
            fr: "Passer l'intro et le tutoriel",
            en: "Skip intro and tutorial",
            es: "Omitir la introducción y el tutorial",
            it: "Salta introduzione e tutorial",
            de: "Intro und Tutorial überspringen"
        },
        skip_tuto_yes: {
            fr: "Bien sûr !",
            en: "Sure !",
            es: "Por supuesto !",
            it: "Certo!",
            de: "Natürlich!"
        },
        skip_tuto_no: {
            fr: "Euuuuh...",
            en: "Uuuuuh...",
            es: "Uuuuu...",
            it: "Ehm...",
            de: "Ähm..."
        },

        gamepad_config_title: {
            fr: "Configuration de la manette",
            en: "Gamepad configuration",
            es: "Configuración del mando",
            it: "Configurazione gamepad",
            de: "Gamepad-Konfiguration"
        },
        gamepad_config_pause: {
            fr: "Pause",
            en: "Pause",
            es: "Romper",
            it: "Pausa",
            de: "Pause"
        },
        gamepad_config_auto_aim: {
            fr: "Tir visée auto",
            en: "Auto aim shot",
            es: "Disparo con puntería automática",
            it: "Tiro mira automatica",
            de: "Auto-Zielschuss"
        },
        gamepad_config_rush: {
            fr: "S'élancer",
            en: "Rush",
            es: "Correr",
            it: "Scatto",
            de: "Sprinten"
        },
        gamepad_config_reload: {
            fr: "Recharger",
            en: "Reload",
            es: "Recargar",
            it: "Ricarica",
            de: "Nachladen"
        },
        gamepad_config_up: {
            fr: "Menu : haut",
            en: "Menu : up",
            es: "Menú: arriba",
            it: "Menu: su",
            de: "Menü: hoch"
        },
        gamepad_config_down: {
            fr: "Menu : bas",
            en: "Menu : down",
            es: "Menú: abajo",
            it: "Menu: giù",
            de: "Menü: runter"
        },
        gamepad_config_left: {
            fr: "Menu : gauche",
            en: "Menu : left",
            es: "Menú: izquierda",
            it: "Menu: sinistra",
            de: "Menü: links"
        },
        gamepad_config_right: {
            fr: "Menu : droite",
            en: "Menu : right",
            es: "Menú: derecha",
            it: "Menu: destra",
            de: "Menü: rechts"
        },
        gamepad_config_validate: {
            fr: "Menu : valider",
            en: "Menu : validate",
            es: "Menú: validar",
            it: "Menu: conferma",
            de: "Menü: bestätigen"
        },
        gamepad_config_abort: {
            fr: "Menu : annuler",
            en: "Menu : abort",
            es: "Menú: cancelar",
            it: "Menu: annulla",
            de: "Menü: abbrechen"
        },
        gamepad_config_mapped_lib: {
            fr: "Bouton",
            en: "Button",
            es: "Botón",
            it: "Pulsante",
            de: "Taste"
        },
        gamepad_config_press_button_lib: {
            fr: "Appuyez sur un bouton",
            en: "Press a button",
            es: "Presione un botón",
            it: "Premi un pulsante",
            de: "Drücke eine Taste"
        },

        tutorial_title: {
            fr: "Introduction",
            en: "Introduction",
            es: "Introducción",
            it: "Introduzione",
            de: "Einführung"
        },
        tutorial_next: {
            fr: "Suite...",
            en: "Next...",
            es: "Siguiente...",
            it: "Avanti...",
            de: "Weiter..."
        },
        tutorial_skip: {
            fr: "Passer",
            en: "Skip",
            es: "Omitir",
            it: "Salta",
            de: "Überspringen"
        },

        tutorial_message_intro_0: {
            fr: "<p>Hey, salut toi !!</p><p>C'est cool de croiser quelqu'un ici.</p>",
            en: "<p>Hey, you !!</p><p>It's cool to run into someone around here.</p>",
            es: "<p>¡Hola, hola!</p><p>Es genial encontrarme con alguien aquí.</p>",
            it: "<p>Ehi, ciao tu!!</p><p>È bello incontrare qualcuno qui.</p>",
            de: "<p>Hey, hallo du!!</p><p>Es ist cool, hier jemanden zu treffen.</p>"
        },
        tutorial_message_intro_1: {
            fr: "<p>Quand j'y pense, il y avait bien longtemps que je n'avais croisé personne...</p>",
            en: "<p>When I think about it, it's been a long time since I've met anyone...</p>",
            es: "<p>Cuando lo pienso, ha pasado mucho tiempo desde que conocí a alguien...</p>",
            it: "<p>Quando ci penso, è passato molto tempo dall'ultima volta che ho incontrato qualcuno...</p>",
            de: "<p>Wenn ich so darüber nachdenke, ist es lange her, dass ich jemanden getroffen habe...</p>"
        },
        tutorial_message_intro_2: {
            fr: "<p>Peu importe...</p><p>Au fait, moi c'est Julie Péhainegis</p><p>Et toi, comment tu t'appelles ?</p>",
            en: "<p>Never mind...</p><p>By the way, I'm Julia Enpeesee</p><p>What about you ? What's your name ?</p>",
            es: "<p>No importa...</p><p>Por cierto, soy Julia Péyenejota</p><p>Y tú, ¿cómo te llamas?</p>",
            it: "<p>Non importa...</p><p>A proposito, io sono Giulia Pienegi</p><p>E tu, come ti chiami?</p>",
            de: "<p>Egal...</p><p>Übrigens, ich bin Julia Enes-se</p><p>Und du, wie heißt du?</p>"
        },
        tutorial_message_intro_3: {
            fr: "<p>...chelou comme nom.</p><p>Bref. Passons.</p>",
            en: "<p>...weird name.</p><p>Anyway. Let's move on.</p>",
            es: "<p>...nombre raro.</p><p>En fin. Sigamos adelante.</p>",
            it: "<p>...nome strano.</p><p>Comunque. Andiamo avanti.</p>",
            de: "<p>...komischer Name.</p><p>Egal. Machen wir weiter.</p>"
        },
        tutorial_message_intro_4: {
            fr: "<p>Comme tu le sais peut-être, la plupart des gens se sont transformés en zombies...</p><p>Et avant que tu ne demandes pourquoi, je n'en ai aucune idée.</p>",
            en: "<p>As you may know, most people have turned into zombies...</p><p>And before you ask why, I have no idea.</p>",
            es: "<p>Como ya sabéis, la mayoría de la gente se ha convertido en zombis...</p><p>Y antes de que preguntéis por qué, no tengo ni idea.</p>",
            it: "<p>Come forse saprai, la maggior parte delle persone si è trasformata in zombie...</p><p>E prima che tu chieda perché, non ne ho idea.</p>",
            de: "<p>Wie du vielleicht weißt, haben sich die meisten Menschen in Zombies verwandelt...</p><p>Und bevor du fragst warum, ich habe keine Ahnung.</p>"
        },
        tutorial_message_intro_5: {
            fr: "<p>Tout ce que je sais, c'est qu'ils ont investi mon labo et l'ont entièrement saccagé.</p><p>Je vois que t'es armé...</p><p>Tu pourrais botter leurs fesses puantes, s'il te plaît ?</p>",
            en: "<p>All I know is that they broke into my lab and completely trashed it.</p><p>I can see you're armed...</p><p>Will you kick their stinky butts, please ?</p>",
            es: "<p>Todo lo que sé es que entraron en mi laboratorio y lo destrozaron por completo.</p><p>Veo que estás armado...</p><p>¿Podrías patearles el trasero, por favor?</p>",
            it: "<p>Tutto quello che so è che hanno invaso il mio laboratorio e l'hanno completamente devastato.</p><p>Vedo che sei armato...</p><p>Potresti dare un calcio ai loro culi puzzolenti, per favore?</p>",
            de: "<p>Alles, was ich weiß, ist, dass sie in mein Labor eingedrungen sind und es komplett verwüstet haben.</p><p>Ich sehe, du bist bewaffnet...</p><p>Könntest du ihnen bitte in ihre stinkenden Hintern treten?</p>"
        },
        tutorial_message_intro_6: {
            fr: "<p>Ce que tu y gagnes ?</p><p>Sauver une demoiselle en détresse, ça suffit pas ?</p>",
            en: "<p>What you shall gain from it ?</p><p>Saving a damsel in distress isn't enough ?</p>",
            es: "¿Qué te aporta? ¿No te basta con salvar a una damisela en apuros?",
            it: "<p>Cosa ci guadagni?</p><p>Salvare una damigella in pericolo non basta?</p>",
            de: "<p>Was hast du davon?</p><p>Eine Jungfrau in Not zu retten reicht nicht?</p>"
        },
        tutorial_message_intro_7: {
            fr: "<p>J'ai une idée: je pourrais t'aider.</p><p>Tu pourrais te réfugier dans mon labo, et je pourrais améliorer ton équipement.</p><p>C'est pas pour me vanter, mais je suis un véritable génie.</p>",
            en: "<p>I have an idea: I could help you.</p><p>You could take refuge in my lab, and I could improve your equipment.</p><p>Not to brag, but I'm a real genius.</p>",
            es: "<p>Tengo una idea: podría ayudarte.</p><p>Podrías refugiarte en mi laboratorio y yo podría mejorar tu equipo.</p><p>No es por presumir, pero soy una verdadera genia.</p>",
            it: "<p>Ho un'idea: potrei aiutarti.</p><p>Potresti rifugiarti nel mio laboratorio, e io potrei migliorare il tuo equipaggiamento.</p><p>Non per vantarmi, ma sono un vero genio.</p>",
            de: "<p>Ich habe eine Idee: Ich könnte dir helfen.</p><p>Du könntest dich in meinem Labor verstecken, und ich könnte deine Ausrüstung verbessern.</p><p>Ich will ja nicht angeben, aber ich bin ein echtes Genie.</p>"
        },
        tutorial_message_intro_8: {
            fr: "<p>Assez parlé !</p><p>Explose-moi ces abominations !</p>",
            en: "<p>Enough talking !</p><p>Blast these abominations !</p>",
            es: "<p>¡Basta de hablar!</p><p>¡Malditas sean estas abominaciones!</p>",
            it: "<p>Basta parlare!</p><p>Distruggi queste abominazioni!</p>",
            de: "<p>Genug geredet!</p><p>Vernichte diese Abscheulichkeiten!</p>"
        },

        tutorial_message_controls_mobile_0: {
            fr: `<p>Au fait, au cas où ça pourrait t'aider, j'ai lu quelque part que le <b>joysitck virtuel</b>, à gauche, permettait de se déplacer, tandis que les <b>boutons à droite</b> permettaient d'effectuer diverses actions :</p>
                <p>Par exemple, celui affichant une <b>cible</b> permettrait de <b>tirer sur le monstre le plus proche</b>.</p>
                <p>Par contre, je n'ai aucune idée de ce que ça signifie...</p>`,
            en: `<p>By the way, in case it helps, I read somewhere that the <b>virtual joystick</b> on the left allows you to move, while the <b>buttons on the right</b> allow you to perform various actions:</p>
                <p>For example, the one displaying a <b>target</b> is supposed to allow you to <b>shoot the nearest monster</b>.</p>
                <p>However, I have no idea what that means...</p>`,
            es: `<p>Por cierto, por si te sirve de ayuda, leí en alguna parte que el <b>joystick virtual</b> de la izquierda te permite moverte, mientras que los <b>botones de la derecha</b> te permiten realizar varias acciones:</p>
                <p>Por ejemplo, el que muestra un <b>objetivo</b> te permitiría <b>disparar al monstruo más cercano</b>.</p>
                <p>Sin embargo, no tengo ni idea de qué significa eso...</p>`,
            it: `<p>Tra l'altro, nel caso possa aiutarti, ho letto da qualche parte che il <b>joystick virtuale</b>, a sinistra, permette di muoversi, mentre i <b>pulsanti a destra</b> permettono di eseguire varie azioni:</p>
                <p>Ad esempio, quello che mostra un <b>bersaglio</b> dovrebbe permettere di <b>colpire il mostro più vicino</b>.</p>
                <p>Tuttavia, non ho idea di cosa significhi...</p>`,
            de: `<p>Übrigens, falls es hilft, ich habe irgendwo gelesen, dass der <b>virtuelle Joystick</b> links es dir ermöglicht, dich zu bewegen, während die <b>Tasten rechts</b> es dir ermöglichen, verschiedene Aktionen auszuführen:</p>
                <p>Zum Beispiel soll der, der ein <b>Ziel</b> anzeigt, es dir ermöglichen, den <b>nächsten Monster zu erschießen</b>.</p>
                <p>Ich habe jedoch keine Ahnung, was das bedeutet...</p>`
        },
        tutorial_message_controls_mobile_1: {
            fr: `<p>En outre, l'ouvrage faisait également référence à un bouton affichant un <b>personnage élancé</b> et permettant d'effectuer une <b>maneuvre d'esquive</b>.</p>
                <p>Il y était aussi question d'un autre bouton, situé juste en-dessous pour <b>recharger l'arme</b>, et d'un bouton <b>pause</b> permettant d'accéder aux paramètres.</p>
                <p>J'espère que tu comprends ce charabia, parce que moi non...</p>`,
            en: `<p>Additionally, the book also referred to a button displaying a <b>dashing character</b> and allowing for a <b>dodge maneuver</b> to be performed.</p>
                <p>There was also written of another button, located just below to <b>reload the weapon</b>, and a <b>pause</b> button allowing access to the settings.</p>
                <p>I hope you understand this gibberish, because I don't...</p>`,
            es: `<p>Además, el libro también mencionaba un botón que mostraba un <b>personaje delgado</b> que permitía esquivar.</p>
                <p>También mencionaba otro botón, ubicado justo debajo, para <b>recargar el arma</b>, y un botón de <b>pausa</b> que permitía acceder a los ajustes.</p>
                <p>Espero que entiendas este galimatías, porque yo no...</p>`,
            it: `<p>Inoltre, nel libro si faceva riferimento anche a un pulsante che mostrava un <b>personaggio in corsa</b> e permetteva di eseguire una <b>manovra di schivata</b>.</p>
                <p>Si parlava anche di un altro pulsante, situato appena sotto per <b>ricaricare l'arma</b>, e di un pulsante <b>pausa</b> che permetteva di accedere alle impostazioni.</p>
                <p>Spero tu capisca questo gergo, perché io non lo capisco...</p>`,
            de: `<p>Zusätzlich wurde in dem Buch auch auf eine Taste verwiesen, die einen <b>ducksenden Charakter</b> anzeigt und eine <b>Ausweichmanöver</b> ermöglicht.</p>
                <p>Es wurde auch von einer anderen Taste gesprochen, die sich direkt darunter befindet, um das <b>Nachladen der Waffe</b> zu ermöglichen, und einer <b>Pause</b>-Taste, die den Zugriff auf die Einstellungen ermöglicht.</p>
                <p>Ich hoffe, du verstehst dieses Kauderwelsch, denn ich tue es nicht...</p>`
        },

        tutorial_message_controls_0: {
            fr: `<p>Au fait, au cas où ça pourrait t'aider, j'ai lu quelque part qu'il était possible de se déplacer avec les touches <b>Z</b>, <b>Q</b>, <b>S</b> et <b>D</b> du clavier.</p>
                <p>Il parraît même que la <b>barre espace</b> permet d'effectuer un bond d'esquive en avant.</p>
                <p>Par contre, je n'ai aucune idée de ce que ça signifie...</p>`,
            en: `<p>By the way, in case it helps, I read somewhere that you can move with the <b>Z</b>, <b>Q</b>, <b>S</b> and <b>D</b> keys on the keyboard.</p>
                <p>It even seems that the <b>space bar</b> allows you to perform a forward dodge jump.</p>
                <p>However, I have no idea what that means...</p>`,
            es: `<p>Por cierto, por si te sirve de algo, leí en alguna parte que puedes moverte usando las teclas <b>Z</b>, <b>Q</b>, <b>S</b> y <b>D</b> del teclado.</p>
                <p>Parece que la <b>barra espaciadora</b> incluso te permite realizar un salto esquivando hacia adelante.</p>
                <p>Sin embargo, no tengo ni idea de qué significa eso...</p>`,
            it: `<p>Tra l'altro, nel caso possa aiutarti, ho letto da qualche parte che puoi muoverti usando i tasti <b>Z</b>, <b>Q</b>, <b>S</b> e <b>D</b> della tastiera.</p>
                <p>Sembrerebbe addirittura che la <b>barra spaziatrice</b> permetta di eseguire un salto in avanti schivando.</p>
                <p>Tuttavia, non ho idea di cosa significhi...</p>`,
            de: `<p>Übrigens, falls es hilft, ich habe irgendwo gelesen, dass du dich mit den Tasten <b>Z</b>, <b>Q</b>, <b>S</b> und <b>D</b> auf der Tastatur bewegen kannst.</p>
                <p>Es scheint sogar, dass die <b>Leertaste</b> es dir ermöglicht, einen Ausweichsprung nach vorne auszuführen.</p>
                <p>Ich habe jedoch keine Ahnung, was das bedeutet...</p>`
        },
        tutorial_message_controls_1: {
            fr: `<p>L'article dans lequel j'ai lu tout ça expliquait aussi que <b>la souris</b> permettait de viser, de tirer avec le <b>bouton gauche</b>, et de recharger avec le <b>bouton droit</b>.</p>
                <p>Il expliquait également que la touche <b>P</b> permettait de mettre en pause et d'afficher les paramètres, et qu'il était possible de choisir ton type de clavier, dans ces paramètres.</p>`,
            en: `<p>The article I read all this in also explained that <b>the mouse</b> allowed you to aim, shoot with the <b>left button</b>, and reload with the <b>right button</b>.</p>
                <p>It also explained that the <b>P</b> key was used to pause and display settings.</p>
                <p>...and that it was possible to choose your keyboard type in these settings.</p>`,
            es: `<p>El artículo donde leí todo esto también explicaba que <b>el ratón</b> permitía apuntar, disparar con el <b>botón izquierdo</b>, y recargar con el <b>botón derecho</b>.</p>
                <p>También explicaba que la tecla <b>P</b> permitía pausar y mostrar la configuración, y que se podía elegir el tipo de teclado en esa configuración</p>`,
            it: `<p>L'articolo in cui ho letto tutto ciò spiegava anche che <b>il mouse</b> permetteva di mirare, sparare con il <b>pulsante sinistro</b>, e ricaricare con il <b>pulsante destro</b>.</p>
                <p>Spiegava anche che il tasto <b>P</b> veniva utilizzato per mettere in pausa e visualizzare le impostazioni.</p>
                <p>...e che era possibile scegliere il tipo di tastiera in queste impostazioni.</p>`,
            de: `<p>Der Artikel, in dem ich das alles gelesen habe, erklärte auch, dass <b>die Maus</b> es dir ermöglicht, zu zielen, mit der <b>linken Taste</b> zu schießen und mit der <b>rechten Taste</b> nachzuladen.</p>
                <p>Es wurde auch erklärt, dass die <b>P</b>-Taste verwendet wird, um das Spiel zu pausieren und die Einstellungen anzuzeigen.</p>
                <p>...und dass es möglich ist, deinen Tastaturtyp in diesen Einstellungen auszuwählen.</p>`
        },
        tutorial_message_controls_2: {
            fr: `<p>Si je me rappelle bien, il y était également fait mention de la possibilité de brancher une <b>manette de jeu</b>, puis de se <b>laisser guider</b>.</p>
                <p>J'espère que tu comprends ce charabia, parce que moi non...</p>`,
            en: `<p>If I remember well, it also mentioned the possibility to connect a <b>gamepad</b> and then <b>follow the instructions</b>.</p>
                <p>I hope you understand this gibberish, because I don't...</p>`,
            es: `<p>Si no recuerdo mal, también mencionaba la posibilidad de conectar un <b>mando</b> y luego <b>seguir las instrucciones</b>.</p>
                <p>Espero que entiendas este galimatías, porque yo no...</p>`,
            it: `<p>Se ricordo bene, si parlava anche della possibilità di collegare un <b>controller</b> e poi <b>seguire le istruzioni</b>.</p>
                <p>Spero tu capisca questo gergo, perché io non lo capisco...</p>`,
            de: `<p>Wenn ich mich recht erinnere, wurde auch die Möglichkeit erwähnt, einen <b>Gamepad</b> anzuschließen und dann den <b>Anweisungen zu folgen</b>.</p>
                <p>Ich hoffe, du verstehst dieses Kauderwelsch, denn ich tue es nicht...</p>`
        },

        tutorial_message_shop_0: {
            fr: `<p>Merci de m'avoir aidée à reprendre le contrôle de mon labo.</p>
                <p>Je te présente ton nouveau chez toi... ou plutôt, notre chez nous.</p>`,
            en: `<p>Thank you for helping me regain control of my lab.</p>
                <p>Here's your new home... or rather, our home.</p>`,
            es: `<p>Gracias por ayudarme a recuperar el control de mi laboratorio.</p>
                <p>Me gustaría presentarles su nuevo hogar... o mejor dicho, nuestro hogar.</p>`,
            it: `<p>Grazie per avermi aiutato a riprendere il controllo del mio laboratorio.</p>
                <p>Ecco la tua nuova casa... o meglio, la nostra casa.</p>`,
            de: `<p>Danke, dass du mir geholfen hast, die Kontrolle über mein Labor zurückzugewinnen.</p>
                <p>Hier ist dein neues Zuhause... oder besser gesagt, unser Zuhause.</p>`
        },
        tutorial_message_shop_money_0: {
            fr: `<p>Ici tu trouveras de quoi te retaurer, entre deux sorties. Mais ce n'est pas gratuit, hein...</p>
                <p>Et comme promis, je pourrai améliorer ton équipement, si tu me ramène de quoi travailler.</p>`,
            en: `<p>Here you'll find something to eat between outings. But it's not free, eh...</p>
                <p>And as promised, I can upgrade your gear if you bring me something to work with.</p>`,
            es: `<p>Aquí encontrarás algo para comer entre salidas. Pero no es gratis, ¿eh?</p>
                <p>Y como prometí, puedo mejorar tu equipo si me traes algo con lo que trabajar.</p>`,
            it: `<p>Qui troverai qualcosa da mangiare tra un'uscita e l'altra. Ma non è gratis, eh...</p>
                <p>E come promesso, posso potenziare il tuo equipaggiamento se mi porti qualcosa con cui lavorare.</p>`,
            de: `<p>Hier findest du etwas zu essen zwischen den Ausflügen. Aber es ist nicht umsonst, eh...</p>
                <p>Und wie versprochen, kann ich deine Ausrüstung aufrüsten, wenn du mir etwas zum Arbeiten bringst.</p>`
        },
        tutorial_message_shop_money_1: {
            fr: `<p>J'avais bricolé un système de téléportation d'urgence permettant de revenir ici instantanément en cas de problème.</p>
                <p>Je me demande s'il fonctionne toujours...</p>`,
            en: `<p>I had tinkered with an emergency teleportation system that would allow me to return here instantly in case of trouble.</p>
                <p>I wonder if it still works...</p>`,
            es: `<p>Experimenté avec un sistema de teletransportación de emergencia que me permitiría regresar aquí al instante en caso de problemas.</p>
                <p>Me pregunto si aún funciona...</p>`,
            it: `<p>Ho sperimentato un sistema di teletrasporto di emergenza che mi permetterebbe di tornare qui istantaneamente in caso di problemi.</p>
                <p>Mi chiedo se funzioni ancora...</p>`,
            de: `<p>Ich hatte mit einem Notfall-Teleportationssystem herumgebastelt, das es mir ermöglichen würde, im Falle von Problemen sofort hierher zurückzukehren.</p>
                <p>Ich frage mich, ob es immer noch funktioniert...</p>`
        },
        tutorial_message_shop_money_2: {
            fr: `<p>Par chance, il semble encore en état de marche. Je vais te raccorder au système de contrôle, et paramétrer la machine pour qu'elle te ramène automatiquement, en cas de problème.</p>
                <p>Compte sur moi pour te soigner dans la limite de ce que j'aurai sous la main, si ça devait se produire.</p>`,
            en: `<p>Luckily, it still seems to be in working order. I'll hook you up to the control system and set the machine to automatically bring you back if anything goes wrong.</p>
                <p>Count on me to heal you in my (ou rather, your) ressources limits, should that happen.</p>`,
            es: `<p>Por suerte, parece que todavía funciona. Te conectaré al sistema de control y configuraré la máquina para que te traiga de vuelta automáticamente si algo sale mal.</p>
                <p>Puedes contar conmigo para tratarte lo mejor posible, si eso sucede.</p>`,
            it: `<p>Fortunatamente, sembra ancora essere in buone condizioni. Ti collegherò al sistema di controllo e imposterò la macchina per riportarti automaticamente indietro se qualcosa va storto.</p>
                <p>Puoi contare su di me per curarti nei limiti delle mie (o meglio, delle tue) risorse, nel caso ciò accada.</p>`,
            de: `<p>Glücklicherweise scheint es noch zu funktionieren. Ich werde dich mit dem Kontrollsystem verbinden und die Maschine so einstellen, dass sie dich automatisch zurückbringt, falls etwas schief geht.</p>
                <p>Verlass dich darauf, dass ich dich in meinen (oder besser gesagt, deinen) Ressourcenlimits heilen werde, falls das passieren sollte.</p>`
        },

        tutorial_message_shop_taining_0: {
            fr: "<p>Ici, c'est la salle d'entrainement.</p><p>Tu peux y développer tes compétences physiques.</p>",
            en: "<p>This is the training room.</p><p>You can develop your physical skills here.</p>",
            es: "<p>Esta es la sala de entrenamiento.</p><p>Aquí puedes desarrollar tus habilidades físicas.</p>",
            it: "<p>Questa è la sala di allenamento.</p><p>Puoi sviluppare le tue abilità fisiche qui.</p>",
            de: "<p>Dies ist der Trainingsraum.</p><p>Hier kannst du deine körperlichen Fähigkeiten entwickeln.</p>"
        },
        tutorial_message_shop_taining_1: {
            fr: `<p>J'ai lu dans un livre sur le sujet, qu'il était nécessaire de s'entrainer concrètement en amont, pour que l'entrainement en salle soit efficace.</p>
                <p>D'après ce livre, tuer des monstres permet de <b>gagner de l'expérience</b>, qui permet ensuite de <b>gagner des niveaux</b>.</p>`,
            en: `<p>I read in a book that it was necessary to train concretely beforehand, for the training in the room to be effective.</p>
                <p>According to this book, killing monsters allows you to <b>gain experience</b>, which then allows you to <b>gain levels</b>.</p>`,
            es: `<p>Leí en un libro sobre el tema que era necesario practicar concretamente de antemano para que el entrenamiento en el gimnasio fuera efectivo.</p>
                <p>Según este libro, matar monstruos permite <b>ganar experiencia</b>, lo que a su vez permite <b>subir de nivel</b>.</p>`,
            it: `<p>Ho letto in un libro che era necessario allenarsi concretamente in anticipo, affinché l'allenamento in sala fosse efficace.</p>
                <p>Secondo questo libro, uccidere mostri consente di <b>guadagnare esperienza</b>, che a sua volta consente di <b>guadagnare livelli</b>.</p>`,
            de: `<p>Ich habe in einem Buch gelesen, dass es notwendig war, vorher konkret zu trainieren, damit das Training im Raum effektiv ist.</p>
                <p>Nach diesem Buch ermöglicht das Töten von Monstern, <b>Erfahrung zu sammeln</b>, was dann ermöglicht, <b>Level aufzusteigen</b>.</p>`
        },
        tutorial_message_shop_taining_2: {
            fr: `<p>Chaque nouveau niveau, te permet d'obtenir des <b>points de compétences</b> utilisables ici pour améliorer tes caractéristiques.</p>
                <p>D'ailleurs, j'ai l'impression que tu es mûr pour utiliser la salle, après ce premier combat.</p>`,
            en: `<p>Each new level allows you to obtain <b>skill points</b> that can be used here to improve your characteristics.</p>
                <p>Besides, it sounds like you're ready to use the room, after this first fight.</p>`,
            es: `<p>Cada nuevo nivel te permite obtener <b>puntos de habilidad</b> que puedes usar para mejorar tus estadísticas.</p>
                <p>Además, me da la impresión de que estás listo para usar la sala después de esta primera pelea.</p>`,
            it: `<p>Ogni nuovo livello ti consente di ottenere <b>punti abilità</b> che possono essere utilizzati qui per migliorare le tue caratteristiche.</p>
                <p>Inoltre, sembra che tu sia pronto per utilizzare la sala, dopo questo primo combattimento.</p>`,
            de: `<p>Jedes neue Level ermöglicht es dir, <b>Fähigkeitspunkte</b> zu erhalten, die hier verwendet werden können, um deine Eigenschaften zu verbessern.</p>
                <p>Außerdem klingt es so, als wärst du nach diesem ersten Kampf bereit, den Raum zu nutzen.</p>`
        },
        tutorial_message_shop_taining_3: {
            fr: "<p>Voilà, tu sais tout. Je te laisse. À très vite.</p>",
            en: "<p>There you have it, I told you everything I know. See you soon.</p>",
            es: "<p>Ahí lo tienen, ya lo saben todo. Los dejo. Nos vemos pronto.</p>",
            it: "<p>Ed ecco fatto, ti ho detto tutto ciò che so. A presto.</p>",
            de: "<p>Da hast du es, ich habe dir alles gesagt, was ich weiß. Bis bald.</p>"
        },

        tutorial_voracious_title: {
            fr: "Présentation du <b>Vorace</b>",
            en: "Introducing <b>Voracious</b>",
            es: "Presentando al <b>Voraz</b>",
            it: "Presentazione del <b>Vorace</b>",
            de: "Vorstellung des <b>Vielfraßes</b>"
        },
        tutorial_voracious_message: {
            fr: `<p>Ces zombie sont appelés des <i>Voraces</i>.</p> 
                <p>Ils ne feront que te foncer dessus, alors tant que tu gardes tes distances, tout devrait bien se passer.</p>`,
            en: `<p>These zombies are called <i>Voracious</i>.</p> 
                <p>They'll just charge at you, so as long as you keep your distance, you should be fine.</p>`,
            es: `<p>Estos zombis se llaman <i>Voraces</i>.</p> 
                <p>Simplemente te atacarán, así que mientras mantengas la distancia, no deberías tener problemas.</p>`,
            it: `<p>Questi zombie si chiamano <i>Voraci</i>.</p> 
                <p>Si lanceranno semplicemente contro di te, quindi finché mantieni le distanze, dovresti stare bene.</p>`,
            de: `<p>Diese Zombies werden <i>Gierig</i> genannt.</p> 
                <p>Sie werden einfach auf dich zurasen, also solltest du, solange du Abstand hältst, in Ordnung sein.</p>`
        },

        tutorial_spitter_title: {
            fr: "Présentation du <b>Cracheur</b>",
            en: "Introducing <b>Spitter</b>",
            es: "Presentando al <b>Escupedor</b>",
            it: "Presentazione dello <b>Scoppiatore</b>",
            de: "Vorstellung des <b>Spuckers</b>"
        },
        tutorial_spitter_message: {
            fr: `<p>Ces zombies miniatures sont des <i>Cracheurs</i>.</p> 
                <p>Méfie-toi d'eux. Non seulement ils attaquent à distance, mais il laissent s'échapper un nuage toxique en mourant.</p>
                <p>Je me demande si tu ne peux pas les amener à tirer sur les autres zombies, en te plaçant stratégiquement.</p>`,
            en: `<p>These miniature zombies are <i>Spitters</i>.</p>
                <p>Beware of them. Not only do they attack from a distance, but they also release a toxic cloud when they die.</p>
                <p>I wonder if you can get them to shoot other zombies by positioning yourself strategically.</p>`,
            es: `<p>Estos zombis en miniatura son <i>Escupedores</i>.</p>
                <p>Cuidado con ellos. No solo atacan a distancia, sino que también liberan una nube tóxica al morir.</p>
                <p>Me pregunto si puedes hacer que disparen a otros zombis colocándote estratégicamente.</p>`,
            it: `<p>Questi zombie in miniatura sono <i>Scoppiatori</i>.</p>
                <p>Fai attenzione a loro. Non solo attaccano da lontano, ma rilasciano anche una nuvola tossica quando muoiono.</p>
                <p>Mi chiedo se puoi farli sparare ad altri zombie posizionandoti strategicamente.</p>`,
            de: `<p>Diese Miniatur-Zombies sind <i>Spucker</i>.</p>
                <p>Vorsicht vor ihnen. Sie greifen nicht nur aus der Ferne an, sondern setzen auch beim Sterben eine giftige Wolke frei.</p>
                <p>Ich frage mich, ob du sie dazu bringen kannst, andere Zombies zu erschießen, indem du dich strategisch positionierst.</p>`
        },

        tutorial_tackler_title: {
            fr: "Présentation du <b>Tacleur</b>",
            en: "Introducing <b>Tackler</b>",
            es: "Presentando al <b>Placador</b>",
            it: "Presentazione del <b>Placcatore</b>",
            de: "Vorstellung des <b>Rammers</b>"
        },
        tutorial_tackler_message: {
            fr: `<p>Fais très attention à ces <i>Tackleurs</i> !</p>
                <p>Ils sont incroyablement rapides, et te fonceront dessus d'un coup, lorsqu'ils se seront suffisamment approchés.</p>`,
            en: `<p>Be very careful of those <i>Tacklers</i> !</p>
                <p>They're incredibly fast, and will charge you in one go when they get close enough.</p>`,
            es: `<p>¡Ten mucho cuidado con esos <i>Placadores</i>!</p>
                <p>Son increíblemente rápidos y te atacarán de una sola vez cuando se acerquen lo suficiente.</p>`,
            it: `<p>Fai molta attenzione a questi <i>Placcatori</i>!</p>
                <p>Sono incredibilmente veloci e ti caricheranno in un colpo solo quando si avvicineranno abbastanza.</p>`,
            de: `<p>Sei vorsichtig bei diesen <i>Blockierern</i>!</p>
                <p>Sie sind unglaublich schnell und werden dich in einem Zug angreifen, wenn sie nah genug dran sind.</p>`
        },

        tutorial_golgoth_title: {
            fr: "Présentation du <b>Golgoth</b>",
            en: "Introducing <b>Golgoth</b>",
            es: "Presentando al <b>Gólgota</b>",
            it: "Presentazione del <b>Golgoth</b>",
            de: "Vorstellung des <b>Golgoth</b>"
        },
        tutorial_golgoth_message: {
            fr: `<p>Les <i>Golgoths</i> sont très lents, mais aussi incroyablement forts et résistants.</p>
                <p>J'ai même entendu dire qu'il leur arrivait d'utiliser d'autres zombies comme projectiles.</p>
                <p>Ils mettent du temps à lancer en ligne droite, mais leurs lancers en cloche sont instantanés et occasionnent de lourds dégâts sur une large zone.</p>`,
            en: `<p>Golgoths are very slow, but also incredibly strong and resilient.</p>
                <p>I've even heard of them sometimes using other zombies as projectiles.</p>
                <p>They take a while to perform a straight throw, but their aerial throws are instantaneous and deal heavy damage over a wide area.</p>`,
            es: `<p>Los <i>Golgoths</i> son muy lentos, pero también increíblemente fuertes y resistentes.</p>
                <p>Incluso he oído que a veces usan a otros zombis como proyectiles.</p>
                <p>Tardan un poco en lanzarlos en línea recta, pero sus lanzamientos en arco son instantáneos e infligen un gran daño en un área extensa.</p>`,
            it: `<p>I <i>Golgoth</i> sono molto lenti, ma anche incredibilmente forti e resistenti.</p>
                <p>Ho persino sentito dire che a volte usano altri zombie come proiettili.</p>
                <p>Ci mettono un po' a lanciare in linea retta, ma i loro lanci aerei sono istantanei e infliggono pesanti danni su un'ampia area.</p>`,
            de: `<p>Die <i>Golgoths</i> sind sehr langsam, aber auch unglaublich stark und widerstandsfähig.</p>
                <p>Ich habe sogar gehört, dass sie manchmal andere Zombies als Projektile verwenden.</p>
                <p>Sie brauchen eine Weile, um einen geraden Wurf zu machen, aber ihre Luftwürfe sind sofort und verursachen schweren Schaden in einem großen Bereich.</p>`
        },

        wave_report_title: {
            fr: "La bataille est terminée...",
            en: "The battle is over...",
            es: "La batalla ha terminado...",
            it: "La battaglia è finita...",
            de: "Die Schlacht ist vorbei..."
        },
        wave_report_victory_0: {
            fr: "Bravo !<br/>Tu as encore fait de l'excellent travail.<br/>Continue comme ça.",
            en: "Well done!<br/>You did an excellent job again.<br/>Keep it up.",
            es: "¡Bien hecho!<br/>Hiciste un excelente trabajo nuevamente.<br/>Sigue así.",
            it: "Ben fatto!<br/>Hai fatto di nuovo un ottimo lavoro.<br/>Continua così.",
            de: "Gut gemacht!<br/>Du hast wieder hervorragende Arbeit geleistet.<br/>Mach weiter so."
        },
        wave_report_victory_1: {
            fr: "Ces monstres n'avaient aucune chance face à toi.",
            en: "Those monsters didn't stand a chance against you.",
            es: "Esos monstruos no tuvieron ninguna oportunidad contra ti.",
            it: "Quei mostri non avevano alcuna possibilità contro di te.",
            de: "Diese Monster hatten gegen dich keine Chance."
        },
        wave_report_victory_2: {
            fr: "Voilà qui est fait.<br/>Rien de tel qu'un peu de ménage pour y voir clair.",
            en: "That's it.<br/>Nothing like a little cleaning to clear things up.",
            es: "Eso es todo.<br/>No hay nada como un poco de limpieza para aclarar las cosas.",
            it: "Ecco fatto.<br/>Niente come una piccola pulizia per chiarire le cose.",
            de: "Das war's.<br/>Nichts wie ein bisschen Aufräumen, um Klarheit zu schaffen."
        },
        wave_report_victory_3: {
            fr: "Exterminer ces brutes sanguinaires semble facile, quand on te voit faire.",
            en: "Exterminating these bloodthirsty brutes seems easy when you see you do it.",
            es: "Exterminar a estas bestias sedientas de sangre parece fácil cuando lo ves.",
            it: "Sembra facile sterminare queste belve assetate di sangue quando si vede che lo fai.",
            de: "Diese blutrünstigen Bestien auszurotten scheint einfach, wenn man dir zusieht."
        },
        wave_report_defeat_0: {
            fr: "Ils étaient trop forts pour toi.<br/>Je vais t'aider à reprendre des forces.",
            en: "They were too strong for you.<br/>I will help you regain your strength.",
            es: "Eran demasiado fuertes para ti.<br/>Te ayudaré a recuperar tu fuerza.",
            it: "Erano troppo forti per te.<br/>Ti aiuterò a riprendere forza.",
            de: "Sie waren zu stark für dich.<br/>Ich helfe dir, wieder zu Kräften zu kommen."
        },
        wave_report_defeat_1: {
            fr: "J'espère que tu vas survivre à tes blessures...<br/>...mais si tu ne survis pas, c'est pas de ma faute !",
            en: "I hope you survive your injuries...<br/>...but if you don't, it's not my fault !",
            es: "Espero que sobrevivas a tus heridas...<br/>...pero si no, ¡no es mi culpa!",
            it: "Spero tu possa sopravvivere alle tue ferite...<br/>...ma se non lo fai, non è colpa mia!",
            de: "Ich hoffe, du überlebst deine Verletzungen...<br/>...aber wenn nicht, ist es nicht meine Schuld!"
        },
        wave_report_defeat_2: {
            fr: "Ma foi, ça à l'air douloureux...",
            en: "Well, that looks painful...",
            es: "Bueno, eso parece doloroso...",
            it: "Bene, sembra doloroso...",
            de: "Nun, das sieht schmerzhaft aus..."
        },
        wave_report_defeat_3: {
            fr: "À mon tour de me rendre utile...<br/>Tu as mal quand j'appuies là ?<br/>Aïe ! Me tapes pas, j'essaies de t'aider !",
            en: "My turn to be useful...<br/>Does it hurt when I press there ?<br/>Ouch ! Don't hit me, I'm trying to help you !",
            es: "Me toca ser útil...<br/>¿Te duele cuando presiono ahí?<br/>¡Ay! ¡No me golpees, intento ayudarte!",
            it: "È il mio turno di essere utile...<br/>Ti fa male quando premo lì?<br/>Ahi! Non colpirmi, sto cercando di aiutarti!",
            de: "Jetzt bin ich mal nützlich...<br/>Tut es weh, wenn ich da drücke?<br/>Autsch! Schlag mich nicht, ich versuche dir zu helfen!"
        },

        params_title: {
            fr: "Paramètres utilisateur",
            en: "User settings",
            es: "Configuración de usuario",
            it: "Impostazioni utente",
            de: "Benutzereinstellungen"
        },
        params_language_lbl: {
            fr: "<b>Langue:</b>",
            en: "<b>Language:</b>",
            es: "<b>Idioma:</b>",
            it: "<b>Lingua:</b>",
            de: "<b>Sprache:</b>"
        },
        params_music_on_lbl: {
            fr: "<b>Musique:</b>",
            en: "<b>Music:</b>",
            es: "<b>Música:</b>",
            it: "<b>Musica:</b>",
            de: "<b>Musik:</b>"
        },
        params_music_volume_lbl: {
            fr: "<b>Volume musique:</b>",
            en: "<b>Music volume:</b>",
            es: "<b>Volumen de música:</b>",
            it: "<b>Volume musica:</b>",
            de: "<b>Musiklautstärke:</b>"
        },
        params_sound_fx_on_lbl: {
            fr: "<b>Effets sonores:</b>",
            en: "<b>Sound FX:</b>",
            es: "<b>Efectos sonoros:</b>",
            it: "<b>Effetti sonori:</b>",
            de: "<b>Soundeffekte:</b>"
        },
        params_sound_fx_volume_lbl: {
            fr: "<b>Volume effets sonores:</b>",
            en: "<b>Sound FX volume:</b>",
            es: "<b>Volumen de efectos sonoros:</b>",
            it: "<b>Volume effetti sonori:</b>",
            de: "<b>Lautstärke Soundeffekte:</b>"
        },
        params_keyboard_type_lbl: {
            fr: "<b>Type de clavier:</b>",
            en: "<b>Keyboard type:</b>",
            es: "<b>Tipo de teclado:</b>",
            it: "<b>Tipo di tastiera:</b>",
            de: "<b>Tastaturtyp:</b>"
        },
        params_show_hitboxes_lbl: {
            fr: "<b>Afficher les hitbox:</b>",
            en: "<b>Display hitboxes:</b>",
            es: "<b>Mostrar cajas de impacto:</b>",
            it: "<b>Mostra hitbox:</b>",
            de: "<b>Hitboxen anzeigen:</b>"
        },
        params_gamepad_config: {
            fr: "Paramétrer la manette",
            en: "Gamepad configuration",
            es: "Configurar el mando",
            it: "Configurazione gamepad",
            de: "Gamepad konfigurieren"
        },

        shop_title: {
            fr: "Pense à faire le plein, avant d'y retourner",
            en: "Remember to fill up before going back",
            es: "Recuerda equiparte antes de volver allí",
            it: "Ricordati di rifornirti prima di tornare",
            de: "Denk daran, dich auszustatten, bevor du zurückgehst"
        },
        shop_money_button: {
            fr: "Ravitaillement",
            en: "Gear",
            es: "Equipo",
            it: "Equipaggiamento",
            de: "Ausrüstung"
        },
        shop_knowledge_button: {
            fr: "Salle d'entrainement",
            en: "Training room",
            es: "Sala de entrenamiento",
            it: "Sala di allenamento",
            de: "Trainingsraum"
        },
        shop_heal_maxed: {
            fr: "Santé déjà au maximum",
            en: "Health still maxed",
            es: "Salud ya al máximo",
            it: "Salute già al massimo",
            de: "Gesundheit bereits maximal"
        },
        shop_heal_desc: {
            fr: "Rend %value% points de vie",
            en: "Recovers %value% health points",
            es: "Restaura %value% puntos de vida",
            it: "Recupera %value% punti salute",
            de: "Stellt %value% Lebenspunkte wieder her"
        },
        shop_heal_name_0: {
            fr: "Verre d'eau",
            en: "Glass of water",
            es: "Vaso de agua",
            it: "Bicchiere d'acqua",
            de: "Glas Wasser"
        },
        shop_heal_name_1: {
            fr: "Repas chaud",
            en: "Hot meal",
            es: "Comida caliente",
            it: "Pasto caldo",
            de: "Heißes Essen"
        },
        shop_item_maxed: {
            fr: "Niveau maximal atteint",
            en: "Max level reached",
            es: "Nivel máximo alcanzado",
            it: "Livello massimo raggiunto",
            de: "Maximales Level erreicht"
        },
        shop_item_price: {
            fr: "<b>Prix:</b> %value%",
            en: "<b>Cost:</b> %value%",
            es: "<b>Precio:</b> %value%",
            it: "<b>Costo:</b> %value%",
            de: "<b>Kosten:</b> %value%"
        },
        shop_item_name_DET: {
            fr: "Détecteur de métaux",
            en: "Metal detector",
            es: "Detector de metales",
            it: "Metal detector",
            de: "Metalldetektor"
        },
        shop_item_desc_DET: {
            fr: "Cet équipement te permettra de récupérer plus de pièces sur les monstres",
            en: "This gear will allow you to collect more coins from monsters",
            es: "Este equipo te permitirá recolectar más monedas de los monstruos",
            it: "Questa attrezzatura ti permetterà di raccogliere più monete dai mostri",
            de: "Mit dieser Ausrüstung kannst du mehr Münzen von Monstern sammeln"
        },
        shop_item_effect_DET: {
            fr: '<b>Argent supplémentaire:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Extra money:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Dinero adicional:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Denaro extra:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Extra-Geld:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_CHC: {
            fr: "Chargeur haute capacité",
            en: "High capacity magazine",
            es: "Cargador de alta capacidad",
            it: "Caricatore ad alta capacità",
            de: "Hochkapazitätsmagazin"
        },
        shop_item_desc_CHC: {
            fr: "Bricolons un peu ton arme, pour augmenter la capacité du chargeur",
            en: "Let's tinker with your gun a little, to increase the magazine capacity",
            es: "Vamos a juguetear un poco con tu arma para aumentar la capacidad del cargador",
            it: "Modifichiamo un po' la tua arma per aumentare la capacità del caricatore",
            de: "Lass uns deine Waffe etwas umbauen, um die Magazinkapazität zu erhöhen"
        },
        shop_item_effect_CHC: {
            fr: '<b>Capacité du chargeur:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Magazine capacity:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Capacidad del cargador:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Capacità caricatore:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Magazinkapazität:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_RAT: {
            fr: "Déluge de balles",
            en: "Bullets' rain",
            es: "Diluvio de balas",
            it: "Pioggia di proiettili",
            de: "Kugelhagel"
        },
        shop_item_desc_RAT: {
            fr: "Réduit le recul de l'arme, pour faciliter la visée entre deux coups de feu",
            en: "Reduces weapon recoil, making it easier to aim between shots",
            es: "Reduce el retroceso del arma, lo que hace que sea más fácil apuntar entre disparos",
            it: "Riduce il rinculo dell'arma, facilitando la mira tra un colpo e l'altro",
            de: "Verringert den Rückstoß der Waffe und erleichtert das Zielen zwischen den Schüssen"
        },
        shop_item_effect_RAT: {
            fr: '<b>Temps entre deux coups (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Delay between shots (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Tiempo entre disparos (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Tempo tra i colpi (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Schussintervall (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_RAT_maxed: {
            fr: '<b>Temps entre deux coups (ms):</b> <span class="present-effect">%value%</span>',
            en: '<b>Delay between shots (ms):</b> <span class="present-effect">%value%</span>',
            es: '<b>Tiempo entre disparos (ms):</b> <span class="present-effect">%value%</span>',
            it: '<b>Tempo tra i colpi (ms):</b> <span class="present-effect">%value%</span>',
            de: '<b>Schussintervall (ms):</b> <span class="present-effect">%value%</span>'
        },
        shop_item_name_POW: {
            fr: "Puissance de feu",
            en: "Firepower",
            es: "Potencia de disparo",
            it: "Potenza di fuoco",
            de: "Feuerkraft"
        },
        shop_item_desc_POW: {
            fr: "Modifie l'arme, afin d'en améliorer la puissance de feu",
            en: "Modifies the weapon to improve its firepower",
            es: "Modifica el arma para mejorar su potencia de disparo",
            it: "Modifica l'arma per migliorarne la potenza di fuoco",
            de: "Modifiziere die Waffe, um ihre Feuerkraft zu verbessern"
        },
        shop_item_effect_POW: {
            fr: '<b>Dégâts par tir:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Damage per shot:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Daño por disparo:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Danno per colpo:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Schaden pro Schuss:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_CON: {
            fr: "Constitution",
            en: "Constitution",
            es: "Constitución",
            it: "Costituzione",
            de: "Konstitution"
        },
        shop_item_desc_CON: {
            fr: "Permet de mieux encaisser les coups",
            en: "Allows you to better absorb hits",
            es: "Permite absorber mejor los golpes",
            it: "Permette di assorbire meglio i colpi",
            de: "Ermöglicht es dir, Schläge besser einzustecken"
        },
        shop_item_effect_CON: {
            fr: '<b>Santé maximale:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Maximum health:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Máxima salud:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Salute massima:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Maximale Gesundheit:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_AGI: {
            fr: "Agilité",
            en: "Agility",
            es: "Agilidad",
            it: "Agilità",
            de: "Beweglichkeit"
        },
        shop_item_desc_AGI: {
            fr: "Permet de courir plus vite",
            en: "Allows you to run faster",
            es: "Te permite correr más rápido",
            it: "Permette di correre più velocemente",
            de: "Ermöglicht es dir, schneller zu laufen"
        },
        shop_item_effect_AGI: {
            fr: '<b>Vitesse de déplacement:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Movement speed:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Velocidad de movimiento:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Velocità di movimento:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Bewegungsgeschwindigkeit:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_AGI_maxed: {
            fr: '<b>Vitesse de déplacement:</b> <span class="present-effect">%value%</span>',
            en: '<b>Movement speed:</b> <span class="present-effect">%value%</span>',
            es: '<b>Velocidad de movimiento:</b> <span class="present-effect">%value%</span>',
            it: '<b>Velocità di movimento:</b> <span class="present-effect">%value%</span>',
            de: '<b>Bewegungsgeschwindigkeit:</b> <span class="present-effect">%value%</span>'
        },
        shop_item_name_RLD: {
            fr: "Rechargement rapide",
            en: "Fast reload",
            es: "Recarga rapida",
            it: "Ricarica veloce",
            de: "Schnelles Nachladen"
        },
        shop_item_desc_RLD: {
            fr: "Permet de changer plus rapidement de chargeur",
            en: "Allows faster magazine changes",
            es: "Permite cambios de cargador más rápidos",
            it: "Permette cambi di caricatore più veloci",
            de: "Ermöglicht schnelleren Magazinwechsel"
        },
        shop_item_effect_RLD: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Tempo di ricarica:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Nachladezeit:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_RLD_maxed: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span>',
            it: '<b>Tempo di ricarica:</b> <span class="present-effect">%value%</span>',
            de: '<b>Nachladezeit:</b> <span class="present-effect">%value%</span>'
        },
        shop_item_name_DAR: {
            fr: "Récupération rapide",
            en: "Fast recovery",
            es: "Rápida recuperación",
            it: "Recupero veloce",
            de: "Schnelle Erholung"
        },
        shop_item_desc_DAR: {
            fr: "Permet de récupérer plus vite d'une esquive",
            en: "Allows you to recover faster from dashing",
            es: "Te permite recuperarte más rápido después de esquivar",
            it: "Ti permette di recuperare più velocemente dopo uno scatto",
            de: "Ermöglicht schnellere Erholung nach Ausweichen"
        },
        shop_item_effect_DAR: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            it: '<b>Tempo di ricarica:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            de: '<b>Erholungszeit:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_DAR_maxed: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span>',
            it: '<b>Tempo di ricarica:</b> <span class="present-effect">%value%</span>',
            de: '<b>Erholungszeit:</b> <span class="present-effect">%value%</span>'
        }
    }
}