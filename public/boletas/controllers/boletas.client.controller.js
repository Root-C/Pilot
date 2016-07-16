// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'boletas' --> Que llama a los servicios boletas
angular.module('boletas').controller('BoletasController', 
    ['$http','$rootScope','$scope', '$routeParams', '$location', 'Authentication', 'Boletas','Distritos','Clientes','Pagos',
    function($http, $rootScope, $scope, $routeParams, $location, Authentication, Boletas, Distritos, Clientes, Pagos) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.clientedata=[];
        $scope.monto_pagado="";
        var date=moment();
        var year=date.format('YYYY');
        var month=date.format('MM');
        var day=date.format('DD');
        $scope.boletasxnum=[];

        
        


 // Crear un nuevo método controller para crear nuevos Boletas
        $scope.createBoleta = function() {

            //Temporal para fecha
            if($scope.fecha){
           $rootScope.fecha_venta=$scope.fecha;
                }
            else{
            $rootScope.fecha_venta=year+'-'+month+'-'+day;
            }
             $scope.fecha="";
             




            // Usar los campos form para crear un nuevo objeto $resource Boleta
            var boleta = new Boletas({
              idcliente: $rootScope.idcliente,
              //fecha_trans:year+'-'+month+'-'+day,
              fecha_trans: $rootScope.fecha_venta,
              //updated_at:year+'-'+month+'-'+day
              updated_at: $rootScope.fecha_venta

            });

            // Usar el método '$save' de boleta para enviar una petición POST apropiada
            boleta.$save(function(response) {
                // Si un artículo fue creado de modo correcto, redireccionar al usuario a la página del artículo 
                //$location.path('boletas/' + response._id);
                if($rootScope.idcliente){

                console.log("el id del cliente es: " + $rootScope.idcliente);
                 $rootScope.idboleta = response.idboleta;
                 $rootScope._id=response._id;
                 $rootScope.showcreardetalles=true;
                 $rootScope.boletagenerate=false;
                 $rootScope.buscarcliente=false;
                console.log("el numero de boleta root es: "+ $rootScope.idboleta);
                console.log("el id real de la boelta es: " + $rootScope._id);
                $scope.findBoleta();
                }
      
            }
            

            , function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });

                
        };

// Crear un nuevo método controller para recuperar una lista de artículos
        $scope.findBoleta = function() {
            // Usar el método 'query' de boleta para enviar una petición GET apropiada
            $scope.boletas = Boletas.query();
  
        };

        // Crear un nuevo método controller para recuperar un unico artículo
        $scope.findOneBoleta = function() {
            // Usar el método 'get' de boleta para enviar una petición GET apropiada
            $scope.boleta = Boletas.get({
                boletaId: $rootScope._id
                //boletaId: $routeParams.boletaId
                //boletaId: $rootScope._i          
            });
        };



 // Crear un nuevo método controller para actualizar un único boleta
        $scope.updateboleta = function() {
            // Usar el método '$update' de boleta para enviar una petición PUT apropiada
            $scope.boleta.$update(function() {
                // Si un boleta fue actualizado de modo correcto, redirigir el user a la página del boleta 
                //$location.path('boletas/' + $scope.boleta._id);
              alert("actualizado");
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };


         $scope.actualizar1=function(id){
            var pagadoahora=this.monto_pagado;
            //monto pagado, el monto que se paga por item, en totales
            //monto_total= el monto que se calcula sin descuentos
            //monto_descontado= el monto descontado total
            //monto_facturado, el total con descuentos.
            $scope.boleta=
            {
              "monto_pagado":pagadoahora,
              "monto_total":$rootScope.parcial,
              "monto_descontado":$rootScope.desc,
              "monto_facturado":$rootScope.facturado,
              "updated_at":year+'-'+month+'-'+day,
              "status":1
            };
       

            $http.put('/api/boletas/'+id,$scope.boleta)
            .success(function(data) {
            //ACTUALIZA BOLETA FIN

            var idboleta=data.idboleta;
            $rootScope.dataCliente=data.idcliente.nombre_cliente +' ' + data.idcliente.ape_pat_cliente;
            

            //SUCCESS PUT
            $scope.boleta = {};
            $rootScope.monto_pagado="";
            $rootScope.showcreardetalles=false;
            $rootScope.showclientname=false;
            $rootScope.showtablebusqueda=false;
            $rootScope.showbuscarcliente=true;
            $rootScope.tabledetalles=false;
            $scope.getTopTen();
            $scope.getTopTenDetails();
            alertify.alert("Venta realizada con éxito");
            $('#registrarventa').modal('toggle');
  


                    //BEGIN HTTPGET
                     $http.get('/api/detalle/' + idboleta)
                                .success(function(data) {
                                //Asigno el array a un scope
                                $rootScope.detallepayments=data;

                                
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
                                        ref_idproducto:idproducto,
                                        ref_preciofacturado:preciofacturado,
                                        ref_descripcionproducto:descripcionproducto,
                                        fecha_trans:$rootScope.fecha_venta,
                                        //fecha_trans   :year+'-'+month+'-'+day,
                                        nombre_cliente: $rootScope.dataCliente               
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
                                        ref_idproducto:idproducto,
                                        ref_preciofacturado:preciofacturado,
                                        ref_descripcionproducto:descripcionproducto,
                                        fecha_trans:$rootScope.fecha_venta,
                                        //fecha_trans   : year+'-'+month+'-'+day,
                                        nombre_cliente:$rootScope.dataCliente               
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
                                        ref_idproducto:idproducto,
                                        ref_preciofacturado:preciofacturado,
                                        ref_descripcionproducto:descripcionproducto,
                                        fecha_trans:$rootScope.fecha_venta,
                                        //fecha_trans   : year+'-'+month+'-'+day,
                                        nombre_cliente: $rootScope.dataCliente                
                                    });

                                    // Usar el método '$save' de cliente para enviar una petición POST apropiada
                                    pago.$save(function(response) {    
                                    });
                                    }
                                    //END ELSE TIER2
                                    pagadoahora=0;
                                    $rootScope.dataCliente="";
                                    $rootScope.fecha_venta="";



                                    //OPCIONAL 

                                }
                                //END ELSE IF


                                }
                                //END FOR
              
                        







                     });
                    //END HTTP GET

            //FIN SUCESS PUT
            });


};




        $scope.actualizar=function(id){
            var hiroshi=this.monto_pagado;
            alertify.alert("el monto pagado es: "+hiroshi);
            //monto pagado, el monto que se paga por item, en totales
            //monto_total= el monto que se calcula sin descuentos
            //monto_descontado= el monto descontado total
            //monto_facturado, el total con descuentos.
            $scope.boleta=
            {
              "monto_pagado":$rootScope.payperitem,
              "monto_total":$rootScope.parcial,
              "monto_descontado":$rootScope.desc,
              "monto_facturado":$rootScope.facturado,
              "updated_at":year+'-'+month+'-'+day,
              "status":1
            };
       
            $http.put('/api/boletas/'+id,$scope.boleta)
            .success(function(data) {
            $scope.boleta = {};
            $rootScope.monto_pagado="";
            $rootScope.showcreardetalles=false;
            $rootScope.showclientname=false;
            $rootScope.showtablebusqueda=false;
            $rootScope.showbuscarcliente=true;
            $rootScope.tabledetalles=false;  

                for(var i=0; i < $rootScope.detalles.length;i++){
                    var fila=$rootScope.detalles[i]; 
                    var monto_pagado=fila.payperitem;
                    var iddetalle=fila._id;
                    var idboleta=fila.idboleta;
                    var idproducto=fila.idproducto;
                    var descripcionproducto=fila.descripcionproducto;
                    var preciofacturado=fila.preciofacturado;
                    var cantidadproducto=fila.cantidadproducto;
                    var precioproducto=preciofacturado/cantidadproducto;

                if(monto_pagado>0){
                    var pago = new Pagos({
                        idboleta      : idboleta,
                        idproducto     : idproducto,
                        descripcionproducto     : descripcionproducto,
                        precioproducto         : precioproducto,
                        cantidadproducto   : cantidadproducto,
                        preciofacturado     : preciofacturado,
                        monto_pagado       : monto_pagado,
                        monto_cancelado : monto_pagado,
                        iddetalle: iddetalle,
                        ref_idproducto:idproducto,
                        ref_preciofacturado:preciofacturado,
                        ref_descripcionproducto:descripcionproducto,
                        fecha_trans   :year+'-'+month+'-'+day                
                    });
                    pago.$save(function(response) { 
                    alertify.alert("Se registro el pago");   
                    });
                }
                }    
            
            $rootScope.detalles=[];
            $('#registrarventa').modal('toggle');
             alertify.log("Venta Realizada correctamente");
            })
            .error(function(data) {
                console.log('Error' + data);
            });
                    
            };


$scope.getTopTen=function(){

      $http.get('/api/boletastop10')
            .success(function(data) {
            $rootScope.topten=data;
                       
    
            })
            .error(function(data) {
                console.log('Error' + data);
            })
}

$scope.getTopTenUpdated=function(){

      $http.get('/api/toptendate')
            .success(function(data) {
            $rootScope.toptendate=data;
                       
            })
            .error(function(data) {
                console.log('Error' + data);
            })
}




// Crear un nuevo método controller para borrar un único artículo
        $scope.deleteBoleta = function(boleta) {
            // Si un artículo fue enviado al método, borrarlo
            if (boleta) {
                // Usar el método '$remove' del artículo para borrar el artículo
                boleta.$remove(function() {
                    // Eliminar el artículo de la lista de artículos
                    for (var i in $scope.boletas) {
                        if ($scope.boletas[i] === boleta) {
                            $scope.boletas.splice(i, 1);
                        }
                    }
                });
            } else {
                // En otro caso, usar el método '$remove' de boleta para borrar el boleta
                $scope.boleta.$remove(function() {
                    $location.path('boletas');
                });
            }
        };

    }
]);