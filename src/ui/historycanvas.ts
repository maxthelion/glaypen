import GrooveBox from "../groovebox.js";
import Renderable from "../interfaces/renderable.js";
import Step from "../step.js";
import UI from "../ui.js";

export default class HistoryCanvas  implements Renderable{
    htmlCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    grooveBox: GrooveBox;
    canvasWidth: number;
    canvasHeight: number;
    ui: UI;

    constructor(ui:UI, groovebox: GrooveBox) {
        this.htmlCanvas = <HTMLCanvasElement>document.querySelector("#historycanvas");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = groovebox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        this.htmlCanvas.addEventListener("wheel", this.ui.onWheel.bind(this.ui));
        this.htmlCanvas.addEventListener("click", this.ui.onHistoryClick.bind(this.ui));
    }

    update() {
        if (this.ctx !== null) {
            // console.log(this.grooveBox.pitchHistory.steps.length)
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            let maxStep = this.grooveBox.pitchHistory.maxStep;
            let stepWidth = this.canvasWidth / maxStep;
            let stepHeight = this.canvasHeight / 128;
            for(let i = 0; i < maxStep; i++) {
                let step = this.grooveBox.pitchHistory.steps[i];
                if (step  !== undefined) {
                    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    this.ctx.fillRect((
                        stepWidth * i), 
                        (128 - step.pitches[0]) * stepHeight, 
                        stepWidth, 
                        stepHeight
                    );
                }
            }
            this.drawWindow(maxStep)
        
        }
    }

    drawWindow(maxStep: number) {
        let stepWidth = this.canvasWidth / maxStep;
        let stepHeight = this.canvasHeight / 128;
        if (this.ctx !== null) {
            this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            if (this.grooveBox.pitchHistory.windowStart !== undefined) {
                var x = this.grooveBox.pitchHistory.windowStart * stepWidth;
            } else {
                var x = (maxStep - this.grooveBox.pitchHistory.windowLength) * stepWidth
            }
            this.ctx.strokeRect(x, 0, this.grooveBox.pitchHistory.windowLength * stepWidth, this.canvasHeight);
        }
    }
}