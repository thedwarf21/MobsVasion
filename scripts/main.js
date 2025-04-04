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

var debug = false;

//-------------- Controller princpal --------------
// Le MainController est statique : il sert à wrapper les fonctions de contrôle et d'orchestration
// => pas d'instanciation de cette classe
class MainController {

    // Accesseurs permettant d'accéder aux éléments du jeu
    static get character() { return document.getElementsByClassName("character")[0]; }

	// Fonction appelée lorsque la page est chargée
	static onLoad() {
		MainController.viewport = new RS_ViewPortCompatibility("y", WINDOW_HEIGHT);
		MV_GameInitializer.prepareGame(MainController);
		MainController.timer.letsPlay();
        MainController.startWave();
	}

    // Fonction d'initialisation du controller principal
    static init() {
    }

    // Injecte un HtmlElement dans l'élément "game-window"
	static addToGameWindow(element) {
		let game = document.getElementById("game-window");
		game.appendChild(element);
	}

    // Suppression de tous les éléments mobiles du jeu
    static __clearGameWindow() {
        let character = MainController.character;
		if (character)
			character.remove();
    }

    // Initialiser la nouvelle vague
    static startWave() {
		MainController.__clearGameWindow();

        // Création du vaisseau, initialisé par défaut (centré et immobile)
		let character = new MV_Character(MainController.viewport);
		MainController.addToGameWindow(character);
    }

    static togglePause() { 
        let controls_state = MainController.scope.controls;
        controls_state.paused = !controls_state.paused;
        console.log(controls_state.paused ? "pause" : "roule !");
    }
}