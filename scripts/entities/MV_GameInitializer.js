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
				keyboard_type: KeyTranslater.AZERTY,
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
				name: "Détecteur de métaux",
				code: "DET",
				description: "Cet accessoire te permettra de récupérer plus de pièces sur les monstres",
				lbl_effect: "Nombre maximum de pièces supplémentaires par monstre",
				max_level: 5,
				level_0_effect: 0,
				upgrade_value: 1,
				level_1_price: 20,
				level_2_price_coef : 1.75,
				current_level: 0,
				nav_id: "0_2"
			}, {
				name: "Chargeur haute capacité",
				code: "CHC",
				description: "Bricolons un peu ton arme, pour augmenter la capacité du chargeur",
				lbl_effect: "Capacité du chargeur",
				level_0_effect: CLIP_SIZE,
				upgrade_value: 1,
				level_1_price: 30,
				level_2_price_coef : 1.5,
				current_level: 0,
				nav_id: "0_3"
			}, {
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
				nav_id: "0_4"
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
				nav_id: "0_5"
			}, {
				name: "Constitution",
				code: "CON",
				description: "Permet de mieux encaisser les coups",
				lbl_effect: "Santé maximale",
				level_0_effect: CHARACTER_MAX_LIFE,
				upgrade_value: 10,
				current_level: 0,
				nav_id: "1_0"
			}, {
				name: "Agilité",
				code: "AGI",
				description: "Permet de courir plus vite",
				lbl_effect: "Vitesse de déplacement",
				max_level: 24,
				level_0_effect: CHARACTER_SPEED,
				upgrade_value: 0.25,
				current_level: 0,
				nav_id: "1_1"
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
				nav_id: "1_2"
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
				nav_id: "1_3"
			}]
		};
	}

	static prepareGame(controller, onInitComplete) {
		controller.scope = MV_GameInitializer.initial_scope;
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
			RS_Confirm(`<div class="modal-line">Nous avons trouvé une sauvegarde.</div>
						<div class="modal-line">Vous pouvez la charger, ou commencer une nouvelle partie. </div>
						<div class="modal-line">Attention: commencer une nouvelle partie implique d'écraser la sauvegarde existante.</div>`, 
						"Gestionnaire de sauvegarde", "Charger", "Nouvelle partie", ()=> {
					controller.save_manager.loadGame();
					onInitComplete();
				}, ()=> { onInitComplete(); });
		} else onInitComplete(); // faut que ça démarre quand y a pas de sauvegarde !!!
	}
}