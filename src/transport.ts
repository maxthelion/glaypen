import GrooveBox from "./groovebox.js";
import Loop from "./loop.js";

export default class Transport {
    grooveBox: GrooveBox;
    playing: boolean = false;
    loop: Loop
    tickNumber: number = 0;
    lastTick: number = 0;
    midiSync: boolean = false;
    tempo: number = 120;

    constructor(groovebox: GrooveBox) {
        this.grooveBox = groovebox;
        this.loop = new Loop(this.grooveBox);
    }

    togglePlay() {
        if (this.playing) {
            this.stop();
        } else  {
            this.start();
        }
    }

    increaseTempo() {
        this.tempo += 1;
    }

    decreaseTempo() { 
        this.tempo -= 1;
    }

    tick() {
        // console.log("tick");
        // if (!this.playing ) {
        //     this.playing = true;
        //     this.loop.reset();
        // }
        this.midiSync = true;
        this.tickNumber++;
        this.lastTick = Date.now();
        if(this.tickNumber % 6 === 0) {
            this.loop.update();
        }
    }

    stop() {
        if (this.midiSync == true || !this.playing) {
            return;
        }
        this.playing = false;
        this.loop.stop();
    }

    start() {
        if (this.midiSync == true || this.playing) {
            return;
        }
        this.playing = true;
        if(this.grooveBox.modeIndex === 2){
            this.loop.reset();    
        }
        this.loop.startWithInterval();
    }

    startByMidi() {
        this.playing = true;
        this.midiSync = true;
        this.loop.reset();
        this.loop.start();
    }

    stopByMidi() {
        this.midiSync = false;
        this.playing = false;
        this.loop.stop();
    }
}