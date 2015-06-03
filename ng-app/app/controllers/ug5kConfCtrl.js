/** */
angular
	.module('Ug5kweb')
	.controller('ug5kConfCtrl', ug5kConfCtrl);

	ug5kConfCtrl.$inject = ['dataservice', 'authservice', 'CfgService', '$q', '$scope'];

	function ug5kConfCtrl(dataservice, authservice, CfgService, $q, $scope) {
	var vm = this;

	/** */
	function post(url,data) {	
		var deferred = $q.defer();
		dataservice.set_data(url, data, false).then(
			function(respuesta) {
				console.log("POST: ", respuesta);
				deferred.resolve();
			}
		);
		return deferred.promise;
	}
	
	/** */
	vm.preconf = [];
	vm.preconfname = "PRECONF01";
	vm.pagina = 0;
	/** */
	vm.Pagina = function(n){
		if (authservice.check_session()==true)
			vm.pagina = n;
	}
	
	/** */
	vm.salvar = function() {
       	if (Confirma("¿Realmente desea activar los cambios efectuados?")) {
       	    // post('/conf/salvar', {});
       	    CfgService.save();
       	}
	}
	
	/** */
	vm.descartar = function() {
       	if (Confirma("¿Realmente desea descartar los cambios efectuados?")) {
       	    // post('/conf/descartar', {});
       	    CfgService.restore();
		}
	}
	
	/** */
	vm.salvarcomo = function() {
       	var pre = "¿Quiere salvar la configuracion actual como " + vm.preconfname + " ?";
       	if (Confirma(pre)) {
			post('/preconf/' + vm.preconfname, {})
				.then(
					function (res) {
						vm.get_preconf();
					}					
				);
		}
	}
	
	/** */
	vm.activar = function(name) {
		var pre = "¿Quiere activar la Preconfiguracion " + name + " ?";
        	if (Confirma(pre)) {
				dataservice.put_data('/preconf/' + name, {})
					.then(function(res){console.log("PUT: ", res);});
			}
	}

	/** */
	vm.eliminar = function(name) {
		var pre = "¿Quiere Eliminar la Preconfiguracion " + name + " ?";
		if (Confirma(pre)) {	
				dataservice.del_data('/preconf/' + name, {})
					.then(
						function(res) {
							console.log("DELETE: ", res);
							vm.get_preconf();
						});
		}
	}
	
	/** */
	vm.get_preconf = function() {
		var deferred = $q.defer();
		var url = '/preconf';

		console.log("GET ", url);		
		dataservice.get_data(url, false).then(
			function (respuesta) {
				console.log("res:", respuesta);
				vm.preconf = respuesta;
				deferred.resolve();
				}
		);
		
		return deferred.promise;
	}		
	
	/** */
	function Confirma(msg) {
		if (authservice.check_session() && confirm(msg))
			return true;
		return false;
	}
	
    /** */
	CfgService.init().then(function () {
	    vm.get_preconf();
	});
	$scope.$on("$destroy", function () {
	});
    /** */
}
