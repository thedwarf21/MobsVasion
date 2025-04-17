//------------- Constantes --------------
// Dimensions de la fenêtre virtuelle (la largeur virtuelle, quant à elle, est calculée selon la hauteur et le ratio de l'écran)
const WINDOW_HEIGHT = 600;

// Paramétrage
const TIME_INTERVAL = 40;

const CHARACTER_SIZE = 50;
const CHARACTER_SPEED = 5;
const CHARACTER_MAX_LIFE = 50;

const SHOT_VELOCITY = 30;
const SHOT_SIZE = 5;
const CLIP_SIZE = 9;
const WOUND_SHOCK_TIME = 500;

const DASH_LENGTH = 125;

const MONSTER_SIZE = 60;
const MIN_MONSTER_SPEED = 2;
const MAX_MONSTER_SPEED = 4;
const MONSTER_MAX_HEALTH = 5;
const MIN_MONSTER_SWAG = 1;
const MAX_MONSTER_SWAG = 3;
const MOBS_PER_WAVE = 3;
const MONSTER_STRENGTH = 1;

const XP_PER_MONSTER = 1;
const BASE_LEVEL_UP_XP = 3;
const LEVEL_UP_XP_COEF = 2;
const KP_PER_LEVEL = 1;

const BLOOD_SPLASH_LENGTH = 60;
const FIRE_SIZE = 30;

const TIMEOUTS = {
	dash_interval: 75,
	shot_interval: 13,
	reload_time: 35,
	before_pop: 25,
	min_pop_interval: 60,
	max_pop_interval: 100
};

const GAMEPAD_ACTION_CODES = {
    pause: "PAU",
    secondary_fire: "SEC",
	reload: "REL"
};

const ANIMATIONS = {
	monster_pop: {
		css_class: "pop-animation",
		duration: 1000
	},
	blood_splash: {
		css_class: "blood-splash",
		duration: 250
	},
	hit_effect: {
		css_class: "flash",
		duration: 250,
	}
};

const HP_PRICE = 5;

const SOILS = ["desert", "ice", "marble"];
const SOIL_BG_SIZE = ["15vh", "100vh", "30vh"];

const PANIC_MODE_THRESHOLD_RATIO = 0.2;

const AUDIO_PATH = "sounds/";
const SHOP_MUSIC = "";
const GAME_MUSIC = "";
const SOUND_LIB = {
};
const DEFAULT_AUDIO_LASTING_TIME = 1000;

var debug = false;

//-------------- Controller princpal --------------
// Le MainController est statique : il sert à wrapper les fonctions de contrôle et d'orchestration
// => pas d'instanciation de cette classe
class MainController {

    static get game_window() { return document.getElementById("game-window"); }

    static get character() 		{ return document.querySelector(".character"); }
	static get shots()			{ return document.getElementsByClassName("shot"); }
	static get monsters() 		{ return document.getElementsByClassName("monster"); }
	static get hitboxes()		{ return document.getElementsByClassName("hitbox"); }
	static get bloodPuddles()	{ return document.getElementsByClassName("blood-puddle"); }

	static get primaryReloadGauge() 	{ return document.querySelector(".gauge.primary-reload"); }
	static get secondaryReloadGauge() 	{ return document.querySelector(".gauge.secondary-reload"); }
	static get panicModeHtmlElement()	{ return document.querySelector(".panic-mode"); }

	static onLoad() {
		MainController.viewport = new RS_ViewPortCompatibility("y", WINDOW_HEIGHT);
		MV_GameInitializer.prepareGame(MainController);
		MainUI.prepareUI();
		MainController.timer.letsPlay();
        MainController.startWave();
	}

    static togglePause() { 
		let controls_state = MainController.scope.controls;
		let was_paused = controls_state.paused;  // --> permet de savoir s'il faut ou non désactiver la pause, au moment de fermer la fenêtre
		controls_state.paused = !controls_state.paused;
        
		// Mise du jeu en pause par l'utilisateur => ouverture des préférences utilisateur, sinon => reprise du jeu demandée par utilisateur => fermer toutes les popups
		if (controls_state.paused) {
			ParametersPopup.show(was_paused);
		} else MainUI.closeAllPopups();
	}

	static popMonsterRandomly() {
		let x_monster, y_monster;
		let max_x_value = MainController.viewport.VIRTUAL_WIDTH - MONSTER_SIZE;
		let max_y_value = MainController.viewport.VIRTUAL_HEIGHT - MONSTER_SIZE;

		switch ( Math.floor(Math.random() * 4) ) { // selon la bordure choisie aléatoirement pour faire apparaître le monstre
			case 0: // haut
				x_monster = MainController.radomValueInRange(0, max_x_value);
				y_monster = 0;
				break;
			case 1: // bas
				x_monster = MainController.radomValueInRange(0, max_x_value);
				y_monster = max_y_value;
				break;
			case 2: // gauche
				x_monster = 0;
				y_monster = MainController.radomValueInRange(0, max_y_value);
				break;
			case 3: // droite
				x_monster = max_x_value;
				y_monster = MainController.radomValueInRange(0, max_y_value);
				break;
		}

		MainController.__performMonsterPop(x_monster, y_monster);
	}

    static startWave() {
		MainController.scope.game.clip_ammo = CLIP_SIZE;
		MainController.scope.controls.paused = true; //TODO à retirer quand la popup de rapport de fin de vague sera en place 
		MainUI.clearGameWindow();
		WaitingCounters.clear();
		MainController.scope.controls.paused = false; //TODO à retirer quand la popup de rapport de fin de vague sera en place

		let pop_animation = MV_AnimatedFrame.create(
			MainController.viewport, 
			( MainController.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE ) / 2, 
			( MainController.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE ) / 2, 
			CHARACTER_SIZE, CHARACTER_SIZE, ANIMATIONS.monster_pop.css_class, ANIMATIONS.monster_pop.duration, 
			()=> {
				let character = MV_Character.create(MainController.viewport);
				MainUI.addToGameWindow(character);
			}
		);
		MainUI.addToGameWindow(pop_animation);

		MainController.__scheduleLevelMonstersPop();
    }

	static __performMonsterPop(x_monster, y_monster) {
		let animation = ANIMATIONS.monster_pop;
		MainUI.addToGameWindow( 
			MV_AnimatedFrame.create(MainController.viewport, 
				x_monster, y_monster, MONSTER_SIZE, MONSTER_SIZE, 
				animation.css_class, animation.duration, ()=> {
					let monster = MV_Monster.create(MainController.viewport, x_monster, y_monster);
					MainUI.addToGameWindow(monster);
				}
			) 
		);
	}

	static __scheduleLevelMonstersPop() {
		MainController.scope.game.wave_pop.elapsed = 0;
		MainController.scope.game.wave_pop.timeouts = [];
		
		let timeout = TIMEOUTS.before_pop;
		let mobsNumber = MainController.scope.game.wave_number * MOBS_PER_WAVE; 
		for (let i=0; i<mobsNumber; i++) {
			MainController.scope.game.wave_pop.timeouts.push(timeout);
			timeout += MainController.radomValueInRange(TIMEOUTS.min_pop_interval, TIMEOUTS.max_pop_interval);
		}
	}

	/** Fonctions utilitaires */
	static radomValueInRange(min_value, max_value) {
		return Math.floor( Math.random() * (max_value - min_value + 1) ) + min_value;
	}
	
	static getFibonacciValue(level_0_value, coef, level) {
		let prev_values = [];
		for (let i=0; i<level+1; i++) {
			let value;
			if (i == 0)
				value = level_0_value;
			else if (i == 1)
				value = level_0_value * coef;
			else value = prev_values[0] + prev_values[1];
			prev_values.unshift(value);
		}
		return prev_values.shift();
	}
}