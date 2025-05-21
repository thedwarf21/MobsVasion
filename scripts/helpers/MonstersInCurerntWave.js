class MonstersInCurerntWave { //TODO supprimer ce helper quand la mécanique utilisant le MV_WaveGenerator sera en place
    static healthPoints() {
        const wave_number = MainController.scope.game.wave_number;
        return MOBS_BASE_HEALTH + (wave_number - 1) * MOBS_HP_ADD_PER_WAVE;
    }

    static mobsNumber() {
        const wave_number = MainController.scope.game.wave_number;
        return MOBS_ON_FIRST_WAVE + (wave_number - 1) * MOBS_ADD_PER_WAVE;
    }
}