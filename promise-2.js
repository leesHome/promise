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
	let promise2 = new Promise((resolve, reject)=>{
		switch(self.status) {
			case 'resolved':
			setTimeout(()=>{
                try{
                	let x = onFullFilled(self.value)
                	resolvePromise(promise2, x, resolve, reject)
                }catch(e){
                	reject(e)
                }
			}, 0);
			// onFullFilled(self.value)
			break
			case 'rejected':
			setTimeout(()=>{
                try{
                	let x = onRejected(self.reason)
                	resolvePromise(promise2, x, resolve, reject)
                }catch(e){
                	reject(e)
                }
			}, 0);			
			// onRejected(self.reason)
			break
			case 'pending':

			self.onResolevedCallbacks.push(function(){
				setTimeout(()=>{
	                try{
	                	let x = onFullFilled(self.value)
	                	resolvePromise(promise2, x, resolve, reject)
	                }catch(e){
	                	reject(e)
	                }
				}, 0);				
				// onFullFilled(self.value)
			})
			self.onRejectedCallbacks.push(function(){
				setTimeout(()=>{
	                try{
	                	let x = onRejected(self.reason)
	                	resolvePromise(promise2, x, resolve, reject)
	                }catch(e){
	                	reject(e)
	                }
				}, 0);					
				// onRejected(self.reason)
			})
		}		
	})
	return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
	if(promise2 === x){  
        return reject(new TypeError('循环引用了'));
    }
    if((x!==null && typeof x === 'object') || typeof x === 'function') {
    	try{
			let then = x.then
    		if(typeof then == 'function') {
    			then.call(x, y=>{
    				resolvePromise(promise2, y, resolve, reject)
    			}, r=>{
    				reject(r)
    			})
    		}    		
    	}catch(e){
			reject(e)
    	}
    } else {
    	resolve(x)
    }
}
module.exports = Promise