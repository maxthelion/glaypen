import GrooveBox from "../groovebox.js";
import Renderable from "../interfaces/renderable.js";
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
    }

    update() {
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            let maxStep = this.grooveBox.pitchHistory.maxStep;
            let stepWidth = this.canvasWidth / maxStep;
            let stepHeight = this.canvasHeight / 128;
            this.grooveBox.pitchHistory.pitches.forEach((pitchStepPair) => {
                if (this.ctx !== null) {
                    this.ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                    this.ctx.fillRect((stepWidth * pitchStepPair[0]), pitchStepPair[1] * stepHeight, stepWidth, stepHeight);
                }
            })
            this.drawWindow(maxStep)
        
        }
    }

    drawWindow(maxStep: number) {
        let stepWidth = this.canvasWidth / maxStep;
        let stepHeight = this.canvasHeight / 128;
        if (this.ctx !== null) {
            this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            if (this.grooveBox.windowStart) {
                var x = this.grooveBox.windowStart * stepWidth;
            } else {
                var x = (maxStep - 16) * stepWidth
            }
            this.ctx.strokeRect(x, 0, 16 * stepWidth, this.canvasHeight);
        }
    }
}