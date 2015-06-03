/** */
angular
	.module('Ug5kweb')
	.controller('ug5kGlobalCtrl', ug5kGlobalCtrl);

ug5kGlobalCtrl.$inject = ['$scope', 'dataservice', 'authservice', 'CfgService', 'ngDialog'];

function ug5kGlobalCtrl($scope, dataservice, authservice, CfgService, ngDialog) {
	var vm = this;
	/** Datos del Modelo Global. */
	vm.date = GetDate();
	vm.user = GetUser();
	vm.logout = function (){Logout();};	
	vm.enable = function(nivel){return enable(nivel);};
	vm.select = function (path) { return is_select(path); };
	vm.hora = GetHora();

    /** */
	vm.software_load = function () {
	    ngDialog.open({ template: './app/templates/ug5kweb-swload-templ.html', className: 'ngdialog-theme-default' });
	}

    /** */
	vm.software_load_send = function () {
	    var file = $scope.myFile;
	    console.log('file is ' + JSON.stringify(file));
	    var uploadUrl = "/sw_upload";
	    dataservice.send_file(uploadUrl, file).then(function(){alert("Fichero Enviado..");});
	}

    /** */
	vm.restore = function () {
	    CfgService.restore();
	}

    /** */
	vm.save = function () {
	    CfgService.save();
	}

	/** */
	//function GetDate() {
	//	var f = new Date();
	//	return (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
	//}
    /** **/
	function ponerCero(digito)
	{
	    if ((digito >= 0) && (digito <= 9)) {
	        digito = '0' + digito;
	    }
	    return digito;
	}
	function GetDate ()
	{	   
	    function calcularDiaSemana(dia, mes, anio)
	    {
	        var objFecha = new Date(anio, mes - 1, dia);
	        var diaSemana = objFecha.toString().substring(0, 3);
	        switch (diaSemana)
	        {
	            case "Mon": {
	                return "Lunes";
	                break;
	            }
	            case "Tue": {
	                return "Martes";
	                break;
	            }
	            case "Wed": {
	                return "Miércoles";
	                break;
	            }
	            case "Thu": {
	                return "Jueves";
	                break;
	            }
	            case "Fri": {
	                return "Viernes";
	                break;
	            }
	            case "Sat": {
	                return "Sábado";
	                break;
	            }
	            case "Sun": {
	                return "Domingo";
	                break;
	            }
	        }
	    };
	    var f = new Date();
	    var fechaHoy = ponerCero(f.getDate()) + "/" + ponerCero(f.getMonth() + 1) + "/" + f.getFullYear();1
	    var diaHoy = calcularDiaSemana(ponerCero(f.getDate()), ponerCero(f.getMonth() + 1), f.getFullYear());	    
	    return fechaHoy + " " +"\(" + diaHoy + "\)";
	}
    /** */
	function GetHora()
	{
	    function ponerCero(digito)
	    {
	        if ((digito >= 0) && (digito <= 9))
	        {
	            digito = '0' + digito;
	        }
	        return digito;
	    }
	        var hora = new Date();
	        var hh = hora.getHours().toString();
	        var mt = hora.getMinutes().toString();
	        var ss = hora.getSeconds().toString();
	        var solohora = ponerCero(hh) + ':' + ponerCero(mt) + ':' + ponerCero(ss);
	        return solohora;
      }
    //f
	function GetUser() {
		var match = document.cookie.match(new RegExp('ssid' + '=([^;]+)'));
		if (match) 
		{
			return match[1].split('|')[0];
		}
	return "Usuario: " + "???";
	}
	
	/** */
	function Logout() {
		dataservice.set_data('/logout', {}, false ).then(
			function(respuesta) {
				console.log("POST: ", respuesta);
				
				document.cookie = "ssid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				window.location.href = "/login.html";				
			}
		);
	}

	/** */
	function enable(nivel) {
		var ret = authservice.profile() >= nivel ? 1 : 0;
		return ret;
	}
	
	/** */
	function is_select(path) {
		return path==$location.path() ? 1 : 0;
	}
}
