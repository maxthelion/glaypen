import GrooveBox from "../groovebox";
import UI from "../ui";

export default class PrefsModal {
    grooveBox: GrooveBox;
    element: HTMLElement | null;
    constructor(ui: UI, grooveBox: GrooveBox, message: string) {
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        let midiOutputs = grooveBox.getMidiOutputs()
        let midiInputs = grooveBox.getMidiInputs()

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
                <label for="midiInput">MIDI Input</label>
                <select id="midiInput">
                </select>
                </div>
                <h3>Storage</h3>
                <div>
                <button id="clearclipbtn">Clear clips</button>
                </div>
            </div>
        `;
        let currentMidiOutputId : string | undefined;
        if (grooveBox.getMidiOutput() !== undefined) {
            currentMidiOutputId = grooveBox.getMidiOutput()!.id;
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
        if (grooveBox.getMidiInput() !== undefined) {
            currentMidiInputId = grooveBox.getMidiInput()!.id;
        }
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

        let clipClearBtn = this.element.querySelector("#clearclipbtn") as HTMLButtonElement;
        clipClearBtn.addEventListener("click", (e) => {
            this.grooveBox.clearAllClips();
        })
        
        outputselect!.addEventListener("blur", (e) => {
            let select = e.target as HTMLSelectElement;
            grooveBox.setMidiOutput(select.value);
        })

        inputselect!.addEventListener("blur", (e) => {
            let select = e.target as HTMLSelectElement;
            grooveBox.setMidiInput(select.value);
        })

        let closeButton = this.element.querySelector(".close");
        if (closeButton !== null) {
            closeButton.addEventListener("click", () => {
                grooveBox.closePrefsModal();
            });
        }

    }
}