import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class GeneratorSavedStates implements Renderable{
    grooveBox: GrooveBox;
    ui: UI;
    elements: HTMLElement[];

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.ui = ui
        this.grooveBox = grooveBox;
        this.elements = []
        let parentElement = document.querySelector("#generatorSavedStates") as HTMLElement;
        for (let i = 0; i < 16; i++) {
            // console.log("GeneratorSavedStates constructor", parentElement);
            let div = document.createElement("div");
            let element = document.createElement("a");
            div.appendChild(element);
            element.dataset.index = i.toString();
            element.textContent = i.toString();
            this.elements.push(element);
            parentElement.appendChild(div);
        }

        this.elements.forEach((element) => {
            element.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let index = element.dataset.index!;
                grooveBox.generatorButtonPressed(parseInt(index));
            })

            element.addEventListener("contextmenu", (e) => {
                let element = e.target as HTMLElement;
                let index = element.dataset.index!;
                grooveBox.generatorManager.clearPresetAtIndex(parseInt(index));
                e.preventDefault();
                return false;
            })
        });
    }

    update(): void {
        let genManager = this.grooveBox.generatorManager;
        this.elements.forEach((element, index) => {
            let storedPreset = genManager.presetAtIndex(index);
            if (storedPreset !== null) {
                element.style.backgroundColor = storedPreset.color;
            } else {
                element.style.backgroundColor = "transparent";
            }

            if (genManager.loadedPresetIndex() === index) {
                element.classList.add("active");
            } else {
                element.classList.remove("active");
            }
        })
    }
}