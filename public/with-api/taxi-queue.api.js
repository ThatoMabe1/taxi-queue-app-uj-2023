document.addEventListener('alpine:init', () => {

	Alpine.data('TaxiQueue', () => {

		return {
			version: 'api-1.0',
			queueLength: 0,
			init() {
				axios
					.get('/api/passenger/queue')
					.then(result => {
						// an example API call
						this.queueLength = result.data.queueCount
					});
			},
			joinQueue() {
				this.queueLength++;
			},
			leaveQueue() {
				if (this.queueLength > 0) {
                    this.queueLength--;
                }
			},

			joinTaxiQueue() {
				this.taxiQueueLength++;
			},

			queueLength() {
				return this.queueLength;
			},

			taxiQueueLength() {
				return this.taxiQueueLength;
			},

			taxiDepart() {
				if (this.taxiQueueLength > 0) {
                    this.taxiQueueLength--;
                }
			}
		}
	});

});

