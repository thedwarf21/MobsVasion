class TrailAttackHelper {
    static performAttack(attacker, moved_monster, trail_length) {
        TrailAttackHelper.__computeMovedMonsterStartPosition(attacker, moved_monster);

        JuiceHelper.attackTrail(moved_monster, trail_length);
        
        let player_already_hit = false;
        const segmentation = Math.ceil(trail_length / CHARACTER_SIZE) + 1;
        const section_length = trail_length / segmentation;

        for (let i = 0; i < segmentation; i++)
            player_already_hit = TrailAttackHelper.__processSection(moved_monster, section_length, player_already_hit, attacker.monster_type.strength);
    }

    static __computeMovedMonsterStartPosition(attacker, moved_monster) {
        if (moved_monster === attacker)
            return;
   
        const center_spot = attacker.centralSpotPosition();
        const cos_angle = Math.cos(attacker.aiming_angle);
        const sin_angle = Math.sin(attacker.aiming_angle);
        
        moved_monster.x = center_spot.x + CHARACTER_SIZE/2 * cos_angle;
        moved_monster.y = center_spot.y + CHARACTER_SIZE/2 * sin_angle; 
        moved_monster.aiming_angle = attacker.aiming_angle;
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