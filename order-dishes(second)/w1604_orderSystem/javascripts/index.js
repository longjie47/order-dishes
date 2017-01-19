/**
 * Created by rimi on 2017/1/16.
 */

var foodsDatas,
    cart = [],
    app = angular.module('myApp', ['ngRoute']);

/*ajax获取数据*/
$.ajax({
    url: 'datas.json',
    type: 'GET',
    success: function (response) {
        foodsDatas = response;
    }
});

/*路由配置*/
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/classify', {
        controller: 'classifyPageCtrl',
        templateUrl: 'pages/classify.html'
    }).when('/details/:id', {
        controller: 'detailsPageCtrl',
        templateUrl: 'pages/details.html'
    }).when('/balance', {
        controller: 'balancePageCtrl',
        templateUrl: 'pages/balance.html'
    }).when('/about', {
        controller: 'aboutPageCtrl',
        templateUrl: 'pages/about.html'
    }).otherwise({redirectTo: '/classify'});
}]);

/*分类页*/
app.controller('classifyPageCtrl', ['$scope', function ($scope) {
    $scope.foods = foodsDatas;
    $scope.active = false;

    /*点菜事件*/
    $scope.add = function (obj) {
        /*在相应菜品上显示点菜数量*/
        if(obj.active === false) {
            obj.active = true;
            cart.push(obj);
            obj.number ++;
        } else {
            obj.number ++;
        }

        /*在已点菜上显示点菜类数*/
        if(cart.length !== 0) {
            $scope.active = true;
            $scope.numbers = $scope.carts.length;
        }
    };

    $scope.carts = cart;

    /*已点菜显示与隐藏*/
    $scope.cart = function () {
        $(".menu_shops_show").toggle();
        if($(".menu_shops_show").css("display")=="block"){
            $(".details_shops_font").css("border-color","gainsboro");
        }else{
            $(".details_shops_font").css("border-color","transparent");
        }
    };

    /*获取点击当前菜品的信息*/
    $scope.product = function (obj) {
        $scope.menus = obj;
    };
}]);

/*菜品类详细页*/
app.controller('detailsPageCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.details = foodsDatas[$routeParams.id - 1];
    $scope.carts = cart;
    $scope.active = false;

    /*获取点击当前菜品的信息*/
    $scope.product = function (obj) {
        $scope.menus = obj;
    };

    /*已点菜显示与隐藏*/
    $scope.cart = function () {
        $(".menu_shops_show").toggle();
        if($(".menu_shops_show").css("display")=="block"){
            $(".details_shops_font").css("border-color","gainsboro");
        }else{
            $(".details_shops_font").css("border-color","transparent");
        }
    };

    /*点菜事件*/
    $scope.add = function (obj) {
        /*在相应菜品上显示点菜数量*/
        if(obj.active === false) {
            obj.active = true;
            cart.push(obj);
            obj.number ++;
        } else {
            obj.number ++;
        }

        /*在已点菜上显示点菜类数*/
        if(cart.length !== 0) {
            $scope.active = true;
            $scope.numbers = $scope.carts.length;
        }
    };

    $scope.carts = cart;
}]);

app.controller('balancePageCtrl', ['$scope', function ($scope) {
    $scope.carts = cart;

    if($scope.carts.length === 0) {
        $('.table_content').html('<p class="text_content">您还没有选择任何一种菜品哦。</p>');
    } else {
        $scope.$on("ngRepeatFinished", function (ngRepeatFinishedEvent) {
            $(document).ready(function () {
                /*小计函数*/
                for(var i=0;i<$(".univalence").length;i++){
                    $(".price")[i].innerHTML=Number($(".univalence")[i].innerHTML.slice(1))*Number($(".number")[i].innerHTML);
                    $(".price")[i].innerHTML="¥"+Number( $(".price")[i].innerHTML).toFixed(2);
                }
                /*总计函数*/
                var p= 0;
                for(var i=0;i<$(".price").length;i++){
                    var price=Number($(".price")[i].innerHTML.slice(1));
                    p=p+price;
                }
                $scope.inTall_one= "¥"+p.toFixed(2);
            });
        });

        /*结算函数*/
        $scope.inTall= function () {
            var p=0;
            for(var i=0;i<$(".price").length;i++){
                var price=Number($(".price")[i].innerHTML.slice(1));
                p=p+price;
            }
            $scope.inTall_one= "¥"+p.toFixed(2);
            /*倒计时函数*/
            var j=3,
                countDown=document.getElementById("countDown");
            countDown.innerHTML=3;
            setInterval(function () {
                j=j-1;
                if(j>=0){
                    countDown.innerHTML=j;
                }else{/*页面跳转*/
                    window.location="index.html";
                }
            },1000);
        };

        /*加数量函数*/
        $scope.add= function (index) {
            var a=document.getElementsByClassName("number"),/*数量*/
                num=Number(a[index].innerHTML)+ 1,
                p= 0,
                price=$scope.carts[index].price* num;
            price=price.toFixed(2);
            a[index].innerHTML=num;
            $(".price")[index].innerHTML="¥"+price;
            for(var i=0;i<$(".price").length;i++){
                var price=Number($(".price")[i].innerHTML.slice(1));
                p=p+price;
            }
            $scope.inTall_one= "¥"+p.toFixed(2);
        };

        /*减数量函数*/
        $scope.minus= function (index) {
            var a=document.getElementsByClassName("number");
            if(Number(a[index].innerHTML)>1){
                var num=Number(a[index].innerHTML)- 1,
                    p= 0,
                    price=$scope.carts[index].price* num;
                price=price.toFixed(2);
                a[index].innerHTML=num;
                $(".price")[index].innerHTML="¥"+price;
                for(var i=0;i<$(".price").length;i++){
                    var price=Number($(".price")[i].innerHTML.slice(1));
                    p=p+price;
                }
                $scope.inTall_one="¥"+p.toFixed(2);
            }
        };

        /*删除函数*/
        $scope.remove= function (index) {
            $(".btn-danger")[index].parentElement.parentElement.style.display="none";
            $(".price")[index].innerHTML=0;
            var p=0;
            for(var i=0;i<$(".price").length;i++){
                var price=Number($(".price")[i].innerHTML.slice(1));
                p=p+price;
            }
            $scope.inTall_one="¥"+p.toFixed(2);
        };
    }
}]);

app.controller('aboutPageCtrl', ['$scope', function ($scope) {}]);

/*模态框（菜品详情）模板*/
app.directive('alertModal', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pages/modal.html'
    };
});

/*已点菜显示框模板*/
app.directive('cart', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pages/cart.html'
    };
});

/*保证渲染页面完成再进行渲染*/
app.directive("onFinish", function ($timeout) {
    return{
        restrict:"A",
        link: function (scope,element,attr) {
            if(scope.$last ===true){
                $timeout(function () {
                    scope.$emit("ngRepeatFinished");
                });
            }
        }
    };
});

/*热门菜品推荐过滤器*/
app.filter('group', function () {
    return function (item, size) {
        var group = [];

        for(var i = 0; i < size; i ++) {
            group.push(item[i]);
        }

        return group;
    };
});

/*首页跳转动画*/
$('#order').click(function(){
    $('#page_first').hide(1000);
    $("#page_second").show(1000);
});