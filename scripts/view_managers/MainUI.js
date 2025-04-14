class MainUI {
    static prepareUI() {
		MainUI.__prepareWaveSwagAutoRefresh();
		MainUI.__prepareAmmoAutoRefresh();
		MainUI.__prepareLifeBarAutoRefresh( MainUI.__createLifeBar() );
        MainUI.__prepareLevelAndXpAutoRefresh( MainUI.__createXpBar() );
	}

    static clearGameWindow() {
        let character = MainController.character;
		if (character)
			character.remove();

		let puddle_elements = MainController.bloodPuddles;
		for (let i = puddle_elements.length; i>0; i--)
			puddle_elements[i-1].remove();

		let monstre_elements = MainController.monsters;
		for (let i = monstre_elements.length; i>0; i--)
			monstre_elements[i-1].remove();

		let game = document.getElementById("game-window");
		let soil_index = MainController.radomValueInRange(0, 2);
		game.style.background = `url("images/soil_${SOILS[ soil_index ]}.png")`;
		game.style.backgroundSize = SOIL_BG_SIZE[ soil_index ];
    }

	static addToGameWindow(element) {
		let game = document.getElementById("game-window");
		game.appendChild(element);
	}

	static refreshAllHitboxesVisibility() {
		for (let hitbox of MainController.hitboxes)
			hitbox.style.opacity = MainController.scope.game.showHitboxes ? "1" : "0";
	}

	static closeAllPopups() {
		let gamepadControlsUI = MainController.scope.gamepadControlsUI;
		
		if (gamepadControlsUI)
			gamepadControlsUI.closeModal();
		
		if (MainController.parameters_popup)
			MainUI.__closePopup(MainController.parameters_popup);

		if (MainController.lobby_popup)
			MainUI.__closePopup(MainController.lobby_popup);
	}

	static checkPanicMode() {
		let panic_threshold = PANIC_MODE_THRESHOLD_RATIO * CHARACTER_MAX_LIFE;
		let panic_element = MainController.panicModeHtmlElement;
		
		if (!panic_element && MainController.scope.game.health_points <= panic_threshold) {
			panic_element = document.createElement("DIV");
			panic_element.classList.add("panic-mode");
			document.body.prepend(panic_element);
		}

		if (panic_element && MainController.scope.game.health_points > panic_threshold)
			panic_element.remove();
	}

	static endOfWave(isVictory) {
		MainController.startWave();
	}

    static __prepareWaveSwagAutoRefresh() {
		new RS_Binding({
			object: MainController.scope.game,
			property: "wave_swag"
		}).addBinding(document.getElementById("wave-swag"), "innerHTML");
    }

    static __prepareAmmoAutoRefresh() {
		let html_element = document.querySelector(".ammo-display #current");
        new RS_Binding({
			object: MainController.scope.game,
			property: "clip_ammo",
			callback: () => {
				if (!MainController.scope.game.clip_ammo)
					html_element.classList.add("out");
				else html_element.classList.remove("out");
			}
		}).addBinding(html_element, "innerHTML");
		document.querySelector(".ammo-display #total").innerHTML = CLIP_SIZE;
    }

    static __createLifeBar() {
		let character_health_bar = new MV_Gauge("character-health-bar", CHARACTER_MAX_LIFE, MainController.scope.game.health_points);
		MainUI.addToGameWindow(character_health_bar);
        return character_health_bar;
    }

    static __prepareLifeBarAutoRefresh(character_health_bar) {
		new RS_Binding({
			object: MainController.scope.game,
			property: "health_points",
			callback: () => { character_health_bar.assignValue(MainController.scope.game.health_points); }
		});
    }

    static __createXpBar() {
		let xp_bar = new MV_Gauge("xp-bar", MV_GameScope.levelUpAt(), MainController.scope.game.current_level_xp);
		MainUI.addToGameWindow(xp_bar);
        return xp_bar;
    }

    static __prepareLevelAndXpAutoRefresh(xp_bar) {
		new RS_Binding({
			object: MainController.scope.game,
			property: "current_level_xp",
			callback: () => { xp_bar.assignValue(MainController.scope.game.current_level_xp); }
		});
		new RS_Binding({
			object: MainController.scope.game,
			property: "player_level",
			callback: () => { 
				document.querySelector(".player-level").innerHTML = MainController.scope.game.player_level; 
				xp_bar.assignValue(MainController.scope.game.current_level_xp);
				xp_bar.setMaxValue(MV_GameScope.levelUpAt());
			}
		});
    }

	static __closePopup(rs_dialog_instance) {
		rs_dialog_instance.closeModal(()=> {
			rs_dialog_instance = null;
		});
	}
}