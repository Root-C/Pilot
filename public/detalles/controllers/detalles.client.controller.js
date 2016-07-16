// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'articles' --> Que llama a los servicios Articles
angular.module('detalles').controller('DetallesController', 
    ['$http','$scope', '$rootScope', '$routeParams', '$location', 'Authentication', 'Detalles',
    function($http, $scope, $rootScope, $routeParams, $location, Authentication, Detalles) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $rootScope.detalles=[];

 // Crear un nuevo método controller para crear nuevos articles
        $scope.createDetalle = function() {

            if(!this.cantidadproducto){
                    this.cantidadproducto=1;
                };

            if(!this.descuentoproducto){
                    this.descuentoproducto=0;
                };

            if(!this.pagoinicial){
                    this.pagoinicial=0;
                };



            // Usar los campos form para crear un nuevo objeto $resource detalle
            var detalle = new Detalles.ID({
                idboleta: $rootScope.idboleta,
                idproducto: this.idproducto,
                descripcionproducto: this.descripcionproducto,

               // precioproducto: this.precioproducto,
               
                cantidadproducto: this.cantidadproducto, 
                descuentoproducto: this.descuentoproducto,
                payperitem: this.pagoinicial,

                //preciofinal: (this.precioproducto * this.cantidadproducto) - this.descuentoproducto
                preciofinal: this.preciofinal,
                preciofacturado:this.preciofinal-this.descuentoproducto,
                precioproducto:((this.preciofinal)/this.cantidadproducto)
            });

            // Usar el método '$save' de detalle para enviar una petición POST apropiada
            detalle.$save(function(response) {
                $scope.idproducto="";
                $scope.descripcionproducto="";
                $scope.preciofinal="";
                $scope.cantidadproducto="";
                $scope.descuentoproducto="";
                $scope.pagoinicial="";
                $rootScope.detalles = Detalles.ForNum.get({idboleta: $rootScope.idboleta }); //Esto es un query de un service
                $rootScope.tabledetalles=true;
                //console.log($rootScope.detalles);




                // Si un artículo fue creado de modo correcto, redireccionar al usuario a la página del artículo 
                console.log(response.idboleta);
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

// Crear un nuevo método controller para recuperar una lista de artículos

        $scope.findDetalles = function() {
            // Usar el método 'query' de article para enviar una petición GET apropiada
            $rootScope.detalles = Detalles.query();
            console.log($scope.detalles);
  
        };



        $scope.getParcial=function(){
            $rootScope.parcial = 0;
            for(var i = 0; i < $rootScope.detalles.length; i++){
            var detalle = $rootScope.detalles[i];
            $rootScope.parcial += (detalle.precioproducto * detalle.cantidadproducto);
            }
            return $rootScope.parcial;

        };


        $scope.getDescuentos=function(){
            //INICIALIZAMOS EL DESCUENTO EN CERO
            $rootScope.desc = 0;
            //PARA I=0 I MENOR QUE QUE LA CANTIDAD DE FILAS E I++
            for(var i = 0; i < $rootScope.detalles.length; i++){

            //ASIGNAMOS A LA VARIABLE DETALLES EL ARRAY CON SUS CAMPOS, EMPEZAMOS POR EL INDICE CERO
            var detalle = $rootScope.detalles[i];
            //CAPTURAMOS EL DESCUENTO DE LA FILA CERO Y LO AÑADIMOS
            $rootScope.desc += (detalle.descuentoproducto);
            }
            return $rootScope.desc;

        };



         $scope.getFacturado=function(){
            $rootScope.facturado=0;
            for(var i = 0; i < $rootScope.detalles.length; i++){
            var detalle = $rootScope.detalles[i];
            $rootScope.facturado += (detalle.preciofinal - detalle.descuentoproducto);
            }
            return $rootScope.facturado;
                    
        }




        //Get Partial Pay Per Item
        $scope.getPPPi=function() {
            // body...
            $rootScope.payperitem=0;
            for(var i = 0; i < $rootScope.detalles.length; i++){
                //partial pay per item
            var detalle = $rootScope.detalles[i];
            $rootScope.payperitem += (detalle.payperitem);
            }
            return $rootScope.payperitem;

        }


    $scope.getTopTenDetails=function(){

      $http.get('/api/detallestop10')
            .success(function(data) {
            $rootScope.toptendetalles=data;
                       
    
            })
            .error(function(data) {
                console.log('Error' + data);
            })
}



        $scope.deleteDetalle = function(id) {
            $http.delete('/api/detalles/' + id)
            .success(function(data) {
                $rootScope.detalles = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error' + data);
            });
        }



        $scope.getDetailsForNumBoleta=function(number){
             $rootScope.detallesxcliente=Detalles.ForNum.get({idboleta: number });

        }

        $scope.getDetailsDashBoard=function(number){
             $rootScope.detallesxclientedashboard=Detalles.ForNum.get({idboleta: number });
              $('#gestionarpagos').modal('toggle');
                   
        }

        $scope.back=function(){
             $('#detallesdashboard').modal('toggle');
             $('#gestionarpagos').modal('show');

        }
       
        // Crear un nuevo método controller para recuperar un unico artículo


       /* $scope.findOneArticle = function() {
            // Usar el método 'get' de article para enviar una petición GET apropiada
            $scope.article = Articles.get({
                articleId: $routeParams.articleId
            });
        };
*/


 // Crear un nuevo método controller para actualizar un único article


      /*  $scope.updateArticle = function() {
            // Usar el método '$update' de article para enviar una petición PUT apropiada
            $scope.article.$update(function() {
                // Si un article fue actualizado de modo correcto, redirigir el user a la página del article 
                $location.path('articles/' + $scope.article._id);
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };
*/


// Crear un nuevo método controller para borrar un único artículo
       /* $scope.deleteDetalle = function(detalle) {
            // Si un artículo fue enviado al método, borrarlo
            if (detalle) {
                // Usar el método '$remove' del artículo para borrar el artículo
                detalle.$remove(function() {
                    // Eliminar el artículo de la lista de artículos
                    for (var i in $scope.detalles) {
                        if ($scope.detalles[i] === detalle) {
                            $scope.detalles.splice(i, 1);
                        }
                    }
                });
            } else {
                // En otro caso, usar el método '$remove' de detalle para borrar el detalle
                $scope.detalle.$remove(function() {
                    alert("eliminado");
                });
            }
        };*/

    }
]);