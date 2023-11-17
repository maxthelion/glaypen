import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class ModeSelector implements Renderable {
    modeTabs: HTMLElement[] = [];
    ui: UI;
    grooveBox: GrooveBox;
    lastModeIndex: number = -1;
    constructor(ui:UI, grooveBox: GrooveBox) {
        this.modeTabs[0] = document.getElementById("generatormodebtn")!;
        this.modeTabs[2] = document.getElementById("clipmodebtn")!;
        this.modeTabs[0].dataset.modeid = "0";
        this.modeTabs[0].addEventListener("click", (e) => {
            let clickedElement = e.target as HTMLElement;
            let modeId = clickedElement.dataset.modeid;
            grooveBox.setMode(parseInt(modeId!));
        })
        this.grooveBox = grooveBox;
        this.ui = ui;
    }

    update() {
        if (this.grooveBox.modeIndex !== this.lastModeIndex) {
            document.querySelectorAll(".modebtn").forEach((modeTab) => {
                modeTab.classList.remove("active");
            })
            if (this.modeTabs[this.grooveBox.modeIndex] !== undefined) {
                this.modeTabs[this.grooveBox.modeIndex].classList.add("active");
            }
            this.lastModeIndex = this.grooveBox.modeIndex;
        }
    }
}