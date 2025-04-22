class TouchScreenControls {
    
	static addListeners(controller) {
		let controls = controller.scope.controls;
		// J'ai prévu des joysticks virtuels pour le déplacement et le tir principal 
		// => idéalement, il faudrait délèguer la responsabilité de générer des informations exploitables (angle + force, au lieu de coordonnées de tapstart + coordonnées actuelles)
		// et dans un format homogène à celui retourné par GamepadGenericAdapter pour les joysticks, de manière à mutualiser le traitement

		document.querySelector('.hud .pause').addEventListener('click', function(e) { controller.togglePause(); });
	}

	/** Contrôles clavier et écran tactile => seront déplacés dans des classes dédiées */
	static applyControls() {
		if (!MainController.scope.controls.paused) {

		} else {
		}
	}
}