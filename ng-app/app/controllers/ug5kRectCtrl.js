/** */
angular
	.module('Ug5kweb')
	.controller('ug5kRectCtrl', ug5kRectCtrl);

ug5kRectCtrl.$inject = ['authservice', 'CfgService', '$scope'];

function ug5kRectCtrl(authservice, CfgService, $scope) {
	var vm = this;
	var simul = true;
	
	/** Modelo */
	vm.selected = 0
	vm.current = -1;
	vm.ltelef = [];
	vm.tdata = {};
	vm.pagina = 0;
	vm.vdata=[];
	
    /***********/
	vm.telgain_show = function (ind)
	{
	    ////if (vm.pagina == 1)
	    //    return true;
	    switch (ind) {
	        case 1:
	            return (vm.vdata[0].Value == 0);
	        case 2:

	        case 3:
	            return (vm.vdata[2].Value == 0);
	        case 4:

	        case 5:
	        case 6:

	    }
	    return true;
	}
    /** */
	vm.update_telef = function() {
	    if (vm.current != -1)
	        set_telef_data(vm.current);
	    get_telef_data(vm.selected);
	}

	/** */
	vm.set_pagina = function(pagina) {
		if (authservice.check_session()==true) {
			v2jdata();
			vm.pagina = pagina;
			j2vdata();
		}
	}

	/** */
	vm.lbn_show = function(ind) {
		switch(ind) {
			case 1:
				return (vm.vdata[0].Value==2);
			case 2:
				return (vm.vdata[0].Value==1);
			default:
				return true;
		}
	}
	
	/** */
	vm.tel_show = function(ind) {
		switch(ind) {
			case 1:
				return (vm.vdata[0].Value == 5 || vm.vdata[0].Value == 6 || vm.vdata[0].Value == 7);
			case 2:
				return (vm.vdata[0].Value == 4);
			case 3:
				return (vm.vdata[0].Value == 4 && vm.vdata[2].Value == 1);
			default:
				return true;
		}
	}
	
    /** */
	vm.restore = function () {
	    CfgService.restore().then(function () {
	        get_telef();
	        get_telef_data(vm.selected);
	    });
	}

	/** */
	function get_telef() {
	    vm.ltelef = CfgService.ltelef();
	}
	
	/** */
	function get_telef_data (telef) {
	    vm.selected = telef;
	    vm.current = telef;
	    vm.tdata = CfgService.telef_data_get(telef);
	    j2vdata();
	}

    /** */
	function set_telef_data(telef) {
	    v2jdata();
	    CfgService.telef_data_set(telef, vm.tdata);
	}

	/** */
	function j2vdata() {
		switch(vm.pagina) {
			case 0:
				vm.vdata = [
					{Name: 'Identificador:', Value: vm.tdata.IdRecurso, Enable: true, Input: 0, Inputs:[], Show: function(){return true;}},
					{Name: 'En Tarjeta:', Value: vm.tdata.SlotPasarela, Enable: true, Input: 0, Inputs:[], Show: function(){return true;}},
					{Name: 'Slot:', Value: vm.tdata.NumDispositivoSlot, Enable: true, Input: 0, Inputs:[], Show: function(){return true;}},
					{Name: 'URI:', Value: vm.tdata.Uri_Local, Enable: true, Input: 0, Inputs:[], Show: function(){return true;}},
					{Name: 'JITTER-MAX:', Value: vm.tdata.Buffer_jitter.max, Enable: true, Input: 0, Inputs:[], Show: function(){return true;}},
					{Name: 'JITTER-MIN:', Value: vm.tdata.Buffer_jitter.min, Enable: true, Input: 0, Inputs:[], Show: function(){return true;}}
				];
			break;
			case 1:
				vm.vdata = [
					{Name: 'AGC en A/D ?:', Value: vm.tdata.hardware.AD_AGC, Enable: true, Input: 1, Inputs:["No","Si"], Show: function(){return true;}},
					{ Name: 'Ganancia en A/D:', Value: vm.tdata.hardware.AD_Gain, Enable: true, Input: 0, Inputs: [], Show: vm.telgain_show },
					{Name: 'AGC en D/A ?:', Value: vm.tdata.hardware.DA_AGC, Enable: true, Input: 1, Inputs:["No","Si"], Show: function(){return true;}},
					{ Name: 'Ganancia en D/A:', Value: vm.tdata.hardware.DA_Gain, Enable: true, Input: 0, Inputs: [], Show: vm.telgain_show }
				];
			break;
			case 2:
				vm.vdata = [
					{Name: 'Tipo de Interfaz Telefonico:', Value: vm.tdata.telefonia.TipoTelefonia, Enable: true, Input: 1, Inputs:[
						"PP-BL", "PP-BC","PP-AB","LCEN","PP-EyM",
						"ATS-R2", "ATS-N5", "ATS-QSIG"], Show: vm.tel_show},
					{Name: 'Lado:', Value: vm.tdata.telefonia.Lado, Enable: true, Input: 1, Inputs:[
						"Lado A","Lado B"], Show: vm.tel_show},
					{Name: 'Tipo EyM:', Value: vm.tdata.telefonia.h2h4, Enable: true, Input: 1, Inputs:[
						"2 Hilos","4 Hilos"], Show: vm.tel_show},
					{Name: 'Hardware EyM:', Value: vm.tdata.telefonia.t_eym, Enable: true, Input: 1, Inputs:[
						"Tipo 1","Tipo 2","Tipo 3","Tipo 4","Tipo 5"], Show: vm.tel_show},
					{Name: 'URI Remota:', Value: vm.tdata.telefonia.uri_remota, Enable: true, Input: 0, Inputs:[
						], Show: vm.tel_show},
					{Name: 'Respuesta Automatica ?:', Value: vm.tdata.telefonia.r_automatica, Enable: true, Input: 1, Inputs:[
						"Si","No"], Show: vm.tel_show}
				];
				break;
			case 3:
				vm.vdata = [
					{Name: 'Tipo de Restriccion:', Value: vm.tdata.restriccion, Enable: true, Input: 1, 
						Inputs:["Ninguna","Lista Negra", "Lista Blanca"], Show: vm.lbn_show},
					{Name: 'Lista Blanca:', Value: vm.tdata.listablanca, Enable: true, Input: 2, 
						Inputs:[], Show: vm.lbn_show},
					{Name: 'Lista Negra:', Value: vm.tdata.listanegra, Enable: true, Input: 2, 
						Inputs:[], Show: vm.lbn_show},
				];
			break;
			default:			
				vm.vdata = [];
			break;
		}
	}
	
	/** */
	function v2jdata() {
		switch (vm.pagina) {
			case 0:
				vm.tdata.IdRecurso = vm.vdata[0].Value;
				vm.tdata.Uri_Local = vm.vdata[3].Value;
				vm.tdata.Buffer_jitter.max = vm.vdata[4].Value;
				vm.tdata.Buffer_jitter.min = vm.vdata[5].Value;
			break;
			case 1:
				vm.tdata.hardware.AD_AGC = vm.vdata[0].Value;
				vm.tdata.hardware.AD_Gain = vm.vdata[1].Value;
				vm.tdata.hardware.DA_AGC = vm.vdata[2].Value;
				vm.tdata.hardware.DA_Gain = vm.vdata[3].Value;
			break;
			case 2:
				vm.tdata.telefonia.TipoTelefonia = vm.vdata[0].Value;
				vm.tdata.telefonia.Lado = vm.vdata[1].Value;
				vm.tdata.telefonia.h2h4 = vm.vdata[2].Value;
				vm.tdata.telefonia.t_eym = vm.vdata[3].Value;
				vm.tdata.telefonia.uri_remota = vm.vdata[4].Value;
				vm.tdata.telefonia.r_automatica = vm.vdata[5].Value;
			break;
			case 3:
				vm.tdata.restriccion = vm.vdata[0].Value;
				vm.tdata.listablanca = vm.vdata[1].Value;
				vm.tdata.listanegra = vm.vdata[2].Value;
			break;
		}
	}
	
    /** */
	CfgService.init().then(function () {
	    get_telef();
	    vm.selected = 0;
	    vm.update_telef();
	});
	$scope.$on("$destroy", function () {
	    set_telef_data(vm.selected);
	});
}
