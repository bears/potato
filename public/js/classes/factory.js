/**
 * Class bhFactory
 * @brief Element factory
 */
function bhFactory(persistent){
	this.source = persistent ? 'localStorage' : 'sessionStorage';
}

///@name Notify type constants
//@{
bhFactory.NOTIFY_INSERT = 'insert';
bhFactory.NOTIFY_UPDATE = 'update';
bhFactory.NOTIFY_DELETE = 'DELETE';
//@

/**
 * Subscribe to a subject
 * Will receive notify later
 * @param object subscriber The observer, MUST provide method notify(type, data)
 * @param string subject Element type
 * @param number id (optional) If omitted, receives notification about any item in the subject
 */
bhFactory.prototype.subscribe = function(subscriber, subject, id){
	// Add into notify list
	var name = this._className(subscriber);
	if (isNaN(parseInt(id))){
		id = '';
		var pool = bhFactory._instance[this.source].listSubscriber;
		if ('object' != typeof pool[subject]){
			pool[subject] = {};
		}
		pool[subject][name] = subscriber;
		this._fetchList(subscriber, subject);
	}
	else{
		var pool = bhFactory._instance[this.source].itemSubscriber;
		if ('object' != typeof pool[subject]){
			pool[subject] = {};
		}
		if ('object' != typeof pool[subject][id]){
			pool[subject][id] = {};
		}
		pool[subject][id][name] = subscriber;
		this._fetchItem(subscriber, subject, id);
	}
};

/**
 * Fetch a single item
 * From local or server
 * @param object subscriber
 * @param string subject
 * @param number id (optional)
 */
bhFactory.prototype._fetchItem = function(subscriber, subject, id){
	var key = subject + '/' + id;
	if (null == window[this.source][key]){
		$.getJSON('/ajaj/item/' + key, function(data){
			window[this.source][key] = JSON.stringify(data);
			subscriber.notify(bhFactory.NOTIFY_INSERT, data);
			var exclude = this._className(subscriber);
			var observers = bhFactory._instance[this.source].listSubscriber[subject];
			for (var name in observers){
				if (exclude != name){
					observers[name].notify(bhFactory.NOTIFY_INSERT, data);
				}
			}
		}.bind(this));
	}
	else{
		subscriber.notify(bhFactory.NOTIFY_INSERT, $.parseJSON(window[this.source][key]));
	}
};

/**
 * Fetch an item list
 * From local or server
 * @param object subscriber
 * @param string subject
 */
bhFactory.prototype._fetchList = function(subscriber, subject){
	if (null != window[this.source][subject]){
		var _this = this;
		$($.parseJSON(window[this.source][subject])).each(function(){
			_this._fetchItem(subscriber, subject, this);
		});
	}
	else{
		$.getJSON('/ajaj/list/' + subject, function(data){
			window[this.source][subject] = JSON.stringify(data);
			this._fetchList(subscriber, subject);
		}.bind(this));
	}
};

/**
 * Get class name of @a subscriber
 * @param object subscriber
 * @returns string
 */
bhFactory.prototype._className = function(subscriber){
	return subscriber.constructor.toString().match(/function (\w+)/)[1];
};

/// Singleton
bhFactory._instance = {
	"localStorage": {
		listSubscriber: {},
		itemSubscriber: {}
	},
	"sessionStorage": {
		listSubscriber: {},
		itemSubscriber: {}
	}
};
