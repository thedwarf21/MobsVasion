class JuiceHelper {
    
    static characterPop() {
        let pop_animation = new MV_AnimatedFrame(
            MainController.viewport, 
            ( MainController.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE ) / 2, 
            ( MainController.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE ) / 2, 
            CHARACTER_SIZE, CHARACTER_SIZE, ANIMATIONS.monster_pop.css_class, ANIMATIONS.monster_pop.duration, 
            ()=> {
                let character = new MV_Character(MainController.viewport);
                MainController.UI.character = character;
                MainController.UI.addToGameWindow(character.root_element);
            }
        );

		MainController.UI.addToGameWindow(pop_animation.root_element);
        MainController.audio_manager.playAudio(SOUND_LIB.portal, false);
    }

    static shoot(x, y, angle) {
        let weapon_flame = document.createElement("DIV");
        weapon_flame.classList.add("fire");

        weapon_flame.style.left = MainController.viewport.getCssValue(x);
        weapon_flame.style.top = MainController.viewport.getCssValue(y - FIRE_SIZE/2);
        weapon_flame.style.transform = `rotate(${angle}deg)`;
        MainController.UI.addToGameWindow(weapon_flame);

        setTimeout(()=> {
            weapon_flame.remove();
        }, 50);
        
        MainController.audio_manager.playAudio(SOUND_LIB.shot, false); 
    }

    static emptyClipPercussion() { MainController.audio_manager.playAudio(SOUND_LIB.empty_clip, false); }

    static dashSound() { MainController.audio_manager.playAudio(SOUND_LIB.dash, false); }

    static levelUp() {
        let level_element = document.querySelector(".player-level");
        level_element.classList.add("level-up");
        setTimeout(()=> {  level_element.classList.remove("level-up"); }, 1000);
        
        MainController.audio_manager.playAudio(SOUND_LIB.level_up, false);
    }
    
    static hitEffect() {
        let flash_effect = new MV_AnimatedFrame( MainController.viewport, 0, 0, 0, 0, 
            ANIMATIONS.hit_effect.css_class, ANIMATIONS.hit_effect.duration, 
            ()=> { flash_effect.root_element.remove(); }
        );

        MainController.UI.addToGameWindow(flash_effect.root_element);
    }

    static playerDied() { MainController.audio_manager.playAudio(SOUND_LIB.lose, false); }


    static checkPanicMode() {
        let panic_element = document.querySelector(".panic-mode");
		let panic_threshold = PANIC_MODE_THRESHOLD_RATIO * Abilities.getMaxPlayerHealth();
		
		if (!panic_element && MainController.scope.game.health_points <= panic_threshold) {
			panic_element = document.createElement("DIV");
			panic_element.classList.add("panic-mode");
			document.body.prepend(panic_element);

            MainController.audio_manager.startAudioLoop(SOUND_LIB.low_hp_loop, false);  
		}

		if (panic_element && MainController.scope.game.health_points > panic_threshold) {
			panic_element.remove();
            MainController.audio_manager.stopAudioLoop(SOUND_LIB.low_hp_loop.loop_id); 
        }
    }

    static popupOpening() { MainController.audio_manager.playAudio(SOUND_LIB.popup_open, false); }
    static popupClosing() { MainController.audio_manager.playAudio(SOUND_LIB.popup_close, false); }
    static popupNavigate() { MainController.audio_manager.playAudio(SOUND_LIB.popup_navigate, false); }


    static monsterPop(x, y) {
		let animation = ANIMATIONS.monster_pop;
        let pop_animation = new MV_AnimatedFrame( MainController.viewport, 
            x, y, MONSTER_SIZE, MONSTER_SIZE, 
            animation.css_class, animation.duration, ()=> {
                let monster = new MV_Monster(MainController.viewport, x, y);
                MainController.UI.monsters.push(monster);
                MainController.UI.addToGameWindow(monster.root_element);
            }
        );

		MainController.UI.addToGameWindow(pop_animation.root_element);
        MainController.audio_manager.playAudio(SOUND_LIB.portal, false);
	}

    static bloodSplash(x, y, angle, onAmimationEnd) {
        let blood_splash = new MV_AnimatedFrame( MainController.viewport, x, y, 0, 0, 
            ANIMATIONS.blood_splash.css_class, ANIMATIONS.blood_splash.duration, ()=> {
                blood_splash.root_element.remove();
                if (onAmimationEnd) 
                    onAmimationEnd();
            }
        );
        blood_splash.root_element.style.transform = `rotate(${angle}deg)`;
        MainController.UI.addToGameWindow(blood_splash.root_element);
    }

    static monsterSlayed() { MainController.audio_manager.playAudio(SOUND_LIB.kill, false); }
}