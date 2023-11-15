import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class ModeSelector implements Renderable {
    modeTabs: HTMLElement[] = [];
    ui: UI;
    grooveBox: GrooveBox;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.modeTabs[0] = document.getElementById("generatormodebtn")!;
        this.modeTabs[1] = document.getElementById("extractmodebtn")!;   
        this.modeTabs[2] = document.getElementById("clipmodebtn")!;
        for(let i = 0; i < this.modeTabs.length; i++){
            this.modeTabs[i].dataset.modeid = i.toString();
            this.modeTabs[i].addEventListener("click", (e) => {
                let clickedElement = e.target as HTMLElement;
                let modeId = clickedElement.dataset.modeid;
                grooveBox.setMode(parseInt(modeId!));
            })
        }
        this.grooveBox = grooveBox;
        this.ui = ui;
    }

    update() {
        document.querySelectorAll(".modebtn").forEach((modeTab) => {
            modeTab.classList.remove("active");
        }
        )
        this.modeTabs[this.grooveBox.modeIndex].classList.add("active");
    }
}