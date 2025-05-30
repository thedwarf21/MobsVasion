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
                    case "voracious":   return TutorialHelper.__showVoraciousTuto();
                    case "spitter":     return TutorialHelper.__showSpitterTuto();
                    case "tackler":     return TutorialHelper.__showTacklerTuto();
                    case "golgoth":     return TutorialHelper.__showGolgothTuto();
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

    static __showVoraciousTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            monster_name: "Vorace",
            monster_class: MV_MonsterVoracious,
            message: `
                <p>Ces zombie sont appelés des <i>Voraces</i>.</p> 
                <p>Ils ne feront que te foncer dessus, alors tant que tu gardes tes distances, tout devrait bien se passer.</p>`
        });
	}

    static __showSpitterTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            monster_name: "Cracheur",
            monster_class: MV_MonsterSpitter,
            attack: {
                prepareSound: JuiceHelper.prepareSpitting,
                sound: JuiceHelper.spit,
                duration: 1000,
                interval: 1500
            },
            special_element: TutorialHelper.__getSpitterSpecial(),
            message: `
                <p>Ces zombies miniatures sont des <i>Cracheurs</i>.</p> 
                <p>Méfie-toi d'eux. Non seulement ils attaquent à distance, mais il laissent s'échapper un nuage toxique en mourant.</p>
                <p>Je me demande si tu ne peux pas les amener à tirer sur les autres zombies, en te plaçant stratégiquement.</p>`
        });
	}

    static __getSpitterSpecial() {
        const toxic_cloud = document.createElement("DIV");
        toxic_cloud.classList.add("toxic-cloud");
        toxic_cloud.style.position = "unset";
        toxic_cloud.style.width = MainController.viewport.getCssValue(100);
        toxic_cloud.style.height = MainController.viewport.getCssValue(100);
        return toxic_cloud;
    }

    static __showTacklerTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            monster_name: "Tackleur",
            monster_class: MV_MonsterTackler,
            attack: {
                prepareSound: JuiceHelper.prepareTackling,
                sound: JuiceHelper.tackle,
                duration: 800,
                interval: 1300
            },
            message: `
                <p>Fais très attention à ces <i>Tackleurs</i> !</p>
                <p>Ils sont incroyablement rapides, et te fonceront dessus d'un coup, lorsqu'ils se seront suffisamment approchés.</p>`
        });
	}

    static __showGolgothTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            monster_name: "Golgoth",
            monster_class: MV_MonsterGolgoth,
            attack: {
                prepareSound: JuiceHelper.prepareThrowing,
                sound: JuiceHelper.throw,
                duration: 600,
                interval: 2000
            },
            special_element: TutorialHelper.__getGolgothSpecial(),
            message: `
                <p>Les <i>Golgoths</i> sont très lents, mais aussi incroyablement forts et résistants.</p>
                <p>J'ai même entendu dire qu'il leur arrivait d'utiliser d'autres zombies comme projectiles.</p>
                <p>Ils mettent du temps à lancer en ligne droite, mais leurs lancers en cloche sont instantanés et occasionnent de lourds dégâts sur une large zone.</p>`
        });
	}

    static __getGolgothSpecial() {
        const aoe = document.createElement("DIV");
        aoe.classList.add("bell-throw-aoe");
        aoe.style.position = "unset";
        aoe.style.width = MainController.viewport.getCssValue(270);
        aoe.style.height = MainController.viewport.getCssValue(270);
        return aoe;
    }

    static __showSpecificMonsterTuto(params) {
        MainController.report_popup = new RS_Dialog("report_dialog", `Présentation du <b>${params.monster_name}</b>`, [], [], [], false, "tpl_monster_tutorial.html", function() {
            const monster_viewer = MainController.report_popup.root_element.querySelector("#monster_view");
            
            let timer;
            if (params.attack) {
                const monster_attacking = new params.monster_class(MainController.viewport, 0, 0);
                monster_attacking.root_element.style.position = "unset";

                timer = setInterval(()=> {
                    params.attack.prepareSound();
                    monster_attacking.root_element.classList.add("attack-animation");
                    setTimeout(()=> {
                        params.attack.sound();
                        monster_attacking.root_element.classList.remove("attack-animation");
                    }, params.attack.duration);
                }, params.attack.interval);
                
                monster_viewer.appendChild(monster_attacking.root_element);
            } else {
                const monster = new params.monster_class(MainController.viewport, 0, 0);
                monster.root_element.style.position = "unset";
                monster_viewer.appendChild(monster.root_element);
            }
            
            if (params.special_element)
                monster_viewer.appendChild(params.special_element);

            const message_container = MainController.report_popup.root_element.querySelector("#message");
            message_container.classList.add("tutorial");
            message_container.innerHTML = params.message;

            const close_button = MainController.report_popup.root_element.querySelector("#btn_close");
            close_button.value = "Suite...";
			close_button.addEventListener("click", function() {
                if (params.special_element)
                    params.special_element.remove();

                if (params.attack)
                    clearInterval(timer);

                MainController.report_popup.closeModal();
                MainController.report_popup = null;
                MainController.scope.controls.paused = false;
			});
		});
		document.body.appendChild(MainController.report_popup.root_element);
    }
}