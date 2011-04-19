/**
 * Class bhFactory
 * 
 * @brief Element factory
 */
function bhFactory() {
	// Keep singleton
	if ( null != bhFactory._singleton ) return bhFactory._singleton;
	bhFactory._instance = this;

	// Basic members
	this.subscribers = {};
	this.cache = {};

	// Schedule updater
	//this._update();
}

/**
 * @name Notify type enumerations
 */
// @{
// Data
bhFactory.NOTIFY_INSERT = 'INSERT';
bhFactory.NOTIFY_UPDATE = 'UPDATE';
bhFactory.NOTIFY_DELETE = 'DELETE';
// Operation
bhFactory.NOTIFY_ATTACH = 'ATTACH';
bhFactory.NOTIFY_DETACH = 'DETACH';
// @}

/**
 * Subscribe to a subject Will receive notify later
 * 
 * @param subscriber
 *        The observer, MUST provide method notify(subject, type, data) & getIdentity()
 * @param subject
 * @param id
 *        Can be an array of several ID
 */
bhFactory.prototype.subscribe = function(subscriber, subject, id) {
	// Add into notify list
	var name = subscriber.getIdentity();
	if ( 'object' != typeof this.subscribers[subject] ) {
		this.subscribers[subject] = {};
	}
	if ( 'object' != typeof this.subscribers[subject][id] ) {
		this.subscribers[subject][id] = {};
	}
	if ( this.subscribers[subject][id][name] ) {
		this.subscribers[subject][id][name].notify(subject, bhFactory.NOTIFY_DETACH, subscriber);
	}
	this.subscribers[subject][id][name] = subscriber;
	subscriber.notify(subject, bhFactory.NOTIFY_ATTACH, this);
	return this._fetch(subscriber, subject, id);
};

/**
 * Fetch a single item From local or server
 * 
 * @param subscriber
 * @param subject
 * @param id
 * @see this.subscribe
 */
bhFactory.prototype._fetch = function(subscriber, subject, id) {
	if ( 'object' != this.cache[subject] ) {
		this.cache[subject] = {};
	}
	if ( 'object' != this.cache[subject][id] ) {
		$.getJSON('/ajaj/' + subject + '/' + id, function(data) {
			this.cache[subject][id] = data;
			var observers = this.subscribers[subject][id];
			for ( var name in observers ) {
				observers[name].notify(subject, bhFactory.NOTIFY_INSERT, data);
			}
		}.bind(this));
	}
	else {
		subscriber.notify(subject, bhFactory.NOTIFY_INSERT, this.cache[subject][id]);
	}
	return this;
};

/**
 * Keep updating with server
 */
bhFactory.prototype._update = function() {
	var plan = {
		"l" : {},
		"e" : {}
	};
	var list = bhFactory._instance[this.source].list.cache;
	for ( var name in list ) {
		plan.l[name] = list[name].t;
	}
	var item = bhFactory._instance[this.source].item.cache;
	for ( var name in item ) {
		if ( undefined == plan.l[name.split('/')[0]] ) {
			plan.e[name] = item[name].t;
		}
	}
	// bhFactory._instance.updater.id =
	// setTimeout(bhFactory.prototype._update.bind(this), 10000);
};

// Singleton
bhFactory._singleton = null;
