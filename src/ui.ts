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
    currentPane: Renderable

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
        let modeSelector = new ModeSelector(this, groovebox);
        let transportDisplay = new TransportDisplay(this, groovebox);
        this.currentPane = new GeneratorParamsPanel(this, groovebox);
        this.renderables = [
            this.playButton,
            this.historyCanvas, 
            this.lcd, 
            this.clipMatrix, 
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
        this.currentPane.update()
    }

    setMode(modeIndex: number) {
        const modePanes = document.querySelectorAll(".modepane");
        modePanes.forEach((element) => {
            element.classList.add("hidden"); 
        });        
        if (modeIndex == 0) {
            this.currentPane = new GeneratorParamsPanel(this, this.grooveBox);
            document.querySelector("#genpane")!.classList.remove("hidden");
        }
        if (modeIndex == 1) {
            document.querySelector("#extractpane")!.classList.remove("hidden");
            // this.clipParamsPanel = new ClipParamsPanel(this, this.grooveBox);
            this.currentPane = new ExtractParamsPanel(this, this.grooveBox);
        }
        if (modeIndex == 2) {
            document.querySelector("#clippane")!.classList.remove("hidden");
            this.currentPane = new ClipParamsPanel(this, this.grooveBox);
        }
    }

    onWheel(event: WheelEvent) {
        let direction = event.deltaY > 0 ? 1 : -1;
        this.grooveBox.moveWindow(direction)
        event.preventDefault(); 
    }

    onHistoryClick(event: MouseEvent) {
        let element = event.target as HTMLElement;
        let width = element.clientWidth;
        let x = event.offsetX;
        let historyIndex = x / width;
        this.grooveBox.setHistoryIndex(historyIndex);
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