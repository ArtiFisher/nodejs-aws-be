class Cache {
    constructor() {
        this.cache = {};
    }

    save(request, data) {
        this.cache[request] = data;
        setTimeout(() => {
            delete this.cache[request];
        }, 120000);
    }

    load(request) {
        return this.cache[request];
    }
}

export default new Cache();
