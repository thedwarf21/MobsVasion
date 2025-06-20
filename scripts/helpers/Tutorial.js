class TutorialHelper {

    static showIntro() {
        if (MainController.scope.game.wave_number > 1) 
            return MainController.startWave();

        JuiceHelper.startShopMusic();

        const controls_sequence = TutorialHelper.#controlsSequence();
        TutorialHelper.#popupsSequence(
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

        TutorialHelper.#popupsSequence(
            [{
                message_key: "tutorial_message_shop_0",
                face: FRIEND_FACES.happy
            }], ()=> {
                setTimeout( TutorialHelper.#showMoneyShopTutorial, 1500 );
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
                    case "voracious":   return TutorialHelper.#showVoraciousTuto();
                    case "spitter":     return TutorialHelper.#showSpitterTuto();
                    case "tackler":     return TutorialHelper.#showTacklerTuto();
                    case "golgoth":     return TutorialHelper.#showGolgothTuto();
                }
            }
        }
        MainController.scope.controls.paused = false;
    }

    static #controlsSequence() {
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

    static #showMoneyShopTutorial() {
        TutorialHelper.#popupsSequence(
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

                const shop_popup_manager = MainController.popups_stack.activePopup();
                if (MainController.timer.gamepad_mapper) {
                    shop_popup_manager.navigateRight();
                } else shop_popup_manager.switchToTrainingRoom();
                
                setTimeout( TutorialHelper.#showTrainingRoomTutorial, 1500 );
            }
        );
    }

    static #showTrainingRoomTutorial() {
        TutorialHelper.#popupsSequence(
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

    static #popupsSequence(dialogs, fn_on_sequence_end) {
        if (MainController.scope.game.skip_tutorial)
            return fn_on_sequence_end();

        const next_dialog = dialogs.shift();
        TutorialHelper.#showPopup(next_dialog.message_key, next_dialog.face, ()=> {
            if (dialogs.length > 0)
                TutorialHelper.#popupsSequence(dialogs, fn_on_sequence_end);
            else fn_on_sequence_end();
        })
    }

    static #showPopup(message, friend_face_url, fn_on_close) {
		MainController.popups_stack.push(TutorialPopup, {
            friend_face_url: friend_face_url,
            message: message,
            on_close: fn_on_close
        });
	}

    static #showVoraciousTuto() {
        MainController.popups_stack.push(MonsterTutoPopup, {
            title_key: "tutorial_voracious_title",
            monster_class: MV_MonsterVoracious,
            message: "tutorial_voracious_message"
        });
	}

    static #showSpitterTuto() {
        MainController.popups_stack.push(MonsterTutoPopup, {
            title_key: "tutorial_spitter_title",
            monster_class: MV_MonsterSpitter,
            attack: {
                prepareSound: JuiceHelper.prepareSpitting,
                sound: JuiceHelper.spit,
                duration: 1000,
                interval: 1500
            },
            special_element: TutorialHelper.#getSpitterSpecial(),
            message: "tutorial_spitter_message"
        });
	}

    static #getSpitterSpecial() {
        const toxic_cloud = document.createElement("DIV");
        toxic_cloud.classList.add("toxic-cloud");
        toxic_cloud.style.position = "unset";
        toxic_cloud.style.width = MainController.viewport.getCssValue(100);
        toxic_cloud.style.height = MainController.viewport.getCssValue(100);
        return toxic_cloud;
    }

    static #showTacklerTuto() {
        MainController.popups_stack.push(MonsterTutoPopup, {
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

    static #showGolgothTuto() {
        MainController.popups_stack.push(MonsterTutoPopup, {
            title_key: "tutorial_golgoth_title",
            monster_class: MV_MonsterGolgoth,
            attack: {
                prepareSound: JuiceHelper.prepareThrowing,
                sound: JuiceHelper.throw,
                duration: 600,
                interval: 2000
            },
            special_element: TutorialHelper.#getGolgothSpecial(),
            message: "tutorial_golgoth_message"
        });
	}

    static #getGolgothSpecial() {
        const aoe = document.createElement("DIV");
        aoe.classList.add("bell-throw-aoe");
        aoe.style.position = "unset";
        aoe.style.width = MainController.viewport.getCssValue(270);
        aoe.style.height = MainController.viewport.getCssValue(270);
        return aoe;
    }
}