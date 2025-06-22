class MonsterTutoPopup extends AbstractPopup {
    rs_dialog_instance;

    #params;
    #timer;

    constructor(options) {
        super();
        this.#params = options;
    }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog(MainController.language_manager, this.#params.title_key, "tpl_monster_tutorial.html", ()=> {
            const monster_viewer = this.querySelector("#monster_view");
            monster_viewer.appendChild( this.#getMonsterPicture() );
            
            this.#addSpecialElement(monster_viewer);
            this.#initMessageContainerContent();

            const close_button = this.querySelector("#btn_close");
            MainController.language_manager.setTranslatedContent(close_button, "tutorial_next", "value");
            onPopupOpened();
		});

		document.body.appendChild(this.rs_dialog_instance.root_element);
        MainController.tuto_popup = this.rs_dialog_instance;
	}

    close() {
        super.close();
        MainController.tuto_popup = null;

        if (this.#params.special_element)
            this.#params.special_element.remove();

        if (this.#timer)
            clearInterval(this.#timer);
    }

    #getMonsterPicture(monster_viewer) {
        const monster = this.#params.monster_class.getInstance(MainController.viewport, 0, 0);
        monster.style.position = "unset";
        monster.rotate_element.style.position = "unset";
        
        if (this.#params.attack) {
            this.#timer = setInterval(()=> {
                this.#params.attack.prepareSound();
                monster.classList.add("attack-animation");
                setTimeout(()=> {
                    this.#params.attack.sound();
                    monster.classList.remove("attack-animation");
                }, this.#params.attack.duration);
            }, this.#params.attack.interval);
        }

        return monster;
    }

    #addSpecialElement(monster_viewer) {
        if (this.#params.special_element)
            monster_viewer.appendChild(this.#params.special_element);
    }

    #initMessageContainerContent() {
        const message_container = this.querySelector("#message");
        MainController.language_manager.setTranslatedContent(message_container, this.#params.message, "innerHTML");
    }

    /*********  AbstractPopup methods implementation  *********/
    navigateUp() {}
    navigateDown() {}
    navigateLeft() {}
    navigateRight() {}
}