# Vue d'ensemble

À mesure que les fonctionnalités arrivent, le projet gagne en complexité (un projet informatique, quoi...).

Je vous propose d'en parcourir les éléments constituants, par thématiques.


## Genèse

Au moment de démarrer, j'ai commencé par rassembler des briques logicielles, provenant de mes précédents projets. Tel que je voyais l'architecture logicielle du projet à ce moment-là, elle devait ressembler à ceci :

![image](initial_archi.excalidraw.svg)

Puis, une chose en entrainant une autre, la quasi-totalité de l'architecture a évolué, afin d'accueillir les nouvelles fonctionnalités (vous savez ce que c'est :smirk:)

Les deux gros morceaux que j'ai conservés sont les suivants :


### Configuration de la manette

le couple `GamepadGenericAdapter` + `GamepadConfigUI`, me permet d'abstraire l'API native Gamepad, en générant une liste d'actions (avec code à exécuter au déclenchement), puis en mappant ces actions aux boutons de la manette, via l'UI de configuration, dont l'ouverture automatique est déclenchée lorsqu'une manette est détectée.


### ViewPortCompatibility

Cette classe gère un système de coordonnées virtuelles, et s'occupe de convertir ces valeurs de coordonnées en positionnement réel dans la viewport.

Pour faire simple : 

* elle assume un axe principal et une dimension virtuelle pour cet axe
* elle met à jour dynamiquement le ratio de la viewport, afin d'en extrapoler les dimensions virtuelles de l'écran sur l'axe secondaire
* le positionnement est exprimé en pourcentage des dimensions de la viewport sur l'axe principal => si l'axe principal est Y, alors la valeur réelle est exprimée en `vh`


## Les éléments du jeu

Parmi les briques conçues en amont pour les besoins d'autres projets, on retrouve `MobileGameElement`. 

Cette dernière a quelque peu évolué. En effet, le s'appuyait à l'origine sur `customElements`, mais pour des raisons de compatibilité avec le navigateur Safari, j'ai dû revenir à une solution plus conventionnelle, et choisir d'intégrer l'élément HTML à l'objet plutôt que d'en hériter directement.

(C'est dommage, c'était drôlement pratique)

![image](mobile_game_elements.excalidraw.svg)

5 classes héritent de ce composant. Certaines n'utilisent pas toutes les fonctionnalités de la `MobileGameElement` : par exemple, les frames animées ne se déplacent pas à l'écran et les tirs ne pivotent pas.

`MobileGameElement` gère la rotation, les déplacements, les hitbox, mais aussi et surtout, elle encapsule la conversion des coordonnées virtuelles en positionnement réel dans la vue.

Chacune des 5 classes, encapsule ensuite les propriétés et méthodes qui lui sont propres.


## Les helpers: des classes statiques qui vous veulent du bien

Ces classes proposent des méthodes statiques permettant d'abstraire certains traitements, en le encapsulant dans des use cases nommés intelligiblement.

![image](helpers.excalidraw.svg)

Ainsi, `HealthBarHelper` et `XpBarHelper` permettent de gérer respectivement la santé et l'expérience du joueur, `AnimationHelper` permet de créer des animation d'un simple appel de méthode, et `Tools` propose des fonctions utilitaires (oui, ok... c'est un fourre-tout... mais pas trop plein, vous en conviendrez).


## Le gestionnaire de boutique

Sur cette partie, je me suis fait plaisir en termes de conception :feelsgood:

Les prix et les effets d'un article du magasin, sont calculés en fonction de son niveau actuel, en se basant sur une progression calquée sur la suite de Fibonnacci.
 
![image](shop_manager.excalidraw.svg)

La classe `ShopItem` doit donc embarqué tout le nécessaire pour effectuer les calculs.

Une fois créé, un `ShopItem` fait sa vie : il met lui-même ses propres listeners en place.

La classe `ShopHealingItem` permet de gérer les articles de soin. Comme ces articles ne sont pas des améliorations, ils ne sont pas soumis aux même mécaniques que les autres articles du magasin.

La classe statique `Abilities` est le helper de la boutique : elle expose des méthodes permettant d'obtenir les valeurs à appliquer en jeu, en fonction du niveau d'amélioration courant, de l'article de boutique correspondant.