/**
 * @class bhFactory
 * @brief Element factory
 */
function bhFactory() {
	// Keep singleton
	if ( null != bhFactory._singleton ) {
		return bhFactory._singleton;
	}
	bhFactory._singleton = this;

	// Basic members
	this.subscribers = {};
	this.elements = {};

	// Schedule updater
	// this._update();
}

///@name Notify type enumerations
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
 * Subscribe to a subject, will receive notify later
 *
 * @param subscriber
 *        The observer, MUST provide method notify(subject, type, data)
 * @param identity
 * @param subject
 * @param id
 *        Can be an array of several ID
 */
bhFactory.prototype.subscribe = function(subscriber, identity, subject, id) {
	// Add into notify list
	if ( 'object' != typeof this.subscribers[subject] ) {
		this.subscribers[subject] = {};
	}
	if ( 'object' != typeof this.subscribers[subject][id] ) {
		this.subscribers[subject][id] = {};
	}
	var predecessor = this.subscribers[subject][id][identity];
	if ( predecessor ) {
		if ( predecessor == subscriber ) return this;
		predecessor.notify(subject, bhFactory.NOTIFY_DETACH, subscriber);
	}
	this.subscribers[subject][id][identity] = subscriber;
	subscriber.notify(subject, bhFactory.NOTIFY_ATTACH, this);
	return this._fetch(subscriber, subject, id);
};

/**
 * Unsubscribe a subject, will not receive notify anymore
 *
 * @param subscriber
 *        The observer, MUST provide method notify(subject, type, data)
 * @param identity
 * @param subject
 * @param id
 *        Can be an array of several ID
 */
bhFactory.prototype.unsubscribe = function(unsubscriber, identity, subject, id) {
	var candidate = this.subscribers[subject][id][identity];
	if ( candidate == unsubscriber ) {
		candidate.notify(subject, bhFactory.NOTIFY_DETACH, this);
		delete this.subscribers[subject][id][identity];
	}
};

/**
 * Fetch a single item From local or server
 *
 * @param subscriber
 * @param subject
 * @param id
 *
 * @see this.subscribe
 */
bhFactory.prototype._fetch = function(subscriber, subject, id) {
	if ( 'object' != typeof this.elements[subject] ) {
		this.elements[subject] = {};
	}
	if ( 'object' != typeof this.elements[subject][id] ) {
		$.getJSON('/ajaj/' + subject + '/' + id, function(data) {
			this.elements[subject][id] = data;
			var observers = this.subscribers[subject][id];
			for ( var identity in observers ) {
				observers[identity].notify(subject, bhFactory.NOTIFY_INSERT, data);
			}
		}.bind(this));
	}
	else {
		subscriber.notify(subject, bhFactory.NOTIFY_INSERT, this.elements[subject][id]);
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
//	bhFactory._instance.updater.id =
//	setTimeout(bhFactory.prototype._update.bind(this), 10000);
};

/**
 * Singleton holder
 */
bhFactory._singleton = null;
