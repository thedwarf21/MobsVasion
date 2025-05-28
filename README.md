# MobsVasion

Projet "build in public"


## Présentation

Il s'agit d'un jeu infini : les niveaux sont générés automatiquement en fonction de l'avancée du joueur (dernière vague vaincue). La difficulté croit progressivement.

Le jeu gère différents modes de contrôle pour les commandes : 

* clavier + souris,
* manette de jeu, 
* écran tactile

MobsVasion propose un affichage lisible et cohérent, quel que soit l'écran utilisé et son ratio d'affichage.

Le joueur affronte des vagues de monstres. Ce faisant, il obtient de l'expérience et de l'argent.

Un magasin d'améliorations, utilisable entre deux vagues de monstres, permet au joueur de se ravitailler et d'améliorer les capacités de son personnage.

L'apparition des monstres de la vague se fait petit à petit (un par un), sur une position aléatoire en bordure d'écran, entre 1s et 2s après l'apparition du monstre précédent.

La vitesse de chaque monstre est fixe, et déterminée aléatoirement lors de son apparition, dans une fourchette de valeurs données, selon le type de monstre.

Chaque monstre se dirige en azimut brutal, dans la direction du joueur, à l'exception du golgoth qui, si un monstre susceptible d'être utilisé comme projectile se trouve plus près de lui, cherchera à aller le ramasser pour le lancer en direction du joueur.

Le joueur tire à distance. La visée se fait par :

* souris : positionnement de la souris, 
* manette : via le joystick doit de la manette, ou en direction du monstre le plus proche avec la commande "Tir visée auto"
* écran tactile : en direction du monstre le plus proche

Lorsqu'un "vorace" ou un "golgoth" est au contact du joueur, ce dernier perd des points de vie.

Le joueur doit éliminer tous les monstres de la vague, pour passer à la vague suivante. S'il échoue, il peut retenter la dernière vague autant de fois qu'il lui sera nécessaire. Toutefois, lorsqu'il échoue, de l'argent est prélevé sur son butin pour assurer ses soins. 

S'il ne dispose pas de l'argent nécessaire à la récupération totale de sa santé, il ne bénéficiera que d'un soin partiel, et devra poursuivre l'aventure ainsi :goberserk:


## Tutoriel intégré

Votre aventure débute par votre rencontre avec un PNJ, qui vous guidera ensuite dans le jeu :

* commandes
* fonctionnement du magasin
* différents types de monstres


## Sauvegare automatique

Votre partie est automatiquement sauvegardée via le `LocalStorage`, à chaque fin de vague et lorsque vous fermez le magasin pour affronter la vague suivante.

Lorsque le jeu s'ouvre, si une sauvegarde est détectée, le choix vous est donné entre reprendre la partie sauvegardée ou commencer une nouvelle partie et écraser la sauvegarde existante.


## Documentation technique

[Regarder sous le capot](docs/overview.md)