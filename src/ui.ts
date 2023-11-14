import PlayButton from "./ui/playbutton.js";
import GrooveBox from "./groovebox.js";
import HistoryCanvas from "./ui/historycanvas.js";
import LCD from "./ui/lcd.js";
import ClipMatrix from "./ui/clipmatrix.js";
import PrefsButton from "./ui/prefsbutton.js";
import PrefsModal from "./ui/prefsmodal.js";
import GeneratorParamsPanel from "./ui/generatorparamspanel.js";
import ModeSelector from "./ui/modeselector.js";
import ClipParamsPanel from "./ui/clipparamspanel.js";
import ExtractParamsPanel from "./ui/extractparamspanel.js";
import Renderable from "./interfaces/renderable.js";
import Transport from "./transport.js";
import TransportDisplay from "./ui/transportdisplay.js";



export default class UI {
    sequencerSteps: Array<HTMLElement>;
    playButton: PlayButton;
    prefsButton: PrefsButton;
    historyCanvas: HistoryCanvas;
    grooveBox: GrooveBox;
    lcd: LCD;
    clipMatrix: ClipMatrix;
    renderables: Array<Renderable>;
    prefsModal?: PrefsModal;
    clipParamsPanel?: ClipParamsPanel;
    extractParamsPanel?: ExtractParamsPanel;

    constructor(groovebox: GrooveBox) {
        var sequencerSteps = document.querySelectorAll(".step");
        this.sequencerSteps = [];
        sequencerSteps.forEach((sequencerStep) => {
            console.log("sequencerStep", sequencerStep.textContent);
            this.sequencerSteps.push(sequencerStep as HTMLElement)
        })
        this.playButton = new PlayButton(groovebox);
        this.historyCanvas = new HistoryCanvas(this, groovebox);
        this.lcd = new LCD(this, groovebox);
        this.grooveBox = groovebox;
        this.clipMatrix = new ClipMatrix(this, groovebox);
        let generaterParamsPanel = new GeneratorParamsPanel(this, groovebox);
        let modeSelector = new ModeSelector(this, groovebox);
        let transportDisplay = new TransportDisplay(this, groovebox);
        this.renderables = [
            this.playButton,
            this.historyCanvas, 
            this.lcd, 
            this.clipMatrix, 
            generaterParamsPanel,
            modeSelector,
            transportDisplay
        ];
        this.prefsButton = new PrefsButton(this, groovebox);
    }

    update() {
        this.sequencerSteps.forEach((sequencerStep) => {
            sequencerStep.classList.remove("active");
        })
        // if (this.grooveBox.transport.loop.currentStep) {
        //     let step = this.grooveBox.transport.loop.currentStep;
        //     this.sequencerSteps[step - 1].classList.add("active");
        // }

        this.renderables.forEach((renderable) => {
            renderable.update();
        })
    }

    setMode(modeIndex: number) {
        const modePanes = document.querySelectorAll(".modepane");
        modePanes.forEach((element) => {
            element.classList.add("hidden"); 
        });        
        if (modeIndex == 0) {
            document.querySelector("#genpane")!.classList.remove("hidden");
        }
        if (modeIndex == 1) {
            document.querySelector("#extractpane")!.classList.remove("hidden");
            // this.clipParamsPanel = new ClipParamsPanel(this, this.grooveBox);
            this.extractParamsPanel = new ExtractParamsPanel(this, this.grooveBox);
        }
        if (modeIndex == 2) {
            document.querySelector("#clippane")!.classList.remove("hidden");
            this.clipParamsPanel = new ClipParamsPanel(this, this.grooveBox);
        }
    }

    onWheel(event: WheelEvent) {
        let direction = event.deltaY > 0 ? 1 : -1;
        this.grooveBox.moveWindow(direction)
        event.preventDefault(); 
    }

    showPrefsModal() {
        this.prefsModal = new PrefsModal(this, this.grooveBox);
        
        document.getElementById("app")!.classList.add("blurred");
    }

    closePrefsModal() {
        if (this.prefsModal !== undefined) {
            this.prefsModal.element?.remove();
            document.getElementById("app")!.classList.remove("blurred");
        }
    }

}