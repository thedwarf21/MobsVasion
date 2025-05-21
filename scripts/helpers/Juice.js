class JuiceHelper {
    
    static characterPop() {
        const pop_animation = new MV_AnimatedFrame(
            MainController.viewport, 
            ( MainController.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE ) / 2, 
            ( MainController.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE ) / 2, 
            CHARACTER_SIZE, CHARACTER_SIZE, ANIMATIONS.monster_pop.css_class, ANIMATIONS.monster_pop.duration, 
            ()=> {
                const character = new MV_Character(MainController.viewport);
                MainController.UI.character = character;
                MainController.UI.addToGameWindow(character.root_element);
            }
        );

		MainController.UI.addToGameWindow(pop_animation.root_element);
        MainController.audio_manager.playAudio("portal");
    }

    static shoot(x, y, angle) {
        const weapon_flame = document.createElement("DIV");
        weapon_flame.classList.add("fire");

        weapon_flame.style.left = MainController.viewport.getCssValue(x);
        weapon_flame.style.top = MainController.viewport.getCssValue(y - FIRE_SIZE/2);
        weapon_flame.style.transform = `rotate(${angle}rad)`;
        MainController.UI.addToGameWindow(weapon_flame);

        setTimeout(()=> {
            weapon_flame.remove();
        }, 50);
        
        MainController.audio_manager.playAudio("shot"); 
    }

    static reload() { MainController.audio_manager.playAudio("reload"); }
    static emptyClipPercussion() { MainController.audio_manager.playAudio("empty_clip"); }
    static dashSound() { MainController.audio_manager.playAudio("dash"); }

    static levelUp() {
        const level_element = document.querySelector(".player-level");
        level_element.classList.add("level-up");
        setTimeout(()=> {  level_element.classList.remove("level-up"); }, 1000);
        
        MainController.audio_manager.playAudio("level_up");
    }
    
    static hitEffect() {
        const flash_effect = new MV_AnimatedFrame( MainController.viewport, 0, 0, 0, 0, 
            ANIMATIONS.hit_effect.css_class, ANIMATIONS.hit_effect.duration, 
            ()=> { flash_effect.root_element.remove(); }
        );

        MainController.UI.addToGameWindow(flash_effect.root_element);
    }

    static playerDied() { MainController.audio_manager.playAudio("lose"); }


    static checkPanicMode() {
        const panic_threshold = PANIC_MODE_THRESHOLD_RATIO * Abilities.getMaxPlayerHealth();
        let panic_element = document.querySelector(".panic-mode");
		
		if (!panic_element && MainController.scope.game.health_points <= panic_threshold) {
			panic_element = document.createElement("DIV");
			panic_element.classList.add("panic-mode");
			document.body.prepend(panic_element);

            MainController.audio_manager.playAudio("low_hp_loop");  
		}

		if (panic_element && MainController.scope.game.health_points > panic_threshold) {
			panic_element.remove();
            MainController.audio_manager.stopAudioLoop("low_hp_loop"); 
        }
    }

    static popupOpening() { MainController.audio_manager.playAudio("popup_open"); }
    static popupClosing() { MainController.audio_manager.playAudio("popup_close"); }
    static popupNavigate() { MainController.audio_manager.playAudio("popup_navigate"); }
    static popupValidate() { MainController.audio_manager.playAudio("popup_validate"); }
    static startShopMusic() { MainController.audio_manager.playAudio("shop_music"); }
    static stopShopMusic() { MainController.audio_manager.stopAudioLoop("shop_music"); }
    static startWaveMusic() { MainController.audio_manager.playAudio("wave_music"); }
    static stopWaveMusic() { MainController.audio_manager.stopAudioLoop("wave_music"); }


    static monsterPop(x, y, MonsterClass) {
		const animation = ANIMATIONS.monster_pop;
        const pop_animation = new MV_AnimatedFrame( MainController.viewport, 
            x, y, MONSTER_SIZE, MONSTER_SIZE, 
            animation.css_class, animation.duration, ()=> {
                const monster = new MonsterClass(MainController.viewport, x, y);
                MainController.UI.monsters.push(monster);
                MainController.UI.addToGameWindow(monster.root_element);
            }
        );

		MainController.UI.addToGameWindow(pop_animation.root_element);
        MainController.audio_manager.playAudio("portal");
	}

    static bloodSplash(x, y, angle, onAmimationEnd) {
        const blood_splash = new MV_AnimatedFrame( MainController.viewport, x, y, 0, 0, 
            ANIMATIONS.blood_splash.css_class, ANIMATIONS.blood_splash.duration, ()=> {
                blood_splash.root_element.remove();
                if (onAmimationEnd) 
                    onAmimationEnd();
            }
        );
        blood_splash.root_element.style.transform = `rotate(${angle}rad)`;
        MainController.UI.addToGameWindow(blood_splash.root_element);
    }

    static monsterSlayed() { MainController.audio_manager.playAudio("kill"); }
}