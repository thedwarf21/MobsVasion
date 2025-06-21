class MainUI {
	#controller;
	#game_scope;

	character;
	shots;
	monster_shots;
	primaryReloadGauge;
	secondaryReloadGauge;


	constructor(controller) {
		this.shots = [];
		this.monster_shots = [];

		this.#controller = controller
		this.#game_scope = controller.scope.game;
		
		this.#prepareWaveSwagAutoRefresh();
		this.#prepareAmmoAutoRefresh();
		this.#prepareLifeBarAutoRefresh( HealthBarHelper.create() );
        this.#prepareLevelAndXpAutoRefresh( XpBarHelper.create() );
		this.#manageHudDisplay();
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
			hitbox.style.opacity = this.#game_scope.showHitboxes ? "1" : "0";
	}

	pickableMonsters() {
		const result_list = [];

		for (const monster of this.monsters)
			if (monster.isPickable())
				result_list.push(monster);

		return result_list;
	}

    clearGameWindow() {
		this.#clearCharacter();
		this.#clearBloodPuddles();
		this.#clearToxicClouds();
		this.#clearBellThrowMarks();
		this.#clearMonsters();
		this.#clearMonsterShots();
		this.#clearPlayerShots();
		this.#clearGauges();

		const soil_index = Tools.radomValueInRange(0, 2);
		this.game_window.style.background = `url("images/soil_${SOILS[ soil_index ]}.png")`;
		this.game_window.style.backgroundSize = SOIL_BG_SIZE[ soil_index ];
    }

	#clearCharacter() {
		if (this.character) {
			this.character.remove();
			this.character = null;
		}
	}

	#clearBloodPuddles() {
		for (let i = this.bloodPuddles.length - 1; i >= 0; i--)
			this.bloodPuddles[i].remove();
	}

	#clearToxicClouds() {
		for (let i = this.toxic_clouds.length - 1; i >= 0; i--) {
			this.toxic_clouds[i].hitbox = null;
			this.toxic_clouds[i].remove();
		}
	}

	#clearBellThrowMarks() {
		for (let i = this.bellThrowMarks.length - 1; i >= 0; i--) {
			this.bellThrowMarks[i].hitbox = null;
			this.bellThrowMarks[i].remove();
		}
	}

	#clearMonsters() {
		for (let i = this.monsters.length - 1; i >= 0; i--) {
			this.monsters[i].remove();
			this.monsters.splice(i, 1);
		}

		//TODO essayer de comprendre pourquoi il arrive (même si c'est très rare) qu'un élément HTML de monstre ne se supprime pas correctement
		for (const monster_element of document.querySelectorAll(".monster"))
			monster_element.remove();
	}

	#clearMonsterShots() {
		for (let i = this.monster_shots.length - 1; i >= 0; i--) {
			this.monster_shots[i].remove();
			this.monster_shots.splice(i, 1);
		}
	}

	#clearPlayerShots() {
		for (let i = this.player_shots.length - 1; i >= 0; i--)
			this.player_shots[i].remove();
	}

	#clearGauges() {
		if (this.primaryReloadGauge) {
			this.primaryReloadGauge.remove();
			this.primaryReloadGauge = null;
		}

		if (this.secondaryReloadGauge) {
			this.secondaryReloadGauge.remove();
			this.secondaryReloadGauge = null;
		}
	}

	#manageHudDisplay() {
		if (!Tools.isMediaStadalone())
			this.hud.remove();
	}

    #prepareWaveSwagAutoRefresh() {
		new RS_Binding({
			object: this.#game_scope,
			property: "human_readable_money",
			callback: (value)=> {   // MAJ du display de l'argent dans le magasin, si la popup est ouverte 
				if (this.#controller.shop_popup) 
					this.#controller.shop_popup.root_element.querySelector("#player_money").innerHTML = value;
			}
		}).addBinding( document.getElementById("wave-swag"), "innerHTML" );

		new RS_Binding({
			object: this.#game_scope,
			property: "money",
			callback: (value)=> {
				this.#game_scope.human_readable_money = Tools.intToHumanReadableString(value);
			}
		});

    }

    #prepareAmmoAutoRefresh() {
		const html_element = document.querySelector(".ammo-display #current");
        new RS_Binding({
			object: this.#game_scope,
			property: "clip_ammo",
			callback: () => {
				if (!this.#game_scope.clip_ammo)
					html_element.classList.add("out");
				else html_element.classList.remove("out");
			}
		}).addBinding(html_element, "innerHTML");

		Abilities.setClipSizeBinding(document.querySelector(".ammo-display #total"));
    }

    #prepareLifeBarAutoRefresh(character_health_bar) {
		this.addToGameWindow(character_health_bar);

		const html_element = document.querySelector(".health-display #current");
		html_element.innerHTML = CHARACTER_MAX_LIFE;
		new RS_Binding({
			object: this.#game_scope,
			property: "health_points",
			callback: () => { 
				character_health_bar.assignValue(this.#game_scope.health_points); 
				JuiceHelper.checkPanicMode();
			}
		}).addBinding(html_element, "innerHTML");

		Abilities.setMaxHealthBinding(character_health_bar, document.querySelector(".health-display #total"));
    }

    #prepareLevelAndXpAutoRefresh(xp_bar) {
		this.addToGameWindow(xp_bar);
		
		new RS_Binding({
			object: this.#game_scope,
			property: "current_level_xp",
			callback: () => { xp_bar.assignValue(this.#game_scope.current_level_xp); }
		});
		new RS_Binding({
			object: this.#game_scope,
			property: "player_level",
			callback: () => { 
				document.querySelector(".player-level").innerHTML = this.#game_scope.player_level; 
				xp_bar.setMaxValue(XpBarHelper.levelUpAt());
				xp_bar.assignValue(this.#game_scope.current_level_xp);
			}
		});
    }
	
	get game_window() 			{ return document.getElementById("game-window"); }
	get bloodPuddles()			{ return document.getElementsByClassName("blood-puddle"); }
	get toxic_clouds() 			{ return document.getElementsByClassName("toxic-cloud"); }
	get bellThrowMarks()		{ return document.getElementsByClassName("bell-throw-aoe"); }
	get player_shots() 			{ return document.getElementsByClassName("shot"); }
	get hitboxes()				{ return document.getElementsByClassName("hitbox"); }
	get hud() 					{ return document.querySelector(".hud"); }

	get monsters()				{ return document.querySelectorAll(".monster"); }
}