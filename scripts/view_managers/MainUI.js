class MainUI {
	character;
	shots;
	monsters;
	primaryReloadGauge;
	secondaryReloadGauge;


	constructor() {
		this.shots = [];
		this.monsters = [];
		this.__prepareWaveSwagAutoRefresh();
		this.__prepareAmmoAutoRefresh();
		this.__prepareLifeBarAutoRefresh( this.__createLifeBar() );
        this.__prepareLevelAndXpAutoRefresh( this.__createXpBar() );
	}

    clearGameWindow() {
		this.__clearCharacter();
		this.__clearBloodPuddles();
		this.__clearMonsters();
		this.__clearGauges();		

		let soil_index = MainController.radomValueInRange(0, 2);
		this.game_window.style.background = `url("images/soil_${SOILS[ soil_index ]}.png")`;
		this.game_window.style.backgroundSize = SOIL_BG_SIZE[ soil_index ];
    }

	__clearCharacter() {
		if (this.character) {
			this.character.root_element.remove();
			this.character = null;
		}
	}

	__clearBloodPuddles() {
		for (let i = this.bloodPuddles.length - 1; i >= 0; i--)
			this.bloodPuddles[i].remove();
	}

	__clearMonsters() {
		for (let i = this.monsters.length - 1; i >= 0; i--) {
			this.monsters[i].root_element.remove();
			this.monsters.splice(i, 1);
		}
	}

	__clearGauges() {
		if (this.primaryReloadGauge) {
			this.primaryReloadGauge.root_element.remove();
			this.primaryReloadGauge = null;
		}

		if (this.secondaryReloadGauge) {
			this.secondaryReloadGauge.root_element.remove();
			this.secondaryReloadGauge = null;
		}
	}

	addToGameWindow(element) {
		this.game_window.appendChild(element);
	}

	refreshAllHitboxesVisibility() {
		for (let hitbox of this.hitboxes)
			hitbox.style.opacity = MainController.scope.game.showHitboxes ? "1" : "0";
	}

	closeAllPopups() {
		let gamepadControlsUI = MainController.scope.gamepadControlsUI;
		
		if (gamepadControlsUI)
			gamepadControlsUI.closeModal();
		
		if (MainController.parameters_popup)
			this.__closePopup(MainController.parameters_popup);

		if (MainController.shop_popup)
			this.__closePopup(MainController.shop_popup);
	}

	checkPanicMode() {
		let panic_threshold = PANIC_MODE_THRESHOLD_RATIO * CHARACTER_MAX_LIFE;
		let panic_element = this.panicModeHtmlElement;
		
		if (!panic_element && MainController.scope.game.health_points <= panic_threshold) {
			panic_element = document.createElement("DIV");
			panic_element.classList.add("panic-mode");
			document.body.prepend(panic_element);
		}

		if (panic_element && MainController.scope.game.health_points > panic_threshold)
			panic_element.remove();
	}

    __prepareWaveSwagAutoRefresh() {
		new RS_Binding({
			object: MainController.scope.game,
			property: "money"
		}).addBinding(document.getElementById("wave-swag"), "innerHTML");
    }

    __prepareAmmoAutoRefresh() {
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

    __createLifeBar() {
		let character_health_bar = new MV_Gauge("character-health-bar", CHARACTER_MAX_LIFE, MainController.scope.game.health_points);
		this.addToGameWindow(character_health_bar.root_element);
        return character_health_bar;
    }

    __prepareLifeBarAutoRefresh(character_health_bar) {
		new RS_Binding({
			object: MainController.scope.game,
			property: "health_points",
			callback: () => { character_health_bar.assignValue(MainController.scope.game.health_points); }
		});
    }

    __createXpBar() {
		let xp_bar = new MV_Gauge("xp-bar", MV_GameScope.levelUpAt(), MainController.scope.game.current_level_xp);
		this.addToGameWindow(xp_bar.root_element);
        return xp_bar;
    }

    __prepareLevelAndXpAutoRefresh(xp_bar) {
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

	__closePopup(rs_dialog_instance) {
		rs_dialog_instance.closeModal(()=> {
			rs_dialog_instance = null;
		});
	}

	
	get game_window() 			{ return document.getElementById("game-window"); }
	get bloodPuddles()			{ return document.getElementsByClassName("blood-puddle"); }
	get panicModeHtmlElement()	{ return document.querySelector(".panic-mode"); }
	get hitboxes()				{ return document.getElementsByClassName("hitbox"); }
}