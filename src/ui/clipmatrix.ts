import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable.js";
import UI from "../ui";

export default class ClipMatrix  implements Renderable{
    grooveBox: GrooveBox;
    clipMatrix: HTMLElement | null;

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.clipMatrix = document.querySelector("#clipMatrix");
        
        for (var i = 0; i < 16; i++) {
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
                let index = element!.dataset.step;
                this.grooveBox.saveOrLoadClipAtIndex(index)
            });
        }
    }

    update() {
        if (this.clipMatrix !== null) {
            this.clipMatrix.querySelectorAll("a").forEach((step) => {
                step.classList.remove("active");
            })
            if (this.grooveBox.clipSaver.clipIndexes() != []) {
                // console.log("this.grooveBox.clipSaver.clipIndexes()", this.grooveBox.clipSaver.clipIndexes())
                this.grooveBox.clipSaver.clipIndexes().forEach((clipIndex) => {
                    let cell = this.clipMatrix!.querySelector(".step" + clipIndex) as HTMLElement;
                    if (cell !== null){
                        cell.classList.add("active");
                        cell.style.backgroundColor = this.grooveBox.clipSaver.clipAtIndex(clipIndex).color; 
                    }
                })
            }
        }
    }
}