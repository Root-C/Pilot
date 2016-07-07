// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'boletas' --> Que llama a los servicios boletas
angular.module('boletas').controller('BoletasController', 
    ['$http','$rootScope','$scope', '$routeParams', '$location', 'Authentication', 'Boletas','Distritos','Clientes',
    function($http, $rootScope, $scope, $routeParams, $location, Authentication, Boletas, Distritos, Clientes) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.clientedata=[];
        $scope.monto_pagado="";

        


 // Crear un nuevo método controller para crear nuevos Boletas
        $scope.createBoleta = function() {
            // Usar los campos form para crear un nuevo objeto $resource Boleta
            var boleta = new Boletas({
              idcliente: $rootScope.idcliente
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


        $scope.actualizar=function(id){
            $scope.boleta={"monto_pagado":$rootScope.monto_pagado,
                            "monto_total":$rootScope.total,
                            "monto_descontado":$rootScope.desc,
                            "monto_facturado":$rootScope.facturado
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
            $rootScope.detalles=[];
            $scope.getTopTen();
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