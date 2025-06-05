class TutorialHelper {

    static showIntro() {
        if (MainController.scope.game.wave_number > 1) 
            return MainController.startWave();

        JuiceHelper.startShopMusic();

        const controls_sequence = TutorialHelper.__controlsSequence();
        TutorialHelper.__popupsSequence(
            [{
                message_key: "tutorial_message_intro_0",
                face: FRIEND_FACES.happy
            }, {
                message_key: "tutorial_message_intro_1",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_intro_2",
                face: FRIEND_FACES.happy
            }, {
                message_key: "tutorial_message_intro_3",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_intro_4",
                face: FRIEND_FACES.disappointed
            }, {
                message_key: "tutorial_message_intro_5",
                face: FRIEND_FACES.angry
            }, {
                message_key: "tutorial_message_intro_6",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_intro_7",
                face: FRIEND_FACES.happy
            }, ...controls_sequence, {
                message_key: "tutorial_message_intro_8",
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
                message_key: "tutorial_message_shop_0",
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
                message_key: "tutorial_message_controls_mobile_0",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_controls_mobile_1",
                face: FRIEND_FACES.worried
            }];
        } else {
            return [{
                message_key: "tutorial_message_controls_0",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_controls_1",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_controls_2",
                face: FRIEND_FACES.worried
            }];
        }
    }

    static __showMoneyShopTutorial() {
        TutorialHelper.__popupsSequence(
            [{
                message_key: "tutorial_message_shop_money_0",
                face: FRIEND_FACES.happy
            }, {
                message_key: "tutorial_message_shop_money_1",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_shop_money_2",
                face: FRIEND_FACES.happy
            }], ()=> {
                if (MainController.scope.game.skip_tutorial)
                    return;

                MainController.popups_stack.activePopup().switchToTrainingRoom();
                setTimeout( TutorialHelper.__showTrainingRoomTutorial, 1500 );
            }
        );
    }

    static __showTrainingRoomTutorial() {
        TutorialHelper.__popupsSequence(
            [{
                message_key: "tutorial_message_shop_taining_0",
                face: FRIEND_FACES.happy
            }, {
                message_key: "tutorial_message_shop_taining_1",
                face: FRIEND_FACES.worried
            }, {
                message_key: "tutorial_message_shop_taining_2",
                face: FRIEND_FACES.happy
            }, {
                message_key: "tutorial_message_shop_taining_3",
                face: FRIEND_FACES.happy
            }], ()=> {}
        );
    }

    static __popupsSequence(dialogs, fn_on_sequence_end) {
        if (MainController.scope.game.skip_tutorial)
            return fn_on_sequence_end();

        const next_dialog = dialogs.shift();
        TutorialHelper.__showPopup(next_dialog.message_key, next_dialog.face, ()=> {
            if (dialogs.length > 0)
                TutorialHelper.__popupsSequence(dialogs, fn_on_sequence_end);
            else fn_on_sequence_end();
        })
    }

    static __showPopup(message, friend_face_url, fn_on_close) {
		MainController.report_popup = new RS_Dialog(MainController.language_manager, "tutorial_title", "tpl_report.html", function() {
            MainController.report_popup.root_element.querySelector("#friend-face").src = friend_face_url; 
            const message_container = MainController.report_popup.root_element.querySelector("#message");
            setTranslatedContent(MainController.language_manager, message_container, message, "innerHTML");
            message_container.classList.add("tutorial");

            const close_button = MainController.report_popup.root_element.querySelector("#btn_close");
            setTranslatedContent(MainController.language_manager, close_button, "tutorial_next", "value");
			close_button.addEventListener("click", function() {
                MainController.report_popup.closeModal();
                MainController.report_popup = null;
                fn_on_close();
			});

            TutorialHelper.__addSkipTutorialButton();
		});
		document.body.appendChild(MainController.report_popup.root_element);
	}
    
    static __addSkipTutorialButton() {
        const button = document.createElement("INPUT");
        button.setAttribute("type", "button");
        button.classList.add("modal-button");
        setTranslatedContent(MainController.language_manager, button, "tutorial_skip", "value");

        button.addEventListener("click", function() {
            RS_Confirm(MainController.language_manager, "skip_tuto_confirm", "skip_tuto_title", "skip_tuto_yes", "skip_tuto_no", function() {
                    MainController.scope.game.skip_tutorial = true;
                    MainController.report_popup.root_element.querySelector("#btn_close").dispatchEvent(new Event('click'));
                }
            );
        })

        MainController.report_popup.root_element.querySelector(".dialog-footer").prepend(button);
    }

    static __showVoraciousTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            title_key: "tutorial_voracious_title",
            monster_class: MV_MonsterVoracious,
            message: "tutorial_voracious_message"
        });
	}

    static __showSpitterTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            title_key: "tutorial_spitter_title",
            monster_class: MV_MonsterSpitter,
            attack: {
                prepareSound: JuiceHelper.prepareSpitting,
                sound: JuiceHelper.spit,
                duration: 1000,
                interval: 1500
            },
            special_element: TutorialHelper.__getSpitterSpecial(),
            message: "tutorial_spitter_message"
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
            title_key: "tutorial_tackler_title",
            monster_class: MV_MonsterTackler,
            attack: {
                prepareSound: JuiceHelper.prepareTackling,
                sound: JuiceHelper.tackle,
                duration: 800,
                interval: 1300
            },
            message: "tutorial_tackler_message"
        });
	}

    static __showGolgothTuto() {
        TutorialHelper.__showSpecificMonsterTuto({
            title_key: "tutorial_golgoth_title",
            monster_class: MV_MonsterGolgoth,
            attack: {
                prepareSound: JuiceHelper.prepareThrowing,
                sound: JuiceHelper.throw,
                duration: 600,
                interval: 2000
            },
            special_element: TutorialHelper.__getGolgothSpecial(),
            message: "tutorial_golgoth_message"
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
        MainController.report_popup = new RS_Dialog(MainController.language_manager, params.title_key, "tpl_monster_tutorial.html", function() {
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
            setTranslatedContent(MainController.language_manager, message_container, params.message, "innerHTML");

            const close_button = MainController.report_popup.root_element.querySelector("#btn_close");
            setTranslatedContent(MainController.language_manager, close_button, "tutorial_next", "value");
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