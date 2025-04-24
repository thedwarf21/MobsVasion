//------------- Constantes --------------
// Dimensions de la fenêtre virtuelle (la largeur virtuelle, quant à elle, est calculée selon la hauteur et le ratio de l'écran)
const WINDOW_HEIGHT = 600;

// Paramétrage
const TIME_INTERVAL = 40;

const CHARACTER_SIZE = 50;
const CHARACTER_SPEED = 4;
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
	reload: "REL",
	menu_up: "MNU",
	menu_down: "MND",
	menu_left: "MNL",
	menu_right: "MNR",
	menu_validate: "MNV",
	menu_cancel: "MNC"
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

const FRIEND_FACES = {
	disappointed: "images/friend_disappointed.png",
	angry: "images/friend_angry.png",
	happy: "images/friend_happy.png",
	worried: "images/friend_worried.png"
};

const NPC_RANDOM_DIALOGS = {
	victory: [
		"Bravo !<br/>Tu as encore fait de l'excellent travail.<br/>Continue comme ça.",
		"Ces monstres n'avaient aucune chance face à toi.",
		"Voilà qui est fait.<br/>Rien de tel qu'un peu de ménage pour y voir clair.",
		"Exterminer ces brutes sanguinaires semble facile, quand on te voit faire."
	],
	defeat: [
		"Ils étaient trop forts pour toi.<br/>Je vais t'aider à reprendre des forces.",
		"J'espère que tu vas survivre à tes blessures...<br/>...mais si tu ne survis pas, c'est pas de ma faute !",
		"Ma foi, ça à l'air douloureux...",
		"À mon tour de me rendre utile...<br/>Tu as mal quand j'appuies là ?<br/>Aïe ! Me tapes pas, j'essaies de t'aider !"
	]
}

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

	static onLoad() {
		MainController.viewport = new RS_ViewPortCompatibility("y", WINDOW_HEIGHT);
		MV_GameInitializer.prepareGame(MainController);
		MainController.UI = new MainUI();
		MainController.timer.letsPlay();
        MainController.startWave();
	}

    static togglePause() { 
		let controls_state = MainController.scope.controls;
		let was_paused = controls_state.paused;
        
		if (!was_paused)   						// Mise en pause manuelle => ouverture de la popup paramètres
			MainController.popups_stack.push(ParametersPopup);
		else if (MainController.report_popup) 	// Possibilité de fermer la popup de rapport de fin de vague, via bouton pause (workflow particulier => gestion à part)
			WaveReportPopup.__close( MainController.startWave );
		else MainController.UI.closeAllPopups();
	}

	static popMonsterRandomly() {
		let x_monster, y_monster;
		let max_x_value = MainController.viewport.VIRTUAL_WIDTH - MONSTER_SIZE;
		let max_y_value = MainController.viewport.VIRTUAL_HEIGHT - MONSTER_SIZE;

		switch ( Math.floor(Math.random() * 4) ) { // selon la bordure choisie aléatoirement pour faire apparaître le monstre
			case 0: // haut
				x_monster = Tools.radomValueInRange(0, max_x_value);
				y_monster = 0;
				break;
			case 1: // bas
				x_monster = Tools.radomValueInRange(0, max_x_value);
				y_monster = max_y_value;
				break;
			case 2: // gauche
				x_monster = 0;
				y_monster = Tools.radomValueInRange(0, max_y_value);
				break;
			case 3: // droite
				x_monster = max_x_value;
				y_monster = Tools.radomValueInRange(0, max_y_value);
				break;
		}

		AnimationsHelper.monsterPop(x_monster, y_monster);
	}

    static startWave() {
		MainController.scope.game.clip_ammo = CLIP_SIZE;
		MainController.UI.clearGameWindow();
		WaitingCounters.clear();

		AnimationsHelper.characterPop();
		MainController.__scheduleLevelMonstersPop();
    }

	static __scheduleLevelMonstersPop() {
		MainController.scope.game.wave_pop.elapsed = 0;
		MainController.scope.game.wave_pop.timeouts = [];
		
		let timeout = TIMEOUTS.before_pop;
		let mobsNumber = MainController.scope.game.wave_number * MOBS_PER_WAVE; 
		for (let i=0; i<mobsNumber; i++) {
			MainController.scope.game.wave_pop.timeouts.push(timeout);
			timeout += Tools.radomValueInRange(TIMEOUTS.min_pop_interval, TIMEOUTS.max_pop_interval);
		}
	}


    static monsterSlayed() {
        let monster_swag = Tools.radomValueInRange(MIN_MONSTER_SWAG, MAX_MONSTER_SWAG);
		MainController.scope.game.money += monster_swag;
		XpBarHelper.addXp(XP_PER_MONSTER);
		if (MainController.__isWaveComplete())
			MainController.__waveDefeated();
    }
	
    static waveLost() {
        MainController.__characterRescueFees();
        WaveReportPopup.show( Tools.getRandomMessage(false), FRIEND_FACES.disappointed );
    }

    static __characterRescueFees() {
        let scope = MainController.scope.game;
        let max_hp = Abilities.getMaxPlayerHealth();

        if (max_hp > scope.money * HP_PRICE) {
            scope.health_points = scope.money * HP_PRICE;
            scope.money = 0;
        } else {
            scope.health_points = max_hp;
            scope.money -= max_hp / HP_PRICE;
        }

        if (!scope.health_points)
            scope.health_points = 1;
    }

    static __isWaveComplete() {
        if (MainController.scope.game.wave_pop.timeouts)
            return false;
        if (MainController.UI.monsters.length > 0)
            return false;
        if (document.querySelector(".pop-animation"))
            return false;
        return true;
    }

    static __waveDefeated() {
        MainController.scope.game.wave_number++;
        WaveReportPopup.show( Tools.getRandomMessage(true), FRIEND_FACES.happy );
    }
}