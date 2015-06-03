/** */
angular
    .module('Ug5kweb')
    .factory('authservice', authservice);

	authservice.$inject = ['$location'];

/** */
function authservice($location) {
    var retorno = {
        browser_support: BrowserSupport,
		check_session: CheckSession,
		profile: Profile		
    };

	/** */
	function CheckSession() {
		var match = document.cookie.match(new RegExp('ssid' + '=([^;]+)'));
		if (!match)
			$location.path(routeForUnauthorizedAccess);
		return (match ? true : false);
	}
	
	/** */
	function Profile() {
		var match = document.cookie.match(new RegExp('ssid' + '=([^;]+)'));
		if (!match)
			return 0;
		var _profile = parseInt(match[1].split('|')[1]);
		return _profile;
	}

	
    /** */
	function BrowserSupport() {
	    if (window.File && window.FileReader && window.FileList && window.Blob) {
	        alert("File API supported.!");
	    } else {
	        alert("The File APIs are not fully supported in this browser.");
	    }
	}


	

	return retorno;
}