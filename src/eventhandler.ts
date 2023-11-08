import Transport from "./transport.js";
export default class EventHandler {
    transport: Transport;

    constructor(grooveBox: GrooveBox) {
        console.log("EventHandler constructor");
        this.grooveBox = grooveBox;
    }

    transportTogglePlay() {
        console.log("transportTogglePlay");
        this.transport.togglePlay();
    }
}