import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class GeneratorToggleControl implements Renderable {
    grooveBox: GrooveBox;
    ui: UI;
    toggleGenerateBtn: HTMLElement = document.querySelector("#toggleGenerateBtn") as HTMLElement;
    toggleExtractBtn: HTMLElement = document.querySelector("#toggleExtractBtn") as HTMLElement;
    lastMode: number = -1;
    constructor(ui:UI, grooveBox:GrooveBox) {

        this.grooveBox = grooveBox;
        this.ui = ui;

        this.toggleGenerateBtn.addEventListener("click", (e) => {
            let element = e.target;
            grooveBox.setMode(0);
        });
        this.toggleExtractBtn.addEventListener("click", (e) => {
            let element = e.target;
            grooveBox.setMode(1);
        });
    }

    update(): void {
        if (this.lastMode !== this.grooveBox.modeIndex) {
            if (this.grooveBox.modeIndex === 0) {
                this.toggleGenerateBtn.classList.add("active");
                this.toggleExtractBtn.classList.remove("active");
            } else {
                this.toggleGenerateBtn.classList.remove("active");
                this.toggleExtractBtn.classList.add("active");
            }
            this.lastMode = this.grooveBox.modeIndex;
        }
    }
}