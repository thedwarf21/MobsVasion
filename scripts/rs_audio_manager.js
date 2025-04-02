class RS_AudioManager {

	/**
	 * Constructeur attendant une référence au paramétrage du son
	 * 
	 * @param 	{object} 	sound_settings 	Doit contenir les propriétés booléennes `music_on` et `sound_fx_on` et référencer l'objet qui sera mis à jour par les paramètres utilisateur
	 */
	constructor(sound_settings) {
		this.sound_settings = sound_settings;
		this.audio_player = undefined;
	}

	/**
	 * Fonction lançant un son dans une balise audio créée à la volée
	 *
	 * @param      {string}  filename      	 Nom du fichier audio
	 * @param      {number}  lasting_time  	 Durée de vie de la balise audio (en fonction du son envoyé)
	 * @param      {boolean} is_music      	 Permet d'identifier effets sonores et musiques
	 */
	playAudio(filename, lasting_time, is_music) {
		let can_play = is_music 
					 ? this.sound_settings.music_on 
					 : this.sound_settings.sound_fx_on;
		if (can_play) {
			this.audio_player = document.createElement("AUDIO");
			this.audio_player.src = AUDIO_PATH + filename;
			document.body.appendChild(this.audio_player);
			this.audio_player.play().catch((error)=> { console.error(error); });

			// On retire la balise audio du DOM, dès lors qu'elle n'est plus utile
			if (!lasting_time)
				lasting_time = DEFAULT_AUDIO_LASTING_TIME;
			setTimeout(()=> this.audio_player.remove(), lasting_time);	
		}
	}

	/**
	 * Lance une musique d'ambiance, en boucle
	 *
	 * @param		{string}  filename        Le nom du fichier
	 */
	startMusicLoop(filename) {
		if (this.sound_settings.music_on) {
			this.stopMusicLoop();
			this.audio_player = document.createElement("AUDIO");
			this.audio_player.src = AUDIO_PATH + filename;
			this.audio_player.loop = true;
			document.body.appendChild(this.audio_player);
			this.audio_player.play().catch((error)=> { console.error(error); });
			AH_MainController.scope.music_player = audio_player;
		}
	}

	/**
	 * Arrête la musique et supprime le lecteur du DOM
	 */
	stopMusicLoop() {
		if (this.audio_player) {
			this.audio_player.pause();
			this.audio_player.remove();
		}
	}
}