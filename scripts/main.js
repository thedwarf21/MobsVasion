//------------- Constantes --------------
// Dimensions de la fenêtre virtuelle (la largeur virtuelle, quant à elle, est calculée selon la hauteur et le ratio de l'écran)
const WINDOW_HEIGHT = 600;

// Paramétrage
const TIME_INTERVAL = 50;

const AUDIO_PATH = "sounds/";
const SHOP_MUSIC = "";
const GAME_MUSIC = "";
const SOUND_LIB = {
};
const DEFAULT_AUDIO_LASTING_TIME = 1000;

const CHARACTER_SIZE = 50;
const CHARACTER_SPEED = 5;

const GAMEPAD_ACTION_CODES = {
    pause: "PAU",
    secondary_fire: "SEC"
};

var debug = false;

//-------------- Controller princpal --------------
// Le MainController est statique : il sert à wrapper les fonctions de contrôle et d'orchestration
// => pas d'instanciation de cette classe
class MainController {

    static get character() { return document.getElementsByClassName("character")[0]; }
    static get openedModal() { return document.getElementsByClassName("rs-modal").length ? document.getElementsByClassName("rs-modal")[0] : null; }

	static onLoad() {
		MainController.viewport = new RS_ViewPortCompatibility("y", WINDOW_HEIGHT);
		MV_GameInitializer.prepareGame(MainController);
		MainController.timer.letsPlay();
        MainController.startWave();
	}

    static init() {
    }

	static addToGameWindow(element) {
		let game = document.getElementById("game-window");
		game.appendChild(element);
	}

    static __clearGameWindow() {
        let character = MainController.character;
		if (character)
			character.remove();
    }

    static startWave() {
		MainController.__clearGameWindow();
		let character = new MV_Character(MainController.viewport);
		MainController.addToGameWindow(character);
    }

    static togglePause() { 
        let controls_state = MainController.scope.controls;
        controls_state.paused = !controls_state.paused;
        console.log(controls_state.paused ? "pause" : "roule !");
        
        let gamepadControlsUI = MainController.scope.gamepadControlsUI;
        if (gamepadControlsUI && !controls_state.paused)
            gamepadControlsUI.closeModal();
    }
}