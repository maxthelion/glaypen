import GrooveBox from "../groovebox";
import UI from "../ui";

export default class PrefsModal {
    grooveBox: GrooveBox;
    element: HTMLElement | null;
    constructor(ui: UI, grooveBox: GrooveBox, message: string) {
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        let midiManager = grooveBox.midiManager;
        let midiOutputs = midiManager.getMidiOutputs()
        let midiInputs = midiManager.getMidiInputs()
        document.body.appendChild(this.element);
        this.element.innerHTML = `
            <div class="modal-content">
                <a href="#" class="close">&times;</a>
                <div id="message">${message}</div>
                <h2>Preferences</h2>
                <h3>MIDI</h3>
                <div class="prefinputgroup">
                <label for="midiOutput">MIDI Output</label>
                <select id="midiOutput">
                </select>
                </div>
                <div class="prefinputgroup">
                <label for="midiInput">MIDI Clock Input</label>
                <select id="midiInput">
                </select>
                </div>

                <div class="prefinputgroup">
                <label for="midiInput">MIDI Note Input</label>
                <select id="midiNoteInput">
                </select>
                </div>
                <h3>Storage</h3>
                <div>
                <button id="clearclipbtn">Clear clips</button>
                </div>
            </div>
        `;
        let currentMidiOutputId : string | undefined;
        if (midiManager.getOutput() !== undefined) {
            currentMidiOutputId = midiManager.getOutput()!.id;
        }
        let outputselect = this.element.querySelector("#midiOutput");
        midiOutputs.forEach((output) => {
            let option = document.createElement("option");
            option.value = output.id;
            option.text = output.name!;
            if (currentMidiOutputId != undefined && output.id === currentMidiOutputId) {
                option.selected = true;
            }
            outputselect!.appendChild(option);
        });

        let currentMidiInputId : string | undefined;
        if (midiManager.getClockInput() !== undefined) {
            currentMidiInputId = midiManager.getClockInput()!.id;
        }
        console.log("currentMidiInputId", currentMidiInputId)
        let inputselect = this.element.querySelector("#midiInput");
        midiInputs.forEach((output) => {
            let option = document.createElement("option");
            option.value = output.id;
            option.text = output.name!;
            if (currentMidiInputId != undefined && output.id === currentMidiInputId) {
                option.selected = true;
            }
            inputselect!.appendChild(option);
        });


        let currentNoteInputId : string | undefined;
        if (midiManager.getNoteInput() !== undefined) {
            currentNoteInputId = midiManager.getNoteInput()!.id;
        }
        let noteinputselect = this.element.querySelector("#midiNoteInput");
        midiInputs.forEach((output) => {
            let option = document.createElement("option");
            option.value = output.id;
            option.text = output.name!;
            if (currentNoteInputId != undefined && output.id === currentNoteInputId) {
                option.selected = true;
            }
            noteinputselect!.appendChild(option);
        });

        let clipClearBtn = this.element.querySelector("#clearclipbtn") as HTMLButtonElement;
        clipClearBtn.addEventListener("click", (e) => {
            this.grooveBox.clearAllClips();
        })
        
        outputselect!.addEventListener("blur", (e) => {
            let select = e.target as HTMLSelectElement;
            midiManager.setMidiOutput(select.value);
        })

        inputselect!.addEventListener("blur", (e) => {
            let select = e.target as HTMLSelectElement;
            midiManager.setClockInput(select.value);
        })

        noteinputselect!.addEventListener("blur", (e) => {
            let select = e.target as HTMLSelectElement;
            console.log ("noteinputselect", select.value)
            midiManager.setNoteInput(select.value);
        })

        let closeButton = this.element.querySelector(".close");
        if (closeButton !== null) {
            closeButton.addEventListener("click", () => {
                grooveBox.closePrefsModal();
            });
        }

    }
}