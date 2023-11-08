import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class LCD implements Renderable {
    htmlCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    grooveBox: GrooveBox;
    canvasWidth: number;
    canvasHeight: number;
    ui: UI;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.htmlCanvas = <HTMLCanvasElement>document.querySelector("#lcd");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        // this.htmlCanvas.addEventListener("wheel", this.ui.onWheel.bind(this.ui));
    }

    update() {
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            if (this.grooveBox.sequencer.clip !== undefined) {
                var stepWidth = this.canvasWidth / 16;
                var stepHeight = this.canvasHeight / 128;
                this.grooveBox.sequencer.clip.steps.forEach((step, index) => {
                    if (step !== undefined) {
                        if (index === this.grooveBox.sequencer.currentStep) {
                            this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        } else {
                            this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        }
                        this.ctx.fillRect(index * stepWidth, step[1] * stepHeight, stepWidth, stepHeight);
                    }
                }

            } else {
                let maxStep = this.grooveBox.pitchHistory.maxStep;
                var stepWidth = this.canvasWidth / 16;
                let stepHeight = this.canvasHeight / 128;
                this.grooveBox.pitchHistory.stepsForWindow( maxStep - 16).forEach((pitchStepPair) => {
                    if (this.ctx !== null) {
                        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        this.ctx.fillRect((stepWidth * pitchStepPair[0]), pitchStepPair[1] * stepHeight, stepWidth, stepHeight);
                    }
                })
            }  
        }
    }
}