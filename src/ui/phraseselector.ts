import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class PhraseSelector implements Renderable{
    grooveBox: GrooveBox;
    ui: UI;
    elements: HTMLElement[];
    lastPhraseIndex: number = -1;
    
    constructor(ui:UI, grooveBox: GrooveBox) {
        console.log("PhraseSelector constructor");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.elements = []
        document.querySelectorAll(".phraseLaunchBtn")!.forEach(element => {
            element = element as HTMLElement;
            let index = element!.dataset.phraseid!;
            this.elements.push(element as HTMLElement);
            element.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let index = element.dataset.phraseid!;
                grooveBox.phraseIndex = parseInt(index);
                grooveBox.setMode(3);
            })

        });
    }
    
    update(): void {
        if (this.lastPhraseIndex !== this.grooveBox.phraseIndex) {
            this.elements.forEach((element) => {
                element.classList.remove("active");
            })
            if (this.grooveBox.phraseIndex !== null && this.grooveBox.phraseIndex !== undefined) {
                let element = this.elements[this.grooveBox.phraseIndex];
                element.classList.add("active");
            }
            this.lastPhraseIndex = this.grooveBox.phraseIndex;
        }
    }
}