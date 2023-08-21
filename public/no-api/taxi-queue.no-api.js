document.addEventListener('alpine:init', () => {

	Alpine.data('TaxiQueue', () => {

		return {
			version: 'no-api-1.0',
			queueLength: 0,
			passengerQueueCount: 0,
			taxiQueueCount: 0,
			init() {
				axios
					.get('/api/passenger/queue')
					.then(result => {
						// an example API call
						this.queueLength = result.data.queueCount
					});
			},
			joinQueue() {
				this.passengerQueueCount++;
			
		
			},
			leaveQueue() {
				if (this.passengerQueueCount > 0) {
					this.passengerQueueCount--;
				}
			},

			joinTaxiQueue() {
				this.taxiQueueCount++;
			
		
			},

			queueLength() {
				return passengerQueueCount;
			
			},

			taxiQueueLength() {
				return taxiQueueCount;
			
			},

			taxiDepart() {
				if (this.taxiQueueCount > 0 && this.passengerQueueCount >=12) {
                    this.taxiQueueCount--;
					this.passengerQueueCount -= 12;
				}
			}
		}
	});

});

