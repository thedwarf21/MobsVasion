class MainUI {
	character;
	shots;
	monster_shots;
	monsters;
	primaryReloadGauge;
	secondaryReloadGauge;


	constructor() {
		this.shots = [];
		this.monsters = [];
		this.toxic_clouds = [];
		this.monster_shots = [];
		this.__prepareWaveSwagAutoRefresh();
		this.__prepareAmmoAutoRefresh();
		this.__prepareLifeBarAutoRefresh( HealthBarHelper.create() );
        this.__prepareLevelAndXpAutoRefresh( XpBarHelper.create() );
		this.__manageHudDisplay();
	}

    clearGameWindow() {
		this.__clearCharacter();
		this.__clearBloodPuddles();
		this.__clearToxicClouds();
		this.__clearMonsters();
		this.__clearMonsterShots();
		this.__clearGauges();

		const soil_index = Tools.radomValueInRange(0, 2);
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

	__clearToxicClouds() {
		for (let i = this.toxicClouds.length - 1; i >= 0; i--) {
			this.toxicClouds[i].hitbox = null;
			this.toxicClouds[i].remove();
		}
	}

	__clearMonsters() {
		for (let i = this.monsters.length - 1; i >= 0; i--) {
			this.monsters[i].root_element.remove();
			this.monsters.splice(i, 1);
		}

		//TODO essayer de comprendre pourquoi il arrive (même si c'est très rare) qu'un élément HTML de monstre ne se supprime pas correctement
		for (const monster_element of document.querySelectorAll(".monster"))
			monster_element.remove();
	}

	__clearMonsterShots() {
		for (let i = this.monster_shots.length - 1; i >= 0; i--) {
			this.monster_shots[i].root_element.remove();
			this.monster_shots.splice(i, 1);
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

	shakeGameWindow() {
		this.game_window.classList.add("shocked");
		setTimeout(()=> { this.game_window.classList.remove("shocked"); }, 500);
	}

	refreshAllHitboxesVisibility() {
		for (const hitbox of this.hitboxes)
			hitbox.style.opacity = MainController.scope.game.showHitboxes ? "1" : "0";
	}

	closeAllPopups() {
		const gamepadControlsUI = MainController.scope.gamepadControlsUI;
		if (gamepadControlsUI) {
			gamepadControlsUI.closeModal();
			MainController.scope.controls.paused = false;
		}

		MainController.popups_stack.closeAll();
	}

	pickableMonsters() {
		const result_list = [];

		for (const monster of this.monsters)
			if (monster.isPickable())
				result_list.push(monster);

		return result_list;
	}

	__manageHudDisplay() {
		if (!Tools.isMediaStadalone())
			this.hud.remove();
	}

    __prepareWaveSwagAutoRefresh() {
		new RS_Binding({
			object: MainController.scope.game,
			property: "human_readable_money",
			callback: (value)=> {   // MAJ du display de l'argent dans le magasin, si la popup est ouverte 
				if (MainController.shop_popup) 
					MainController.shop_popup.root_element.querySelector("#player_money").innerHTML = value;
			}
		}).addBinding( document.getElementById("wave-swag"), "innerHTML" );

		new RS_Binding({
			object: MainController.scope.game,
			property: "money",
			callback: (value)=> {
				MainController.scope.game.human_readable_money = Tools.intToHumanReadableString(value);
			}
		});

    }

    __prepareAmmoAutoRefresh() {
		const html_element = document.querySelector(".ammo-display #current");
        new RS_Binding({
			object: MainController.scope.game,
			property: "clip_ammo",
			callback: () => {
				if (!MainController.scope.game.clip_ammo)
					html_element.classList.add("out");
				else html_element.classList.remove("out");
			}
		}).addBinding(html_element, "innerHTML");

		Abilities.setClipSizeBinding(document.querySelector(".ammo-display #total"));
    }

    __prepareLifeBarAutoRefresh(character_health_bar) {
		this.addToGameWindow(character_health_bar.root_element);

		const html_element = document.querySelector(".health-display #current");
		html_element.innerHTML = CHARACTER_MAX_LIFE;
		new RS_Binding({
			object: MainController.scope.game,
			property: "health_points",
			callback: () => { 
				character_health_bar.assignValue(MainController.scope.game.health_points); 
				JuiceHelper.checkPanicMode();
			}
		}).addBinding(html_element, "innerHTML");

		Abilities.setMaxHealthBinding(character_health_bar, document.querySelector(".health-display #total"));
    }

    __prepareLevelAndXpAutoRefresh(xp_bar) {
		this.addToGameWindow(xp_bar.root_element);
		
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
				xp_bar.setMaxValue(XpBarHelper.levelUpAt());
				xp_bar.assignValue(MainController.scope.game.current_level_xp);
			}
		});
    }
	
	get game_window() 			{ return document.getElementById("game-window"); }
	get bloodPuddles()			{ return document.getElementsByClassName("blood-puddle"); }
	get toxicClouds() 			{ return document.getElementsByClassName("toxic-cloud"); }
	get hitboxes()				{ return document.getElementsByClassName("hitbox"); }
	get hud() 					{ return document.querySelector(".hud"); }
}