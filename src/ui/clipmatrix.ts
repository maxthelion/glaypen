import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable.js";
import UI from "../ui";

export default class ClipMatrix  implements Renderable{
    grooveBox: GrooveBox;
    clipMatrix: HTMLElement | null;
    lastClipIndex: number = -1;
    lastClipIndexes: number[] = [];

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.clipMatrix = document.querySelector("#clipMatrix");
        let cellNumber = 64;
        for (var i = 0; i < cellNumber; i++) {
            var div = document.createElement("div");
            var step = document.createElement("a");
            step.href = "#";
            div.classList.add("clipButtonCell");
            step.classList.add("step" + i);
            step.textContent = (i + 1).toString();
            step.setAttribute("data-step", i.toString());
            div.appendChild(step);
            this.clipMatrix!.appendChild(div);

            step.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let index = element!.dataset.step!;
                this.grooveBox.saveOrLoadClipAtIndex(parseInt(index))
            });

            step.addEventListener("contextmenu", (e) => {
                console.log("rightclick")
                let element = e.target as HTMLElement;
                let index = element!.dataset.step!;
                this.grooveBox.clearClipAtIndex(parseInt(index))
                e.preventDefault();
                return false;
            });
        }
    }

    update() {
        if (this.clipMatrix !== null) {
            
            if (this.grooveBox.clipIndex !== null && this.grooveBox.clipIndex !== undefined
                && this.grooveBox.clipIndex !== this.lastClipIndex) {
                
                this.clipMatrix.querySelectorAll("a").forEach((step) => {
                    step.classList.remove("active");
                })
                let cell = this.clipMatrix!.querySelector(".step" + this.grooveBox.clipIndex) as HTMLElement;
                cell.classList.add("active");
                this.lastClipIndex = this.grooveBox.clipIndex;
            }
            

            if (this.grooveBox.clipSaver.clipIndexes() !== this.lastClipIndexes){
                let clipIndexes = this.grooveBox.clipSaver.clipIndexes();
                this.lastClipIndexes = clipIndexes;
                for (var i = 0; i < this.grooveBox.maxClips; i++) {
                    let cell = this.clipMatrix!.querySelector(".step" + i) as HTMLElement;
                    if (clipIndexes.includes(i) === true) {
                        cell.style.backgroundColor = this.grooveBox.clipSaver.clipAtIndex(i).color;
                    } else {
                        cell.style.backgroundColor = "transparent";
                    }
                }
            }
        }
    }
}