function Promise(executor) {
	let self = this
	self.status = 'pending'
	self.value = undefined
	self.reason = undefined
	self.onResolevedCallbacks = []
	self.onRejectedCallbacks = []
	function resolve(value) {
		if(self.status == 'pending') {
			self.value = value
			self.status = 'resolved'
			self.onResolevedCallbacks.forEach(fn=>{fn()})
		}
	}
	function reject(reason) {
		if(self.status == 'pending') {
			self.reason = reason
			self.status = 'rejected'
			self.onRejectedCallbacks.forEach(fn=>{fn()})
		}		
	}
	executor(resolve, reject)
}

Promise.prototype.then = function(onFullFilled, onRejected) {
	let self = this
	switch(this.status) {
		case 'resolved':
		onFullFilled(self.value)
		break
		case 'rejected':
		onRejected(self.reason)
		break
		case 'pending':
		self.onResolevedCallbacks.push(function(){
			onFullFilled(self.value)
		})
		self.onRejectedCallbacks.push(function(){
			onRejected(self.reason)
		})
	}
}

module.exports = Promise