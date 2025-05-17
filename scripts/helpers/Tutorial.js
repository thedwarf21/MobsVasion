class TutorialHelper {

    static showIntro() {
        if (MainController.scope.game.wave_number > 1) 
            return MainController.startForReal();

        JuiceHelper.startShopMusic();

        TutorialHelper.popupsSequence(
            [{
                message_lines: ["Hey, salut toi !!", 
                                "C'est cool de croiser de quelqu'un, ici."],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["Quand j'y pense, il y a bien longtemps que je n'ai croisé personne..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Peu importe...", 
                                "Au fait, moi c'est Julie Péhainegis.", 
                                "Et toi, comment tu t'appeles ?"],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["... chelou comme nom.", 
                                "Bref. Passons."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Comme tu le sais peut-être, la plupart des gens se sont transformés en zombies...", 
                                "Et avant que tu ne demandes pourquoi, je n'en ai aucune idée."],
                face: FRIEND_FACES.disappointed
            }, {
                message_lines: ["Tout ce que je sais, c'est qu'ils ont investi mon labo et l'ont entièrement saccagé.", 
                                "Je vois que t'es armé...", 
                                "Tu pourrais leur botter les fesses, s'il te plaît ?"],
                face: FRIEND_FACES.angry
            }, {
                message_lines: ["Ce que tu y gagnes ?",
                                "Sauver une demoiselle en détresse, ça suffit pas ?"],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["J'ai une idée : je pourrais t'aider.", 
                                "Tu pourras te réfugier dans mon labo, et je pourrai améliorer ton équipement.", 
                                "C'est pas pour me vanter, mais je suis un véritable génie."],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["Au fait, au cas où ça pourrait t'aider, j'ai lu quelque part qu'il était possible de se déplacer avec les touches <b>Z</b>, <b>Q</b>, <b>S</b> et <b>D</b> du clavier.",
                                "Il parraît même que la <b>barre espace</b> permet d'effectuer un bond d'esquive en avant.", 
                                "Par contre, je n'ai aucune idée de ce que ça signifie..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["L'article dans lequel j'ai lu tout ça expliquait aussi que la souris permettait de viser, de tirer avec le <b>bouton gauche</b>, et de recharger avec le <b>bouton droit</b>."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Si je me rappelle bien, il y était également fait mention de la possibilité de brancher une <b>manette de jeu</b>, puis de se <b>laisser guider</b>.",
                                "J'espère que tu comprends ce charabia, parce que moi non..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Assez parlé !",
                                "Explose-moi ces abominations !"],
                face: FRIEND_FACES.angry
            }], ()=> {
                JuiceHelper.stopShopMusic();
                MainController.startForReal();
            }
        );
    }

    static popupsSequence(dialogs, fn_on_sequence_end) {
        const next_dialog = dialogs.shift();
        const message = TutorialHelper.fromMessageLines(next_dialog.message_lines);
        TutorialHelper.showPopup(message, next_dialog.face, ()=> {
            if (dialogs.length > 0)
                TutorialHelper.popupsSequence(dialogs, fn_on_sequence_end);
            else fn_on_sequence_end();
        })
    }

    static fromMessageLines(message_lines) {
        let html_message = "";
        for (let line of message_lines)
            html_message += `<p>${line}</p>`;
        return html_message;
    }

    static showPopup(message, friend_face_url, fn_on_close) {
		MainController.report_popup = new RS_Dialog("report_dialog", "Introduction", [], [], [], false, "tpl_report.html", function() {
            MainController.report_popup.root_element.querySelector("#friend-face").src = friend_face_url; 
            const message_container = MainController.report_popup.root_element.querySelector("#message");
            message_container.innerHTML = message;
            message_container.classList.add("tutorial");

			MainController.report_popup.root_element.querySelector("#btn_close").addEventListener("click", function() {
                MainController.report_popup.closeModal();
                MainController.report_popup = null;
                fn_on_close();
			});
		});
		document.body.appendChild(MainController.report_popup.root_element);
	}

    static close() {
        MainController.report_popup.closeModal();
        MainController.report_popup = null;
        MainController.popups_stack.push(ShopPopup);
    }
}