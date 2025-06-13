class TrailAttackHelper {
    static performAttack(attacker, moved_monster, trail_length) {
        JuiceHelper.attackTrail(moved_monster, attacker.aiming_angle, trail_length);
        
        let player_already_hit = false;
        const segmentation = Math.ceil(trail_length / CHARACTER_SIZE) + 1;
        const section_length = trail_length / segmentation;

        for (let i = 0; i < segmentation; i++)
            player_already_hit = TrailAttackHelper.#processSection(attacker, moved_monster, section_length, player_already_hit);
    }

    static #processSection(attacker, moved_monster, section_length, player_already_hit) {
        moved_monster.deltaX = section_length * Math.cos(attacker.aiming_angle);
        moved_monster.deltaY = section_length * Math.sin(attacker.aiming_angle);
        moved_monster.move();

        if (player_already_hit)
            return true;

        if ( moved_monster.hitbox.checkCollide(MainController.UI.character.hitbox) ) {
            HealthBarHelper.characterHit(attacker.monster_type.strength);
            return true;
        }

        return false;
    }
}