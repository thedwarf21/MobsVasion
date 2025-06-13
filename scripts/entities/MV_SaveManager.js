/**
 * Une sauvegarde contient :
 * 		- tout scope.game, sauf "wave_pop" et "waiting_counter", qui sont des objets de traitement utilisés en cours de vague
 * 		- l'état du shop dans un objet sous la formme { shop_item.code: shop_item.current_level }
 * 		- l'objet sound_settings de l'objet MV_AudioManager (MainController.audio_manager.sound_settings)
 */
class MV_SaveManager {

	get SAVE_FILENAME_PREFIX() { return "mv_save_"; }
	set SAVE_FILENAME_PREFIX(value) { console.error("MV_SaveManager.SAVE_FILENAME_PREFIX est en lecture seule"); }
	get save_name() { return this.SAVE_FILENAME_PREFIX + this.game_scope.save_slot; }
	set save_name(value) { console.error("MV_SaveManager.save_name est en lecture seule"); }
	get last_saved_game() { return JSON.parse(localStorage.getItem(this.save_name)); }
	set last_saved_game(value) { console.error("MV_SaveManager.last_saved_game est en lecture seule"); }

	/**
	 * Constructeur nécessitant le controller principal, afin d'accéder à toutes les données du jeu soumises à sauvegarde/chargement
	 * 
	 * @param  {object}  main_controller
	 */
	constructor(main_controller) {
		this.game_scope = main_controller.scope.game;
		this.ingame_shop = main_controller.scope.shop;
		this.shop_manager = main_controller.shop_manager;
		this.audio_manager = main_controller.audio_manager;
		this.sound_settings = main_controller.audio_manager.sound_settings;
	}

	/**
	 * Fonction de sauvegarde de la partie en cours
	 */
	saveGame(is_silent_save) {
		const save_object = this.#generateSaveObjet();
		localStorage.setItem(this.save_name, JSON.stringify(save_object));

		if (!is_silent_save)
			RS_Toast.show("Partie sauvegardé", 1000);
	}

	/**
	 * Fonction permettant de charger une sauvegarde
	 */
	loadGame() {
		const saved_game = this.last_saved_game;

		if (saved_game) {
			this.#loadGameScope(saved_game);
			this.#loadShop(saved_game);
			this.#loadSoundSettings(saved_game);
		}

		this.shop_manager.refreshAllShopItems(true); // Traduction des articles du magasin, si nécessaire (langue sauvegardée != langue du navigateur)
	}

	#loadGameScope(saved_game) {
		for (const prop in saved_game.game_scope)
			this.game_scope[prop] = saved_game.game_scope[prop];
	}

	#loadShop(saved_game) {
		for (const prop in saved_game.shop) {
			Abilities.setCurrentLevel(prop, saved_game.shop[prop]);
			this.shop_manager.forceItemLevel(prop, saved_game.shop[prop]);
		}
	}

	#loadSoundSettings(saved_game) {
		for (const prop in saved_game.sound_settings)
			this.sound_settings[prop] = saved_game.sound_settings[prop];
		
		this.audio_manager.applyVolumesSettings();
	}

	/**
	 * Une sauvegarde contient :
	 * 		- tout scope.game, sauf "wave_pop" et "waiting_counter", qui sont des objets de traitement utilisés en cours de vague
	 * 		- l'état du shop dans un objet sous la formme { shop_item.code: shop_item.current_level }
	 * 		- l'objet sound_settings de l'objet MV_AudioManager (MainController.audio_manager.sound_settings)
	 */
	#generateSaveObjet() {
		const save = { game_scope: {} };
		
		this.#gameScopeToObject(save);
		this.#shopToObject(save);
		this.#soundSettingsToObject(save);	
		
		return save;
	}

	#gameScopeToObject(save) {
		const game_properties = Object.keys( this.game_scope ).filter((key) => this.#gameScopePropsFilter(key));

		for (const prop of game_properties)
			save.game_scope[prop] = this.game_scope[prop];
	}

	#shopToObject(save) {
		save.shop = Object.fromEntries(
			this.ingame_shop.map( 
				item => [item.code, item.current_level] 
			)
		);
	}

	#soundSettingsToObject(save) {
		save.sound_settings = {
			sound_fx_on : this.sound_settings.sound_fx_on,
			music_on : this.sound_settings.music_on,
			sound_fx_volume: this.sound_settings.sound_fx_volume,
			music_volume: this.sound_settings.music_volume
		};
	}

	/**
	 * Fonction dédiée au filtrage des propriétés de scope.game, dans le cadre de la sauvegarde
	 * Ceci permet de filtrer les propriétés inutiles ou gênantes (clip_ammo, par exemple)
	 * 
	 * @param {string}  key
	 */
	#gameScopePropsFilter(key) {
		const excluded_keys = [	
			"wave_pop",
			"waiting_counter",
			"clip_ammo",
			"attacking_monsters",
			"flying_monsters"
		];

		return !excluded_keys.includes(key);
	}
}