/**
 * Single potato in season panel.
 * @param uuid {String}
 * @param target {String}
 */
function pTuber(uuid, target) {
	var vessel = $('#season_' + target + ' .season');

	this.notify = function(subject, type, source) {
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				$(pTuber.template.replace(/{%(\w+)%}/g, function(unused, key) {
					return source.get(key, 'tuber');
				}).replace('{%$%}', source.uuid())).appendTo(vessel).click(function() {
					$('#seasons li.ui-state-highlight').removeClass('ui-state-highlight');
					$(this).addClass('ui-state-highlight');
					//new pDetail(data.id);
				});
				break;
		}
	};

	(new sPotato(uuid)).subscribe('tuber', this);
}

pTuber.template = '<li id="tuber_{%$%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%brand%}"></a>{%label%}</li>';
