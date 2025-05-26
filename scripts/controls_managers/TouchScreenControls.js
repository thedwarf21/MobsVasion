class TouchScreenControls {
    
	static addListeners(controller) {
		const controls = controller.scope.controls;
		const joystick_element = document.querySelector('.hud .virtual-joystick');
		MainController.virtual_joystick = new VirtualJoystick(joystick_element, joystick_element.querySelector('.stick'));

		document.querySelector('.hud .pause').addEventListener('touchstart', function(e) {
			e.preventDefault();
			controller.togglePause();
		});

		TouchScreenControls.__bindEvents(document.querySelector('.hud .primary-fire'), function(e) {
			controls.firing_primary = true;
			controls.auto_aiming = true;
		}, function() { 
			TouchScreenControls.__resetControls(); 
		});

		TouchScreenControls.__bindEvents(document.querySelector('.hud .secondary-fire'), function(e) {
			controls.firing_secondary = true;
		}, function() {
			controls.firing_secondary = false;
		});

		TouchScreenControls.__bindEvents(document.querySelector('.hud .reload'), function(e) {
			controls.reloading = true;
		}, function() {
			controls.reloading = false;
		});
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

	static __bindEvents(html_element, on_mouse_down, on_mouse_up) {
		html_element.addEventListener('touchstart', function(e) {
			e.preventDefault();
			on_mouse_down();
		});
		html_element.addEventListener('touchend', function(e) { on_mouse_up(); });
		html_element.addEventListener('touchcancel', function(e) { on_mouse_up(); });
	}

	static __resetControls() {
		const controls = MainController.scope.controls;
		controls.firing_secondary = false;
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
			character.aiming_angle = character_hitbox.getDirection( nearest_monster_hitbox );
			character.applyAngles();
		} else character.aiming_angle = character.angle;
	}

	static __nearestMonsterHitbox(character_hitbox) {
		return character_hitbox.getNearest( MainController.UI.monsters );
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
		this.global_element.addEventListener("touchstart", (e)=> { 
			e.preventDefault();
			this.touch_index = e.touches.length - 1;

			const current_touch = this.__getTouch(e.touches);
			this.start_x = current_touch.clientX;
			this.start_y = current_touch.clientY;
		});

		this.global_element.addEventListener("touchmove", (e)=> {
			if (this.start_x === null || this.start_y === null)
				return;

			const stick_movement = 3;
			const current_touch = this.__getTouch(e.touches);
			const delta_x = current_touch.clientX - this.start_x;
			const delta_y = current_touch.clientY - this.start_y;
			
			this.global_element.style.transform = `translate(${delta_x}px, ${delta_y}px)`;
			
			this.angle = Math.atan2(delta_y, delta_x);
			MainController.UI.character.angle = this.angle;

			this.stick_element.style.transform = `translate(${stick_movement * Math.cos(this.angle)}vh, ${stick_movement * Math.sin(this.angle)}vh)`;
		});

		this.global_element.addEventListener("touchend", (e)=> { this.reset(); });
		this.global_element.addEventListener("touchcancel", (e)=> { this.reset(); });
	}

	reset() {
		this.global_element.style.transform = "";
		this.stick_element.style.transform = "";
		this.start_x = null;
		this.start_y = null;
		this.angle = null;
	}

	__getTouch(event_touches_list) {
		for (let touch of event_touches_list) {
			if (touch.target === this.global_element)
				return touch;
			if (touch.target === this.stick_element)
				return touch;
		}
	}
}