import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";
import RotaryDial from "./rotarydial.js";

export default class ClipParamsPanel implements Renderable {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement;
    paramElements
    clipdensityinput: HTMLInputElement;
    renderables: Renderable[] = [];
    cliplengthinput: HTMLInputElement;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#clippane") as HTMLElement;
        this.paramElements = this.element.querySelectorAll(".clipparam");
        let clipLeftBtn = this.element.querySelector("#clipstartleftbtn") as HTMLButtonElement;
        clipLeftBtn.addEventListener("click", (e) => {
            this.grooveBox.clipStartLeft();
        })
        let clipRightBtn = this.element.querySelector("#clipstartrightbtn") as HTMLButtonElement;
        clipRightBtn.addEventListener("click", (e) => {
            this.grooveBox.clipStartRight();
        })
        let clipshufflepitchesbtn = this.element.querySelector("#clipshufflepitchesbtn") as HTMLButtonElement;
        clipshufflepitchesbtn.addEventListener("click", (e) => {
            this.grooveBox.shuffleClipPitches();
        })
        let clipshufflestepsbtn = this.element.querySelector("#clipshufflestepsbtn") as HTMLButtonElement;
        clipshufflestepsbtn.addEventListener("click", (e) => {
            this.grooveBox.shuffleClipSteps();
        })
        // let clipEndInput = this.element.querySelector("#clipend") as HTMLInputElement;
        // clipEndInput.addEventListener("input", (e) => {
        //     let element = e.target as HTMLInputElement;
        //     let value = element.value;
        //     // this.grooveBox.setClipEnd(parseInt(value));
        // })
        // clipEndInput.value = this.grooveBox.currentClip()!.clipLength().toString();

        this.clipdensityinput = this.element.querySelector("#clipdensity") as HTMLInputElement;
        this.clipdensityinput.addEventListener("input", (e) => {
            let element = e.target as HTMLInputElement;
            let value = element.value;
            // this.grooveBox.currentClip()!.setClipDensity(parseFloat(value));
        })

        this.cliplengthinput = this.element.querySelector("#cliplength") as HTMLInputElement;
        this.cliplengthinput.addEventListener("input", (e) => {
            let element = e.target as HTMLInputElement;
            let value = element.value;
            this.grooveBox.currentClip()!.setClipLength(parseInt(value));
        })

        // this.paramElements.forEach((paramElement) => {
        //     let paramId = paramElement.dataset.paramid;

        //     let clip = this.grooveBox.sequencer.clip;

        //     paramElement.addEventListener("input", (e) => {
        //         let element = e.target as HTMLInputElement;
        //         let value = element.value;
        //         this.grooveBox.setClipParam(paramId!, parseInt(value));
        //     })
        // });


        let rotaryElements = [];

        let densityRotary = new RotaryDial(ui, grooveBox, document.getElementById("clipDensityRotary") as HTMLElement);
        densityRotary.getParamValue = function () {
            return this.grooveBox.currentClip()!.densityPercentage();
        }
        rotaryElements.push(densityRotary);


        let clipLengthRotary = new RotaryDial(ui, grooveBox, document.getElementById("clipLengthRotary") as HTMLElement);
        clipLengthRotary.getParamValue = function () {
            return this.grooveBox.currentClip()!.clipLength;
        }
        rotaryElements.push(clipLengthRotary);

        this.renderables = this.renderables.concat(rotaryElements);
    }

    update() {
        this.clipdensityinput.value = this.grooveBox.currentClip()!.densityPercentage().toString();
        this.renderables.forEach((renderable) => {
            renderable.update();
        })
    }

}