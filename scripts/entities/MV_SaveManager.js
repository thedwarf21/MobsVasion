class MV_SaveManager {

	get SAVE_FILENAME_PREFIX() { return "mv_save_"; }
	set SAVE_FILENAME_PREFIX(value) { console.error("RS_SaveManager.SAVE_FILENAME_PREFIX est une constante et ne peut donc pas être modifiée"); }

	/**
	 * Constructeur attendant les données à sauvegarder (paramétrage et achats dans le jeu)
	 * 
	 * @param  {object}  game_settings 
	 * @param  {object}  ingame_shop 
	 */
	constructor(game_settings, ingame_shop) {
		this.game_settings = game_settings;
		this.ingame_shop = ingame_shop;
	}

	/**
	 * Fonction de sauvegarde de la partie en cours
	 */
	saveGame() {
		let object = {
			money: this.game_settings.money,
			level: this.game_settings.level,
			shop: [],
			show_hitboxes: this.game_settings.showHitboxes,
			sound_fx_on: this.game_settings.sound_fx_on,
			music_on: this.game_settings.music_on
		};
		for (let shopElem of this.ingame_shop) {
			object.shop.push({
				code: shopElem.code,
				level: shopElem.level
			});
		}
		localStorage.setItem(this.SAVE_FILENAME_PREFIX + this.game_settings.save_slot, JSON.stringify(object));
	}

	/**
	 * Fonction permettant de charger une sauvegarde
	 */
	loadGame()
	{
		let saved_game = JSON.parse(localStorage.getItem(this.SAVE_FILENAME_PREFIX + this.game_settings.save_slot));
		this.game_settings.money = saved_game.money;
		this.game_settings.level = saved_game.level;
		this.game_settings.radial_sensivity = saved_game.radial_sensivity;
		this.game_settings.showHitboxes = saved_game.show_hitboxes;
		this.game_settings.sound_fx_on = saved_game.sound_fx_on == undefined ? true : saved_game.sound_fx_on;
		this.game_settings.music_on = saved_game.music_on == undefined ? true : saved_game.music_on;
		for (let savedShopElem of saved_game.shop)
			this.setShopItemLevel(savedShopElem.code, savedShopElem.level);
	}

	/**
	 * Fonction initialisant le niveau d'amélioration d'un élément de magasin, en fonction de son identifiant
	 * 
	 * @param {string} code   Identifiant de l'élément du magasin
	 * @param {number} level  Niveau d'amélioration
	 */
	setShopItemLevel(code, level) {
		for (let shopElem of this.ingame_shop)
			if (shopElem.code === code)
				shopElem.level = level;
	}
}