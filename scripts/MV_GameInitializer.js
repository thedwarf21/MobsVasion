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
				xp: 0,
				wave_number: 1,
				save_slot: 1,
				clip_ammo: CLIP_SIZE,
				health_points: CHARACTER_MAX_LIFE,
				wave_swag: 0,
				wave_pop: {
					timeouts: null,
					elapsed: 0
				},
				waiting_counter: {
					shot: 0,
					dash: 0,
					clip: 0
				},
				sound_fx_on: true,
				music_on: true,
				showHitboxes: false
			},
			controls: {
				upPressed: false,
				downPressed: false,
				rightPressed: false,
				leftPressed: false,
				paused: true,
				firing_primary: false,
				firing_secondary: false,
				reloading: false
			},
			gamepad_mapper: null,
			shop: [] // définira les articles du magasin (données de calcul du prix et de l'effet en fonction du niveau d'amélioration, ainsi que du libellé pour affichage et d'un identifiant unique)
		};
	}

	static prepareGame(controller) {
		controller.scope = MV_GameInitializer.initial_scope;
		MV_GameInitializer.__addTouchListeners(controller);
		MV_GameInitializer.__addKeyListeners(controller);
		MV_GameInitializer.__prepareGamepadControls(controller);
        MV_GameInitializer.__createTimer(controller);
	}

	static __addKeyListeners(controller) {
		let controls = controller.scope.controls;
		window.addEventListener('keydown', function(e) {
			if (e.code == "ArrowDown")
				controls.downPressed = true;
			else if (e.code == "ArrowUp")
				controls.upPressed = true;
			else if (e.code == "ArrowLeft")
				controls.leftPressed = true;
			else if (e.code == "ArrowRight")
				controls.rightPressed = true;
			else if (e.code == "Space")
				controls.firing_secondary = true;
			else if (e.code == "KeyP") 
				controller.togglePause();
		});
		window.addEventListener('keyup', function(e) {
			if (e.code == "ArrowDown")
				controls.downPressed = false;
			if (e.code == "ArrowUp")
				controls.upPressed = false;
			if (e.code == "ArrowLeft")
				controls.leftPressed = false;
			if (e.code == "ArrowRight")
				controls.rightPressed = false;
			if (e.code == "Space")
				controls.firing_secondary = false;
		});

		// penser à ajouter un listener de clic, pour le tir principal
	}

	static clearGamepadControlsState(controls_state) {
		controls_state.firing_primary = false;
		controls_state.firing_secondary = false;
		controls_state.reloading = false;
	}

	static __addTouchListeners(controller) {
		let controls = controller.scope.controls;
		// J'ai prévu des joysticks virtuels pour le déplacement et le tir principal 
		// => idéalement, il faudrait délèguer la responsabilité de générer des informations exploitables (angle + force, au lieu de coordonnées de tapstart + coordonnées actuelles)
		// et dans un format homogène à celui retourné par GamepadGenericAdapter pour les joysticks, de manière à mutualiser le traitement

		document.querySelector('.hud .pause').addEventListener('click', function(e) { controller.togglePause(); });
	}

	static __prepareGamepadControls(controller) {
		window.addEventListener('gamepadconnected', (event)=> {
			console.log("Manette connectée");

			let controls = controller.scope.controls;
			let gamepad = new GamepadGenericAdapter();
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.pause, "Pause", ()=> { controller.togglePause(); });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.secondary_fire, "Tir secondaire", ()=> { controls.firing_secondary = true; });
			gamepad.addControlEntry(GAMEPAD_ACTION_CODES.reload, "Recharger", ()=> { controls.reloading = true; });
			
			controller.timer.gamepad_mapper = gamepad;
			let was_paused = controls.paused;
			controls.paused = true;
			controller.scope.gamepadControlsUI = new GamepadConfigUI(gamepad, ()=> { controls.paused = was_paused; });
		});

		window.addEventListener('gamepaddisconnected', (event)=> {
			controller.scope.gamepadControlsUI = null;
			controller.timer.gamepad_mapper = null;
			MV_GameInitializer.clearGamepadControlsState(controller.scope.controls);
			controller.togglePause();
		});
	}

	static __createTimer(controller) {
		controller.timer = new MV_Timer(controller.scope.controls);
	}
}