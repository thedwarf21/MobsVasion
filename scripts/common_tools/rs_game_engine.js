/**
 * Pioche une valeur au hasard dans une liste
 * 
 * @param 	{array} 	values_list 	Liste de valeur dans laquelle piocher au hasard
 * @returns   			La valeur piochée dans la liste
 */
function randomize(values_list) {
	const randomIndex = Math.floor(Math.random() * values_list.length);
	return values_list[randomIndex];
}

/**
 * La classe RS_Hitbox centralise les tests de collision
 *
 * @class      RS_Hitbox
 */
class RS_Hitbox {
	constructor(shape, params) {
		this.shape = shape;
		for (const property_name in params)
			this[property_name] = params[property_name];
	}

	checkCollide(hitbox) {
		const str_notice = "veillez à n'initialiser la propriété shape qu'avec les constantes statiques prévues à cet effet.";
		if (this.shape === RS_Hitbox.SHAPE_CIRCLE) {
			if (hitbox.shape === RS_Hitbox.SHAPE_CIRCLE)
				return this.#checkCircleVsCircle(hitbox);
			else if (hitbox.shape === RS_Hitbox.SHAPE_BOX)
				return this.#checkCircleVsBox(hitbox);
			else console.error(`Forme de hitbox inconnue: ${hitbox.shape} >>> ${str_notice}`);
		} else if (this.shape === RS_Hitbox.SHAPE_BOX) {
			if (hitbox.shape === RS_Hitbox.SHAPE_CIRCLE)
				return hitbox.#checkCircleVsBox(this);
			else if (hitbox.shape === RS_Hitbox.SHAPE_BOX)
				return this.#checkBoxVsBox(hitbox);
			else console.error(`Forme de hitbox inconnue: ${hitbox.shape} >>> ${str_notice}`);
		} else console.error(`Forme de hitbox inconnue: ${this.shape} >>> ${str_notice}`);
	}

	getDistance(hitbox) {
		const deltaX = Math.abs(this.x - hitbox.x),
			  deltaY = Math.abs(this.y - hitbox.y);
		return (deltaX**2 + deltaY**2) ** 0.5;
	}

	getDirection(hitbox) {
        const rad_angle = Math.atan( (hitbox.y - this.y) / (hitbox.x - this.x) );
        return this.x > hitbox.x 
			 ? rad_angle + Math.PI 
			 : rad_angle;
	}

	getNearest(hitboxed_elements) {
		let nearest_element = null;
		let shortest_distance = MainController.viewport.VIRTUAL_WIDTH * 2; 
		
		for (const game_element of hitboxed_elements) {
			const current_hitbox = game_element.hitbox;
			const distance = this.getDistance( current_hitbox );
			if (distance < shortest_distance) {
				nearest_element = game_element;
				shortest_distance = distance;
			}
		}

		return nearest_element;
	}

	#checkCircleVsCircle(hitbox) {
		const deltaX = Math.abs(this.x - hitbox.x),
			  deltaY = Math.abs(this.y - hitbox.y),
			  distance = (deltaX**2 + deltaY**2) ** 0.5;
		return (distance < this.radius + hitbox.radius);
	}

	#checkCircleVsBox(hitbox) {
		console.warn("RS_Hitbox.checkCircleVsBox(): Cette fonction est en attente d'implémentation");	
		return false;
	}

	#checkBoxVsBox(hitbox) {
		console.warn("RS_Hitbox.checkBoxVsBox(): Cette fonction est en attente d'implémentation");
		return false;
	}

	static get SHAPE_CIRCLE() 		{ return 3.14; }
	static get SHAPE_BOX()			{ return 4; }
	static set SHAPE_CIRCLE(value) 	{ console.error("La constante RS_Hitbox.SHAPE_CIRCLE est en lecture seule."); }
	static set SHAPE_BOX(value)		{ console.error("La constante RS_Hitbox.SHAPE_BOX est en lecture seule."); }
}

/**
 * Cette classe a pour but de gérer la compatibilité d'affichage en fonction de la taille de l'écran.
 * Elle fonctionne sur un principe de coordonnées virtuelles :
 * 		- Le programme principal continue d'utiliser des coordonnées virtuelles en pixels sur un 
 * 		  écran virtuel à hauteur/largeur fixe (l'autre dimension est calculée à l'aide du ratio réel de l'écran)
 * 		- La classe, une fois paramétrés "base_axis" et "base_axis_virtual_size", convertit les coordonnées en % 
 * 				=> utilisation de vh ou vw, pour appliquer les coordonnées dans l'interface, selon l'axe choisit
 * 		- Largeur et hauteur de l'écran virtuel en propriétés (pour détecter les sorties d'écran)
 *
 * @class      RS_ViewPortCompatibility
 */
class RS_ViewPortCompatibility {
	constructor(baseAxis, windowVirtualBaseSize) {
		this.refreshScreenRatio();
		if (baseAxis && windowVirtualBaseSize) {
			if (["x", "y"].includes(baseAxis)) {
				this.base_axis = baseAxis;
				this.base_axis_virtual_size = windowVirtualBaseSize;
			} else console.error(`RS_ViewPortCompatibility.constructor: axes supportés -> 'x' ou 'y': reçu -> '${baseAxis}'`);
		} else console.error(`RS_ViewPortCompatibility.constructor('${baseAxis}', ${windowVirtualBaseSize}): paramètres invalides.`);

		// Suite à un redimensionnement, le ratio est recalculé afin que la conversion s'adapte
		window.addEventListener('resize', ()=> { this.refreshScreenRatio(); });
	}

	get VIRTUAL_HEIGHT() {
		if (this.base_axis === "y") 
			return this.base_axis_virtual_size;
		else return this.base_axis_virtual_size / this.screen_ratio;
	}

	get VIRTUAL_WIDTH() {
		if (this.base_axis === "y")
			return this.base_axis_virtual_size * this.screen_ratio;
		else return this.base_axis_virtual_size;
	}

	refreshScreenRatio() { this.screen_ratio = window.innerWidth / window.innerHeight; }

	getCssValue(virtual_pixels) {
		if (this.base_axis === "y") {
			return (virtual_pixels * 100 / this.VIRTUAL_HEIGHT) + "vh";
		}
		return (virtual_pixels * 100 / this.VIRTUAL_WIDTH) + "vw";
	}
}

/**
 * Couche d'abstraction permettant d'interfacer des contrôles à l'API native Gamepad.
 * Référence une liste de contrôles. Chacun d'entre eux se caractérise par :
 *    - un nom destiné à l'affichage pour configuration de la manette
 *    - une fonction rattachée, exécutant l'action correspondante
 *    - l'indice du bouton de manette rattaché, dans la liste fournie par l'API
 *
 * @class      GamepadGenericAdapter
 */
class GamepadGenericAdapter {
	constructor() { 
		this.controls = [];
		this.calibration = [0, 0, 0, 0];
	}

	calibrate() {
		const gamepad = GamepadGenericAdapter.getConnectedGamepad();
		this.calibration = [gamepad.axes[0],
							gamepad.axes[1],
							gamepad.axes[2],
							gamepad.axes[3]];
	}

	addControlEntry(code, name, fnPushedAction, fnUnpushedAction, isAuto) {
		this.controls.push(new GamepadControl(code, name, fnPushedAction, fnUnpushedAction, isAuto));
	}

	setControlMapping(controlIndex, buttonIndex) {
		this.controls[controlIndex].actionAlreadyDone = true; // Empêche l'exécution de l'action durant le paramétrage
		this.controls[controlIndex].buttonIndex = buttonIndex;
	}

	applyControl(code, isSecondaryAction) {
		const gamepad = GamepadGenericAdapter.getConnectedGamepad();
		for (const control of this.controls)
			if (control.code === code)
				control.applyContext(gamepad, isSecondaryAction);
	}

	updateJoysticksStates() {
		const gamepad = GamepadGenericAdapter.getConnectedGamepad();
		this.leftJoystick = new GamepadJoystick(this.axes[0], this.axes[1]);
		this.rightJoystick = new GamepadJoystick(this.axes[2], this.axes[3]);
		if (gamepad.axes.length > 4)
			this.accelerometer = new GamepadJoystick(gamepad.axes[4], gamepad.axes[5]);
	}

	static getConnectedGamepad() {
		const gamepads = navigator.getGamepads();
		for (const gamepad of gamepads)
			if (gamepad !== null)
				return gamepad;
	}

	get axes() {
		const gamepad = GamepadGenericAdapter.getConnectedGamepad();
		return [gamepad.axes[0] - this.calibration[0],
				gamepad.axes[1] - this.calibration[1],
				gamepad.axes[2] - this.calibration[2],
				gamepad.axes[3] - this.calibration[3]]
	}
}

/**
 * Représente un contrôle de Gamepad, géré par GamepadGenericAdapter.
 *
 * @class      GamepadControl
 */
class GamepadControl {
	constructor(code, name, fnPushedAction, fnUnpushedAction, isAuto) {
		this.code = code;
		this.name = name;
		this.pushedAction = fnPushedAction;
		this.unpushedAction = fnUnpushedAction;
		this.isAuto = isAuto;
		this.actionAlreadyDone = false;
		this.buttonIndex = undefined;
	}

	applyContext(gamepad) {
		if (this.#isButtonPressed(gamepad)) {
			if (this.#isExecutionPossible()) {
				this.#execute(true);
				this.actionAlreadyDone = true;
			}
		} else {
			this.#execute(false);
			this.actionAlreadyDone = false;
		}

	}

	#execute(button_state) {
		if (button_state)
			return this.pushedAction();
		
		if (this.unpushedAction) 
			return this.unpushedAction();
	}

	#isButtonPressed(gamepad) {
		return this.buttonIndex !== undefined && gamepad.buttons[this.buttonIndex].pressed;
	}

	#isExecutionPossible() {
		return !this.actionAlreadyDone || this.isAuto;
	}
}

/**
 * Représente un joystick de Gamepad, géré par GamepadGenericAdapter.
 *
 * @class      GamepadJoystick
 */
class GamepadJoystick {
	constructor(x_rate, y_rate) {
		this.x = x_rate;
		this.y = y_rate;
		this.#computeAngleAndIntensity();
	}

	#computeAngleAndIntensity() {
		this.angle = Math.atan2(this.y, this.x);
		this.intensity 	= Math.abs(this.x) > Math.abs(this.y) 
						? Math.abs(this.x) 
						: Math.abs(this.y);
	}
}