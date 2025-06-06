class MV_LanguageManager {
    TEMPLATED_VALUES_SEPARATOR = ",";
    __game_scope;
    __shop_manager;

    constructor(game_scope, shop_manager) {
        this.__game_scope = game_scope;
        this.__shop_manager = shop_manager;
        this.__initLanguageFromNavigator();
    }

    setLanguage(language) {
        this.__game_scope.language = language;
        this.__translateAll();
    }

    setTranslatedContent(element, text_key, target_property, templated_values) {
        element.setAttribute("text-key", text_key);
        element.setAttribute("translated-property", target_property);

        if (templated_values)
            this.__setTamplatedValuesAttribute(element, templated_values);

        element[target_property] = this.getText(text_key, templated_values);
    }

    getText(text_key, templated_values) { 
        let translated_string = this.TEXTS[text_key][this.__game_scope.language];

        if (templated_values)
            for (const current_value of templated_values)
                translated_string = translated_string.replace("%value%", current_value); 
        
        return translated_string; 
    }

    __initLanguageFromNavigator() {
        const language = navigator.language.split("-")[0];
        
        if ( !["fr", "es"].includes(language ) ) // Si la langue du navigateur n'est pas supportée => anglais
            language = "en";

        this.setLanguage(language);
    }

    __translateAll() {
        for (const element of document.querySelectorAll("[text-key][translated-property]")) {
            const text_key = element.getAttribute("text-key");
            const translated_property = element.getAttribute("translated-property");
            const templated_values = this.__getTemplatedValuesArray(element);

            element[translated_property] = this.getText(text_key, templated_values);
        }
    }

    __setTamplatedValuesAttribute(element, templated_values) {
        let templated_values_string = ""
        for (const val of templated_values)
            templated_values_string += val + this.TEMPLATED_VALUES_SEPARATOR;
        templated_values_string = templated_values_string.substring(0, templated_values_string.length-1);

        element.setAttribute("templated-values", templated_values_string);
    }

    __getTemplatedValuesArray(element) {
        const templated_values_string = element.getAttribute("templated-values");
        
        if (templated_values_string)
            return templated_values_string.split(this.TEMPLATED_VALUES_SEPARATOR);
        else return null;
    }

    TEXTS = {
        popup_close: {
            fr: "Fermer",
            en: "Close",
            es: "Cerca"
        },
        wave_number: {
            fr: "Vague %value%",
            en: "Wave %value%",
            es: "Ola %value%"
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
				<p><b><u>Advertencia</u> :</b> Al empezar una nueva parte, se sobrescribirá el archivo guardado.</p>`
        },
        load_popup_title: {
            fr: "Gestionnaire de sauvegarde",
            en: "Save manager",
            es: "Administrador de archivo guardado"
        },
        load_popup_yes: {
            fr: "Charger",
            en: "Load",
            es: "Carga"
        },
        load_popup_no: {
            fr: "Nouvelle partie",
            en: "New game",
            es: "Nueva parte"
        },

        skip_tuto_confirm: {
            fr: "<p>Le présent tutoriel ne vous sera présenté qu'une seule fois.</p><p>Souhaitez-vous réellement le passer ?</p>",
            en: "<p>This tutorial will only be shown once.</p><p>Are you really sure you want to skip it ?</p>",
            es: "<p>Este tutorial solo se te presentará una vez.</p><p>¿Realmente quieres omitirlo?</p>"
        },
        skip_tuto_title: {
            fr: "Passer l'intro et le tutoriel",
            en: "Skip intro and tutorial",
            es: "Omitir la introducción y el tutorial"
        },
        skip_tuto_yes: {
            fr: "Bien sûr !",
            en: "Sure !",
            es: "Por supuesto !"
        },
        skip_tuto_no: {
            fr: "Euuuuh...",
            en: "Uuuuuh...",
            es: "Uuuuu..."
        },

        gamepad_config_title: {
            fr: "Configuration de la manette",
            en: "Gamepad configuration",
            es: "Configuración del mando"
        },
        gamepad_config_pause: {
            fr: "Pause",
            en: "Pause",
            es: "Romper"
        },
        gamepad_config_auto_aim: {
            fr: "Tir visée auto",
            en: "Auto aim shot",
            es: "Disparo con puntería automática"
        },
        gamepad_config_rush: {
            fr: "S'élancer",
            en: "Rush",
            es: "Correr"
        },
        gamepad_config_reload: {
            fr: "Recharger",
            en: "Reload",
            es: "Recargar"
        },
        gamepad_config_up: {
            fr: "Menu : haut",
            en: "Menu : up",
            es: "Menú: arriba"
        },
        gamepad_config_down: {
            fr: "Menu : bas",
            en: "Menu : down",
            es: "Menú: abajo"
        },
        gamepad_config_left: {
            fr: "Menu : gauche",
            en: "Menu : left",
            es: "Menú: izquierda"
        },
        gamepad_config_right: {
            fr: "Menu : droite",
            en: "Menu : right",
            es: "Menú: derecha"
        },
        gamepad_config_validate: {
            fr: "Menu : valider",
            en: "Menu : validate",
            es: "Menú: validar"
        },
        gamepad_config_abort: {
            fr: "Menu : annuler",
            en: "Menu : abort",
            es: "Menú: cancelar"
        },
        gamepad_config_mapped_lib: {
            fr: "Bouton",
            en: "Button",
            es: "Botón"
        },
        gamepad_config_press_button_lib: {
            fr: "Appuyez sur un bouton",
            en: "Press a button",
            es: "Presione un botón"
        },

        tutorial_title: {
            fr: "Introduction",
            en: "Introduction",
            es: "Introducción"
        },
        tutorial_next: {
            fr: "Suite...",
            en: "Next...",
            es: "Siguiente..."
        },
        tutorial_skip: {
            fr: "Passer",
            en: "Skip",
            es: "Omitir"
        },

        tutorial_message_intro_0: {
            fr: "<p>Hey, salut toi !!</p><p>C'est cool de croiser quelqu'un ici.</p>",
            en: "<p>Hey, you !!</p><p>It's cool to run into someone around here.</p>",
            es: "<p>¡Hola, hola!</p><p>Es genial encontrarme con alguien aquí.</p>"
        },
        tutorial_message_intro_1: {
            fr: "<p>Quand j'y pense, il y avait bien longtemps que je n'avais croisé personne...</p>",
            en: "<p>When I think about it, it's been a long time since I've met anyone...</p>",
            es: "<p>Cuando lo pienso, ha pasado mucho tiempo desde que conocí a alguien...</p>"
        },
        tutorial_message_intro_2: {
            fr: "<p>Peu importe...</p><p>Au fait, moi c'est Julie Péhainegis</p><p>Et toi, comment tu t'appelles ?</p>",
            en: "<p>Never mind...</p><p>By the way, I'm Julia Peehenjay</p><p>What about you ? What's your name ?</p>",
            es: "<p>No importa...</p><p>Por cierto, soy Julia Péyenejota</p><p>Y tú, ¿cómo te llamas?</p>"
        },
        tutorial_message_intro_3: {
            fr: "<p>...chelou comme nom.</p><p>Bref. Passons.</p>",
            en: "<p>...weird name.</p><p>Anyway. Let's move on.</p>",
            es: "<p>...nombre raro.</p><p>En fin. Sigamos adelante.</p>"
        },
        tutorial_message_intro_4: {
            fr: "<p>Comme tu le sais peut-être, la plupart des gens se sont transformés en zombies...</p><p>Et avant que tu ne demandes pourquoi, je n'en ai aucune idée.</p>",
            en: "<p>As you may know, most people have turned into zombies...</p><p>And before you ask why, I have no idea.</p>",
            es: "<p>Como ya sabéis, la mayoría de la gente se ha convertido en zombis...</p><p>Y antes de que preguntéis por qué, no tengo ni idea.</p>"
        },
        tutorial_message_intro_5: {
            fr: "<p>Tout ce que je sais, c'est qu'ils ont investi mon labo et l'ont entièrement saccagé.</p><p>Je vois que t'es armé...</p><p>Tu pourrais botter leurs fesses puantes, s'il te plaît ?</p>",
            en: "<p>All I know is that they broke into my lab and completely trashed it.</p><p>I can see you're armed...</p><p>Will you kick their stinky butts, please ?</p>",
            es: "<p>Todo lo que sé es que entraron en mi laboratorio y lo destrozaron por completo.</p><p>Veo que estás armado...</p><p>¿Podrías patearles el trasero, por favor?</p>"
        },
        tutorial_message_intro_6: {
            fr: "<p>Ce que tu y gagnes ?</p><p>Sauver une demoiselle en détresse, ça suffit pas ?</p>",
            en: "<p>What you shall gain from it ?</p><p>Saving a damsel in distress isn't enough ?</p>",
            es: "¿Qué te aporta? ¿No te basta con salvar a una damisela en apuros?"
        },
        tutorial_message_intro_7: {
            fr: "<p>J'ai une idée: je pourrais t'aider.</p><p>Tu pourrais te réfugier dans mon labo, et je pourrais améliorer ton équipement.</p><p>C'est pas pour me vanter, mais je suis un véritable génie.</p>",
            en: "<p>I have an idea: I could help you.</p><p>You could take refuge in my lab, and I could improve your equipment.</p><p>Not to brag, but I'm a real genius.</p>",
            es: "<p>Tengo una idea: podría ayudarte.</p><p>Podrías refugiarte en mi laboratorio y yo podría mejorar tu equipo.</p><p>No es por presumir, pero soy una verdadera genia.</p>"
        },
        tutorial_message_intro_8: {
            fr: "<p>Assez parlé !</p><p>Explose-moi ces abominations !</p>",
            en: "<p>Enough talking !</p><p>Blast these abominations !</p>",
            es: "<p>¡Basta de hablar!</p><p>¡Malditas sean estas abominaciones!</p>"
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
                <p>Sin embargo, no tengo ni idea de qué significa eso...</p>`
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
                <p>Espero que entiendas este galimatías, porque yo no...</p>`
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
                <p>Sin embargo, no tengo ni idea de qué significa eso...</p>`
        },
        tutorial_message_controls_1: {
            fr: `<p>L'article dans lequel j'ai lu tout ça expliquait aussi que <b>la souris</b> permettait de viser, de tirer avec le <b>bouton gauche</b>, et de recharger avec le <b>bouton droit</b>.</p>
                <p>Il expliquait également que la touche <b>P</b> permettait de mettre en pause et d'afficher les paramètres, et qu'il était possible de choisir ton type de clavier, dans ces paramètres.</p>`,
            en: `<p>The article I read all this in also explained that <b>the mouse</b> allowed you to aim, shoot with the <b>left button</b>, and reload with the <b>right button</b>.</p>
                <p>It also explained that the <b>P</b> key was used to pause and display settings.</p>
                <p>...and that it was possible to choose your keyboard type in these settings.</p>`,
            es: `<p>El artículo donde leí todo esto también explicaba que <b>el ratón</b> permitía apuntar, disparar con el <b>botón izquierdo</b>, y recargar con el <b>botón derecho</b>.</p>
                <p>También explicaba que la tecla <b>P</b> permitía pausar y mostrar la configuración, y que se podía elegir el tipo de teclado en esa configuración</p>`
        },
        tutorial_message_controls_2: {
            fr: `<p>Si je me rappelle bien, il y était également fait mention de la possibilité de brancher une <b>manette de jeu</b>, puis de se <b>laisser guider</b>.</p>
                <p>J'espère que tu comprends ce charabia, parce que moi non...</p>`,
            en: `<p>If I remember well, it also mentioned the possibility to connect a <b>gamepad</b> and then <b>follow the instructions</b>.</p>
                <p>I hope you understand this gibberish, because I don't...</p>`,
            es: `<p>Si no recuerdo mal, también mencionaba la posibilidad de conectar un <b>mando</b> y luego <b>seguir las instrucciones</b>.</p>
                <p>Espero que entiendas este galimatías, porque yo no...</p>`
        },

        tutorial_message_shop_0: {
            fr: `<p>Merci de m'avoir aidée à reprendre le contrôle de mon labo.</p>
                <p>Je te présente ton nouveau chez toi... ou plutôt, notre chez nous.</p>`,
            en: `<p>Thank you for helping me regain control of my lab.</p>
                <p>Here's your new home... or rather, our home.</p>`,
            es: `<p>Gracias por ayudarme a recuperar el control de mi laboratorio.</p>
                <p>Me gustaría presentarles su nuevo hogar... o mejor dicho, nuestro hogar.</p>`
        },
        tutorial_message_shop_money_0: {
            fr: `<p>Ici tu trouveras de quoi te retaurer, entre deux sorties. Mais ce n'est pas gratuit, hein...</p>
                <p>Et comme promis, je pourrai améliorer ton équipement, si tu me ramène de quoi travailler.</p>`,
            en: `<p>Here you'll find something to eat between outings. But it's not free, eh...</p>
                <p>And as promised, I can upgrade your gear if you bring me something to work with.</p>`,
            es: `<p>Aquí encontrarás algo para comer entre salidas. Pero no es gratis, ¿eh?</p>
                <p>Y como prometí, puedo mejorar tu equipo si me traes algo con lo que trabajar.</p>`
        },
        tutorial_message_shop_money_1: {
            fr: `<p>J'avais bricolé un système de téléportation d'urgence permettant de revenir ici instantanément en cas de problème.</p>
                <p>Je me demande s'il fonctionne toujours...</p>`,
            en: `<p>I had tinkered with an emergency teleportation system that would allow me to return here instantly in case of trouble.</p>
                <p>I wonder if it still works...</p>`,
            es: `<p>Experimenté con un sistema de teletransportación de emergencia que me permitiría regresar aquí al instante en caso de problemas.</p>
                <p>Me pregunto si aún funciona...</p>`
        },
        tutorial_message_shop_money_2: {
            fr: `<p>Par chance, il semble encore en état de marche. Je vais te raccorder au système de contrôle, et paramétrer la machine pour qu'elle te ramène automatiquement, en cas de problème.</p>
                <p>Compte sur moi pour te soigner dans la limite de ce que j'aurai sous la main, si ça devait se produire.</p>`,
            en: `<p>Luckily, it still seems to be in working order. I'll hook you up to the control system and set the machine to automatically bring you back if anything goes wrong.</p>
                <p>Count on me to heal you in my (ou rather, your) ressources limits, should that happen.</p>`,
            es: `<p>Por suerte, parece que todavía funciona. Te conectaré al sistema de control y configuraré la máquina para que te traiga de vuelta automáticamente si algo sale mal.</p>
                <p>Puedes contar conmigo para tratarte lo mejor posible, si eso sucede.</p>`
        },

        tutorial_message_shop_taining_0: {
            fr: "<p>Ici, c'est la salle d'entrainement.</p><p>Tu peux y développer tes compétences physiques.</p>",
            en: "<p>This is the training room.</p><p>You can develop your physical skills here.</p>",
            es: "<p>Esta es la sala de entrenamiento.</p><p>Aquí puedes desarrollar tus habilidades físicas.</p>"
        },
        tutorial_message_shop_taining_1: {
            fr: `<p>J'ai lu dans un livre sur le sujet, qu'il était nécessaire de s'entrainer concrètement en amont, pour que l'entrainement en salle soit efficace.</p>
                <p>D'après ce livre, tuer des monstres permet de <b>gagner de l'expérience</b>, qui permet ensuite de <b>gagner des niveaux</b>.</p>`,
            en: `<p>I read in a book that it was necessary to train concretely beforehand, for the training in the room to be effective.</p>
                <p>According to this book, killing monsters allows you to <b>gain experience</b>, which then allows you to <b>gain levels</b>.</p>`,
            es: `<p>Leí en un libro sobre el tema que era necesario practicar concretamente de antemano para que el entrenamiento en el gimnasio fuera efectivo.</p>
                <p>Según este libro, matar monstruos permite <b>ganar experiencia</b>, lo que a su vez permite <b>subir de nivel</b>.</p>`
        },
        tutorial_message_shop_taining_2: {
            fr: `<p>Chaque nouveau niveau, te permet d'obtenir des <b>points de compétences</b> utilisables ici pour améliorer tes caractéristiques.</p>
                <p>D'ailleurs, j'ai l'impression que tu es mûr pour utiliser la salle, après ce premier combat.</p>`,
            en: `<p>Each new level allows you to obtain <b>skill points</b> that can be used here to improve your characteristics.</p>
                <p>Besides, it sounds like you're ready to use the room, after this first fight.</p>`,
            es: `<p>Cada nuevo nivel te permite obtener <b>puntos de habilidad</b> que puedes usar para mejorar tus estadísticas.</p>
                <p>Además, me da la impresión de que estás listo para usar la sala después de esta primera pelea.</p>`
        },
        tutorial_message_shop_taining_3: {
            fr: "<p>Voilà, tu sais tout. Je te laisse. À très vite.</p>",
            en: "<p>There you have it, I told you everything I know. See you soon.</p>",
            es: "<p>Ahí lo tienen, ya lo saben todo. Los dejo. Nos vemos pronto.</p>"
        },

        tutorial_voracious_title: {
            fr: "Présentation du <b>Vorace</b>",
            en: "Introducing <b>Voracious</b>",
            es: "Presentando al <b>Voraz</b>"
        },
        tutorial_voracious_message: {
            fr: `<p>Ces zombie sont appelés des <i>Voraces</i>.</p> 
                <p>Ils ne feront que te foncer dessus, alors tant que tu gardes tes distances, tout devrait bien se passer.</p>`,
            en: `<p>These zombies are called <i>Voracious</i>.</p> 
                <p>They'll just charge at you, so as long as you keep your distance, you should be fine.</p>`,
            es: `<p>Estos zombis se llaman <i>Voraces</i>.</p> 
                <p>Simplemente te atacarán, así que mientras mantengas la distancia, no deberías tener problemas.</p>`
        },

        tutorial_spitter_title: {
            fr: "Présentation du <b>Cracheur</b>",
            en: "Introducing <b>Spitter</b>",
            es: "Presentando al <b>Escupedor</b>"
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
                <p>Me pregunto si puedes hacer que disparen a otros zombis colocándote estratégicamente.</p>`
        },

        tutorial_tackler_title: {
            fr: "Présentation du <b>Tacleur</b>",
            en: "Introducing <b>Tackler</b>",
            es: "Presentando al <b>Placador</b>"
        },
        tutorial_tackler_message: {
            fr: `<p>Fais très attention à ces <i>Tackleurs</i> !</p>
                <p>Ils sont incroyablement rapides, et te fonceront dessus d'un coup, lorsqu'ils se seront suffisamment approchés.</p>`,
            en: `<p>Be very careful of those <i>Tacklers</i> !</p>
                <p>They're incredibly fast, and will charge you in one go when they get close enough.</p>`,
            es: `<p>¡Ten mucho cuidado con esos <i>Placadores</i>!</p>
                <p>Son increíblemente rápidos y te atacarán de una sola vez cuando se acerquen lo suficiente.</p>`
        },

        tutorial_golgoth_title: {
            fr: "Présentation du <b>Golgoth</b>",
            en: "Introducing <b>Golgoth</b>",
            es: "Presentando al <b>Gólgota</b>"
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
                <p>Tardan un poco en lanzarlos en línea recta, pero sus lanzamientos en arco son instantáneos e infligen un gran daño en un área extensa.</p>`
        },

        wave_report_title: {
            fr: "La bataille est terminée...",
            en: "The battle is over...",
            es: "La batalla ha terminado..."
        },
        wave_report_victory_0: {
            fr: "Bravo !<br/>Tu as encore fait de l'excellent travail.<br/>Continue comme ça.",
            en: "Well done!<br/>You did an excellent job again.<br/>Keep it up.",
            es: "¡Bien hecho!<br/>Hiciste un excelente trabajo nuevamente.<br/>Sigue así."
        },
        wave_report_victory_1: {
            fr: "Ces monstres n'avaient aucune chance face à toi.",
            en: "Those monsters didn't stand a chance against you.",
            es: "Esos monstruos no tuvieron ninguna oportunidad contra ti."
        },
        wave_report_victory_2: {
            fr: "Voilà qui est fait.<br/>Rien de tel qu'un peu de ménage pour y voir clair.",
            en: "That's it.<br/>Nothing like a little cleaning to clear things up.",
            es: "Eso es todo.<br/>No hay nada como un poco de limpieza para aclarar las cosas."
        },
        wave_report_victory_3: {
            fr: "Exterminer ces brutes sanguinaires semble facile, quand on te voit faire.",
            en: "Exterminating these bloodthirsty brutes seems easy when you see you do it.",
            es: "Exterminar a estas bestias sedientas de sangre parece fácil cuando lo ves."
        },
        wave_report_defeat_0: {
            fr: "Ils étaient trop forts pour toi.<br/>Je vais t'aider à reprendre des forces.",
            en: "They were too strong for you.<br/>I will help you regain your strength.",
            es: "Eran demasiado fuertes para ti.<br/>Te ayudaré a recuperar tu fuerza."
        },
        wave_report_defeat_1: {
            fr: "J'espère que tu vas survivre à tes blessures...<br/>...mais si tu ne survis pas, c'est pas de ma faute !",
            en: "I hope you survive your injuries...<br/>...but if you don't, it's not my fault !",
            es: "Espero que sobrevivas a tus heridas...<br/>...pero si no, ¡no es mi culpa!"
        },
        wave_report_defeat_2: {
            fr: "Ma foi, ça à l'air douloureux...",
            en: "Well, that looks painful...",
            es: "Bueno, eso parece doloroso..."
        },
        wave_report_defeat_3: {
            fr: "À mon tour de me rendre utile...<br/>Tu as mal quand j'appuies là ?<br/>Aïe ! Me tapes pas, j'essaies de t'aider !",
            en: "My turn to be useful...<br/>Does it hurt when I press there ?<br/>Ouch ! Don't hit me, I'm trying to help you !",
            es: "Me toca ser útil...<br/>¿Te duele cuando presiono ahí?<br/>¡Ay! ¡No me golpees, intento ayudarte!"
        },

        params_title: {
            fr: "Paramètres utilisateur",
            en: "User settings",
            es: "Configuración de usuario"
        },
        params_language_lbl: {
            fr: "<b>Langue:</b>",
            en: "<b>Language:</b>",
            es: "<b>Idioma:</b>"
        },
        params_music_on_lbl: {
            fr: "<b>Musique:</b>",
            en: "<b>Music:</b>",
            es: "<b>Música:</b>"
        },
        params_music_volume_lbl: {
            fr: "<b>Volume musique:</b>",
            en: "<b>Music volume:</b>",
            es: "<b>Volumen de música:</b>"
        },
        params_sound_fx_on_lbl: {
            fr: "<b>Effets sonores:</b>",
            en: "<b>Sound FX:</b>",
            es: "<b>Efectos sonoros:</b>"
        },
        params_sound_fx_volume_lbl: {
            fr: "<b>Volume effets sonores:</b>",
            en: "<b>Sound FX volume:</b>",
            es: "<b>Volumen de efectos sonoros:</b>"
        },
        params_keyboard_type_lbl: {
            fr: "<b>Type de clavier:</b>",
            en: "<b>Keyboard type:</b>",
            es: "<b>Tipo de teclado:</b>"
        },
        params_show_hitboxes_lbl: {
            fr: "<b>Afficher les hitbox:</b>",
            en: "<b>Display hitboxes:</b>",
            es: "<b>Mostrar cajas de impacto:</b>"
        },
        params_gamepad_config: {
            fr: "Paramétrer la manette",
            en: "Gamepad configuration",
            es: "Configurar el mando"
        },

        shop_title: {
            fr: "Pense à faire le plein, avant d'y retourner",
            en: "Remember to fill up before going back",
            es: "Recuerda equiparte antes de volver allí"
        },
        shop_money_button: {
            fr: "Ravitaillement",
            en: "Gear",
            es: "Equipo"
        },
        shop_knowledge_button: {
            fr: "Salle d'entrainement",
            en: "Training room",
            es: "Sala de entrenamiento"
        },
        shop_heal_maxed: {
            fr: "Santé déjà au maximum",
            en: "Health still maxed",
            es: "Salud ya al máximo"
        },
        shop_heal_desc: {
            fr: "Rend %value% points de vie",
            en: "Recovers %value% health points",
            es: "Restaura %value% puntos de vida"
        },
        shop_heal_name_0: {
            fr: "Verre d'eau",
            en: "Glass of water",
            es: "Vaso de agua"
        },
        shop_heal_name_1: {
            fr: "Repas chaud",
            en: "Hot meal",
            es: "Comida caliente"
        },
        shop_item_maxed: {
            fr: "Niveau maximal atteint",
            en: "Max level reached",
            es: "Nivel máximo alcanzado"
        },
        shop_item_price: {
            fr: "<b>Prix:</b> %value%",
            en: "<b>Cost:</b> %value%",
            es: "<b>Precio:</b> %value%"
        },
        shop_item_name_DET: {
            fr: "Détecteur de métaux",
            en: "Metal detector",
            es: "Detector de metales"
        },
        shop_item_desc_DET: {
            fr: "Cet équipement te permettra de récupérer plus de pièces sur les monstres",
            en: "This gear will allow you to collect more coins from monsters",
            es: "Este equipo te permitirá recolectar más monedas de los monstruos"
        },
        shop_item_effect_DET: {
            fr: '<b>Argent supplémentaire maximum par monstre:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Maximum extra money per monster:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Dinero adicional máximo por monstruo:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_CHC: {
            fr: "Chargeur haute capacité",
            en: "High capacity magazine",
            es: "Cargador de alta capacidad"
        },
        shop_item_desc_CHC: {
            fr: "Bricolons un peu ton arme, pour augmenter la capacité du chargeur",
            en: "Let's tinker with your gun a little, to increase the magazine capacity",
            es: "Vamos a juguetear un poco con tu arma para aumentar la capacidad del cargador"
        },
        shop_item_effect_CHC: {
            fr: '<b>Capacité du chargeur:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Magazine capacity:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Capacidad del cargador:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_RAT: {
            fr: "Déluge de balles",
            en: "Bullets' rain",
            es: "Diluvio de balas"
        },
        shop_item_desc_RAT: {
            fr: "Réduit le recul de l'arme, pour faciliter la visée entre deux coups de feu",
            en: "Reduces weapon recoil, making it easier to aim between shots",
            es: "Reduce el retroceso del arma, lo que hace que sea más fácil apuntar entre disparos"
        },
        shop_item_effect_RAT: {
            fr: '<b>Temps entre deux coups (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Delay between shots (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Tiempo entre disparos (ms):</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_RAT_maxed: {
            fr: '<b>Temps entre deux coups (ms):</b> <span class="present-effect">%value%</span>',
            en: '<b>Delay between shots (ms):</b> <span class="present-effect">%value%</span>',
            es: '<b>Tiempo entre disparos (ms):</b> <span class="present-effect">%value%</span>'
        },
        shop_item_name_POW: {
            fr: "Puissance de feu",
            en: "Firepower",
            es: "Potencia de disparo"
        },
        shop_item_desc_POW: {
            fr: "Modifie l'arme, afin d'en améliorer la puissance de feu",
            en: "Modifies the weapon to improve its firepower",
            es: "Modifica el arma para mejorar su potencia de disparo"
        },
        shop_item_effect_POW: {
            fr: '<b>Dégats par tir:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Damage per shot:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Daño por disparo:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_CON: {
            fr: "Constitution",
            en: "Constitution",
            es: "Constitución"
        },
        shop_item_desc_CON: {
            fr: "Permet de mieux encaisser les coups",
            en: "Allows you to better absorb hits",
            es: "Permite absorber mejor los golpes"
        },
        shop_item_effect_CON: {
            fr: '<b>Santé maximale:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Maximum health:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Máxima salud:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_name_AGI: {
            fr: "Agilité",
            en: "Agility",
            es: "Agilidad"
        },
        shop_item_desc_AGI: {
            fr: "Permet de courir plus vite",
            en: "Allows you to run faster",
            es: "Te permite correr más rápido"
        },
        shop_item_effect_AGI: {
            fr: '<b>Vitesse de déplacement:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Movement speed:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Velocidad de movimiento:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_AGI_maxed: {
            fr: '<b>Vitesse de déplacement:</b> <span class="present-effect">%value%</span>',
            en: '<b>Movement speed:</b> <span class="present-effect">%value%</span>',
            es: '<b>Velocidad de movimiento:</b> <span class="present-effect">%value%</span>'
        },
        shop_item_name_RLD: {
            fr: "Rechargement rapide",
            en: "Fast reload",
            es: "Recarga rapida"
        },
        shop_item_desc_RLD: {
            fr: "Permet de changer plus rapidement de chargeur",
            en: "Allows faster magazine changes",
            es: "Permite cambios de cargador más rápidos"
        },
        shop_item_effect_RLD: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_RLD_maxed: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span>'
        },
        shop_item_name_DAR: {
            fr: "Récupération rapide",
            en: "Fast recovery",
            es: "Rápida recuperación"
        },
        shop_item_desc_DAR: {
            fr: "Permet de récupérer plus vite d'une esquive",
            en: "Allows you to recover faster from dashing",
            es: "Te permite recuperarte más rápido después de esquivar"
        },
        shop_item_effect_DAR: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span> >> <span class="increased-effect">%value%</span>'
        },
        shop_item_effect_DAR_maxed: {
            fr: '<b>Temps de rechargement:</b> <span class="present-effect">%value%</span>',
            en: '<b>Reload time:</b> <span class="present-effect">%value%</span>',
            es: '<b>Tiempo de recarga:</b> <span class="present-effect">%value%</span>'
        }
    }
}