//------------- Constantes --------------
// Dimensions de la fenêtre virtuelle (la largeur virtuelle, quant à elle, est calculée selon la hauteur et le ratio de l'écran)
const WINDOW_HEIGHT = 600;

// Paramétrage
const TIME_INTERVAL = 40;

const CHARACTER_SIZE = 50;
const CHARACTER_SPEED = 4;
const CHARACTER_MAX_LIFE = 50;

const SHOT_VELOCITY = 30;
const SHOT_SIZE = 6;
const CLIP_SIZE = 9;
const WOUND_SHOCK_TIME = 500;

const DASH_LENGTH = 125;

const FIRST_WAVE_BATTLE_VALUE = 3;
const BATTLE_VALUE_ADD_PER_WAVE = 1;

const BASE_LEVEL_UP_XP = 3;
const LEVEL_UP_XP_COEF = 1.3;
const KP_PER_LEVEL = 2;

const BLOOD_SPLASH_LENGTH = 60;
const FIRE_SIZE = 30;

const MONSTERS_TYPES = {
	voracious: {
		class: MV_MonsterVoracious,
		appear_from_wave: 1,
		size: 60,
		speed_range: [2, 4],
		swag_range: [1, 3],
		strength: 1,
		base_hp: 3,
		hp_inc_per_wave: 0.2,
		battle_value: 1
	},
	spitter: {
		class: MV_MonsterSpitter,
		appear_from_wave: 2,
		size: 30,
		speed_range: [2, 2],
		swag_range: [3, 6],
		attack_range: 300,
		strength: 3,
		base_hp: 1.5,
		hp_inc_per_wave: 0.1,
		battle_value: 2
	},
	tackler: {
		class: MV_MonsterTackler,
		appear_from_wave: 4,
		size: 45,
		speed_range: [6, 7],
		swag_range: [6, 10],
		attack_range: 150,
		strength: 5,
		base_hp: 2.5,
		hp_inc_per_wave: 0.15,
		battle_value: 3
	},
	golgoth: {
		class: MV_MonsterGolgoth,
		appear_from_wave: 10,
		appear_limiter: 25,
		size: 90,
		speed_range: [1, 1],
		swag_range: [12, 20],
		attack_range: 450,
		strength: 10,
		base_hp: 20,
		hp_inc_per_wave: 0.35,
		battle_value: 5
	}
}

const TIMEOUTS = {
	dash_interval: 75,
	shot_interval: 13,
	reload_time: 35,
	before_pop: 25,
	min_pop_interval: 25,
	max_pop_interval: 50
};

const GAMEPAD_ACTION_CODES = {
    pause: "PAU",
    primary_auto_fire: "PRI",
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
		"wave_report_victory_0",
		"wave_report_victory_1",
		"wave_report_victory_2",
		"wave_report_victory_3"
	],
	defeat: [
		"wave_report_defeat_0",
		"wave_report_defeat_1",
		"wave_report_defeat_2",
		"wave_report_defeat_3"
	]
}

const HP_PRICE = 0.5;

const SOILS = ["desert", "ice", "marble"];
const SOIL_BG_SIZE = ["15vh", "100vh", "30vh"];

const PANIC_MODE_THRESHOLD_RATIO = 0.2;

const AUDIO_PATH = "sounds/";
const SOUND_LIB = {
	lose: 			{ file: "lose.mp3" },
	popup_open: 	{ file: "popup-open.mp3" },
	popup_navigate: {
		file: "popup-navigate.mp3",
		players_number: 3
	},
	popup_validate: { file: "popup-validate.mp3" },
	popup_close: 	{ file: "popup-close.mp3" },
	empty_clip: 	{ file: "empty-gun-shot.mp3" },
	reload: 		{ file: "reload.mp3" },
	dash: 			{ file: "dash.mp3" },
	level_up:   	{ file: "level-up.mp3" },
	spit_prepare:   { 
		file: "spit-prepare.mp3",
		players_number: 10 
	},
	spit:   { 
		file: "spit.mp3",
		players_number: 5
	},
	tackle_prepare:   { 
		file: "tackle-prepare.mp3",
		players_number: 10 
	},
	tackle:   { 
		file: "tackle.mp3",
		players_number: 5 
	},
	throw_prepare:   { 
		file: "throw-prepare.mp3",
		players_number: 6 
	},
	throw:   { 
		file: "throw.mp3",
		players_number: 6 
	},
	monster_falldown:   { 
		file: "falldown.mp3",
		players_number: 6 
	},
	kill: 			{ 
		file: "dying-monster.mp3",
		players_number: 6
	},
	portal: { 
		file: "portal.mp3",
		players_number: 2 
	},
	shot: { 
		file: "shot.mp3", 
		players_number: 10
	},
	low_hp_loop: { 
		file: "heartbeat-loop.mp3", 
		is_loop: true
	},
	shop_music:     { 
		file: "Franquefort - Test.m4a",
		is_loop: true, 
		is_music: true 
	},
	wave_music:     { 
		file: "Franquefort - Lets Play.m4a",
		is_loop: true, 
		is_music: true 
	}
};
const DEFAULT_AUDIO_LASTING_TIME = 1000;

var debug = false;

//-------------- Controller princpal --------------
// Le MainController est statique : il sert à wrapper les fonctions de contrôle et d'orchestration
// => pas d'instanciation de cette classe
class MainController {

	static onLoad() {
		MainController.viewport = new RS_ViewPortCompatibility("y", WINDOW_HEIGHT);
		MV_GameInitializer.prepareGame(MainController, ()=> {
			MainController.prepareWaveStart(true);
		});
	}

    static togglePause() { 
		const controls_state = MainController.scope.controls;
		const was_paused = controls_state.paused;
        
		if (!was_paused)   						// Mise en pause manuelle => ouverture de la popup paramètres
			MainController.popups_stack.push(ParametersPopup);
		else if (MainController.report_popup) 	// Possibilité de fermer la popup de rapport de fin de vague, via bouton pause (workflow particulier => gestion à part)
			WaveReportPopup.__close( MainController.prepareWaveStart );
		else MainController.UI.closeAllPopups();
	}

    static prepareWaveStart(is_silent_save) {
		MainController.save_manager.saveGame(is_silent_save);
		
		MainController.scope.game.clip_ammo = Abilities.getClipSize();
		MainController.UI.clearGameWindow();
		WaitingCounters.clear();
		
		JuiceHelper.characterPop();
		MainController.__showWaveNumber();
		MainController.wave_generator.scheduleLevelMonstersPop();
		
		setTimeout(TutorialHelper.showIntro, 1500);
    }

	static startWave() {
		JuiceHelper.startWaveMusic();

		if (!MainController.popups_stack.activePopup())
			TutorialHelper.showMonsterTutorial();
	}

	
    static waveLost() {
		JuiceHelper.stopWaveMusic();
        MainController.__characterRescueFees();

		MainController.save_manager.saveGame();
        WaveReportPopup.show( Tools.getRandomMessage(false), FRIEND_FACES.disappointed );
		JuiceHelper.playerDied();
    }

	static __showWaveNumber() {
		const wave_number_display = document.createElement("DIV");
		wave_number_display.classList.add("wave-level");
		wave_number_display.innerHTML = MainController.language_manager.getText("wave_number");

		MainController.UI.addToGameWindow(wave_number_display);
		wave_number_display.style.opacity = 0.8;
		setTimeout(()=> {
			wave_number_display.style.opacity = 0;
			setTimeout(()=> { wave_number_display.remove() }, 300);
		}, 1200);
	}

    static __characterRescueFees() {
        const scope = MainController.scope.game;
        const max_hp = Abilities.getMaxPlayerHealth();

        if (max_hp > scope.money / HP_PRICE) {
            scope.health_points = scope.money / HP_PRICE;
            scope.money = 0;
        } else {
            scope.health_points = max_hp;
            scope.money -= max_hp * HP_PRICE;
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
		JuiceHelper.stopWaveMusic();
        MainController.scope.game.wave_number++;

		MainController.save_manager.saveGame();
        WaveReportPopup.show( Tools.getRandomMessage(true), FRIEND_FACES.happy );
    }
}