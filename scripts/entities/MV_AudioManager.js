class MV_AudioManager {

	/**
	 * Constructeur attendant une référence au paramétrage du son
	 * 
	 * @param 	{object} 	sound_settings 	Doit contenir les propriétés booléennes `music_on` et `sound_fx_on` et référencer l'objet qui sera mis à jour par les paramètres utilisateur
	 */
	constructor(sound_settings) {
		this.sound_settings = sound_settings;
		this.loops = [];
	}

	/**
	 * Fonction lançant un son dans une balise audio créée à la volée
	 *
	 * @param      {string}  filename      	 Nom du fichier audio
	 * @param      {number}  lasting_time  	 Durée de vie de la balise audio (en fonction du son envoyé)
	 * @param      {boolean} is_music      	 Permet de différencier effets sonores et musiques (pour application des paramètres)
	 */
	playAudio(filename, lasting_time, is_music) {
		let audio_player = this.__createAudioTag(filename, is_music, false);
		
		if (audio_player) {
			if (!lasting_time)
				lasting_time = DEFAULT_AUDIO_LASTING_TIME;
			setTimeout(()=> audio_player.remove(), lasting_time);
		}
	}

	/**
	 * Lance une boucle sonore
	 *
	 * @param		{string}  filename        	Le nom du fichier
	 * @param      	{boolean} is_music      	Permet de différencier effets sonores et musiques (pour application des paramètres)
	 * @param      	{string}  loop_id      		Permet d'identifier formellement une boucle audio
	 */
	startAudioLoop(filename, is_music, loop_id) {
		let audio_player = this.__createAudioTag(filename, is_music, true);

		if (audio_player) {
			this.loops.push({
				id: loop_id,
				audio_player: audio_player
			});
		}
	}

	/**
	 * Arrête la musique et supprime le lecteur du DOM
	 *
	 * @param		{string}  loop_id  Permet d'identifier formellement une boucle audio
	 */
	stopAudioLoop(loop_id) {
		for (let i=0; i<this.loops.length; i++) {
			let loop = this.loops[i];
			if (loop.id === loop_id) {
				loop.audio_player.pause();
				loop.audio_player.remove();
				this.loops.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Crée, initialise, ajoute au DOM, et retourne une balise audio (ou undefined, si le paramétrage ne le permet pas)
	 * 
	 * @param {string} 		filename 
	 * @param {boolean} 	is_music 
	 * @param {boolean} 	is_loop
	 */
	__createAudioTag(filename, is_music, is_loop) {
		if (!this.__canBePlayed(is_music))
			return;
		
		let audio_player = document.createElement("AUDIO");
		audio_player.src = AUDIO_PATH + filename;
		audio_player.loop = is_loop;
		document.body.appendChild(audio_player);
		audio_player.play().catch((error)=> { console.error(error); });

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
}