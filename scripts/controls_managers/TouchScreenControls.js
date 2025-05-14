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

		const joystick_element = document.querySelector('.virtual-joystick');
		MainController.virtual_joystick = new VirtualJoystick(joystick_element, joystick_element.querySelector('.stick'));
	}

	/** Contrôles clavier et écran tactile => seront déplacés dans des classes dédiées */
	static applyControls() {
		if (!MainController.scope.controls.paused) {
			if (MainController.virtual_joystick.angle !== null)
				MainController.UI.character.walk();
		} else {

		}
	}
}


class VirtualJoystick {
	global_element;
	stick_element;
	start_x;
	start_y;
	angle;

	constructor(global_element, stick_element) {
		this.angle = null;
		this.start_x = null;
		this.start_y = null;
		this.global_element = global_element;
		this.stick_element = stick_element;
		this.addListeners();
	}

	addListeners() {
		this.global_element.addEventListener("mousedown", (e)=> { 
			e.stopPropagation();

			this.start_x = e.clientX;
			this.start_y = e.clientY;
		});

		this.global_element.addEventListener("mousemove", (e)=> {
			if (this.start_x === null || this.start_y === null)
				return;

			const delta_x = e.clientX - this.start_x;
			const delta_y = e.clientY - this.start_y;
			
			this.global_element.style.transform = `translate(${delta_x}px, ${delta_y}px)`;
			
			this.angle = Math.atan2(delta_y, delta_x);
			MainController.UI.character.angle = this.angle * 180 / Math.PI;

			this.stick_element.style.transform = `translate(${2 * Math.cos(this.angle)}vh, ${2 * Math.sin(this.angle)}vh)`;
		});

		this.global_element.addEventListener("mouseup", (e)=> { this.__reset(); });
		this.global_element.addEventListener("mouseleave", (e)=> { this.__reset(); });
	}

	__reset() {
		this.global_element.style.transform = "";
		this.stick_element.style.transform = "";
		this.start_x = null;
		this.start_y = null;
		this.angle = null;
	}
}