class TutorialHelper {

    static showIntro() {
        if (MainController.scope.game.wave_number > 1) 
            return MainController.startWave();

        JuiceHelper.startShopMusic();

        const controls_sequence = TutorialHelper.__controlsSequence();
        TutorialHelper.__popupsSequence(
            [{
                message_lines: ["Hey, salut toi !!", 
                                "C'est cool de croiser quelqu'un, ici."],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["Quand j'y pense, il y avait bien longtemps que je n'avais croisé personne..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Peu importe...", 
                                "Au fait, moi c'est Julie Péhainegis.", 
                                "Et toi, comment tu t'appelles ?"],
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
            }, ...controls_sequence, {
                message_lines: ["Assez parlé !",
                                "Explose-moi ces abominations !"],
                face: FRIEND_FACES.angry
            }], ()=> {
                JuiceHelper.stopShopMusic();
                MainController.startWave();
            }
        );
    }

    static showShopTutorial() {
        if (MainController.scope.game.wave_number > 2)
            return;

        TutorialHelper.__popupsSequence(
            [{
                message_lines: ["Merci de m'avoir aidée à reprendre le contrôle de mon labo.", 
                                "Je te présente ton nouveau chez toi... ou plutôt, notre chez nous."],
                face: FRIEND_FACES.happy
            }], ()=> {
                setTimeout( TutorialHelper.__showMoneyShopTutorial, 1500 );
            }
        );
    }

    static showMonsterTutorial() {
        const bestiary = MainController.wave_generator.bestiary;
        MainController.scope.controls.paused = true;

        for (const key in bestiary) {
            const monster_type = bestiary[key];

            if (monster_type.appear_from_wave === MainController.scope.game.wave_number) {
                switch (key) {
                    case "voracious":
                        TutorialHelper.__popupsSequence(
                            [{
                                message_lines: ["Ces zombie sont appelés des <i>Voraces</i>.", 
                                                "Ils ne feront que te foncer dessus, alors tant que tu gardes tes distances, tout devrait bien se passer."],
                                face: FRIEND_FACES.happy
                            }], ()=> { MainController.scope.controls.paused = false; }
                        );
                        return;

                    case "spitter":
                        TutorialHelper.__popupsSequence(
                            [{
                                message_lines: ["Ces zombies miniatures sont des <i>Cracheurs</i>.", 
                                                "Méfie-toi d'eux. Non seulement ils attaquent à distance, mais il laissent s'échapper un nuage toxique en mourant."],
                                face: FRIEND_FACES.angry
                            }, {
                                message_lines: ["Je me demande si tu ne peux pas les amener à tirer sur les autres zombies, en te plaçant stratégiquement."],
                                face: FRIEND_FACES.worried
                            }], ()=> { MainController.scope.controls.paused = false; }
                        );
                        return;

                    case "tackler":
                        TutorialHelper.__popupsSequence(
                            [{
                                message_lines: ["Fais très attention à ces <i>Tacleurs</i> !", 
                                                "Ils sont incroyablement rapides, et te fonceront dessus d'un coup, lorsqu'ils se seront suffisamment approchés."],
                                face: FRIEND_FACES.worried
                            }], ()=> { MainController.scope.controls.paused = false; }
                        );
                        return;

                    case "golgoth":
                        TutorialHelper.__popupsSequence(
                            [{
                                message_lines: ["Oh non ! Un <i>Golgoth</i> !", 
                                                "Ces abominations sont très lentes, mais aussi incroyablement fortes et résistantes."],
                                face: FRIEND_FACES.disappointed
                            }, {
                                message_lines: ["J'ai même entendu dire qu'il leur arrivait d'utiliser d'autres zombies comme projectiles.", 
                                                "Si le zombie ainsi projeté survit au vol plané, il sera dangereusement proche de toi."],
                                face: FRIEND_FACES.worried
                            }], ()=> { MainController.scope.controls.paused = false; }
                        );
                        return;
                }
            }
        }

        MainController.scope.controls.paused = false;
    }

    static __controlsSequence() {
        if ( Tools.isMediaStadalone() ) { // permet de savoir si l'utilisateur est sur mobile ou sur PC
            return [{
                message_lines: ["Au fait, au cas où ça pourrait t'aider, j'ai lu quelque part que le <b>joysitck virtuel</b>, à gauche, permettait de se déplacer, tandis que les <b>boutons à droite</b> permettaient d'effectuer diverses actions : ",
                                "Par exemple, celui affichant une <b>cible</b> permettrait de <b>tirer sur le monstre le plus proche</b>.",
                                "Par contre, je n'ai aucune idée de ce que ça signifie..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["En outre, l'ouvrage faisait également référence à un bouton affichant un <b>personnage élancé</b> et permettant d'effectuer une <b>maneuvre d'esquive</b>.",
                                "Il y était aussi question d'un autre bouton, situé juste en-dessous pour <b>recharger l'arme</b>, et d'un bouton <b>pause</b> permettant d'accéder aux paramètres.",
                                "J'espère que tu comprends ce charabia, parce que moi non..."],
                face: FRIEND_FACES.worried
            }];
        } else {
            return [{
                message_lines: ["Au fait, au cas où ça pourrait t'aider, j'ai lu quelque part qu'il était possible de se déplacer avec les touches <b>Z</b>, <b>Q</b>, <b>S</b> et <b>D</b> du clavier.",
                                "Il parraît même que la <b>barre espace</b> permet d'effectuer un bond d'esquive en avant.", 
                                "Par contre, je n'ai aucune idée de ce que ça signifie..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["L'article dans lequel j'ai lu tout ça expliquait aussi que <b>la souris</b> permettait de viser, de tirer avec le <b>bouton gauche</b>, et de recharger avec le <b>bouton droit</b>.",
                                "Il expliquait également que la touche <b>P</b> permettait de mettre en pause et d'afficher les paramètres."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Si je me rappelle bien, il y était également fait mention de la possibilité de brancher une <b>manette de jeu</b>, puis de se <b>laisser guider</b>.",
                                "J'espère que tu comprends ce charabia, parce que moi non..."],
                face: FRIEND_FACES.worried
            }];
        }
    }

    static __showMoneyShopTutorial() {
        TutorialHelper.__popupsSequence(
            [{
                message_lines: ["Ici tu trouveras de quoi te retaurer, entre deux sorties. Mais ce n'est pas gratuit, hein...", 
                                "Et comme promis, je pourrai améliorer ton équipement, si tu me ramène de quoi travailler."],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["J'avais bricolé un système de téléportation d'urgence permettant de revenir ici instantanément en cas de problème.", 
                                "Je me demande s'il fonctionne toujours..."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Par chance, il semble encore en état de marche. Je vais te raccorder au système de contrôle, et paramétrer la machine pour qu'elle te ramène automatiquement, en cas de problème.",
                                "Compte sur moi pour te soigner dans la limite de ce que j'aurai sous la main, si ça devait se produire."],
                face: FRIEND_FACES.happy
            }], ()=> {
                MainController.popups_stack.activePopup().switchToTrainingRoom();
                setTimeout( TutorialHelper.__showTrainingRoomTutorial, 1500 );
            }
        );
    }

    static __showTrainingRoomTutorial() {
        TutorialHelper.__popupsSequence(
            [{
                message_lines: ["Ici, c'est la salle d'entrainement.", 
                                "Tu peux y développer tes compétences physiques."],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["J'ai lu dans un livre sur le sujet, qu'il était nécessaire de s'entrainer concrètement en amont, pour que l'entrainement en salle soit efficace.",
                                "D'après ce livre, tuer des monstres permet de <b>gagner de l'expérience</b>, qui permet ensuite de <b>gagner des niveaux</b>."],
                face: FRIEND_FACES.worried
            }, {
                message_lines: ["Chaque nouveau niveau, te permet d'obtenir des <b>points de compétences</b> utilisables ici pour améliorer tes caractéristiques.", 
                                "D'ailleurs, j'ai l'impression que tu es mûr pour utiliser la salle, après ce premier combat."],
                face: FRIEND_FACES.happy
            }, {
                message_lines: ["Voilà, tu sais tout. Je te laisse. À très vite."],
                face: FRIEND_FACES.happy
            }], ()=> {}
        );
    }

    static __popupsSequence(dialogs, fn_on_sequence_end) {
        const next_dialog = dialogs.shift();
        const message = TutorialHelper.__fromMessageLines(next_dialog.message_lines);
        TutorialHelper.__showPopup(message, next_dialog.face, ()=> {
            if (dialogs.length > 0)
                TutorialHelper.__popupsSequence(dialogs, fn_on_sequence_end);
            else fn_on_sequence_end();
        })
    }

    static __fromMessageLines(message_lines) {
        let html_message = "";
        for (let line of message_lines)
            html_message += `<p>${line}</p>`;
        return html_message;
    }

    static __showPopup(message, friend_face_url, fn_on_close) {
		MainController.report_popup = new RS_Dialog("report_dialog", "Introduction", [], [], [], false, "tpl_report.html", function() {
            MainController.report_popup.root_element.querySelector("#friend-face").src = friend_face_url; 
            const message_container = MainController.report_popup.root_element.querySelector("#message");
            message_container.innerHTML = message;
            message_container.classList.add("tutorial");

            const close_button = MainController.report_popup.root_element.querySelector("#btn_close");
            close_button.value = "Suite...";
			close_button.addEventListener("click", function() {
                MainController.report_popup.closeModal();
                MainController.report_popup = null;
                fn_on_close();
			});
		});
		document.body.appendChild(MainController.report_popup.root_element);
	}
}