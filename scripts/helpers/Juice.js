class JuiceHelper {
    
    static characterPop() {
        const pop_animation = MV_AnimatedFrame.getInstance(
            MainController.viewport, 
            ( MainController.viewport.VIRTUAL_WIDTH - CHARACTER_SIZE ) / 2, 
            ( MainController.viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE ) / 2, 
            CHARACTER_SIZE, CHARACTER_SIZE, ANIMATIONS.monster_pop.css_class, ANIMATIONS.monster_pop.duration, 
            ()=> {
                const character = MV_Character.getInstance(MainController.viewport);
                MainController.UI.character = character;
                MainController.UI.addToGameWindow(character);
            }
        );

		MainController.UI.addToGameWindow(pop_animation);
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

    static levelUp() {
        const level_element = document.querySelector(".player-level");
        level_element.classList.add("level-up");
        setTimeout(()=> {  level_element.classList.remove("level-up"); }, 1000);
        
        MainController.audio_manager.playAudio("level_up");
    }
    
    static hitEffect() {
        const flash_effect = MV_AnimatedFrame.getInstance( MainController.viewport, 0, 0, 0, 0, 
            ANIMATIONS.hit_effect.css_class, ANIMATIONS.hit_effect.duration, 
            ()=> { flash_effect.remove(); }
        );

        MainController.UI.addToGameWindow(flash_effect);
    }

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

    static reload() { MainController.audio_manager.playAudio("reload"); }
    static emptyClipPercussion() { MainController.audio_manager.playAudio("empty_clip"); }
    static dashSound() { MainController.audio_manager.playAudio("dash"); }
    static playerDied() { MainController.audio_manager.playAudio("lose"); }

    static popupOpening() { MainController.audio_manager.playAudio("popup_open"); }
    static popupClosing() { MainController.audio_manager.playAudio("popup_close"); }
    static popupNavigate() { MainController.audio_manager.playAudio("popup_navigate"); }
    static popupValidate() { MainController.audio_manager.playAudio("popup_validate"); }

    static prepareSpitting() { MainController.audio_manager.playAudio("spit_prepare"); }
    static spit() { MainController.audio_manager.playAudio("spit"); }
    static prepareTackling() { MainController.audio_manager.playAudio("tackle_prepare"); }
    static tackle() { MainController.audio_manager.playAudio("tackle"); }
    static prepareThrowing() { MainController.audio_manager.playAudio("throw_prepare"); }
    static throw() { MainController.audio_manager.playAudio("throw"); }
    static monsterSlayed() { MainController.audio_manager.playAudio("kill"); }
    static monsterFalldown() { MainController.audio_manager.playAudio("monster_falldown"); }
    
    static startShopMusic() { MainController.audio_manager.playAudio("shop_music"); }
    static stopShopMusic() { MainController.audio_manager.stopAudioLoop("shop_music"); }
    static startWaveMusic() { MainController.audio_manager.playAudio("wave_music"); }
    static stopWaveMusic() { MainController.audio_manager.stopAudioLoop("wave_music"); }


    static monsterPop(x, y, monster_type) {
		const animation = ANIMATIONS.monster_pop;
        const pop_animation = MV_AnimatedFrame.getInstance( MainController.viewport, 
            x, y, monster_type.size, monster_type.size, 
            animation.css_class, animation.duration, ()=> {
                const monster = (monster_type.class).getInstance(MainController.viewport, x, y);
                MainController.UI.addToGameWindow(monster);
                MainController.UI.monsters.push(monster);
            }
        );

		MainController.UI.addToGameWindow(pop_animation);
        MainController.audio_manager.playAudio("portal");
	}

    static bloodSplash(x, y, angle, onAmimationEnd) {
        const blood_splash = MV_AnimatedFrame.getInstance( MainController.viewport, x, y, 0, 0, 
            ANIMATIONS.blood_splash.css_class, ANIMATIONS.blood_splash.duration, ()=> {
                blood_splash.remove();
                if (onAmimationEnd) 
                    onAmimationEnd();
            }
        );
        blood_splash.rotate(angle);
        MainController.UI.addToGameWindow(blood_splash);
    }

    static attackTrail(monster, trail_angle, trail_length) {
        const trail = document.createElement("DIV");
        trail.classList.add("attack-trail");
        trail.style.height = MainController.viewport.getCssValue(monster.pixel_size);
        trail.style.width = MainController.viewport.getCssValue(trail_length);
        trail.style.top = MainController.viewport.getCssValue(monster.y);
        trail.style.left = MainController.viewport.getCssValue(monster.x + monster.pixel_size/2);
        trail.style.transform = `rotateZ(${trail_angle}rad)`;

        MainController.UI.addToGameWindow(trail);
        setTimeout(()=> {
            trail.style.opacity = 0;
            setTimeout(()=> { trail.remove(); }, 1000);
        }, 200);
    }
}