/**
 * Class bhFactory
 * @brief Element factory
 */
function bhFactory(persistent){
	this.source = persistent ? 'localStorage' : 'sessionStorage';
	if ('object' != typeof bhFactory._instance.updater){
		bhFactory._instance.updater = {};
		this._update();
	}
}

///@name Notify type constants
//@{
bhFactory.NOTIFY_INSERT = 'INSERT';
bhFactory.NOTIFY_UPDATE = 'UPDATE';
bhFactory.NOTIFY_DELETE = 'DELETE';
//@

/**
 * Subscribe to a subject
 * Will receive notify later
 * @param object subscriber The observer, MUST provide method notify(type, data) & getIdentity()
 * @param string subject Element type
 * @param number id (optional) If omitted, receives notification about any item in the subject
 */
bhFactory.prototype.subscribe = function(subscriber, subject, id){
	// Add into notify list
	var name = subscriber.getIdentity();
	if (isNaN(parseInt(id))){
		id = '';
		var pool = bhFactory._instance[this.source].list.subscriber;
		if ('object' != typeof pool[subject]){
			pool[subject] = {};
		}
		pool[subject][name] = subscriber;
		this._fetchList(subscriber, subject);
	}
	else{
		var pool = bhFactory._instance[this.source].item.subscriber;
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
	var cache = bhFactory._instance[this.source].item.cache;
	if ('object' == typeof cache[key]){
		subscriber.notify(bhFactory.NOTIFY_INSERT, cache[key]);
	}
	else if ('string' == typeof window[this.source][key]){
		cache[key] = $.parseJSON(window[this.source][key]);
		subscriber.notify(bhFactory.NOTIFY_INSERT, cache[key]);
	}
	else{
		$.getJSON('/ajaj/item/' + key, function(data){
			cache[key] = data;
			window[this.source][key] = JSON.stringify(data);
			subscriber.notify(bhFactory.NOTIFY_INSERT, data);
			var exclude = subscriber.getIdentity();
			var observers = bhFactory._instance[this.source].list.subscriber[subject];
			for (var name in observers){
				if (exclude != name){
					observers[name].notify(bhFactory.NOTIFY_INSERT, data);
				}
			}
		}.bind(this));
	}
};

/**
 * Fetch an item list
 * From local or server
 * @param object subscriber
 * @param string subject
 */
bhFactory.prototype._fetchList = function(subscriber, subject){
	var cache = bhFactory._instance[this.source].list.cache;
	if ('object' == typeof cache[subject]){
		var factory = this;
		$(cache[subject].indices).each(function(){
			factory._fetchItem(subscriber, subject, this);
		});
	}
	else if ('string' == typeof window[this.source][subject]){
		cache[subject] = $.parseJSON(window[this.source][subject]);
		this._fetchList(subscriber, subject);
	}
	else{
		$.getJSON('/ajaj/list/' + subject, function(data){
			cache[subject] = data;
			window[this.source][subject] = JSON.stringify(data);
			this._fetchList(subscriber, subject);
		}.bind(this));
	}
};

/**
 * Keep updating with server
 */
bhFactory.prototype._update = function(){
	var plan = {"l": {},"e": {}};
	var list = bhFactory._instance[this.source].list.cache;
	for (var name in list){
		plan.l[name] = list[name].t;
	}
	var item = bhFactory._instance[this.source].item.cache;
	for (var name in item){
		if (undefined == plan.l[name.split('/')[0]]){
			plan.e[name] = item[name].t;
		}
	}
	//bhFactory._instance.updater.id = setTimeout(bhFactory.prototype._update.bind(this), 10000);
};

/// Singleton
bhFactory._instance = {
	"localStorage": {
		"list": {
			"subscriber": {},
			"cache": {}
		},
		"item": {
			"subscriber": {},
			"cache": {}
		}
	},
	"sessionStorage": {
		"list": {
			"subscriber": {},
			"cache": {}
		},
		"item": {
			"subscriber": {},
			"cache": {}
		}
	}
};
