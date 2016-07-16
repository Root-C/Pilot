// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'clientes' --> Que llama a los servicios Clientes
angular.module('clientes').controller('ClientesController', 
    ['$http','$rootScope','$scope', '$routeParams', '$location', 'Authentication', 'Clientes', 'Distritos','Pagos', 'Boletas', 
    function($http,$rootScope, $scope, $routeParams, $location, Authentication, Clientes, Distritos, Pagos, Boletas) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $rootScope.showtablebusqueda=false;
        $scope.clientedata=[];
        $rootScope.showbuscarcliente=true;
        var date=moment();
        var year=date.format('YYYY');
        var month=date.format('MM');
        var day=date.format('DD');
        

 
 

 // Crear un nuevo método controller para crear nuevos clientes
        $scope.createClient = function() {
            // Usar los campos form para crear un nuevo objeto $resource cliente
            var cliente = new Clientes.ID({
                nombre_cliente      : this.nombre_cliente,
                ape_pat_cliente     : this.ape_pat_cliente,
                ape_mat_cliente     : this.ape_mat_cliente,
                dni_cliente         : this.dni_cliente,
                direccion_cliente   : this.direccion_cliente,
                celular_cliente     : this.celular_cliente,
                fijo_cliente        : this.fijo_cliente,
                fecha_nac_cliente   : this.fecha_nac_cliente,
                distrito        : this.distrito

            });

            // Usar el método '$save' de cliente para enviar una petición POST apropiada
            cliente.$save(function(response) {
                $scope.nombre_cliente="";
                $scope.ape_pat_cliente="";
                $scope.ape_mat_cliente="";
                $scope.dni_cliente="";
                $scope.direccion_cliente="";
                $scope.celular_cliente="";
                $scope.fijo_cliente="";
                $scope.fecha_nac_cliente="";

                $('#registrarcliente').modal('toggle');
                alertify.log("Cliente registrado");
                // Si un cliente fue creado de modo correcto, redireccionar al usuario a la página del cliente 
                //$location.path('clientes/' + response._id);
                
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };


 $scope.createPayment = function() {
            // Usar los campos form para crear un nuevo objeto $resource cliente
            var pago = new Pagos({
                idboleta      : idboleta,
                idproducto     : idproducto,
                descripcionproducto     : descripcionproducto,
                precioproducto         : precioproducto,
                cantidadproducto   : cantidadproducto,
                preciofacturado     : preciofacturado,
                monto_pagado       : monto_pagado + pendiente,
                monto_cancelado : pendiente,
                iddetalle: iddetalle,
                fecha_trans   : year+'-'+month+'-'+day              
            });

            // Usar el método '$save' de cliente para enviar una petición POST apropiada
            pago.$save(function(response) {
                alertify.alert("Se registró un pago =O");
                // Si un cliente fue creado de modo correcto, redireccionar al usuario a la página del cliente 
                //$location.path('clientes/' + response._id);
                
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };


                                            


// Crear un nuevo método controller para recuperar una lista de clientes
        $scope.findClient = function() {
            // Usar el método 'query' de cliente para enviar una petición GET apropiada
            $scope.clientes = Clientes.ID.query();
            $scope.distritos = Distritos.query();
            console.log($scope.distritos);

            
        };

        // Crear un nuevo método controller para recuperar un unico cliente
        $scope.findOneClient = function(id) {
            // Usar el método 'get' de cliente para enviar una petición GET apropiada
        $scope.clientedata = Clientes.ID.get({clienteId: id});
           $rootScope.idcliente=id;
           $rootScope.boletagenerate=true;
           $rootScope.showclientname=true;
           $rootScope.showtablebusqueda=!$scope.showtablebusqueda;
           //$rootScope.showbuscarcliente=false;


        };


        // Capturar cliente por apellido
        $scope.GetClientbyLastName = function(ape) {
            // Usar el método 'get' de cliente para enviar una petición GET apropiada
            $scope.cliente = Clientes.Apellido.get({apellido: ape },function(cliente) {
            $rootScope.showtablebusqueda=true;
            $rootScope.boletapayments=false;
            console.log($scope.cliente);
            //console.log($scope.cliente);
            //console.log('Cantidad ' + $scope.cliente.length);
             });
  
        };





        $scope.getBoletasByClientId=function(id){
            $http.get('/api/boleta/' + id)
            .success(function(data) {
            $rootScope.boletapayments=true;

               $scope.boletasxcliente=data;
               $rootScope.boletasxc=data;
               $scope.getFacturadoByClient();
               $scope.getCanceladoByClient();
            })
            .error(function(data) {
                console.log('Error' + data);
            });
        };


         $scope.getFacturadoByClient=function(){
            $rootScope.facturadoxc=0;
            for(var i = 0; i < $rootScope.boletasxc.length; i++){
            var boleta = $rootScope.boletasxc[i];
            $rootScope.facturadoxc += boleta.monto_facturado;
            }
            return $rootScope.facturadoxc;
                    
        }


         $scope.getCanceladoByClient=function(){
            $rootScope.pagadoxc=0;
            for(var i = 0; i < $rootScope.boletasxc.length; i++){
            var boleta = $rootScope.boletasxc[i];
            $rootScope.pagadoxc += boleta.monto_pagado;
            }
            return $rootScope.pagadoxc;
                    
        }


          
$scope.hola=function(){
$rootScope.showcreardetalles=false;
            $rootScope.showclientname=false;
            $rootScope.showtablebusqueda=false;
            $rootScope.showbuscarcliente=true;
            $rootScope.tabledetalles=false;
            $rootScope.boletagenerate=false;
            $rootScope.detalles=[];
            $('#registrarventa').modal('toggle');

    
};          
                       
                        


        
            
            $scope.actualizarPago=function(id){
                //igualamos el scope montoapagar a la variable pagadoahora
                var pagadoahora=this.montoapagar;
                //Fecha personalizada, temporal
                if($rootScope.fechapago){
                    var fechapersonalizada=$rootScope.fechapago;
                }
                else{
                    var fechapersonalizada=year+'-'+month+'-'+day;
                }

                //creamos scope para actualizar data
                $scope.boleta={"monto_pagado":pagadoahora,
                                "updated_at":year+'-'+month+'-'+day
                                };

                //llamamos a la boleta que vamos a actualizar
                $http.get('/api/boletas/'+id)
                            .success(function(data) { 
                            //capturamos a la boleta traida en el scope  
                            $scope.boletaxid=data; 
                            

                            //capturamos el valor anterior pagado
                           var pagadoantes=$scope.boletaxid.monto_pagado;
                           var idboleta=$scope.boletaxid.idboleta;

                           $rootScope.dataClient=data.idcliente.nombre_cliente +' ' + data.idcliente.ape_pat_cliente;


                           //Capturo el valor facturado de la boleta en mencion
                           var facturadoantes=$scope.boletaxid.monto_facturado;

                           //Pregunto si el pago actual es menor a la resta del facturado con el pagado anteriormente, 
                           //con esto verifico si el mongo pagado actual es menor a la deuda o igual
                           if(pagadoahora<=(parseFloat(facturadoantes)-parseFloat(pagadoantes))){
                               

                                //INICIO DEL PUT
                                //Si el monto pagado actual es menor a la deuda, actualizamos
                                $http.put('/api/boletas/'+id,$scope.boleta).success(function(boletas) {
                                //luego de hacer la actualizacion, traemos el dato actualizado y 
                                //restamos el monto facturado con el monto_pagado nuevo
                                var diferencia= (parseFloat(boletas.monto_facturado) - parseFloat(boletas.monto_pagado));
                                //Mostramos la diferencia, deuda actual
                                alertify.alert('Cuota pagada correctamente, deuda actual: S/.'+diferencia,function(){
                                //Cerramos el modal y enviamos una alerta
                                    $('#gestionarpagos').modal('toggle');
                                    alertify.log("Has pagado una cuota satisfactoriamente");
                                    });
                                    $scope.cliente=[];
                                    $rootScope.boletapayments=false;
        
                                })
                                .error(function(boletas) {
                                    console.log('Error' + boletas);
                                });
                                //FIN DEL PUT

                                //CONDICIONAL DETALLES PAYMENT
                                //Traigo todo el array de la boleta
                                 $http.get('/api/detalle/' + idboleta)
                                .success(function(data) {
                                //Asigno el array a un scope
                                $rootScope.detallepayments=data;
                                

                                //DETALLESPAYMENT
                                //BEGIN FOR
                                for(var i=0; i < $rootScope.detallepayments.length;i++){
                                  var fila=$rootScope.detallepayments[i];
                                  var preciofila=fila.preciofacturado;
                                  var monto_pagado=fila.payperitem;
                                  var iddetalle=fila._id;
                                  var idboleta=fila.idboleta;
                                  var idproducto=fila.idproducto;
                                  var descripcionproducto=fila.descripcionproducto;
                                  var preciofacturado=fila.preciofacturado;
                                  var cantidadproducto=fila.cantidadproducto;
                                  var precioproducto=preciofacturado/cantidadproducto;
                                  var pagado=fila.payperitem;



                                //BEGIN IF
                                if(preciofila>monto_pagado && pagadoahora>=preciofila){
                                    var pendiente=preciofila-monto_pagado;
                                    pagadoahora=pagadoahora-pendiente;
                                    console.log("pagó "+pendiente);
                                    console.log("iddetalle es :" +iddetalle);
                                    $scope.payupdate={"payperitem":pendiente
                                                            };
                                            //ACTUALIZACION PUT PAYPERITEM
                                            $http.put('/api/detalles/'+iddetalle,$scope.payupdate).
                                            success(function(detalles) {
                                            console.log("Detalle actualizado");
                                            })
                                            .error(function(boletas) {
                                                console.log('Error' + boletas);
                                            });

                                            //FIN ACTUALIZACION PUT PAYPERITEM

                                var pago = new Pagos({
                                        idboleta      : idboleta,
                                        idproducto     : idproducto,
                                        descripcionproducto     : descripcionproducto,
                                        precioproducto         : precioproducto,
                                        cantidadproducto   : cantidadproducto,
                                        preciofacturado     : preciofacturado,
                                        monto_pagado       : (parseFloat(pagado) + parseFloat(pendiente)),
                                        monto_cancelado : pendiente,
                                        iddetalle: iddetalle,
                                        ref_idproducto:1,
                                        ref_preciofacturado:0,
                                        ref_descripcionproducto:"Pago",
                                        fecha_trans:fechapersonalizada,
                                        //fecha_trans   : year+'-'+month+'-'+day,
                                        nombre_cliente:$rootScope.dataClient              
                                    });

                                    // Usar el método '$save' de cliente para enviar una petición POST apropiada
                                    pago.$save(function(response) {    
                                    });

                                }
                                //END IF

                                //BEGIN ELSEIF
                                else if(preciofila>monto_pagado && pagadoahora<preciofila && pagadoahora>0){

                                    var pendiente=preciofila-monto_pagado;

                                    //BEGIN 2 TIER IF
                                    if(pagadoahora>pendiente){
                                        pagadoahora=pagadoahora-pendiente;
                                         console.log("Aqui pagó: "+pendiente);

                                         console.log("iddetalle es :" +iddetalle);


                                    $scope.payelse={"payperitem":pendiente
                                                            };
                                            //ACTUALIZACION PUT PAYPERITEM
                                            $http.put('/api/detalles/'+iddetalle,$scope.payelse).
                                            success(function(detalles) {
                                            console.log("Detalle actualizado");
                                            })
                                            .error(function(boletas) {
                                                console.log('Error' + boletas);
                                            });
                                            //FIN ACTUALIZACION PUT PAYPERITEM

                                    var pago = new Pagos({
                                        idboleta      : idboleta,
                                        idproducto     : idproducto,
                                        descripcionproducto     : descripcionproducto,
                                        precioproducto         : precioproducto,
                                        cantidadproducto   : cantidadproducto,
                                        preciofacturado     : preciofacturado,
                                        monto_pagado       : (parseFloat(pagado) + parseFloat(pendiente)),
                                        monto_cancelado : pendiente,
                                        iddetalle: iddetalle,
                                        ref_idproducto:1,
                                        ref_preciofacturado:0,
                                        ref_descripcionproducto:"Pago",
                                        fecha_trans:fechapersonalizada,
                                        //fecha_trans   : year+'-'+month+'-'+day,
                                        nombre_cliente:$rootScope.dataClient               
                                    });

                                    // Usar el método '$save' de cliente para enviar una petición POST apropiada
                                    pago.$save(function(response) {    
                                    });
                                    }
                                    //END TIER 2 IF

                                    //INICIO ELSE TIER 2
                                    else{
                                        pendiente=preciofila-(monto_pagado+pagadoahora);
                                         console.log("Aqui pagó: "+pagadoahora);

                                         console.log("iddetalle es :" +iddetalle);


                                    $scope.payelse={"payperitem":pagadoahora
                                                            };
                                            //ACTUALIZACION PUT PAYPERITEM
                                            $http.put('/api/detalles/'+iddetalle,$scope.payelse).
                                            success(function(detalles) {
                                            console.log("Detalle actualizado");
                                            })
                                            .error(function(boletas) {
                                                console.log('Error' + boletas);
                                            });
                                            //FIN ACTUALIZACION PUT PAYPERITEM

                                    var pago = new Pagos({
                                        idboleta      : idboleta,
                                        idproducto     : idproducto,
                                        descripcionproducto     : descripcionproducto,
                                        precioproducto         : precioproducto,
                                        cantidadproducto   : cantidadproducto,
                                        preciofacturado     : preciofacturado,
                                        monto_pagado       : (parseFloat(pagado) + parseFloat(pagadoahora)),
                                        monto_cancelado : pagadoahora,
                                        iddetalle: iddetalle,
                                        ref_idproducto:1,
                                        ref_preciofacturado:0,
                                        ref_descripcionproducto:"Pago",
                                        fecha_trans:fechapersonalizada,
                                        //fecha_trans   : year+'-'+month+'-'+day,
                                        nombre_cliente:$rootScope.dataClient               
                                    });

                                    // Usar el método '$save' de cliente para enviar una petición POST apropiada
                                    pago.$save(function(response) {    
                                    });
                                    }
                                    //END ELSE TIER2
                                    pagadoahora=0;
                                    $rootScope.fechapago="";
                                }
                                //END ELSE IF


                                }
                                //END FOR
                               

                                });
                                //END GET         

                           }                           
                           else if(pagadoahora>(parseFloat(facturadoantes)-parseFloat(pagadoantes))){
                            alertify.alert("No puedes pagar un monto mayor a la deuda existente");
                           }

                        })
                
            };









            //Al cerrar modal
            $scope.dismiss=function(){
                $scope.cliente=[];
                $rootScope.boletapayments=false;

            }



 // Crear un nuevo método controller para actualizar un único cliente
        $scope.updateClient = function() {
            // Usar el método '$update' de cliente para enviar una petición PUT apropiada
            $scope.cliente.$update(function() {
                // Si un cliente fue actualizado de modo correcto, redirigir el user a la página del cliente 
                $location.path('clientes/' + $scope.cliente._id);
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

// Crear un nuevo método controller para borrar un único cliente
        $scope.deleteClient = function(cliente) {
            // Si un cliente fue enviado al método, borrarlo
            if (cliente) {
                // Usar el método '$remove' del cliente para borrar el cliente
                cliente.$remove(function() {
                    // Eliminar el cliente de la lista de clientes
                    for (var i in $scope.clientes) {
                        if ($scope.clientes[i] === cliente) {
                            $scope.clientes.splice(i, 1);
                        }
                    }
                });
            } else {
                // En otro caso, usar el método '$remove' de cliente para borrar el cliente
                $scope.cliente.$remove(function() {
                    $location.path('clientes');
                });
            }
        };

    }
]);