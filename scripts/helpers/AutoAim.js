class AutoAimHelper {
    static proceed() {
		const character = MainController.UI.character;
		const character_hitbox = character.hitbox;
		const nearest_monster_hitbox = AutoAimHelper.__nearestMonsterHitbox(character_hitbox);

		if (nearest_monster_hitbox) {
			character.aiming_angle = character_hitbox.getDirection( nearest_monster_hitbox );
			character.applyAngles();
		} else character.aiming_angle = character.angle;
	}

	static __nearestMonsterHitbox(character_hitbox) {
		const aimable_monsters = MainController.UI.monsters.filter((monster) => !monster.carried)
		const nearest_monster = character_hitbox.getNearest(aimable_monsters);
		return nearest_monster ? nearest_monster.hitbox : null;
	}
}