var EventHandler = /** @class */ (function () {
    function EventHandler(grooveBox) {
        console.log("EventHandler constructor");
        this.grooveBox = grooveBox;
    }
    EventHandler.prototype.transportTogglePlay = function () {
        console.log("transportTogglePlay");
        this.transport.togglePlay();
    };
    return EventHandler;
}());
export default EventHandler;
