class MonsterTutoPopup extends AbstractPopup {
    rs_dialog_instance;

    #params;

    constructor(options) {
        super();
        this.#params = options;
    }

    show(onPopupOpened) {
        this.rs_dialog_instance = new RS_Dialog(MainController.language_manager, this.#params.title_key, "tpl_monster_tutorial.html", ()=> {
            const monster_viewer = this.querySelector("#monster_view");
            
            let timer;
            if (this.#params.attack) {
                const monster_attacking = new this.#params.monster_class(MainController.viewport, 0, 0);
                monster_attacking.root_element.style.position = "unset";

                timer = setInterval(()=> {
                    this.#params.attack.prepareSound();
                    monster_attacking.root_element.classList.add("attack-animation");
                    setTimeout(()=> {
                        this.#params.attack.sound();
                        monster_attacking.root_element.classList.remove("attack-animation");
                    }, this.#params.attack.duration);
                }, this.#params.attack.interval);
                
                monster_viewer.appendChild(monster_attacking.root_element);
            } else {
                const monster = new this.#params.monster_class(MainController.viewport, 0, 0);
                monster.root_element.style.position = "unset";
                monster_viewer.appendChild(monster.root_element);
            }
            
            if (this.#params.special_element)
                monster_viewer.appendChild(this.#params.special_element);

            const message_container = this.querySelector("#message");
            message_container.classList.add("tutorial");
            MainController.language_manager.setTranslatedContent(message_container, this.#params.message, "innerHTML");

            const close_button = this.querySelector("#btn_close");
            MainController.language_manager.setTranslatedContent(close_button, "tutorial_next", "value");
			close_button.addEventListener("click", ()=> {
                if (this.#params.special_element)
                    this.#params.special_element.remove();

                if (this.#params.attack)
                    clearInterval(timer);

                MainController.popups_stack.pop();
			});
            
            if (onPopupOpened)
                onPopupOpened();
		});

		document.body.appendChild(this.rs_dialog_instance.root_element);
        MainController.tuto_popup = this.rs_dialog_instance;
	}
}