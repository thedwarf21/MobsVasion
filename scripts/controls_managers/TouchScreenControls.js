class TouchScreenControls {
    
	static addListeners(controller) {
		let controls = controller.scope.controls;
		// J'ai prévu des joysticks virtuels pour le déplacement et le tir principal 
		// => idéalement, il faudrait délèguer la responsabilité de générer des informations exploitables (angle + force, au lieu de coordonnées de tapstart + coordonnées actuelles)
		// et dans un format homogène à celui retourné par GamepadGenericAdapter pour les joysticks, de manière à mutualiser le traitement

		document.querySelector('.hud .pause').addEventListener('mousedown', function(e) { 
			e.stopPropagation(); 	// évite de déclencher un tir non souhaité, lorsque l'utilisateur appuie sur pause => deviendra obsolète quand le ViewportCompatibility permettra de shunter les contrôles souris
			controller.togglePause();
		});
	}

	/** Contrôles clavier et écran tactile => seront déplacés dans des classes dédiées */
	static applyControls() {
		if (!MainController.scope.controls.paused) {

		} else {
		}
	}
}