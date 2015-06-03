/** */
angular
	.module('Ug5kweb')
	.controller('ug5kRecrCtrl', ug5kRecrCtrl);

ug5kRecrCtrl.$inject = ['authservice', 'CfgService', '$scope'];

function ug5kRecrCtrl(authservice, CfgService, $scope)
{
    var vm = this;
    var simul = true;

    /** Modelo */
    vm.radiosel = 0;
    vm.current = -1;
    vm.lradios = [];
    vm.rdata = {};
    vm.pagina = 0;
    vm.vdata = [];

    /** */
    vm.update_radio = function ()
    {
        if (vm.current != -1)
            set_radio_data(vm.current);
        get_radio_data(vm.radiosel);
    }

    /**********************/
    vm.radgain_show = function (ind)
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
    vm.set_pagina = function (pagina)
    {
        if (authservice.check_session() == true) {
            v2jdata();
            vm.pagina = pagina;
            j2vdata();
        }
    }

    /** */
    vm.rad_show = function (ind)
    {
        switch (ind) {
            case 2:	// Umbral VAD. Solo si SQH==1
                return (vm.vdata[1].Value == 1);
            case 5:	// Mostrar Control BSS. Solo Radio Locales en FD				
                return (vm.vdata[0].Value == 2 || vm.vdata[0].Value == 3);
            case 6:
            case 7:
            case 8: // Parametros BSS. Solo Radio Locales en FD y BSS Activo
                return ((vm.vdata[0].Value == 2 || vm.vdata[0].Value == 3) && vm.vdata[5].Value == 1)
            case 9: // Tiempo de Compensacion CLIMAX. Solo Radio Locales en FD, BSS Activo y Metodo Estatico
                return (((vm.vdata[0].Value == 2 || vm.vdata[0].Value == 3) && vm.vdata[5].Value == 1) && vm.vdata[8].Value == 0);
        }
        return true;
    }

    /** */
    vm.col_show = function (ind)
    {
        switch (ind) {
            case 4:	// Emp 1. Tx y Rx B.
            case 6:
                return (vm.vdata[0].Value == 1 || vm.vdata[0].Value == 3);
            case 7:
            case 8: // Emp 2/3. Tx y Rx A.
            case 10:
            case 13:
            case 15:
                return (vm.vdata[0].Value == 2 || vm.vdata[0].Value == 3);
            case 12:
            case 9: // Emp 2/3. Tx y Rx B.
            case 11:
            case 14:
            case 16:
                return (vm.vdata[0].Value == 3);
            default:
                return true;
        }
    }

    /** */
    vm.lbn_show = function (ind)
    {
        switch (ind) {
            case 1:
                return (vm.vdata[0].Value == 2);
            case 2:
                return (vm.vdata[0].Value == 1);
            default:
                return true;
        }
    }

    /** */
    vm.restore = function ()
    {
        CfgService.restore().then(function ()
        {
            get_radios();
            get_radio_data(vm.radiosel);
        });
    }

    /** */
    function get_radios()
    {
        vm.lradios = CfgService.lradios();
    }

    /** */
    function get_radio_data(radio)
    {
        vm.radiosel = radio;
        vm.current = radio;
        vm.rdata = CfgService.radio_data_get(radio);
        j2vdata();
    }

    /** */
    function set_radio_data(radio)
    {
        v2jdata();
        CfgService.radio_data_set(radio, vm.rdata);
    }

    /** */
    function j2vdata()
    {
        switch (vm.pagina) {
            case 0:
                vm.vdata = [
					{ Name: 'Identificador:', Value: vm.rdata.IdRecurso, Enable: true, Input: 0, Inputs: [], Show: function () { return true; } },
					{ Name: 'En Tarjeta:', Value: vm.rdata.SlotPasarela, Enable: true, Input: 0, Inputs: [], Show: function () { return true; } },
					{ Name: 'Slot:', Value: vm.rdata.NumDispositivoSlot, Enable: true, Input: 0, Inputs: [], Show: function () { return true; } },
					{ Name: 'URI:', Value: vm.rdata.Uri_Local, Enable: true, Input: 0, Inputs: [], Show: function () { return true; } },
					{ Name: 'JITTER-MAX:', Value: vm.rdata.Buffer_jitter.max, Enable: true, Input: 0, Inputs: [], Show: function () { return true; } },
					{ Name: 'JITTER-MIN:', Value: vm.rdata.Buffer_jitter.min, Enable: true, Input: 0, Inputs: [], Show: function () { return true; } }
                ];
                break;
            case 1:
                vm.vdata = [
					{ Name: 'AGC en A/D ?:', Value: vm.rdata.hardware.AD_AGC, Enable: true, Input: 1, Inputs: ["No", "Si"], Show: function () { return true; } },
					{ Name: 'Ganancia en A/D:', Value: vm.rdata.hardware.AD_Gain, Enable: true, Input: 0, Inputs: [], Show: vm.radgain_show  },
					{ Name: 'AGC en D/A ?:', Value: vm.rdata.hardware.DA_AGC, Enable: true, Input: 1, Inputs: ["No", "Si"], Show: function () { return true; } },
					{ Name: 'Ganacia en D/A:', Value: vm.rdata.hardware.DA_Gain, Enable: true, Input: 0, Inputs: [], Show: vm.radgain_show  }
                ];
                break;
            case 2:
                vm.vdata = [
					{
					    Name: 'Tipo de Agente Radio:', Value: vm.rdata.radio.TipoRadio, Enable: true, Input: 1, Inputs: [
                           "Local-Simple", "Local-P/R", "Local FD-Simple", "Local FD-P/R",
                           "Remoto RxTx", "Remoto Tx", "Remoto Rx"], Show: vm.rad_show
					},
					{ Name: 'Tipo SQUELCH:', Value: vm.rdata.radio.SQ, Enable: true, Input: 1, Inputs: ["Hardware", "VAD"], Show: vm.rad_show },
					{ Name: 'Umbral VAD:', Value: vm.rdata.radio.UmbralVAD, Enable: true, Input: 0, Inputs: [], Show: vm.rad_show },
					{ Name: 'Tipo PTT:', Value: vm.rdata.radio.PTT, Enable: true, Input: 1, Inputs: ["Hardware", "Tono"], Show: vm.rad_show },
					{ Name: 'Tiempo PTT Maximo:', Value: vm.rdata.radio.TiempoPTT, Enable: true, Input: 0, Inputs: [], Show: vm.rad_show },
					{ Name: 'BSS/CLIMAX?:', Value: vm.rdata.radio.BSS, Enable: true, Input: 1, Inputs: ["No", "Si"], Show: vm.rad_show },
					{ Name: 'Método BSS:', Value: vm.rdata.radio.MetodoBSS, Enable: false, Input: 1, Inputs: ["Nucleo", "Otro"], Show: vm.rad_show },
					{ Name: 'Ventana BSS:', Value: vm.rdata.radio.tm_ventana_rx, Enable: true, Input: 0, Inputs: [], Show: vm.rad_show },
					{
					    Name: 'Método Compensacion CLIMAX:', Value: vm.rdata.radio.modo_compensacion, Enable: true, Input: 1, Inputs: ["Estatico", "Dinamico"],
					    Show: vm.rad_show
					},
					{
					    Name: 'Tiempo Compensacion Estatico:', Value: vm.rdata.radio.climax_delay, Enable: true, Input: 0, Inputs: [],
					    Show: vm.rad_show
					}
                ];
                break;
            case 3:
                vm.vdata = [                                                       // Enable: false,
					{
					    Name: 'Tipo de Agente Radio:', Value: vm.rdata.radio.TipoRadio, Enable: true, Input: 1, Inputs: [
                           "Local-Simple", "Local-P/R", "Local FD-Simple", "Local FD-P/R",
                           "Remoto RxTx", "Remoto Tx", "Remoto Rx"], Show: vm.col_show
					},
					{ Name: 'Frecuencia:', Value: vm.rdata.radio.colateral.name, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'Emplazamiento-1:', Value: [], Enable: false, Input: -1, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-TX-A:', Value: vm.rdata.radio.colateral.emplazamientos[0].uriTxA, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-TX-B:', Value: vm.rdata.radio.colateral.emplazamientos[0].uriTxB, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-RX-A:', Value: vm.rdata.radio.colateral.emplazamientos[0].uriRxA, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-RX-B:', Value: vm.rdata.radio.colateral.emplazamientos[0].uriRxB, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'Emplazamiento-2:', Value: [], Enable: false, Input: -1, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-TX-A:', Value: vm.rdata.radio.colateral.emplazamientos[1].uriTxA, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-TX-B:', Value: vm.rdata.radio.colateral.emplazamientos[1].uriTxB, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-RX-A:', Value: vm.rdata.radio.colateral.emplazamientos[1].uriRxA, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-RX-B:', Value: vm.rdata.radio.colateral.emplazamientos[1].uriRxB, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'Emplazamiento-3:', Value: [], Enable: false, Input: -1, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-TX-A:', Value: vm.rdata.radio.colateral.emplazamientos[2].uriTxA, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-TX-B:', Value: vm.rdata.radio.colateral.emplazamientos[2].uriTxB, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-RX-A:', Value: vm.rdata.radio.colateral.emplazamientos[2].uriRxA, Enable: true, Input: 0, Inputs: [], Show: vm.col_show },
					{ Name: 'URI-RX-B:', Value: vm.rdata.radio.colateral.emplazamientos[2].uriRxB, Enable: true, Input: 0, Inputs: [], Show: vm.col_show }
                ];
                break;
            case 4:
                vm.vdata = [
					{
					    Name: 'Tipo de Restriccion:', Value: vm.rdata.restriccion, Enable: true, Input: 1,
					    Inputs: ["Ninguna", "Lista Negra", "Lista Blanca"], Show: vm.lbn_show
					},
					{
					    Name: 'Lista Blanca:', Value: vm.rdata.listablanca, Enable: true, Input: 2,
					    Inputs: [], Show: vm.lbn_show
					},
					{
					    Name: 'Lista Negra:', Value: vm.rdata.listanegra, Enable: true, Input: 2,
					    Inputs: [], Show: vm.lbn_show
					},
                ];
                break;
            default:
                vm.vdata = [];
                break;
        }
    }

    /** */
    function v2jdata()
    {
        switch (vm.pagina) {
            case 0:
                vm.rdata.IdRecurso = vm.vdata[0].Value;
                vm.rdata.Uri_Local = vm.vdata[3].Value;
                vm.rdata.Buffer_jitter.max = vm.vdata[4].Value;
                vm.rdata.Buffer_jitter.min = vm.vdata[5].Value;
                break;
            case 1:
                vm.rdata.hardware.AD_AGC = vm.vdata[0].Value;
                vm.rdata.hardware.AD_Gain = vm.vdata[1].Value;
                vm.rdata.hardware.DA_AGC = vm.vdata[2].Value;
                vm.rdata.hardware.DA_Gain = vm.vdata[3].Value;
                break;
            case 2:
                vm.rdata.radio.TipoRadio = vm.vdata[0].Value;
                vm.rdata.radio.SQ = vm.vdata[1].Value;
                vm.rdata.radio.UmbralVAD = vm.vdata[2].Value;
                vm.rdata.radio.PTT = vm.vdata[3].Value;
                vm.rdata.radio.TiempoPTT = vm.vdata[4].Value;
                vm.rdata.radio.BSS = vm.vdata[5].Value;
                vm.rdata.radio.MetodoBSS = vm.vdata[6].Value;
                vm.rdata.radio.tm_ventana_rx = vm.vdata[7].Value;
                vm.rdata.radio.modo_compensacion = vm.vdata[8].Value;
                vm.rdata.radio.climax_delay = vm.vdata[9].Value;
                break;
            case 3:
                vm.rdata.radio.colateral.name = vm.vdata[1].Value;
                vm.rdata.radio.colateral.emplazamientos[0].uriTxA = vm.vdata[3].Value;
                vm.rdata.radio.colateral.emplazamientos[0].uriTxB = vm.vdata[4].Value;
                vm.rdata.radio.colateral.emplazamientos[0].uriRxA = vm.vdata[5].Value;
                vm.rdata.radio.colateral.emplazamientos[0].uriRxB = vm.vdata[6].Value;
                vm.rdata.radio.colateral.emplazamientos[1].uriTxA = vm.vdata[8].Value;
                vm.rdata.radio.colateral.emplazamientos[1].uriTxB = vm.vdata[9].Value;
                vm.rdata.radio.colateral.emplazamientos[1].uriRxA = vm.vdata[10].Value;
                vm.rdata.radio.colateral.emplazamientos[1].uriRxB = vm.vdata[11].Value;
                vm.rdata.radio.colateral.emplazamientos[2].uriTxA = vm.vdata[13].Value;
                vm.rdata.radio.colateral.emplazamientos[2].uriTxB = vm.vdata[14].Value;
                vm.rdata.radio.colateral.emplazamientos[2].uriRxA = vm.vdata[15].Value;
                vm.rdata.radio.colateral.emplazamientos[2].uriRxB = vm.vdata[16].Value;
                break;
            case 4:
                vm.rdata.restriccion = vm.vdata[0].Value;
                vm.rdata.listablanca = vm.vdata[1].Value;
                vm.rdata.listanegra = vm.vdata[2].Value;
                break;
        }
    }

    /** */
    CfgService.init().then(function ()
    {
        get_radios();
        vm.radiosel = 0;
        vm.update_radio();
    });
    $scope.$on("$destroy", function ()
    {
        set_radio_data(vm.radiosel);
    });


}
