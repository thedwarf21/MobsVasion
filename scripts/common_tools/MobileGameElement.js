class MobileGameElement extends HTMLElement {
	shadow_dom;

	x               = null;
	y               = null;
	deltaX          = null;
	deltaY          = null;
	angle			= null;
	pixel_size      = null;
	viewport		= null;
	rotate_element	= null;

	constructor() {
		super();
		this.shadow_dom = this.attachShadow({ mode: SHADOW_MODE });
	}

	static getInstance(viewport, css_url, x, y) { 
		const instance = document.createElement("rs-game-element");
		instance.init(viewport, css_url, x, y);
		return instance;
	}

	init(viewport, css_url, x, y) {
	  	this.classList.add("game");
		this.rotate_element = this;  // Par défaut, la rotation s'applique à l'ensemble de l'objet
	  
	  	if (!viewport) {
			console.error("MobileGameElement.constructor : le paramètre viewport est obligatoire");
			return;
	  	}
	  	if (!viewport instanceof RS_ViewPortCompatibility) {
			console.error("MobileGameElement.constructor : le paramètre viewport doit être une instance de RS_ViewPortCompatibility");
			return;
	  	}
	  	this.viewport = viewport;
	  	
	  	// Certains éléments initialisent eux-mêmes leurs coordonnées. Les paramètres peuvent donc être absents.
		if (x !== undefined && y !== undefined) {
			this.x = x;
			this.y = y;
			this.style.left = viewport.getCssValue(this.x);
			this.style.top = viewport.getCssValue(this.y);
	  	}

		RS_WCL.styleShadow(this.shadow_dom, css_url);
	}
  
	move(onScreenLeave) {
		this.y += this.deltaY;
		this.x += this.deltaX;
		
		// Gestion de l'arriver en bordure d'écran selon onScreenLeave
		//------------------------------------------------------------------
		// function  --> exécuter la fonction
		// undefined --> bloquer en bordure
	  	const window_height = this.viewport.VIRTUAL_HEIGHT,
		 	   window_width = this.viewport.VIRTUAL_WIDTH;
	  	if (onScreenLeave) {
			if (this.y > window_height || this.y < -this.pixel_size || this.x > window_width || this.x < -this.pixel_size)
				onScreenLeave();
	  	} else {
			if (this.y + this.pixel_size > window_height) 
				this.y = window_height - this.pixel_size;
			if (this.y < 0) 
				this.y = 0;
			if (this.x + this.pixel_size > window_width) 
				this.x = window_width - this.pixel_size;
			if (this.x < 0) 
				this.x = 0;
		}

	  	this.applyPosition();
		this.rotate();
	}

	applyPosition() {
		delete this.style.right;
		delete this.style.bottom;
		this.style.top = this.viewport.getCssValue(this.y);
	  	this.style.left = this.viewport.getCssValue(this.x);
	}

	rotate(forced_angle) {
		if (this.angle >= Math.PI) this.angle -= 2 * Math.PI;
    	if (this.angle < -Math.PI) this.angle += 2 * Math.PI;

    	this.rotate_element.style.transform = `rotateZ(${ forced_angle !== undefined ? forced_angle : this.angle }rad)`;
	}

	animate(animationCssClass, duration, fnPostAnimation) {
	  	this.classList.add(animationCssClass);
		if (typeof fnPostAnimation == "function")
			setTimeout(fnPostAnimation, duration);
	}
  
	addVisualHitBox(isVisible) {
		const div = document.createElement("DIV");
		div.classList.add("hitbox");
	
		// On applique le coefficient pour obtenir la marge 
		// marge de centrage => réduction du rayon = <rayon_hitbox_de_base> - <rayon_hitbox_souhaité>
		let margin, cssSize;
		if (this.hitbox_size_coef) {
			margin = this.pixel_size/2 * (1 - this.hitbox_size_coef);
			cssSize = `calc(100% - ${this.viewport.getCssValue(margin * 2)})`;
		} else {
			margin = 0;
			cssSize = "100%";
		}
		div.style.margin = this.viewport.getCssValue(margin);
		div.style.height = cssSize;
		div.style.width = cssSize;
		div.style.opacity = isVisible ? "1" : "0";
		this.appendChild(div);
	}

	addImageElt(css_class_name) {
		this.rotate_element = document.createElement("DIV");
		this.rotate_element.classList.add(css_class_name);
		this.appendChild(this.rotate_element);
	}

	setHitboxDisplay(makeVisible) { 
		this.querySelector(".hitbox").style.opacity = makeVisible ? "1" : "0";
	}

    centralSpotPosition() {
        return {
            x: this.x + (this.pixel_size / 2),
            y: this.y + (this.pixel_size / 2)
        };
    }

	frontSpotPosition() {
		const center_spot = this.centralSpotPosition();
        const cos_angle = Math.cos(this.aiming_angle || this.angle);
        const sin_angle = Math.sin(this.aiming_angle || this.angle);
        
        return { 
            x: center_spot.x + this.pixel_size/2 * cos_angle,
            y: center_spot.y + this.pixel_size/2 * sin_angle
        };
	}

	appendChild(element) { return this.shadow_dom.appendChild(element); }
	querySelector(selector) { return this.shadow_dom.querySelector(element); }
 
	get hitbox() {
		const radius_coef = this.hitbox_size_coef || 1;
		
		return new RS_Hitbox(RS_Hitbox.SHAPE_CIRCLE, {
			radius: this.pixel_size/2 * radius_coef,
			x: this.x + (this.pixel_size / 2),
			y: this.y + (this.pixel_size / 2)
		});
	}

	set hitbox(value) { console.error("La propriété hitbox de MobileGameElement est en lecture seule."); }
}
customElements.define("rs-game-element", MobileGameElement);