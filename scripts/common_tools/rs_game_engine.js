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
				return this.__checkCircleVsCircle(hitbox);
			else if (hitbox.shape === RS_Hitbox.SHAPE_BOX)
				return this.__checkCircleVsBox(hitbox);
			else console.error(`Forme de hitbox inconnue: ${hitbox.shape} >>> ${str_notice}`);
		} else if (this.shape === RS_Hitbox.SHAPE_BOX) {
			if (hitbox.shape === RS_Hitbox.SHAPE_CIRCLE)
				return hitbox.__checkCircleVsBox(this);
			else if (hitbox.shape === RS_Hitbox.SHAPE_BOX)
				return this.__checkBoxVsBox(hitbox);
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

	__checkCircleVsCircle(hitbox) {
		const deltaX = Math.abs(this.x - hitbox.x),
			  deltaY = Math.abs(this.y - hitbox.y),
			  distance = (deltaX**2 + deltaY**2) ** 0.5;
		return (distance < this.radius + hitbox.radius);
	}

	__checkCircleVsBox(hitbox) {
		console.warn("RS_Hitbox.checkCircleVsBox(): Cette fonction est en attente d'implémentation");	
		return false;
	}

	__checkBoxVsBox(hitbox) {
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
 * Classe mère des éléments mobiles du jeu
 */
class MobileGameElement {
	x               = null;
	y               = null;
	deltaX          = null;
	deltaY          = null;
	angle			= null;
	pixel_size      = null;
	viewport		= null;
	root_element 	= null;
	rotate_element	= null;

	constructor(viewport, x, y) {
		this.root_element = document.createElement("DIV");
	  	this.root_element.classList.add("game");
		this.rotate_element = this.root_element;  // Sert à cibler un sous-élément DOM dans une classe enfant (avoue, sans le commentaire, elle t'aurait fait buguer, cette ligne)
	  
	  	if (!viewport) {
			console.error("MobileGameElement.constructor : le paramètre viewport est obligatoire");
			return;
	  	}
	  	if (!viewport instanceof RS_ViewPortCompatibility) {
			console.error("MobileGameElement.constructor : le paramètre viewport doit être une instance de RS_ViewPortCompatibility");
			return;
	  	}
  
	  	// Certains éléments initialisent eux-mêmes leurs coordonnées. Les paramètres peuvent donc être absents.
	  	this.viewport = viewport;
	  	
		if (x !== undefined && y !== undefined) {
			this.x = x;
			this.y = y;
			this.root_element.style.left = viewport.getCssValue(this.x);
			this.root_element.style.top = viewport.getCssValue(this.y);
	  	}
	}
  
	/**
	 * Fonction de déplacement de base
	 *
	 * @param      {boolean}  onScreenLeave  hook sortie d'écran, shuntant le comportement par défaut
	 */
	move(onScreenLeave) {
		this.y += this.deltaY;
		this.x += this.deltaX;
		
		// Gestion de l'arriver en bordure d'écran selon onScreenLeave
		//------------------------------------------------------------------
		// function  --> exécuter la fonction
		// undefined --> bloquer en bordure
	  	const window_height = this.viewport.VIRTUAL_HEIGHT,
		 	   window_width = this.viewport.VIRTUAL_WIDTH;
	  	if (onScreenLeave) {
			if (this.y > window_height || this.y < -this.pixel_size || this.x > window_width || this.x < -this.pixel_size)
				onScreenLeave();
	  	} else {
			if (this.y + this.pixel_size > window_height) 
				this.y = window_height - this.pixel_size;
			if (this.y < 0) 
				this.y = 0;
			if (this.x + this.pixel_size > window_width) 
				this.x = window_width - this.pixel_size;
			if (this.x < 0) 
				this.x = 0;
		}

	  	this.root_element.style.top = this.viewport.getCssValue(this.y);
	  	this.root_element.style.left = this.viewport.getCssValue(this.x);
		this.__rotate();
	}

	__rotate(forced_angle) {
		if (this.angle >= Math.PI) this.angle -= 2 * Math.PI;
    	if (this.angle < -Math.PI) this.angle += 2 * Math.PI;

    	this.rotate_element.style.transform = `rotateZ(${ forced_angle !== undefined ? forced_angle : this.angle }rad)`;
	}
  
	/**
	 * Fonction déclenchant une animation sur l'élément
	 *
	 * @param   	{string}	animationCssClass	Nom de la classe CSS correspondant à l'animation
	 * @param		{number}	duration			Durée en ms de l'animation
	 * @param      	{function}  fnPostAnimation  	Hook post-animation
	 */
	animate(animationCssClass, duration, fnPostAnimation) {
	  	this.classList.add(animationCssClass);
		if (typeof fnPostAnimation == "function")
			setTimeout(fnPostAnimation, duration);
	}
  
	/**
	 * Ajoute un élément permettant de visualiser la hitbox de l'élément
	 */
	addVisualHitBox(isVisible) {
		const div = document.createElement("DIV");
		div.classList.add("hitbox");
	
		// On applique le coefficient pour obtenir la marge 
		// marge de centrage => réduction du rayon = <rayon_hitbox_de_base> - <rayon_hitbox_souhaité>
		let margin, cssSize;
		if (this.hitbox_size_coef) {
			margin = this.pixel_size/2 * (1 - this.hitbox_size_coef);
			cssSize = `calc(100% - ${this.viewport.getCssValue(margin * 2)})`;
		} else {
			margin = 0;
			cssSize = "100%";
		}
		div.style.margin = this.viewport.getCssValue(margin);
		div.style.height = cssSize;
		div.style.width = cssSize;
		div.style.opacity = isVisible ? "1" : "0"; // Afficher/cacher selon paramétrage utilisateur
		this.root_element.appendChild(div);
	}

	/**
	 * Méthode permettant de créer un élément enfant dédié à la partie soumise à rotation de l'affichage.
	 * 
	 * @param {string} css_class_name Classe CSS permettant de définir l'affichage.
	 */
	addImageElt(css_class_name) {
		this.__image_elt = document.createElement("DIV");
		this.__image_elt.classList.add(css_class_name);
		this.root_element.appendChild(this.__image_elt);
	
		this.rotate_element = this.__image_elt;
	}

	/**
	 * Permet d'afficher/cacher la hitbox de l'élément
	 * 
	 * @param {boolean} makeVisible 
	 */
	setHitboxDisplay(makeVisible) { 
		this.root_element.querySelector(".hitbox").style.opacity = makeVisible ? "1" : "0";
	}

	/**
	 * Permet d'obtenir les coordonnées du point central de l'objet
	 * 
	 * @returns {x, y}
	 */
    centralSpotPosition() {
        return {
            x: this.x + (this.pixel_size / 2),
            y: this.y + (this.pixel_size / 2)
        };
    }
  
	/**
	 * Retourne l'objet RS_Hitbox correspondant au vaisseau
	 *
	 * @type       {RS_Hitbox}
	 */
	get hitbox() {
		const radius_coef = this.hitbox_size_coef || 1;
		
		// On retourne un objet donnant le coef à appliquer à la taille 
		return new RS_Hitbox(RS_Hitbox.SHAPE_CIRCLE, {
			radius: this.pixel_size/2 * radius_coef,
			x: this.x + (this.pixel_size / 2),
			y: this.y + (this.pixel_size / 2)
		});
	}
  
	/**
	 * Ecrit un message d'erreur dans la console: propriété en lecture seule
	 */
	set hitbox(value) { console.error("La propriété hitbox de MobileGameElement est en lecture seule."); }
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
	constructor() { this.controls = []; }

	addControlEntry(code, name, fnMainAction, fnSecondaryAction, isAuto) {
		this.controls.push(new GamepadControl(code, name, fnMainAction, fnSecondaryAction, isAuto));
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
		this.leftJoystick = new GamepadJoystick(gamepad.axes[0], gamepad.axes[1]);
		this.rightJoystick = new GamepadJoystick(gamepad.axes[2], gamepad.axes[3]);
		if (gamepad.axes.length > 4)
			this.accelerometer = new GamepadJoystick(gamepad.axes[4], gamepad.axes[5]);
	}

	static getConnectedGamepad() {
		const gamepads = navigator.getGamepads();
		for (const gamepad of gamepads)
			if (gamepad !== null)
				return gamepad;
	}
}

/**
 * Représente un contrôle de Gamepad, géré par GamepadGenericAdapter.
 *
 * @class      GamepadControl
 */
class GamepadControl {
	constructor(code, name, fnMainAction, fnSecondaryAction, isAuto) {
		this.code = code;
		this.name = name;
		this.mainAction = fnMainAction;
		this.secondaryAction = fnSecondaryAction;
		this.isAuto = isAuto;
		this.actionAlreadyDone = false;
		this.buttonIndex = undefined;
	}

	applyContext(gamepad, isSecondaryAction) {
		if (this.__isButtonPressed(gamepad)) {
			if (this.__isExecutionPossible()) {
				this.__execute(isSecondaryAction);
				this.actionAlreadyDone = true;
			}
		} else this.actionAlreadyDone = false;
	}

	__execute(isSecondaryAction) {
		if (isSecondaryAction) {
			this.secondaryAction();
		} else this.mainAction();
	}

	__isButtonPressed(gamepad) {
		return this.buttonIndex !== undefined && gamepad.buttons[this.buttonIndex].pressed;
	}

	__isExecutionPossible() {
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
		this.__computeAngleAndIntensity();
	}

	__computeAngleAndIntensity() {
		this.angle = Math.atan2(this.y, this.x);
		this.intensity 	= Math.abs(this.x) > Math.abs(this.y) 
						? Math.abs(this.x) 
						: Math.abs(this.y);
	}
}

/**
 * Génère et gère l'UI permettant le mapping de GamepadGenericAdapter
 * Le constructeur de la classe attend une instance de GamepadGenericAdapter en paramètre
 *
 * @class      GamepadConfigUI
 */
class GamepadConfigUI {
	constructor(game_controls_mapper, onPopupClose) {
		this.controls_mapper = game_controls_mapper;
		this.show(onPopupClose);
	}

	show(onPopupClose) {
		this.popup = new RS_Dialog("gamepad_config", "Configuration de la manette", [], [], [], false, 
								  "tpl_gamepad_config.html", ()=> {
			const container = this.popup.root_element.querySelector("#controls-gui-container");
			for (let i=0; i<this.controls_mapper.controls.length; i++) {
				container.appendChild(this.__getConfigInterfaceItem(i));
			}
			this.popup.root_element.querySelector("#btn_close").addEventListener("click", ()=> { this.closeModal(onPopupClose) });
			document.body.appendChild(this.popup.root_element);
		});
	}

	closeModal(onPopupClose) {
		this.popup.closeModal(onPopupClose);
	}

	__getConfigInterfaceItem(control_index) {
		const control_mapping_item = this.controls_mapper.controls[control_index]
		const config_interface_item = this.__getItemContainer();
		config_interface_item.appendChild(this.__getItemNameDiv(control_mapping_item.name));
		const button_mapped = this.__getItemMapDiv(control_mapping_item.buttonIndex);
		config_interface_item.appendChild(button_mapped);
		config_interface_item.addEventListener("click", ()=> { this.__itemClicked(button_mapped, control_index); });
		return config_interface_item;
	}

	__getItemContainer() {
		const config_interface_item = document.createElement("DIV");
		config_interface_item.classList.add("control-item-container");
		return config_interface_item;
	}

	__getItemNameDiv(name) {
		const control_name = document.createElement("DIV");
		control_name.classList.add("control-name");
		control_name.innerHTML = name;
		return control_name;
	}

	__getItemMapDiv(buttonIndex) {
		const button_mapped = document.createElement("DIV");
		button_mapped.classList.add("button-mapped");
		button_mapped.innerHTML = buttonIndex 
								? "Bouton " + buttonIndex 
								: "-";
		return button_mapped;
	}

	__itemClicked(button_mapped, control_index) {
		button_mapped.innerHTML = "Appuyez sur un bouton";
		this.__captureButtonPressed((button_index)=> {
			this.controls_mapper.setControlMapping(control_index, button_index);
			button_mapped.innerHTML = "Bouton " + button_index;
		});
	}

	__captureButtonPressed(fnThen) {
		const interval_id = setInterval(()=> {
			const gamepad = GamepadGenericAdapter.getConnectedGamepad();
			for (let i=0; i<gamepad.buttons.length; i++) {
				if (gamepad.buttons[i].pressed) {
					clearInterval(interval_id);
					fnThen(i);
				}
			}
		}, 35);
	}
}