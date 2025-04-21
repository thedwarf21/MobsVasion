/** Gestionnaire d'XP */
class XpBarHelper {
    static addXp(xp_amount) {
        let level_up_at = XpBarHelper.levelUpAt();
        let game_scope = MainController.scope.game;
        game_scope.current_level_xp += xp_amount;
        
        if (game_scope.current_level_xp >= level_up_at) {
            game_scope.current_level_xp -= level_up_at;
            game_scope.player_level++;
            game_scope.knowledge_points += KP_PER_LEVEL;
        }
    }

    static levelUpAt() {
        return MV_Tools.getFibonacciValue(BASE_LEVEL_UP_XP, LEVEL_UP_XP_COEF, MainController.scope.game.player_level);
    }
}


/** Gestionnaire de santé du joueur */
class HealthBarHelper {
    static characterHit(damage) {
        MainController.scope.game.health_points -= damage;
		MainController.UI.checkPanicMode();

        if (MainController.scope.game.health_points <= 0) {
            MainController.waveLost();
        }
    }

    static healPlayer(amount) {
        MainController.scope.game.health_points += amount;

        let max_hp = Abilities.getMaxPlayerHealth();
        if (MainController.scope.game.health_points > max_hp)
            MainController.scope.game.health_points = max_hp;
    }
}


/** Frabrique d'animations */
class AnimationsHelper {
    static hitEffect() {
        let flash_effect = new MV_AnimatedFrame( MainController.viewport, 0, 0, 0, 0, 
            ANIMATIONS.hit_effect.css_class, ANIMATIONS.hit_effect.duration, 
            ()=> { flash_effect.root_element.remove(); }
        );

        MainController.UI.addToGameWindow(flash_effect.root_element);
    } 
    
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
    }

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
}


/** Fonctions utilitaires */
class MV_Tools {
	static radomValueInRange(min_value, max_value) {
		return Math.floor( Math.random() * (max_value - min_value + 1) ) + min_value;
	}
	
	static getFibonacciValue(level_0_value, coef, level) {
		let prev_values = [];
		for (let i=0; i<level+1; i++) {
			let value;
			if (i == 0)
				value = level_0_value;
			else if (i == 1)
				value = level_0_value * coef;
			else value = prev_values[0] + prev_values[1];
			prev_values.unshift(value);
		}
		return prev_values.shift();
	}

	static getRandomMessage(isVictory) {
		let random_messages = isVictory ? NPC_RANDOM_DIALOGS.victory : NPC_RANDOM_DIALOGS.defeat;
		return random_messages[ MV_Tools.radomValueInRange(0, random_messages.length - 1) ];
	}

	static intToHumanReadableString(value) {
		if (value > 10**13)
			return Math.floor(value / 10**12) + "T";
		if (value > 10**10)
			return Math.floor(value / 10**9) + "B";
		if (value > 10**7)
			return Math.floor(value / 10**6) + "M";
		if (value > 10**4)
			return Math.floor(value / 10**3) + "k";
		return value;
	}
}