class TrailAttackHelper {
    static performAttack(attacker, moved_monster, trail_length) {
        moved_monster.aiming_angle = attacker.aiming_angle;
        JuiceHelper.attackTrail(moved_monster, trail_length);
        
        let player_already_hit = false;
        const segmentation = Math.ceil(trail_length / CHARACTER_SIZE) + 1;
        const section_length = trail_length / segmentation;

        for (let i = 0; i < segmentation; i++)
            player_already_hit = TrailAttackHelper.__processSection(moved_monster, section_length, player_already_hit, attacker.monster_type.strength);
    }

    static __processSection(moved_monster, section_length, player_already_hit, strength) {
        moved_monster.deltaX = section_length * Math.cos(moved_monster.aiming_angle);
        moved_monster.deltaY = section_length * Math.sin(moved_monster.aiming_angle);
        moved_monster.move();

        if (player_already_hit)
            return true;

        if ( moved_monster.hitbox.checkCollide(MainController.UI.character.hitbox) ) {
            JuiceHelper.hitEffect();
            HealthBarHelper.characterHit(strength);
            return true;
        }

        return false;
    }
}