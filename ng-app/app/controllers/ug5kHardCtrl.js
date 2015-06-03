/** */
angular
	.module('Ug5kweb')
	.controller('ug5kHardCtrl', ug5kHardCtrl);

ug5kHardCtrl.$inject = ['CfgService', '$scope'];

function ug5kHardCtrl(CfgService, $scope) {
	var vm = this;

	/** */
	vm.jslv = {};
	vm.slv = 0;
	
	/** Funciones AJAX */
	/** Get Data */
	vm.get_data = function (slv) {
	    vm.jslv = CfgService.hw_data_get(slv);
	}

	/** Post Data. */
	vm.post_data = function (slv) {
	    CfgService.hw_data_set(slv, vm.jslv);
	}

	/** */
	vm.set_slv = function (slv) {
	    vm.post_data(vm.slv);
		vm.slv = slv;
		vm.get_data(slv);
	}
	
    /** */
	vm.restore = function () {
	    CfgService.restore().then(function () {
	        vm.get_data(vm.slv);
	    });
	}

    /** */
	vm.pos_change = function () {
	    vm.post_data(vm.slv);
	}

    /** */
	CfgService.init().then(function () {
	    vm.slv = 0;
	    vm.get_data(0);
	});

    /** Salva los cambios al salir */
	$scope.$on("$destroy", function () {
	    vm.post_data(vm.slv);
	});
}
