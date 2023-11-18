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
import GeneratorToggleControl from "./ui/generatortogglecontrol.js";
import PhraseSelector from "./ui/phraseselector.js";



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
    currentPane: Renderable;
    clipParamsPanel: ClipParamsPanel;
    generatorParamsPanel: GeneratorParamsPanel;
    lastClipLength: number = -1;

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
        document.querySelectorAll(".windowlengthbtn").forEach(element => {
            if (element !== undefined){
            element.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let windowlength = parseInt(element.dataset.windowlength?.toString()!);
                groovebox.changeWindowLength(windowlength);
            })
            }
        });
        let generatorToggleControl = new GeneratorToggleControl(this, groovebox);
        let transportDisplay = new TransportDisplay(this, groovebox);

        this.generatorParamsPanel = new GeneratorParamsPanel(this, groovebox);
        this.clipParamsPanel = new ClipParamsPanel(this, groovebox);
        this.currentPane = this.generatorParamsPanel;
        let phraseSelector = new PhraseSelector(this, groovebox);
        this.renderables = [
            phraseSelector,
            generatorToggleControl,
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
        if (this.lastClipLength !== this.grooveBox.pitchHistory.windowLength) {
            this.lastClipLength = this.grooveBox.pitchHistory.windowLength;
            document.querySelectorAll(".windowlengthbtn").forEach(element => {
                if (element !== undefined){
                    element.classList.remove("active");
                    if (parseInt(element.dataset.windowlength?.toString()!) === this.lastClipLength) {
                        element.classList.add("active");
                    }
                }
            });
        }
        
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
        if (modeIndex == 0 || modeIndex == 1) {
            this.currentPane = this.generatorParamsPanel;
            document.querySelector("#genpane")!.classList.remove("hidden");
        }
        console.log("modeIndex", modeIndex)
        if (modeIndex == 2) {
            
            document.querySelector("#clippane")!.classList.remove("hidden");
            this.currentPane = this.clipParamsPanel;
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

    showPrefsModal(message: string = "") {
        this.prefsModal = new PrefsModal(this, this.grooveBox, message);
        
        document.getElementById("app")!.classList.add("blurred");
    }

    closePrefsModal() {
        if (this.prefsModal !== undefined) {
            this.prefsModal.element?.remove();
            document.getElementById("app")!.classList.remove("blurred");
        }
    }

}