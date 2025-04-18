class KeyboardAndMouseControls {

    static applyControlsObject() {
        let character = MainController.UI.character;
		if ( character ) {
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
                let rad_angle = character.angle * Math.PI / 180;
                character.angle = angle;
                character.deltaX = CHARACTER_SPEED * Math.cos(rad_angle);
                character.deltaY = CHARACTER_SPEED * Math.sin(rad_angle);
                character.move();
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