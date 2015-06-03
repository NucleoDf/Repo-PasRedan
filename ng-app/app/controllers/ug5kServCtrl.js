/** */
angular
	.module('Ug5kweb')
	.controller('ug5kServCtrl', ug5kServCtrl);

	ug5kServCtrl.$inject = ['authservice', 'CfgService', '$scope'];

function ug5kServCtrl(authservice, CfgService, $scope) {
	var vm = this;
	var url = '/servicios';

	/** */
	vm.jserv = {};
	vm.index = 0;
	vm.data;
	
	/** */
	vm.set_index = function(index) {
	    if (authservice.check_session() == true) {
	        post_data();
			vm.index = index;
			j2data();
		}
	}

    /** */
	vm.restore = function(){
	    CfgService.restore().then(function () {
	        get_data();
	    });
	}

    /** Get Data */
	function get_data() {
	    vm.jserv = CfgService.ser_data_get();
	    j2data();
	}

    /** Post Data. */
	function post_data() {
        if (data2j() == false)
            return;
        CfgService.ser_data_set(vm.jserv);
	}

    /** */
	function j2data() {
		switch(vm.index)
		{
			case 0:	// SIP
				vm.data = [
					{Name: 'Puerto', Value: vm.jserv.sip.PuertoLocalSIP, Enable: true, Input: 0, Inputs:[]},
					{Name: 'Keep Alive Period:', Value: vm.jserv.sip.KeepAlivePeriod, Enable: true, Input: 0, Inputs:[]},
					{Name: 'Keep Alive Mult.:', Value: vm.jserv.sip.KeepAliveMultiplier, Enable: true, Input: 0, Inputs:[]},
					{Name: 'Periodo Supervision:', Value: vm.jserv.sip.PeriodoSupervisionSIP, Enable: true, Input: 0, Inputs:[]},
					{Name: 'Proxy:', Value: vm.jserv.sip.proxys, Enable: true, Input: 2, Inputs: []},
					{Name: 'Registar:', Value: vm.jserv.sip.registrars, Enable: true, Input: 2, Inputs:[]}
				];
				break;
			case 1:	// Sincronizacion
				vm.data = [
					{Name: 'Tipo:', Value: vm.jserv.sincr.ntp, Enable: false, Input: 1, Inputs:["NADA","OTRO","NTP"]},
					{Name: 'Servidor NTP:', Value: vm.jserv.sincr.servidores, Enable: true, Input: 2, Inputs:[]}
				];
				break;
			case 2:	// SNMP
				vm.data = [
					{Name: 'Puerto Servicio:', Value: vm.jserv.snmp.sport, Enable: false, Input: 0, Inputs:[]},
					{Name: 'Puerto SNMP:', Value: vm.jserv.snmp.snmpp, Enable: true, Input: 0, Inputs:[]},
					{Name: 'Destinos TRAPS:', Value: vm.jserv.snmp.traps, Enable: true, Input: 2, Inputs:[]},
					{Name: 'SNMP-V2?:', Value: vm.jserv.snmp.agv2, Enable: true, Input: 1, Inputs:["No","Si"]},
					{Name: 'SNMP-V2-COMMUNITY:', Value: vm.jserv.snmp.agcomm, Enable: true, Input: 0, Inputs:[]},
					{Name: 'SNMP-NAME:', Value: vm.jserv.snmp.agname, Enable: false, Input: 0, Inputs:[], Val: ""},
					{Name: 'SNMP-LOCATION:', Value: vm.jserv.snmp.agloc, Enable: false, Input: 0, Inputs:[]},
					{Name: 'SNMP-CONTACT:', Value: vm.jserv.snmp.agcont, Enable: false, Input: 0, Inputs:[]}
				];
				break;
			case 3:	// WEB
				vm.data = [
					{Name: 'Puerto Servicio:', Value: vm.jserv.web.wport, Enable: false, Input: 0, Inputs:[]},
					{Name: 'Tiempo de Session (seg):', Value: vm.jserv.web.stime, Enable: true, Input: 0, Inputs:[]}
				];
				break;
			case 4:	// Grabador
				vm.data = [
					{Name: 'Puerto Servicio:', Value: vm.jserv.grab.sport, Enable: false, Input: 0, Inputs:[]},
					{Name: 'RTSP-URI:', Value: vm.jserv.grab.rtsp_uri, Enable: true, Input: 0, Inputs:[]},
					{Name: 'RTSP-IP:', Value: vm.jserv.grab.rtsp_ip, Enable: true, Input: 0, Inputs:[]},
					{Name: 'PUERTO RTSP:', Value: vm.jserv.grab.rtsp_port, Enable: true, Input: 0, Inputs:[]},
					{Name: 'TRAMAS RTP?:', Value: vm.jserv.grab.rtsp_rtp, Enable: true, Input: 1, Inputs:["No","Si"]},
					{Name: 'RTP PAYLOAD:', Value: vm.jserv.grab.rtp_pl, Enable: false, Input: 0, Inputs:[]},
					{Name: 'RTP RATE:', Value: vm.jserv.grab.rtp_sr, Enable: false, Input: 0, Inputs:[]}
				];
				break;
			default:
				vm.data = [];
		}
	}
	
	/** */
	function data2j(){
	
		if (Validate()==false)
			return false;
			
		switch(vm.index)
		{
			case 0: // SIP...
				vm.jserv.sip.PuertoLocalSIP = vm.data[0].Value;
				vm.jserv.sip.KeepAlivePeriod = vm.data[1].Value;
				vm.jserv.sip.KeepAliveMultiplier = vm.data[2].Value;
				vm.jserv.sip.PeriodoSupervisionSIP = vm.data[3].Value;
				vm.jserv.sip.proxys = vm.data[4].Value;
				vm.jserv.sip.registrars = vm.data[5].Value;
				break;
			case 1: // NTP...
				vm.jserv.sincr.ntp = vm.data[0].Value;
				vm.jserv.sincr.servidores = vm.data[1].Value;
				break;
			case 2: // SNMP...
				vm.jserv.snmp.sport = vm.data[0].Value;
				vm.jserv.snmp.snmpp = vm.data[1].Value;
				vm.jserv.snmp.traps = vm.data[2].Value;
				vm.jserv.snmp.agv2 = vm.data[3].Value;
				vm.jserv.snmp.agcomm = vm.data[4].Value;
				vm.jserv.snmp.agname = vm.data[5].Value;
				vm.jserv.snmp.agloc = vm.data[6].Value;
				vm.jserv.snmp.agcont = vm.data[7].Value;
				break;
			case 3: // WEB...
				vm.jserv.web.wport = vm.data[0].Value;
				vm.jserv.web.stime = vm.data[1].Value;
				break;
			case 4: // Grabador
				vm.jserv.grab.sport = vm.data[0].Value;
				vm.jserv.grab.rtsp_uri = vm.data[1].Value;
				vm.jserv.grab.rtsp_ip = vm.data[2].Value;
				vm.jserv.grab.rtsp_port = vm.data[3].Value;
				vm.jserv.grab.rtsp_rtp = vm.data[4].Value;
				vm.jserv.grab.rtp_pl = vm.data[5].Value;
				vm.jserv.grab.rtp_sr = vm.data[6].Value;
				break;
		}
		return true;
	}
	
	/** */
	function Validate() {
		switch (vm.index)
		{
		case 0:
			/** */
			$.each(vm.data[4].Value, function(index, value) {
				console.log("Validate Proxy IP: ", index, value);
				if (value.match(regx_ipval)==null)
					return Error('Error en formato de Proxy IP: ' + value);
			});
			$.each(vm.data[5].Value, function(index, value) {
				console.log("Validate Registar IP: ", index, value);
				if (value.match(regx_ipval)==null)
					return Error('Error en formato de Registar IP: ' + value);
			});			
			break;
		case 1:
			$.each(vm.data[1].Value, function(index, value) {
				console.log("Validate NTP IP: ", index, value);
				if (value.match(regx_ipval)==null)
					return Error('Error en formato de NTP IP: ' + value);
			});
			break;
		case 2:
			$.each(vm.data[2].Value, function(index, value) {
			console.log("Validate TRAP: ", index, value);
			if (value.match(regx_trpval)==null)
				return Error('Error en formato de TRAP: ' + value);
			});
			break;
		case 4:
			if (vm.data[2].Value.match(regx_ipval)==null)
				return Error('Error en formato de RTSP IP'+vm.data[2].Value);
			break;
		}
		
		return true;
	}
	
	/** */
	function Error(msg) {
		alert("Error: " + msg);
		return false;
	}
	
	
	/** */
    /** */
	CfgService.init().then(function () {
	    get_data();
	    vm.set_index(0);
	    Validate();
	});
	$scope.$on("$destroy", function () {
	    post_data();
	});
}
