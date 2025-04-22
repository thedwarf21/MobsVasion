# MobsVasion

Projet "build in public"


## Présentation

Il s'agit d'un jeu infini : les niveaux sont générés automatiquement en fonction de l'avancée du joueur (dernière vague vaincue). La difficulté croit progressivement.

Le jeu gère différents modes de contrôle pour les commandes : 

* clavier + souris,
* manette de jeu, 
* écran tactile (pas encore implémenté)

MobsVasion propose un affichage lisible et cohérent, quel que soit l'écran utilisé et son ratio d'affichage.

Le joueur affronte des vagues de monstres. Ce faisant, il obtient de l'expérience et de l'argent.

Un magasin d'améliorations, utilisable entre deux vagues de monstres, permet au joueur de se ravitailler et d'améliorer les capacités de son personnage.

L'apparition des monstres de la vague se fait petit à petit (un par un), sur une position aléatoire en bordure d'écran, entre 2.4s et 4s après l'apparition du monstre précédent (valeurs susceptibles de bouger, pour affiner l'expérience de jeu).

La vitesse de chaque monstre est fixe, et déterminée aléatoirement lors de son apparition, dans une fourchette de valeurs.

Chaque monstre se dirige en azimut brutal, dans la direction du joueur.

Le joueur tire à distance (visée par positionnement souris, ou via l'un des joysticks manette/tactile)

Lorsqu'un monstre est au contact du joueur, ce dernier perd des points de vie.

Le joueur doit éliminer tous les monstres de la vague, pour passer à la vague suivante. S'il échoue, il peut retenter la dernière vague autant de fois qu'il lui sera nécessaire. Toutefois, lorsqu'il échoue, de l'argent est prélevé sur son butin pour assurer ses soins. 

S'il ne dispose pas de l'argent nécessaire à la récupération totale de sa santé, il ne bénéficiera que d'un soin partiel, et devra poursuivre l'aventure ainsi :goberserk:


## Les commandes

### Clavier

Vous pouvez déplacer le personnage à l'aide des touches Z, Q, S et D.

La barre espace vous permet de bondir dans la direction du déplacement (dash).

Le clic gauche de la souris permet de tirer dans la direction pointée.

Le clic droit de la souris permet de recharger l'arme principale.


### Manette

Pour jouer avec la manette, il faut tout d'abord que celle-ci soit détectée par le jeu.

Pour se faire, il vous suffit de presser n'importe quel bouton de la manette, tandis que le jeu est ouvert. Un fenêtre de configuration de la manette s'ouvrira alors, vous permettant de paramétrer les boutons d'action pour les actions :

* Pause
* Dash
* Rechargement de l'arme principale

À ce jour, la manette n'est pas prise en charge dans les menus, donc il vous faudra garder la souris à proximité, le temps que cette fonctionnalité soit implémentée.


## Bientôt disponible

À venir prochainement :

* Des sons et de la musique
* La possibilité de sauvegarder/charger une partie (c'est mieux pour un jeu infini)
* Des commandes tactiles pour jouer sur un smartphone
* Prise en charge de la manette dans les menus
* Une intro avec un mini-tutoriel (j'ai déjà un PNJ, autant en profiter)


À venir en seconde intention :

* Plus d'améliorations
* Différents types de monstres
* Différentes armes pour le tir principal
* Différentes options de tir secondaire


## Documentation technique

[Regarder sous le capot](docs/overview.md)