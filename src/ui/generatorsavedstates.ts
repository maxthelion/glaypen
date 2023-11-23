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
        });
    }

    update(): void {
        this.elements.forEach((element) => {    
            if (this.grooveBox.generatorParamsIndex !== null && this.grooveBox.generatorParamsIndex !== undefined) {
                if (element.dataset.index === this.grooveBox.generatorParamsIndex.toString()) {
                  element.style.backgroundColor = "red";
                }
            }
        }
    }
}