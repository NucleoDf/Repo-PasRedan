/** */
angular
    .module('Ug5kweb')
    .factory('dataservice', dataservice);

dataservice.$inject = ['$http', 'logger', 'authservice', 'Simulador', '$q'];

/** */
function dataservice($http, logger, authservice, Simulador, $q) {
	var retorno = {
        get_data: getData,
		set_data: setData,
		put_data: putData,
		del_data: delData,
        send_file: sendFile
	};

    function DataFailed(error) {
        logger.error('XHR Failed: ' + error.data)
	};
	/** */
    function getData(url,simul) {
        if (authservice.check_session() == true) {
            if (simul === true) {
                return Simulador.get_data(url).then(function (response) { return response; });
            } else {
                return $http.get(url)
                    .then(function (response) { return response.data; })
                    .catch(DataFailed);
            }
        }
    }
	
	/** */
    function setData(url, data, simul) {
        if (authservice.check_session() == true) {
            if (simul === true) {
                return Simulador.set_data(url).then(function (response) { return response; });
            } else {
                return $http.post(url, data)
                    .then(function (response) { return 'OK'; })
                    .catch(DataFailed);
            }
        }
    }
	
	/** */
	function putData(url, data) {
		if (authservice.check_session()==true)
			return $http.put(url, data)
				.then(function(res){return "OK";})
				.catch(DataFailed);
	}
	
	/** */
	function delData(url, data) {
		if (authservice.check_session()==true)
			return $http.delete(url)
				.then(function(res){return "OK";})
				.catch(DataFailed);
	}

    /** */
	function sendFileBlock(url, filename, nb, b, data, ldata, ret) {

	    if (!ret) {
	        ret = $q.defer();
	    }

	    if (b > nb)
	        ret.resolve();
	    else {
	        var config = {
	            headers: {
	                'Filename': filename,
	                'UploadControl': b + ':' + nb,
	                'Content-Type': 'application/octet-stream'
	            }
	        };
	        $http.post(url, data, config)
                .then(
                function (response) {
                    sendFileBlock(url, filename, nb, b+1, data, 1024, ret);
                })
                .catch(
                function (error) {
                    ret.reject(error.data);
                });
	    }

	    return ret.promise;
	}

    /** */
	function sendFile1(url, filename, data, ldata) {
	    var ret = $q.defer();

	    if (authservice.check_session() == true) {	        

	        sendFileBlock(url, filename, 1, 1, data, ldata)
                .then(
                    function () { ret.resolve("Fichero Enviado"); },
                    function (error) { ret.reject(error); }
                    );
	    }
	    else
	        ret.resolve("Error de Autentificacion");

	    return ret.promise;
	}

    /** */
	function sendFile(url, file) {
	    var fd = new FormData();
	    fd.append('file', file);

	    return $http.post(url, fd, {
	        transformRequest: angular.identity,
	        headers: {
	            'Content-Type': undefined, 'Filename': file.name }
	    });
        //.success(function () {
        //})
        //.error(function () {
        //});
	}

	return retorno;
}