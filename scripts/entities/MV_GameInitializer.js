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
				showHitboxes: false
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
				paused: false,
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
				name: "Déluge de balles",
				code: "RAT",
				description: "Réduit le recul de l'arme, pour faciliter la visée entre deux coups de feu",
				lbl_effect: "Temps entre deux coups (ms)",
				max_level: 10,
				show_multiplicator: TIME_INTERVAL,
				level_0_effect: TIMEOUTS.shot_interval,
				upgrade_value: -1,
				level_1_price: 80,
				level_2_price_coef : 1.75,
				current_level: 0,
				nav_id: "0_1"
			}, {
				name: "Puissance de feu",
				code: "POW",
				description: "Modifie l'arme, afin d'en améliorer la puissance de feu",
				lbl_effect: "Dégats par tir",
				level_0_effect: 1,
				upgrade_value: 0.2,
				level_1_price: 40,
				level_2_price_coef : 1.75,
				current_level: 0,
				nav_id: "1_1"
			}, {
				name: "Constitution",
				code: "CON",
				description: "Permet de mieux encaisser les coups",
				lbl_effect: "Santé maximale",
				level_0_effect: CHARACTER_MAX_LIFE,
				upgrade_value: 10,
				current_level: 0,
				nav_id: "2_0"
			}, {
				name: "Agilité",
				code: "AGI",
				description: "Permet de courir plus vite",
				lbl_effect: "Vitesse de déplacement",
				max_level: 24,
				level_0_effect: CHARACTER_SPEED,
				upgrade_value: 0.25,
				current_level: 0,
				nav_id: "3_0"
			}, {
				name: "Rechargement rapide",
				code: "RLD",
				description: "Permet de changer plus rapidement de chargeur",
				lbl_effect: "Temps de rechargement",
				max_level: 20,
				show_multiplicator: TIME_INTERVAL / 1000,
				display_unit: "s",
				level_0_effect: TIMEOUTS.reload_time,
				upgrade_value: -1,
				current_level: 0,
				nav_id: "2_1"
			}, {
				name: "Récupération rapide",
				code: "DAR",
				description: "Permet de récupérer plus vite d'une esquive",
				lbl_effect: "Temps de rechargement",
				max_level: 25,
				show_multiplicator: TIME_INTERVAL / 1000,
				display_unit: "s",
				level_0_effect: TIMEOUTS.dash_interval,
				upgrade_value: -2,
				current_level: 0,
				nav_id: "3_1"
			}]
		};
	}

	static prepareGame(controller) {
		controller.scope = MV_GameInitializer.initial_scope;
		MV_GameInitializer.__initPopupsStack(controller);
		MV_GameInitializer.__initShopManager(controller);
		TouchScreenControls.addListeners(controller);
		KeyboardAndMouseControls.addKeyListeners(controller);
		KeyboardAndMouseControls.addMouseListeners(controller);
		GamepadControls.prepareControls(controller);
		MV_GameInitializer.__initAudioManager(controller);
		MV_GameInitializer.__initSaveManager(controller);
        MV_GameInitializer.__createTimer(controller);
	}

	static __initShopManager(controller) { 
		controller.shop_manager = new ShopManager( controller.scope.shop );
	}

	static __initPopupsStack(controller) { 
		controller.popups_stack = new PopupsStack();
	}

	static __initAudioManager(controller) {
		controller.audio_manager = new MV_AudioManager({
			music_on: true,
			sound_fx_on: true
		});
	}

	static __initSaveManager(controller) {
		controller.save_manager = new MV_SaveManager(controller);
	}

	static __createTimer(controller) {
		controller.timer = new GameClock(controller.scope.controls);
	}
}