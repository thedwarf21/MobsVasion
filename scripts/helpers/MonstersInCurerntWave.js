class MonstersInCurerntWave {
    static healthPoints() {
        let wave_number = MainController.scope.game.wave_number;
        return MOBS_ON_FIRST_WAVE + (wave_number - 1) * MOBS_HP_ADD_PER_WAVE;
    }

    static mobsNumber() {
        let wave_number = MainController.scope.game.wave_number;
        return MOBS_BASE_HEALTH + (wave_number - 1) * MOBS_ADD_PER_WAVE;
    }
}