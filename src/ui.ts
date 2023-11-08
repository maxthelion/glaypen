import Loop from "./loop.js";
import PlayButton from "./ui/playbutton.js";
import EventHandler from "./eventhandler.js";
import GrooveBox from "./groovebox.js";
import HistoryCanvas from "./ui/historycanvas.js";
import LCD from "./ui/lcd.js";
import ClipMatrix from "./ui/clipmatrix.js";
import PrefsButton from "./ui/prefsbutton.js";
import PrefsModal from "./ui/prefsmodal.js";


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

    constructor(groovebox: GrooveBox) {
        var sequencerSteps = document.querySelectorAll(".step");
        console.log("sequencerSteps", sequencerSteps);
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
        this.renderables = [this.historyCanvas, this.lcd, this.clipMatrix];
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


    onWheel(event: WheelEvent) {
        let direction = event.deltaY > 0 ? 1 : -1;
        this.grooveBox.moveWindow(direction)
        event.preventDefault(); 
    }

    showPrefsModal() {
        this.prefsModal = new PrefsModal(this, this.grooveBox);
        
        document.getElementById("app").classList.add("blurred");
    }

    closePrefsModal() {
        if (this.prefsModal !== undefined) {
            this.prefsModal.element?.remove();
            document.getElementById("app").classList.remove("blurred");
        }
    }

}