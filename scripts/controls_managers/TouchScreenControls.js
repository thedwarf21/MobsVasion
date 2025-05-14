class TouchScreenControls {
    
	static addListeners(controller) {
		let controls = controller.scope.controls;
		// J'ai prévu des joysticks virtuels pour le déplacement et le tir principal 
		// => idéalement, il faudrait délèguer la responsabilité de générer des informations exploitables (angle + force, au lieu de coordonnées de tapstart + coordonnées actuelles)
		// et dans un format homogène à celui retourné par GamepadGenericAdapter pour les joysticks, de manière à mutualiser le traitement
		
		const joystick_element = document.querySelector('.hud .virtual-joystick');
		MainController.virtual_joystick = new VirtualJoystick(joystick_element, joystick_element.querySelector('.stick'));

		document.querySelector('.hud .pause').addEventListener('mousedown', function(e) { 
			e.stopPropagation(); 	//TODO provisoire: évite de déclencher un tir non souhaité
			controller.togglePause();
		});

		const primary_fire_button = document.querySelector('.hud .primary-fire');
		primary_fire_button.addEventListener('mousedown', function(e) { 
			e.stopPropagation(); 	//TODO provisoire: évite de déclencher un tir non souhaité
			controls.firing_primary = true;
			controls.auto_aiming = true;
		});
		primary_fire_button.addEventListener('mouseup', function(e) { TouchScreenControls.__resetControls(); });
		primary_fire_button.addEventListener('mouseleave', function(e) { TouchScreenControls.__resetControls(); });
	}

	/** Contrôles clavier et écran tactile => seront déplacés dans des classes dédiées */
	static applyControls() {
		if (!MainController.scope.controls.paused) {
			TouchScreenControls.__applyJoystick();
			TouchScreenControls.__autoAim();
		} else {
			MainController.virtual_joystick.reset();
			TouchScreenControls.__resetControls();
		}
	}

	static __resetControls() {
		let controls = MainController.scope.controls;
		controls.firing_primary = false;
		controls.auto_aiming = false;
	}

	static __applyJoystick() {
		if (MainController.virtual_joystick.angle === null)
			return;

		MainController.UI.character.walk();	
	}

	static __autoAim() {
		if (!MainController.scope.controls.auto_aiming)
			return;

		const character = MainController.UI.character;
		const character_hitbox = character.hitbox;
		const nearest_monster_hitbox = TouchScreenControls.__nearestMonsterHitbox(character_hitbox);

		if (nearest_monster_hitbox) {
			const rad_angle = character_hitbox.getDirection( nearest_monster_hitbox );
			character.aiming_angle = rad_angle * 180 / Math.PI;
			character.applyAngles();
		} else character.aiming_angle = character.angle;
	}

	static __nearestMonsterHitbox(character_hitbox) {
		const monsters = MainController.UI.monsters;

		let nearest_monster_hitbox = null;
		let shortest_distance = MainController.viewport.VIRTUAL_WIDTH * 2; 
		
		for (const monster of monsters) {
			const monster_hitbox = monster.hitbox;
			const distance = character_hitbox.getDistance( monster_hitbox );
			if (distance < shortest_distance) {
				nearest_monster_hitbox = monster_hitbox;
				shortest_distance = distance;
			}
		}

		return nearest_monster_hitbox;
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
			e.stopPropagation();  //TODO provisoire: évite de déclencher un tir non souhaité

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

		this.global_element.addEventListener("mouseup", (e)=> { this.reset(); });
		this.global_element.addEventListener("mouseleave", (e)=> { this.reset(); });
	}

	reset() {
		this.global_element.style.transform = "";
		this.stick_element.style.transform = "";
		this.start_x = null;
		this.start_y = null;
		this.angle = null;
	}
}