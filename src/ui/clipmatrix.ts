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
            var step = document.createElement("a");
            step.href = "#";
            step.classList.add("clipButtonCell");
            step.classList.add("step" + i);
            step.textContent = (i + 1).toString();
            step.setAttribute("data-step", i.toString());
            this.clipMatrix.appendChild(step);

            step.addEventListener("click", (e) => {
                let index = e.target.dataset.step;
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
                    let cell = this.clipMatrix.querySelector(".step" + clipIndex);
                    if (cell !== null){
                        cell.classList.add("active");
                    }
                })
            }
        }
    }
}