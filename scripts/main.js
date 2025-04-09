//------------- Constantes --------------
// Dimensions de la fenêtre virtuelle (la largeur virtuelle, quant à elle, est calculée selon la hauteur et le ratio de l'écran)
const WINDOW_HEIGHT = 600;

// Paramétrage
const TIME_INTERVAL = 40;

const AUDIO_PATH = "sounds/";
const SHOP_MUSIC = "";
const GAME_MUSIC = "";
const SOUND_LIB = {
};
const DEFAULT_AUDIO_LASTING_TIME = 1000;

const CHARACTER_SIZE = 50;
const CHARACTER_SPEED = 5;

const SHOT_VELOCITY = 30;
const SHOT_SIZE = 5;

const MONSTER_SIZE = 60;

const CLIP_SIZE = 9;

const DASH_LENGTH = 125;

const TIMEOUTS = {
	dash_interval: 75,
	shot_interval: 13,
	reload_time: 35
};

const GAMEPAD_ACTION_CODES = {
    pause: "PAU",
    secondary_fire: "SEC",
	reload: "REL"
};

var debug = false;

//-------------- Controller princpal --------------
// Le MainController est statique : il sert à wrapper les fonctions de contrôle et d'orchestration
// => pas d'instanciation de cette classe
class MainController {

    static get character() { return document.querySelector(".character"); }
	static get shots()	{ return document.getElementsByClassName("shot"); }
	static get hitboxes()	{ return document.getElementsByClassName("hitbox"); }

	static get primaryReloadGauge() { return document.querySelector(".gauge.primary-reload"); }
	static get secondaryReloadGauge() { return document.querySelector(".gauge.secondary-reload"); }

	static onLoad() {
		MainController.viewport = new RS_ViewPortCompatibility("y", WINDOW_HEIGHT);
		MV_GameInitializer.prepareGame(MainController);
		MainController.__prepareUI();
		MainController.timer.letsPlay();
        MainController.__startWave();
	}

    static init() {
    }

	static addToGameWindow(element) {
		let game = document.getElementById("game-window");
		game.appendChild(element);
	}

	static __prepareUI() {
		new RS_Binding({  // Enregistrement de la mise à jour auto de l'affichage des munitions dans l'UI
			object: MainController.scope.game,
			property: "clip_ammo"
		}).addBinding(document.querySelector(".ammo-display #current"), "innerHTML");
		
		document.querySelector(".ammo-display #total").innerHTML = CLIP_SIZE;
	}

    static __clearGameWindow() {
        let character = MainController.character;
		if (character)
			character.remove();
    }

    static __startWave() {
		MainController.__clearGameWindow();

		let character = new MV_Character(MainController.viewport);
		MainController.addToGameWindow(character);

		let monster = new MV_Monster(MainController.viewport, 50, 50);
		MainController.addToGameWindow(monster);
    }

    static togglePause() { 
        let controls_state = MainController.scope.controls;
        controls_state.paused = !controls_state.paused;
        
		// Mise du jeu en pause par l'utilisateur => ouverture des préférences utilisateur, sinon => reprise du jeu demandée par utilisateur => fermer toutes les popups
		if (controls_state.paused) {
			MainController.showParametersPopup();
		} else MainController.__closeAllPopups();
	}

	static __closeAllPopups() {
		let gamepadControlsUI = MainController.scope.gamepadControlsUI;
		
		if (gamepadControlsUI)
			gamepadControlsUI.closeModal();
		
		if (MainController.parameters_popup)
			MainController.__closePopup(MainController.parameters_popup);

		if (MainController.lobby_popup)
			MainController.__closePopup(MainController.lobby_popup);
	}

	static __closePopup(rs_dialog_instance) {
		rs_dialog_instance.closeModal(()=> {
			rs_dialog_instance = null;
		});
	}

    static showParametersPopup() {
		let was_paused = MainController.scope.controls.paused;  // --> permet de savoir s'il faut ou non désactiver la pause, au moment de fermer la fenêtre
		MainController.scope.controls.paused = true;
		MainController.parameters_popup = new RS_Dialog("report_dialog", "Paramètres utilisateur", [], [], [], false, "tpl_parameters.html", function() {
			if(!MainController.timer.gamepad_mapper)
				MainController.parameters_popup.querySelector("#btn_gamepad_controls").remove();
			
            // Binding option affichage ou non des hitbox
			new RS_Binding({
				object: MainController.scope.game,
				property: "showHitboxes"
			}).addBinding(MainController.parameters_popup.querySelector("#show_hitboxes"), "checked", "change", function() {
				for (let hitbox of MainController.hitboxes)
					hitbox.style.opacity = MainController.scope.game.showHitboxes ? "1" : "0";
			});

			/* Pour le momment, le son n'est pas encore géré => code provisoirement désactivé

            // Binding option sons on/off
			new RS_Binding({
				object: MainController.scope.game,
				property: "sound_fx_on"
			}).addBinding(MainController.parameters_popup.querySelector("#sound_fx_on"), "checked", "change");

			// Binding option musique on/off
			new RS_Binding({
				object: MainController.scope.game,
				property: "music_on"
			}).addBinding(MainController.parameters_popup.querySelector("#music_on"), "checked", "change", function() {
				if (MainController.scope.game.music_on) {
					let music_loop_filename = was_paused ? GAME_MUSIC : SHOP_MUSIC; // si le jeu était en pause avant ouverture des paramètres, c'est qu'on est dans le magasin, sinon on est en jeu => musique différente
					MainController.audio_manager.startMusicLoop(music_loop_filename);
				} else MainController.audio_manager.stopMusicLoop();
			});
            
            */

			MainController.parameters_popup.querySelector("#btn_close").addEventListener("click", ()=> {
				MainController.parameters_popup.closeModal();
				MainController.parameters_popup = null;
				if (!was_paused)
					MainController.scope.controls.paused = false;
			});
		});
		document.body.appendChild(MainController.parameters_popup);
	}
}