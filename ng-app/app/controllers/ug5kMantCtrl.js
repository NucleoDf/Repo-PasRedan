/** */
angular
	.module('Ug5kweb')
	.controller('ug5kMantCtrl', ug5kMantCtrl);

	ug5kMantCtrl.$inject = ['dataservice', 'authservice', 'logger', '$q', 'Simulador'];

function ug5kMantCtrl(dataservice, authservice, logger, $q, Simulador) {
    var vm = this;
    var simul = true;

    /** Lista de versiones Software */
    vm.versiones = [{ id: "Version 1.1", activa: true }, { id: "Version 1.0", activa: false }];

    /** Lista de Interfaces Radio */
    vm.lradios = [];
    /** Lista de Interfaces Telefonicas */
    vm.ltelef = [];
	/** Frecuencias en P/R */
    vm.jfrec = [];
    /** Estado P/R */
    vm.cpusel = 0;
    /** Pagina */
	vm.pagina = 0;
	
    /** */
	vm.set_pagina = function (ind) {
	    vm.pagina = ind;
	}

    /** */
	vm.cpu_cambiar = function () {
	    console.log("Orden Cambiar CPU");
	}

    /** */
	vm.software_load = function () {
	    console.log("Software LOAD");
	}

    /** */
	vm.software_activar = function (version) {
	    console.log("Activar Version: ", version);
	}

    /** */
	vm.reset = function () {
	    console.log("RESET!!!");
	}
}
