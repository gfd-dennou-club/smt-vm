class RateLimiter {
    /**
     * @param {number} maxPerSecond - Maximum number of requests per second.
     * @param {number} intervalMs - Minimum interval between requests in milliseconds.
     */
    constructor (maxPerSecond, intervalMs) {
        this.maxPerSecond = maxPerSecond;
        this.intervalMs = intervalMs;
        this.queue = [];
        this.lastSendTime = 0;
        this.processing = false;
    }

    /**
     * Add a request to the queue.
     * @param {any} data - Data to send.
     * @param {Function} sendFunction - Asynchronous function to send data.
     * @returns {Promise} - Resolves with the result of sendFunction.
     */
    send (data, sendFunction) {
        return new Promise((resolve, reject) => {
            this.queue.push({data, resolve, reject, sendFunction});
            this.processQueue();
        });
    }

    /**
     * Wait for all current requests in the queue to complete.
     * @returns {Promise<void>} - A promise that resolves when the queue is empty.
     */
    waitForCompletion () {
        if (!this.processing && this.queue.length === 0) return Promise.resolve();
        
        return new Promise(resolve => {
            const check = () => {
                if (!this.processing && this.queue.length === 0) {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        });
    }

    /**
     * Process the queue sequentially respecting the interval.
     * @private
     */
    async processQueue () {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;

        while (this.queue.length > 0) {
            const now = Date.now();
            const timeSinceLastSend = now - this.lastSendTime;

            if (timeSinceLastSend < this.intervalMs) {
                // Wait for the interval to pass
                await new Promise(resolve => setTimeout(resolve, this.intervalMs - timeSinceLastSend));
            }

            const item = this.queue.shift();
            try {
                const result = await item.sendFunction(item.data);
                this.lastSendTime = Date.now();
                item.resolve(result);
            } catch (error) {
                item.reject(error);
            }
        }

        this.processing = false;
    }
}

module.exports = RateLimiter;
