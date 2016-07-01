// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'clientes' --> Que llama a los servicios Clientes
angular.module('clientes').controller('ClientesController', 
    ['$rootScope','$scope', '$routeParams', '$location', 'Authentication', 'Clientes', 'Distritos', 'Boletas',
    function($rootScope, $scope, $routeParams, $location, Authentication, Clientes, Distritos, Boletas) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.tablebusqueda=false;
        $scope.clientedata=[];
        $rootScope.buscarcliente=true;
 
        


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
                distrito        : this.distrito
                
            });

            // Usar el método '$save' de cliente para enviar una petición POST apropiada
            cliente.$save(function(response) {
                $('#registrarcliente').modal('toggle');
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
           $scope.clientename=true;
           $scope.tablebusqueda=!$scope.tablebusqueda;


        };


        // Capturar cliente por apellido
        $scope.GetClientbyLastName = function(ape) {
            // Usar el método 'get' de cliente para enviar una petición GET apropiada
            $scope.cliente = Clientes.Apellido.get({apellido: ape },function(cliente) {
            $scope.tablebusqueda=true;
            //console.log($scope.cliente);
            //console.log('Cantidad ' + $scope.cliente.length);
             });
  
        };


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