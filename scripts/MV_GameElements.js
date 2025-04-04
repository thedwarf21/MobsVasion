/**
 * Classe gérant le personnage, en tant qu'élément graphique
 */
class MV_Character extends MobileGameElement {

  constructor(viewport) {
    super(viewport);
    this.classList.add("character");
    this.__init();
  }

  __init() {
    this.angle = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.pixel_size = CHARACTER_SIZE;

    let viewport = MainController.viewport;
    this.x = (viewport.VIRTUAL_WIDTH - CHARACTER_SIZE) / 2;
    this.y = (viewport.VIRTUAL_HEIGHT - CHARACTER_SIZE) / 2;
    this.style.top = viewport.getCssValue(this.y, true);
    this.style.left = viewport.getCssValue(this.x, false);

    super.addVisualHitBox();
  }

  /*move() {
    super.move();

    if (this.angle >= 360) this.angle -= 360;
    if (this.angle < 0) this.angle += 360;
    this.style.transform = "rotateZ(" + this.angle + "deg)";
  }

  shoot() {
    let scope = MainController.scope;

    // Calcul des coordonnées d'apparition du tir :
    //  -> x et y correspondent au coin supérieur gauche.
    //  -> il faut déterminer le point central du vaisseau pour déterminer les coordonnées d'apparition du tir selon l'angle
    let angle_rad = this.angle * Math.PI / 180;
    let power = AH_Shop.getShopAttributeValue("POW");
    let x = this.x + (SPACESHIP_SIZE / 2) + (Math.sin(angle_rad) * SPACESHIP_SIZE / 2) - (power * SHOT_BASE_SIZE / 2);
    let y = this.y + (SPACESHIP_SIZE / 2) - (Math.cos(angle_rad) * SPACESHIP_SIZE / 2) - (power * SHOT_BASE_SIZE / 2);

    // Création du tir
    new AH_Shot(power, this.angle, AH_Shop.getShopAttributeValue("VEL"), x, y);
  }
    
  explode() {

    // Après l'animation d'explosion du vaisseau, on ouvre le rapport de fin de vague et on ré-initialise la
    // position et l'angle et les déplacements du vaisseau pour le niveau suivant
    super.explode(()=> { 
      MainController.showWaveIncomesReport(true);
      this.__init();
    });

    // Mise en pause
    MainController.scope.controls.paused = true;
  }*/
}
customElements.define('ah-js-spaceship', MV_Character, { extends: 'div' });

/*
class AH_Shot extends MobileGameElement {
  
  constructor(power, angle, velocity, x, y) {
    super(x, y);
    this.classList.add("shot");

    this.pixel_size = SHOT_BASE_SIZE * power;
    let cssSize = AH_MainController.ah_viewport.getCssValue(this.pixel_size, true);
    this.style.width = cssSize;
    this.style.height = cssSize;

    this.power = power;

    this.angle_rad = angle * Math.PI / 180;
    this.velocity = velocity;
    this.deltaX = velocity * Math.sin(this.angle_rad);
    this.deltaY = velocity * Math.cos(this.angle_rad);

    AH_MainController.addToGameWindow(this);
  }

  move() { super.move(true); }

  explode() {
    super.explode(()=> { this.remove(); });
    this.classList.remove("shot"); // Evite que le tir soit pris en compte par les tests de collision, pendant l'animation de son explosion
  }
}
customElements.define('ah-js-shot', AH_Shot, { extends: 'div' });

class AH_Asteroid extends MobileGameElement {

  constructor(size, x, y) {

    super(x, y);
    this.classList.add("asteroid");
    this.hitbox_size_coef = AST_HITBOX_RADIUS_COEF;
    this.__init(size, x, y);

    // Ajout de la barre de vie
    // La fonction à besoin de this.pixel_size (initialisé dans this.__init()), 
    // il est donc important que l'appel à createLifeBar() soit effectué après this.__init()
    this.__createLifeBar();

    AH_MainController.addToGameWindow(this);
  }

  __createLifeBar() {
    this.life_bar = document.createElement("DIV");
    this.life_bar.classList.add("life-bar");
    this.life_bar.classList.add("game");
    this.life_bar.style.width = AH_MainController.ah_viewport.getCssValue(this.pixel_size, true);
    
    this.life_ink = document.createElement("DIV");
    this.life_ink.classList.add("life-ink");
    this.life_ink.style.width = (this.health / this.max_health * 100) + "%";
    this.life_bar.appendChild(this.life_ink);
    
    AH_MainController.addToGameWindow(this.life_bar);
  }

  __refreshLifeBar() { this.life_ink.style.width = (this.health / this.max_health * 100) + "%"; }

  __init(size, x, y) {

    let pixel_size = BASE_AST_SIZE * size;
    this.style.width = AH_MainController.ah_viewport.getCssValue(pixel_size, true);
    this.style.height = AH_MainController.ah_viewport.getCssValue(pixel_size, true);

    // On crée la hitbox visuelle
    super.addVisualHitBox();

    // Si les coordonnées sont passées en paramètre, on les initialise sinon c'est aléatoire
    if (x == undefined && y == undefined) {
      //--------- GESTION DU RANDOM SPOT DE DEBUT DE VAGUE ----------
      // Les astéroïdes apparaissent sur des bandes de 100px de chaque côté de l'écran
      // La position sur ces bandes est aléatoire : 0 < x < 200. Si 0 < x < 100 => gauche, sinon droite.
      // Ces cooredonnées représentent le milieu des astéroïdes. Il faut donc en déduire les propriétés left et top.
      let x = AH_MainController.entierAleatoire(AST_SPAWN_ZONE_WIDTH * 2 - 1); // *2 pour gérer les deux bandes et -1 pour avoir un nombre pair de valeurs possibles (prise en compte de la valeur 0)
      let y = AH_MainController.entierAleatoire(AH_MainController.ah_viewport.VIRTUAL_HEIGHT);

      // Placement de l'astéroïde côté gauche ou côté droit selon x (première tranche à gauche, seconde à droite)
      this.x = x < AST_SPAWN_ZONE_WIDTH
             ? x - (pixel_size / 2)
             : x - (pixel_size / 2) + AST_SPAWN_ZONE_WIDTH + (AH_MainController.ah_viewport.VIRTUAL_WIDTH - (AST_SPAWN_ZONE_WIDTH * 2));
      this.y = y - (pixel_size / 2);
      this.style.top = AH_MainController.ah_viewport.getCssValue(this.y, true);
      this.style.left = AH_MainController.ah_viewport.getCssValue(this.x, false);
    }

    // Application de la rotation aléatoire, de la vie et des aspects graphiques liés aux corrdonnées afin d'éviter les collisions ramdom lors du pop
    this.deltaX = AH_MainController.reelAleatoire(AST_MAX_INITIAL_AXIAL_SPEED) - (AST_MAX_INITIAL_AXIAL_SPEED / 2);
    this.deltaY = AH_MainController.reelAleatoire(AST_MAX_INITIAL_AXIAL_SPEED) - (AST_MAX_INITIAL_AXIAL_SPEED / 2);
    this.display_angle = AH_MainController.reelAleatoire(360);
    this.radial_speed = AH_MainController.reelAleatoire(1 / AST_RADIAL_SPEED_DIVIDER) - (0.5 / AST_RADIAL_SPEED_DIVIDER);
    this.pixel_size = pixel_size;
    this.size = size;
    this.max_health = BASE_AST_LIFE * size;
    this.health = BASE_AST_LIFE * size;
  }

  move() {
    super.move();
    this.display_angle += this.radial_speed;

    // Permet de conserver à tout moment un angle compris entre 0° et 360° (plus pratique pour le debugging)
    if (this.display_angle >= 360) this.display_angle -= 360;
    if (this.display_angle < 0) this.display_angle += 360;

    // Application des nouvelles coordonnées et de l'angle
    this.life_bar.style.top = AH_MainController.ah_viewport.getCssValue(this.y, true);
    this.life_bar.style.left = AH_MainController.ah_viewport.getCssValue(this.x, false);
    this.style.transform = "rotateZ(" + this.display_angle + "deg)";
  }

  impact(angle_rad, power) {
    this.health -= power;

    // Si la vie tombe à ou sous 0 => explosion, sinon on applique les modifications inertielles
    if (this.health <= 0) {
      this.life_bar.remove();
      this.explode();
    } else {
      this.__refreshLifeBar();
      this.deltaX += Math.sin(angle_rad) * power;
      this.deltaY += Math.cos(angle_rad) * power;
      this.radial_speed += AH_MainController.reelAleatoire(1 / AST_RADIAL_SPEED_DIVIDER) - (0.5 * AST_RADIAL_SPEED_DIVIDER) * power;
    }
  }

  explode() {
    super.explode(()=> { this.remove(); });
    this.classList.remove("asteroid");

    // Selon la taille de l'astéroïde : si 1 (taille mini) -> gain d'argent, sinon création d'un bonus et de deux astéroïdes plus petits
    if (this.size > 1) {

      // Calcul des coordonnées médianes du this
      let x_center = this.x + BASE_AST_SIZE / 2;
      let y_center = this.y + BASE_AST_SIZE / 2;

      // Création de <NUMBER_OF_SUB_AST> nouveaux astéroïdes plus petits
      for (let i=0; i < NUMBER_OF_SUB_AST; i++) {
        let asteroid = new AH_Asteroid(this.size - 1, x_center, y_center);
        AH_MainController.addToGameWindow(asteroid);
      }

      // Création du bonus
      let bonus = new AH_Bonus(x_center, y_center);
      AH_MainController.addToGameWindow(bonus);
    } else {
      // Gain d'argent puis, vérification de fin de niveau (plus d'astéroïde à détruire ?)
      AH_MainController.scope.game.tinyAstDestroyed++;
      AH_MainController.checkLevelEnd();
    }
  }
}
customElements.define('ah-js-asteroid', AH_Asteroid, { extends: 'div' });
*/