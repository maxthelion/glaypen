import Renderable from "../../interfaces/renderable.js";
import UI from "../../ui.js";
import GrooveBox from "../../groovebox.js";

export default class ManualStepControl implements Renderable {
    stepSelector: HTMLElement;
    element: HTMLElement;
    ui: UI;
    grooveBox: GrooveBox;
    probabilityCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSteps: number = 16;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.ui = ui;
        this.grooveBox = grooveBox;
        this.stepSelector = document.createElement("div");
        this.stepSelector.classList.add("stepselector");
        this.stepSelector.innerHTML = "stepselector"
        this.element = document.createElement("div");
        this.probabilityCanvas = document.createElement("canvas");
        this.probabilityCanvas.width = 300;
        this.probabilityCanvas.height = 160;
        this.element.appendChild(this.probabilityCanvas);
        this.element.appendChild(this.stepSelector);
        this.ctx = this.probabilityCanvas.getContext("2d")!;
        this.probabilityCanvas.addEventListener("click", (e) => {
            let stepWidth = this.probabilityCanvas.width / this.maxSteps;
            let ydivisions = this.probabilityCanvas.height / 128;
            let x = e.offsetX;
            let y = e.offsetY;
            let step = Math.floor(x / stepWidth);
            let probability = 128 - Math.floor((y / ydivisions));
            this.grooveBox.generatorManager.setManualStepProbability(step, probability);
        })
        this.probabilityCanvas.style.cursor = "pointer";
        this.probabilityCanvas.style.border = "1px solid #ffffff";
    }

    update() {
        if (this.grooveBox.generatorManager.currentGeneratorParams.manualSteps !== undefined){
            this.ctx.clearRect(0, 0, this.probabilityCanvas.width, this.probabilityCanvas.height);
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            // console.log(this.grooveBox.generatorManager.currentGeneratorParams.manualSteps)
            this.grooveBox.generatorManager.currentGeneratorParams.manualSteps.forEach((step, index) => {
                let stepWidth = this.probabilityCanvas.width / this.maxSteps;
                let ydivisions = this.probabilityCanvas.height / 128;
                // console.log("step", step, "index", index);
                this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                this.ctx.fillRect(
                    index * stepWidth, 
                    Math.floor(128 - step) * ydivisions, 
                    stepWidth - 1,
                    step * ydivisions
                );
            })
        }
    }

}