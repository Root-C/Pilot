// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'articles' --> Que llama a los servicios Articles
angular.module('pagos').controller('PagosController', 
    ['$http','$scope', '$rootScope', '$routeParams', '$location', 'Authentication', 'Detalles', 'Pagos', 
    function($http, $scope, $rootScope, $routeParams, $location, Authentication, Detalles, Pagos) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.pagosxfecha=[];


 // Crear un nuevo método controller para crear nuevos articles
      
            // Usar los campos form para crear un nuevo objeto $resource detalle
          
        

        $scope.getPagosByFecha=function(fechainicio,fechafin) {
            $http.get('/api/fecha/' + fechainicio + '/' + fechafin)
            .success(function(data) {
            console.log(data);
            $scope.tablapagos=true;
            $scope.pagosxfecha=data;
            })
            .error(function(data) {
                console.log('Error' + data);
            });
        }


        $scope.getPagosByMax=function(fechainicio,fechafin) {
            $http.get('/api/max/' + fechainicio + '/' + fechafin)
            .success(function(data) {
            console.log(data);
            $scope.tablapagos=true;
            $scope.pagosxfecha=data;
            })
            .error(function(data) {
                console.log('Error' + data);
            });
        }


 $scope.exportData = function () {
    $scope.hiroshi=[];
    for(var i=0; i<$scope.pagosxfecha.length;i++){
        var fila=$scope.pagosxfecha[i];
        var nombre_cliente=fila.nombre_cliente;
        var fecha_trans=moment(new Date(fila.fecha_trans)).format("DD/MM/YYYY");
        var ref_idproducto=fila.ref_idproducto;
        var ref_descripcionproducto=fila.ref_descripcionproducto;
        var cantidadproducto=fila.cantidadproducto;
        var ref_preciofacturado=fila.ref_preciofacturado;
        var monto_pagado=fila.monto_pagado;
        var monto_cancelado=fila.monto_cancelado;
        var preciofacturado=fila.preciofacturado;
        if(preciofacturado-monto_pagado==0){
            var tipo="T";
        }
        else{
            var tipo="P";
        }

        $scope.excel=
        {
            NOMBRE:nombre_cliente,
            FECHA:fecha_trans,
            CODIGO:ref_idproducto,
            DESCRIPCION:ref_descripcionproducto,
            CANTIDAD:cantidadproducto,
            TIPO:tipo,
            P_VENTA:ref_preciofacturado,
            INGRESO:monto_cancelado
            
        };

        $scope.hiroshi.push($scope.excel);
    }


        alasql('SELECT * INTO XLSX("Reporte de pagos.xlsx",{headers:true}) FROM ?',[$scope.hiroshi]);
    };
    
 

       
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