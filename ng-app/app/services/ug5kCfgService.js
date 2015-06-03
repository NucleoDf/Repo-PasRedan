/** */
angular
    .module('Ug5kweb')
    .factory('CfgService', CfgService);

CfgService.$inject = ['dataservice', '$q'];

/** */
function CfgService(dataservice, $q)
{

    var cfg = null;
    var lradios = [];
    var radios = [];
    var ltelef = [];
    var telefs = [];

    /** */
    function Cfg2RadioTelef()
    {

        lradios = [];
        radios = [];
        ltelef = [];
        telefs = [];

        for (irec = 0; irec < cfg.recursos.length; irec++) {
            if (cfg.recursos[irec].Radio_o_Telefonia == 0) {
                lradios.push({ index: irec, id: cfg.recursos[irec].IdRecurso });
                radios.push(cfg.recursos[irec]);
            }
            else {
                ltelef.push({ index: irec, id: cfg.recursos[irec].IdRecurso });
                telefs.push(cfg.recursos[irec]);
            }
        }
    }

    /** */
    function HwSlvSet(slv, data)
    {
        var modificado = false;
        for (ican = 0; ican < 4; ican++) {
            if (cfg.hardware.slv[slv].pos[ican].cfg != data.pos[ican].cfg) {
                RecSet(slv, ican, parseInt(data.pos[ican].cfg));
                modificado = true;
            }
        }
        cfg.hardware.slv[slv] = jQuery.extend(true, {}, data);
        // cfg.hardware.slv[slv] = data;

        if (modificado)
            Cfg2RadioTelef();
    }

    /** Añade, Modifica o Borra un Recurso */
    function RecSet(slv, can, tp)
    {
        for (irec = 0; irec < cfg.recursos.length; irec++) {
            if (cfg.recursos[irec].SlotPasarela == slv && cfg.recursos[irec].NumDispositivoSlot == can) {
                switch (tp) {
                    case 0: // Borra el Recurso...
                        console.log("Borrado Recurso: ", slv, ":", can);
                        cfg.recursos.splice(irec, 1);
                        break;
                    case 1:
                        console.log("Modificado Recurso: ", slv, ":", can, " a Radio");
                        cfg.recursos[irec].Radio_o_Telefonia = 0;
                        break;
                    case 2:
                        console.log("Modificado Recurso: ", slv, ":", can, " a Telefonia");
                        cfg.recursos[irec].Radio_o_Telefonia = 1;
                        break;
                }
                return;
            }
        }
        /** Añadir el Recurso */
        if (tp != 0) {
            console.log("Añadido Recurso: ", slv, ":", can, " Tipo: ", tp);
            cfg.recursos.push(defResource(slv, can, tp));
        }
    }

    /** */
    function defResource(slv, can, tp)
    {
        return {
            IdRecurso: tp == 1 ? "Nueva Radio " : "Nueva Telef",
            Radio_o_Telefonia: tp == 1 ? 0 : 1,
            SlotPasarela: slv,
            NumDispositivoSlot: can,
            TamRTP: "20",
            Codec: "0",
            Uri_Local: "uri local",
            Buffer_jitter: {
                min: 0,
                max: 0
            },
            hardware: {
                AD_AGC: 0,
                AD_Gain: 10,
                DA_AGC: 0,
                DA_Gain: -10
            },
            radio: {
                TipoRadio: 0,
                SQ: 0,
                PTT: 0,
                BSS: false,
                ModoConfPTT: "0",
                RepSQyBSS: "1",
                DesactivacionSQ: "1",
                TimeoutPTT: "200",
                MetodoBSS: "0",
                UmbralVAD: "-33",
                NumFlujosAudio: "1",
                TiempoPTT: "0",
                tm_ventana_rx: "100",
                climax_delay: 1,
                modo_compensacion: 1,
                bss_rtp: 0,
                tabla_indices_calidad: [],
                colateral: {
                    name: "NUEVA-FRECUENCIA1",
                    tipoConmutacion: 0,
                    emplazamientos: [
                      {
                          uriTxA: "uriA",
                          uriTxB: "uriB",
                          activoTx: 0,
                          uriRxA: "uriA",
                          uriRxB: "uriB",
                          activoRx: "A o B"
                      },
                      {
                          uriTxA: "uriA",
                          uriTxB: "uriB",
                          activoTx: 0,
                          uriRxA: "uriA",
                          uriRxB: "uriB",
                          activoRx: "A"
                      },
                      {
                          uriTxA: "uriA",
                          uriTxB: "uriB",
                          activoTx: 0,
                          uriRxA: "uriA",
                          uriRxB: "uriB",
                          activoRx: "A"
                      }
                    ]
                }
            },
            telefonia: {
                TipoTelefonia: 0,
                Lado: 1,
                t_eym: 0,
                h2h4: 0,
                r_automatica: 0,
                uri_remota: "uri"
            },
            restriccion: 0,
            listablanca: [
              "uri0",
            ],
            listanegra: [
              "uri1",
            ]
        };
    }

    /** */
    function Init()
    {
        var promise = $q.defer();
        if (cfg == null) {
            dataservice.get_data('/config', false).then(
                function (respuesta)
                {
                    console.log("res:", respuesta);
                    cfg = respuesta;
                    Cfg2RadioTelef();
                    promise.resolve();
                },
                function (error)
                {
                    console.log("Error:", error);
                }
                );
        }
        else {
            promise.resolve();
        }
        return promise.promise;
    }

    /** */
    return {
        init: Init,
        restore: function ()
        {
            cfg = null;
            return Init();
        },
        save: function ()
        {
            dataservice.set_data('/config', cfg, false).then(
                function (respuesta)
                {
                    console.log("POST: ", respuesta);
                },
                function (error)
                {
                    console.log("POST-ERROR: ", error);
                }
            );
        },
        inicio_data_get: function ()
        {
            return cfg.general;
        },
        inicio_data_set: function (data)
        {
            cfg.general = data;
        },
        hw_data_get: function (slv)
        {
            return jQuery.extend(true, {}, cfg.hardware.slv[slv]);
            // return cfg.hardware.slv[slv];
        },
        hw_data_set: function (slv, data)
        {
            console.log("hw_data_set: ", slv);
            HwSlvSet(slv, data);
        },
        ser_data_get: function (slv)
        {
            return cfg.servicios;
        },
        ser_data_set: function (slv, data)
        {
            cfg.servicios = data;
        },
        lradios: function ()
        {
            return lradios;
        },
        radio_data_get: function (index)
        {
            return radios[index];
        },
        radio_data_set: function (index, data)
        {
            radios[index] = data;
            lradios[index].id = data.IdRecurso;
            cfg.recursos[lradios[index].index] = data;
        },
        ltelef: function ()
        {
            return ltelef;
        },
        telef_data_get: function (index)
        {
            return telefs[index];
        },
        telef_data_set: function (index, data)
        {
            telefs[index] = data;
            ltelef[index].id = data.IdRecurso;
            cfg.recursos[ltelef[index].index] = data;
        }
    };
}