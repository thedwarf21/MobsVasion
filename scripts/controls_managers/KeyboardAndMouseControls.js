class KeyboardAndMouseControls {
    
    static addKeyListeners(controller) {
		const controls = controller.scope.controls;
		window.addEventListener('keydown', function(e) {
			const key = e.key.toLowerCase();
			if ( KeyTranslater.isDown(key) )
				controls.downPressed = true;
			else if ( KeyTranslater.isUp(key) )
				controls.upPressed = true;
			else if ( KeyTranslater.isLeft(key) )
				controls.leftPressed = true;
			else if ( KeyTranslater.isRight(key) )
				controls.rightPressed = true;
			else if (e.code === "Space")
				controls.firing_secondary = true;
			else if (e.code === "KeyP") 
				controller.togglePause();
		});
		window.addEventListener('keyup', function(e) {
			const key = e.key.toLowerCase();
			if ( KeyTranslater.isDown(key) )
				controls.downPressed = false;
			if ( KeyTranslater.isUp(key) )
				controls.upPressed = false;
			if ( KeyTranslater.isLeft(key) )
				controls.leftPressed = false;
			if ( KeyTranslater.isRight(key) )
				controls.rightPressed = false;
			if (e.code === "Space")
				controls.firing_secondary = false;
		});
	}

	static addMouseListeners(controller) {
		const controls = controller.scope.controls;
		window.addEventListener('mousemove', (e)=> {
			controls.mousePosition = { 
				x: e.clientX / MainController.UI.game_window.clientWidth * MainController.viewport.VIRTUAL_WIDTH, 
				y: e.clientY / MainController.UI.game_window.clientHeight * MainController.viewport.VIRTUAL_HEIGHT 
			}; 
		});

		// MouseEvent.buttons est une représentation codée en binaire de l'état des boutons de souris, convertie en décimal 
		// pour bien faire et gérer un nombre variable de boutons, il faudrait écrire une classe qui le gère => pas urgent, mais à voir
		window.addEventListener('mousedown', (e)=> {
			if (e.buttons & 2**0) { //=> 1?
				controls.firing_primary = true;
				controls.mouse_aiming = true;
			}
			if (e.buttons & 2**1) //=> ?1
				controls.reloading = true;
		});
		window.addEventListener('mouseup', (e)=> {
			if (!(e.buttons & 2**0)) { //=> 0?
				controls.firing_primary = false;
				controls.mouse_aiming = false;
			}
			if (!(e.buttons & 2**1))  //=> ?0
				controls.reloading = false;
		});
	}

    static applyControlsObject() {
        const character = MainController.UI.character;
		if ( character && !MainController.scope.controls.paused ) {
            const controls = MainController.scope.controls;
            const absurd_value = 1000;
            let angle = absurd_value;
            if (KeyboardAndMouseControls.#isToLeft(controls))
                angle = Math.PI;
            else if (KeyboardAndMouseControls.#isToRight(controls))
                angle = 0;
            else if (KeyboardAndMouseControls.#isToUp(controls))
                angle = -Math.PI / 2;
            else if (KeyboardAndMouseControls.#isToDown(controls))
                angle = Math.PI / 2;
            if (KeyboardAndMouseControls.#isToUpLeft(controls))
                angle = -Math.PI * 3 / 4;
            else if (KeyboardAndMouseControls.#isToUpRight(controls))
                angle = -Math.PI / 4;
            else if (KeyboardAndMouseControls.#isToDownLeft(controls))
                angle = Math.PI * 3 / 4;
            else if (KeyboardAndMouseControls.#isToDownRight(controls))
                angle = Math.PI / 4;

            if (angle !== absurd_value) {
                character.angle = angle;
                character.walk();
            }

            if (MainController.scope.controls.mouse_aiming)
                KeyboardAndMouseControls.#applyMouseAiming(character);
		}
	}

    static #applyMouseAiming(character) {
        const mouse_position = MainController.scope.controls.mousePosition;
        const character_center = character.centralSpotPosition();
        let rad_angle = Math.atan( (mouse_position.y - character_center.y) / (mouse_position.x - character_center.x) );
        if (character_center.x > mouse_position.x)
            rad_angle += Math.PI;
		
        character.aiming_angle = rad_angle;
        character.applyAngles();
    }

    static #hasYaxisControls(controls) { return (controls.upPressed && !controls.downPressed) || (!controls.upPressed && controls.downPressed); }
    static #hasXaxisControls(controls) { return (controls.leftPressed && !controls.rightPressed) || (!controls.leftPressed && controls.rightPressed); }

    static #isToLeft(controls) {  return controls.leftPressed && !controls.rightPressed && !KeyboardAndMouseControls.#hasYaxisControls(controls); }
    static #isToRight(controls) {  return !controls.leftPressed && controls.rightPressed && !KeyboardAndMouseControls.#hasYaxisControls(controls); }
    static #isToUp(controls) {  return controls.upPressed && !controls.downPressed && !KeyboardAndMouseControls.#hasXaxisControls(controls); }
    static #isToDown(controls) {  return !controls.upPressed && controls.downPressed && !KeyboardAndMouseControls.#hasXaxisControls(controls); }
    static #isToUpLeft(controls) {  return controls.leftPressed && !controls.rightPressed && controls.upPressed && !controls.downPressed; }
    static #isToUpRight(controls) {  return !controls.leftPressed && controls.rightPressed && controls.upPressed && !controls.downPressed; }
    static #isToDownLeft(controls) {  return controls.leftPressed && !controls.rightPressed && !controls.upPressed && controls.downPressed; }
    static #isToDownRight(controls) {  return !controls.leftPressed && controls.rightPressed && !controls.upPressed && controls.downPressed; }
}


class KeyTranslater {

	static get AZERTY() { return "AZERTY"; } 	/* zqsd */
	static get QWERTY() { return "QWERTY"; }	/* wasd */
	static get DVORAK() { return "Dvorak"; } 	/* ,aoe */
	static get BEPO() 	{ return "Bépo"; }		/* éaui */

	static isUp(key) {
		const keyboard_type = MainController.scope.game.keyboard_type;
		if (keyboard_type === KeyTranslater.AZERTY && key === "z")
			return true;
		if (keyboard_type === KeyTranslater.QWERTY && key === "w")
			return true;
		if (keyboard_type === KeyTranslater.DVORAK && key === ",")
			return true;
		if (keyboard_type === KeyTranslater.BEPO && key === "é")
			return true;
		return false;
	}

	static isLeft(key) {
		const keyboard_type = MainController.scope.game.keyboard_type;
		if (keyboard_type === KeyTranslater.AZERTY && key === "q")
			return true;
		else if (key === "a")
			return true;
		return false;
	}

	static isDown(key) {
		const keyboard_type = MainController.scope.game.keyboard_type;
		if (keyboard_type === KeyTranslater.AZERTY && key === "s")
			return true;
		if (keyboard_type === KeyTranslater.QWERTY && key === "s")
			return true;
		if (keyboard_type === KeyTranslater.DVORAK && key === "o")
			return true;
		if (keyboard_type === KeyTranslater.BEPO && key === "u")
			return true;
		return false;
	}

	static isRight(key) {
		const keyboard_type = MainController.scope.game.keyboard_type;
		if (keyboard_type === KeyTranslater.AZERTY && key === "d")
			return true;
		if (keyboard_type === KeyTranslater.QWERTY && key === "d")
			return true;
		if (keyboard_type === KeyTranslater.DVORAK && key === "e")
			return true;
		if (keyboard_type === KeyTranslater.BEPO && key === "i")
			return true;
		return false;
	}
}