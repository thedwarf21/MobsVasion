class MV_GameInitializer {

	/*
	 * Initialisation par défaut => le scope du controller principal est initialisé avec ses attributs, au lancement du jeu
	 * 		Les données correspondant à la partie (attribut "game") sont mis à jour au fil de l'eau
	 * 		L'attribut "controls" permet au timer d'accéder rapidement à l'état des touches de contrôle
	 * 		L'attribut "shop" permet l'affichage et la gestion par le programme, du magasin d'améliorations (prix, effets)
	 * 		  il permet également de stocker le niveau d'amélioration courant, pour chacune d'entre elle
	 */
	static get initial_scope() {
		return {
			game: {
				money: 0,
				human_readable_money: "0",
				knowledge_points: 0,
				current_level_xp: 0,
				player_level: 0,
				wave_number: 1,
				save_slot: 1,
				clip_ammo: CLIP_SIZE,
				health_points: CHARACTER_MAX_LIFE,
				wave_pop: {
					timeouts: null,
					elapsed: 0
				},
				waiting_counter: {
					shot: 0,
					dash: 0,
					clip: 0
				},
				attacking_monsters: [],   	// { monster: MV_Monster, time: number }
				flying_monsters: [], 		// { monster: MV_Monster, deltaX, deltaY, deltaAngle, frames, max_scale: number, onAnimationEnd: function }
				keyboard_type: KeyTranslater.AZERTY,
				language: "fr",
				showHitboxes: false,
				skip_tutorial: false
			},
			controls: {
				upPressed: false,
				downPressed: false,
				rightPressed: false,
				leftPressed: false,
				mousePosition: {
					x: 0,
					y: 0
				},
				mouse_aiming: false,
				auto_aiming: false,
				paused: true,
				firing_primary: false,
				firing_secondary: false,
				reloading: false,
				gamepad_menu_nav: {
					left: false,
					right: false,
					up: false,
					down: false,
					validate: false,
					cancel: false
				}
			},
			gamepad_mapper: null,
			shop: [{
				name: "shop_item_name_DET",
				code: "DET",
				description: "shop_item_desc_DET",
				lbl_effect: "shop_item_effect_DET",
				level_0_effect: 0,
				upgrade_value: 0.75,
				show_multiplicator: 100,
				display_unit: "%",
				level_1_price: 20,
				level_2_price_coef : 1.75,
				current_level: 0,
				nav_id: "0_2"
			}, {
				name: "shop_item_name_CHC",
				code: "CHC",
				description: "shop_item_desc_CHC",
				lbl_effect: "shop_item_effect_CHC",
				level_0_effect: CLIP_SIZE,
				upgrade_value: 1,
				level_1_price: 30,
				level_2_price_coef : 1.5,
				current_level: 0,
				nav_id: "0_3"
			}, {
				name: "shop_item_name_RAT",
				code: "RAT",
				description: "shop_item_desc_RAT",
				lbl_effect: "shop_item_effect_RAT",
				max_level: 10,
				show_multiplicator: TIME_INTERVAL,
				level_0_effect: TIMEOUTS.shot_interval,
				upgrade_value: -1,
				level_1_price: 80,
				level_2_price_coef : 1.75,
				current_level: 0,
				nav_id: "0_4"
			}, {
				name: "shop_item_name_POW",
				code: "POW",
				description: "shop_item_desc_POW",
				lbl_effect: "shop_item_effect_POW",
				level_0_effect: 1,
				upgrade_value: 0.2,
				level_1_price: 40,
				level_2_price_coef : 1.75,
				current_level: 0,
				nav_id: "0_5"
			}, {
				name: "shop_item_name_CON",
				code: "CON",
				description: "shop_item_desc_CON",
				lbl_effect: "shop_item_effect_CON",
				level_0_effect: CHARACTER_MAX_LIFE,
				upgrade_value: 10,
				current_level: 0,
				nav_id: "1_0"
			}, {
				name: "shop_item_name_AGI",
				code: "AGI",
				description: "shop_item_desc_AGI",
				lbl_effect: "shop_item_effect_AGI",
				max_level: 24,
				level_0_effect: CHARACTER_SPEED,
				upgrade_value: 0.25,
				current_level: 0,
				nav_id: "1_1"
			}, {
				name: "shop_item_name_RLD",
				code: "RLD",
				description: "shop_item_desc_RLD",
				lbl_effect: "shop_item_effect_RLD",
				max_level: 12,
				show_multiplicator: TIME_INTERVAL / 1000,
				display_unit: "s",
				level_0_effect: TIMEOUTS.reload_time,
				upgrade_value: -2,
				current_level: 0,
				nav_id: "1_2"
			}, {
				name: "shop_item_name_DAR",
				code: "DAR",
				description: "shop_item_desc_DAR",
				lbl_effect: "shop_item_effect_DAR",
				max_level: 15,
				show_multiplicator: TIME_INTERVAL / 1000,
				display_unit: "s",
				level_0_effect: TIMEOUTS.dash_interval,
				upgrade_value: -4,
				current_level: 0,
				nav_id: "1_3"
			}]
		};
	}

	static prepareGame(controller, onInitComplete) {
		controller.scope = MV_GameInitializer.initial_scope;
		MV_GameInitializer.__initLanguageManager(controller);
		MV_GameInitializer.__initPopupsStack(controller);
		MV_GameInitializer.__initShopManager(controller);
		MV_GameInitializer.__initWaveGenerator(controller);
		TouchScreenControls.addListeners(controller);
		KeyboardAndMouseControls.addKeyListeners(controller);
		KeyboardAndMouseControls.addMouseListeners(controller);
		GamepadControls.prepareControls(controller);
		MV_GameInitializer.__initAudioManager(controller);
		MV_GameInitializer.__initMainUI(controller);
        MV_GameInitializer.__createTimer(controller);
		MV_GameInitializer.__initSaveManager(controller, onInitComplete);
	}

	static __initLanguageManager(controller) {
		controller.language_manager = new MV_LanguageManager( controller.scope.game );
	}

	static __initPopupsStack(controller) { 
		controller.popups_stack = new PopupsStack();
	}

	static __initShopManager(controller) { 
		controller.shop_manager = new ShopManager( controller.scope.shop );
	}

	static __initWaveGenerator(controller) {
		controller.wave_generator = new MV_WaveGenerator();
	}

	static __initAudioManager(controller) {
		controller.audio_manager = new MV_AudioManager({
			music_on: true,
			sound_fx_on: true,
			music_volume: 1,
			sound_fx_volume: 1
		});
	}

	static __initMainUI(controller) {
		controller.UI = new MainUI();
	}

	static __createTimer(controller) {
		controller.timer = new GameClock(controller.scope.controls);
		controller.timer.letsPlay();
	}

	static __initSaveManager(controller, onInitComplete) {
		controller.save_manager = new MV_SaveManager(controller);
		if (controller.save_manager.last_saved_game) {
			RS_Confirm(controller.language_manager, "load_popup_confirm", "load_popup_title", "load_popup_yes", "load_popup_no", 
				()=> {
					controller.save_manager.loadGame();
					onInitComplete();
				}, ()=> { onInitComplete(); }
			);
		} else onInitComplete(); // faut que ça démarre quand y a pas de sauvegarde !!!
	}
}