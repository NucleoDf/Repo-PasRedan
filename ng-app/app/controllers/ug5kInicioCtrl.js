/** */
angular
	.module('Ug5kweb')
	.controller('ug5kInicioCtrl', ug5kInicioCtrl);

ug5kInicioCtrl.$inject = ['CfgService','authservice','$q','$scope'];

function ug5kInicioCtrl(CfgService, authservice, $q, $scope) {
	var vm = this;
	var url = '/general';	
	/** */
	vm.j_data = {};
	vm.v_data = [];
	vm.pagina = -1;

	/** */
	vm.set_pagina = function(pagina) {
	    if (authservice.check_session() == true) {
	        post_data();
			vm.pagina = pagina;
			j2vdata();
		}
	}
	
	/** */
	vm.show = function(index){
		if (vm.pagina == 0)
			return true;
		switch (index)
		{
			case 1:
			case 2:
			case 3:
			case 4:
				return vm.v_data[0].Value==0;
			case 5:
			case 6:
				return vm.v_data[0].Value==1;
		}
		return true;
	}

    /** */
	vm.show_cpu2 = function () {
	    return vm.pagina == 0 ? (vm.v_data[1].Value == 1) : (vm.j_data.dual==1);
	}

    /** */
	vm.restore = function () {
	    CfgService.restore().then(function () {
            get_data();
	    });
	}

    /** */
	function get_data() {
	    vm.j_data = CfgService.inicio_data_get();
	    j2vdata();
	}

    /** Post Data. */
	function post_data() {
	    v2jdata();
	    CfgService.inicio_data_set(vm.j_data);
	}

    /** */
	function j2vdata() {
		switch(vm.pagina)
		{
			case 0:	// General
				vm.v_data = [
					{Name: 'Identificador:', Value: vm.j_data.name, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Modo:', Value: vm.j_data.dual, Enable: true, Input: 1, Inputs:["Simple","Dual"], Show: true},
					{Name: 'Ip de Acceso:', Value: vm.j_data.ipv, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip de Servidor:', Value: vm.j_data.ips, Enable: true, Input: 0, Inputs:[], Show: true}
				];
				break;
			case 1:	// CPU-0
				vm.v_data = [
					{Name: 'Tipo de LAN:', Value: vm.j_data.cpus[0].tlan, Enable: true, Input: 1, Inputs:["Simple","Dual"], Show: true},
					{Name: 'Ip ETH0:', Value: vm.j_data.cpus[0].ip0, Enable: true, Input: 0, Inputs:[], Show: vm.v_data[0].Value==0},
					{Name: 'Msc ETH0:', Value: vm.j_data.cpus[0].ms0, Enable: false, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip ETH1:', Value: vm.j_data.cpus[0].ip1, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Msc ETH1', Value: vm.j_data.cpus[0].ms1, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip BOND:', Value: vm.j_data.cpus[0].ipb, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Msc BOND:', Value: vm.j_data.cpus[0].msb, Enable: false, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip Gateway:', Value: vm.j_data.cpus[0].ipg, Enable: false, Input: 0, Inputs:[], Show: true}
				];
				break;
			case 2:	// CPU-1
				vm.v_data = [
					{Name: 'Tipo de LAN:', Value: vm.j_data.cpus[1].tlan, Enable: true, Input: 1, Inputs:["Simple","Dual"], Show: true},
					{Name: 'Ip ETH0:', Value: vm.j_data.cpus[1].ip0, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Msc ETH0:', Value: vm.j_data.cpus[1].ms0, Enable: false, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip ETH1:', Value: vm.j_data.cpus[1].ip1, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Msc ETH1', Value: vm.j_data.cpus[1].ms1, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip BOND:', Value: vm.j_data.cpus[1].ipb, Enable: true, Input: 0, Inputs:[], Show: true},
					{Name: 'Msc BOND:', Value: vm.j_data.cpus[1].msb, Enable: false, Input: 0, Inputs:[], Show: true},
					{Name: 'Ip Gateway:', Value: vm.j_data.cpus[1].ipg, Enable: false, Input: 0, Inputs:[], Show: true}
				];
				break;
			default:
			    vm.v_data = [];
                
		}
	}
	
	/** */
	function v2jdata(){
		switch(vm.pagina)
		{
			case 0: // General
				vm.j_data.name = vm.v_data[0].Value;
				vm.j_data.dual = vm.v_data[1].Value;
				vm.j_data.ipv = vm.v_data[2].Value;
				vm.j_data.ips = vm.v_data[3].Value;
				break;
			case 1: //CPU0
				vm.j_data.cpus[0].tlan = vm.v_data[0].Value;
				vm.j_data.cpus[0].ip0 = vm.v_data[1].Value;
				vm.j_data.cpus[0].ms0 = vm.v_data[2].Value;
				vm.j_data.cpus[0].ip1 = vm.v_data[3].Value;
				vm.j_data.cpus[0].ms1 = vm.v_data[4].Value;
				vm.j_data.cpus[0].ipb = vm.v_data[5].Value;
				vm.j_data.cpus[0].msb = vm.v_data[6].Value;
				vm.j_data.cpus[0].ipg = vm.v_data[7].Value;
				break;
			case 2: //CPU1
				vm.j_data.cpus[1].tlan = vm.v_data[0].Value;
				vm.j_data.cpus[1].ip0 = vm.v_data[1].Value;
				vm.j_data.cpus[1].ms0 = vm.v_data[2].Value;
				vm.j_data.cpus[1].ip1 = vm.v_data[3].Value;
				vm.j_data.cpus[1].ms1 = vm.v_data[4].Value;
				vm.j_data.cpus[1].ipb = vm.v_data[5].Value;
				vm.j_data.cpus[1].msb = vm.v_data[6].Value;
				vm.j_data.cpus[1].ipg = vm.v_data[7].Value;
				break;
		}
	}

    /** */
	CfgService.init().then(function () {
	    get_data();
	    vm.pagina = 0;
	    j2vdata();
	});
	$scope.$on("$destroy", function () {
	    post_data();
	});
}
