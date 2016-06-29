// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'boletas' --> Que llama a los servicios boletas
angular.module('boletas').controller('BoletasController', 
    ['$rootScope','$scope', '$routeParams', '$location', 'Authentication', 'Boletas','Distritos','Clientes',
    function($rootScope, $scope, $routeParams, $location, Authentication, Boletas, Distritos, Clientes) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.clientedata=[];
        


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
                console.log($rootScope.idcliente);
            }, function(errorResponse) {
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
                boletaId: $routeParams.boletaId
            });
        };

 // Crear un nuevo método controller para actualizar un único boleta
        $scope.updateboleta = function() {
            // Usar el método '$update' de boleta para enviar una petición PUT apropiada
            $scope.boleta.$update(function() {
                // Si un boleta fue actualizado de modo correcto, redirigir el user a la página del boleta 
                $location.path('boletas/' + $scope.boleta._id);
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

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