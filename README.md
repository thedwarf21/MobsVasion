# MobsVasion

Un jeu infini : les niveaux sont générés automatiquement en fonction de l'avancée du joueur (dernière vague vaincue). La difficulté croit progressivement.


Le jeu devra gérer différents modes de contrôle pour les commandes : clavier + souris, manette de jeu, écran tactile


Devra permettre un affichage lisible et cohérent, quel que soit l'écran utilisé et son ratio d'affichage


Mettre en place un magasin d'améliorations, utilisable entre deux vagues de monstres (j'ai déjà le détail, mais je vous le donnerai dans le post concernant cette partie)


Le pop des monstres se fait petit à petit (un par un), sur une position aléatoire en bordure d'écran, entre 200ms et 1s après l'apparition du monstre précédent (valeurs susceptibles de bouger, pour affiner l'expérience de jeu)


La vitesse de chaque monstre est aléatoire, fixe, et déterminée lors de son apparition dans une fourchette de valeurs à déterminer


Chaque monstre se dirige en azimut brutal, dans la direction du joueur


Le joueur doit éliminer tous les monstres de la vague, pour passer à la vague suivante. S'il échoue, il peut retenter la dernière vague autant de fois qu'il lui sera nécessaire.

