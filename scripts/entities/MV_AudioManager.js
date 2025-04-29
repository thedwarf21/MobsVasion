class MV_AudioManager {

	/**
	 * Constructeur attendant une référence au paramétrage du son
	 * 
	 * @param 	{object} 	sound_settings 	Doit contenir les propriétés booléennes `music_on` et `sound_fx_on` et référencer l'objet qui sera mis à jour par les paramètres utilisateur
	 */
	constructor(sound_settings) {
		this.sound_settings = sound_settings;
		this.sound_lib = {};
		
		this.__initFromConfig(SOUND_LIB);
	}

	/**
	 * Fonction lançant un son dans une balise audio créée à la volée
	 *
	 * @param      {string}  sound_key  Nom de la propriété de SOUND_LIB, définissant le fichier audio et son paramétrage
	 */
	playAudio(sound_key) {
		let sound_entry = this.sound_lib[sound_key];

		if (!sound_entry) {
			console.error(`MV_AaudioManager.playAudio() --> son ${sound_key} inconnu.`);
			return;
		}
		
		if (this.__canBePlayed(sound_entry.is_music)) {
			let audio_element = this.__getAvailableElement(sound_entry);
			audio_element.currentTime = 0;
			audio_element.play().catch((error)=> { console.error(error); });
		}
	}

	/**
	 * Arrête la musique et supprime le lecteur du DOM
	 *
	 * @param		{string}  sound_key  Nom de la propriété de SOUND_LIB, définissant le fichier audio et son paramétrage
	 */
	stopAudioLoop(sound_key) {
		let sound_entry = this.sound_lib[sound_key];

		if (!sound_entry) {
			console.error(`MV_AaudioManager.playAudio() --> son ${sound_key} inconnu.`);
			return;
		}

		sound_entry.elements[0].pause();  // Les boucles audio sont uniques dans le pool
	}

	/**
	 * Arrête la lecture de tous les lecteurs audio, répertoriés comme musique
	 */
	stopMusic() {
		for (let key in this.sound_lib) {
			let sound_entry = this.sound_lib[key];
			if (sound_entry.is_music)
				sound_entry.elements[0].pause();    // Les musiques sont toujours des boucles et sont donc uniques dans le pool
		}
	}

	/**
	 * Initialise `this.sound_lib` sur la base d'un objet de configuration passé en paramètre
	 * 
	 * @param {object} sounds_lib_config  Objet de configuration des sons (chemin, boucle/simple, fx/music, noumbre d'occurrences de lecteur audio)
	 */
	__initFromConfig(sounds_lib_config) {
		for (const key in sounds_lib_config) {
			const sounds_config_entry = sounds_lib_config[key];

			this.sound_lib[key] = {
				is_loop: sounds_config_entry.is_loop,
				is_music: !!sounds_config_entry.is_music,
				elements: []
			};

			this.sound_lib[key].elements = this.__getConfigEntryElements(sounds_config_entry);
		}
	}

	/**
	 * Instancie et attache au DOM le nombre de lecteurs requis, puis en retourne la liste
	 * 
	 * @param {object} sounds_config_entry  Objet de configuration d'un son précis
	 */
	__getConfigEntryElements(sounds_config_entry) {
		let players_number = sounds_config_entry.players_number;
		let elements = [];

		if (!players_number)
			players_number = 1;
		
		for (let i = 0; i < players_number; i++)
			elements.push( this.__createAudioTag(sounds_config_entry.file, sounds_config_entry.is_loop) );

		return elements;
	}

	/**
	 * Crée, initialise, ajoute au DOM, et retourne une balise audio (ou undefined, si le paramétrage ne le permet pas)
	 * 
	 * @param {string} 		filename 
	 * @param {boolean} 	is_loop
	 */
	__createAudioTag(filename, is_loop) {
		let audio_player = document.createElement("AUDIO");
		audio_player.src = AUDIO_PATH + filename;
		audio_player.loop = is_loop;
		audio_player.style.display = 'none';
		document.body.appendChild(audio_player);

		return audio_player;
	}

	/**
	 * Vérifie les paramètres son
	 * 
	 * @param {boolean} is_music
	 */
	__canBePlayed(is_music) {
		return is_music 
			 ? this.sound_settings.music_on 
			 : this.sound_settings.sound_fx_on;
	}

	/**
	 * Permet de récupérer l'élément le plus pertinent pour lancer un son, au sein de `sound_entry.elements`
	 * 
	 * @param {object} sound_entry  Objet de travail correspondant à un son précis 
	 */
	__getAvailableElement(sound_entry) {
		let max_current_time = 0;
		let best_choice_index;

		for (let i = 0; i < sound_entry.elements.length; i++) {
			let element = sound_entry.elements[i];
			if (element.paused)
				return element;

			if (element.currentTime > max_current_time) {
				max_current_time = element.currentTime;
				best_choice_index = i;
			}
		}

		return sound_entry.elements[ best_choice_index ];
	}
}