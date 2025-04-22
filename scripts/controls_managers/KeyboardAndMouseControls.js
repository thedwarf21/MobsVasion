class KeyboardAndMouseControls {
    
    static addKeyListeners(controller) {
		let controls = controller.scope.controls;
		window.addEventListener('keydown', function(e) {
			let key = e.key.toLowerCase();
			if (key == "s")
				controls.downPressed = true;
			else if (key == "z")
				controls.upPressed = true;
			else if (key == "q")
				controls.leftPressed = true;
			else if (key == "d")
				controls.rightPressed = true;
			else if (e.code == "Space")
				controls.firing_secondary = true;
			else if (e.code == "KeyP") 
				controller.togglePause();
		});
		window.addEventListener('keyup', function(e) {
			let key = e.key.toLowerCase();
			if (key == "s")
				controls.downPressed = false;
			if (key == "z")
				controls.upPressed = false;
			if (key == "q")
				controls.leftPressed = false;
			if (key == "d")
				controls.rightPressed = false;
			if (e.code == "Space")
				controls.firing_secondary = false;
		});
	}

	static addMouseListeners(controller) {
		let controls = controller.scope.controls;
		window.addEventListener('mousemove', (e)=> {
			controls.mousePosition = { 
				x: e.clientX / MainController.UI.game_window.clientWidth * MainController.viewport.VIRTUAL_WIDTH, 
				y: e.clientY / MainController.UI.game_window.clientHeight * MainController.viewport.VIRTUAL_HEIGHT 
			}; 
		});
		window.addEventListener('mousedown', (e)=> { 
			if ([1, 3].includes(e.buttons)) {
				controls.firing_primary = true;
				controls.mouse_aiming = true;
			}
			if ([2, 3].includes(e.buttons))
				controls.reloading = true;
		});
		window.addEventListener('mouseup', (e)=> {
			if ([0, 2].includes(e.buttons)) {
				controls.firing_primary = false;
				controls.mouse_aiming = false;
			}
			if ([0, 1].includes(e.buttons))
				controls.reloading = false;
		});
	}

    static applyControlsObject() {
        let character = MainController.UI.character;
		if ( character && !MainController.scope.controls.paused ) {
            const absurd_value = 1000;
            let angle = absurd_value;
            let controls = MainController.scope.controls;
            if (KeyboardAndMouseControls.__isToLeft(controls))
                angle = 180;
            else if (KeyboardAndMouseControls.__isToRight(controls))
                angle = 0;
            else if (KeyboardAndMouseControls.__isToUp(controls))
                angle = -90;
            else if (KeyboardAndMouseControls.__isToDown(controls))
                angle = 90;
            if (KeyboardAndMouseControls.__isToUpLeft(controls))
                angle = -135;
            else if (KeyboardAndMouseControls.__isToUpRight(controls))
                angle = -45;
            else if (KeyboardAndMouseControls.__isToDownLeft(controls))
                angle = 135;
            else if (KeyboardAndMouseControls.__isToDownRight(controls))
                angle = 45;

            if (angle != absurd_value) {
                character.angle = angle;
                character.walk(angle * Math.PI / 180);
            }

            if (MainController.scope.controls.mouse_aiming)
                KeyboardAndMouseControls.__applyMouseAiming(character);
		}
	}

    static __applyMouseAiming(character) {
        let mouse_position = MainController.scope.controls.mousePosition;
        let character_center = character.centralSpotPosition();
        let rad_angle = Math.atan( (mouse_position.y - character_center.y) / (mouse_position.x - character_center.x) );
        if (character_center.x > mouse_position.x)
            rad_angle += Math.PI;
		
        character.aiming_angle = rad_angle * 180 / Math.PI;
        character.applyAngles();
    }

    static hasMoveControls() {
        let controls = MainController.scope.controls;
        return controls.upPressed || controls.downPressed || controls.upPressed || controls.downPressed; 
    }

    static __hasYaxisControls(controls) { return (controls.upPressed && !controls.downPressed) || (!controls.upPressed && controls.downPressed); }
    static __hasXaxisControls(controls) { return (controls.leftPressed && !controls.rightPressed) || (!controls.leftPressed && controls.rightPressed); }

    static __isToLeft(controls) {  return controls.leftPressed && !controls.rightPressed && !KeyboardAndMouseControls.__hasYaxisControls(controls); }
    static __isToRight(controls) {  return !controls.leftPressed && controls.rightPressed && !KeyboardAndMouseControls.__hasYaxisControls(controls); }
    static __isToUp(controls) {  return controls.upPressed && !controls.downPressed && !KeyboardAndMouseControls.__hasXaxisControls(controls); }
    static __isToDown(controls) {  return !controls.upPressed && controls.downPressed && !KeyboardAndMouseControls.__hasXaxisControls(controls); }
    static __isToUpLeft(controls) {  return controls.leftPressed && !controls.rightPressed && controls.upPressed && !controls.downPressed; }
    static __isToUpRight(controls) {  return !controls.leftPressed && controls.rightPressed && controls.upPressed && !controls.downPressed; }
    static __isToDownLeft(controls) {  return controls.leftPressed && !controls.rightPressed && !controls.upPressed && controls.downPressed; }
    static __isToDownRight(controls) {  return !controls.leftPressed && controls.rightPressed && !controls.upPressed && controls.downPressed; }
}