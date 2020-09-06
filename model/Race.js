/*export */ class Race {
    constructor(id, active, racers) {
        this.id = id;
        this.active = active;
        this.racers = racers;
    }
}

module.exports = { Race };