// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
  
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 37.539, lng: 126.961}
  });
  var markers = [];

  //dot리스트을 불러와 marker 표시  
  $.ajax({
        url: "/dots.json",
        type: "GET",    
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data) {
      $.each(data, function(index, value) {
          var marker = new google.maps.Marker({map: map,
          });
          marker.setPosition({lat : value.lat, lng : value.lng});
          markers[value.id] = marker;
      });
  });
  
  //dot생성 버튼 액션
  $('.makingDot').click(function() {
    makeDot(map,markers);
  });
  
  
  //dot삭제 버튼 액션
  $('body').on('click', '.destroyingDot', function () {
      destroyDot(map,markers,this.id);
  });
  //새로 생성한 dot의 경수 작동하지 않음 <위와 같이 개선>
  //$('.destroyingDot').click(function() {
  //console.log("1")
  //destroyDot(map,markers,this.id);
  //});
  
  //dot수정 버튼 액션
  //  document.getElementById('editingDot').addEventListener('click',function() {
  //editDot(map);
  //  });
}


function makeDot(map,markers) {
  //현재위치를 불러와 dot0에 저장
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var dot0 = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

  //DB에 dot0을 저장하고,  성공하면 리스트와 맵에 표시
        $.post('/dots',
                dot0,
                function(data){
                    $("#dots").append("<div class='dot'" + "id="+data.id+">"+
                                      "<li>"+"latitude: "+data.lat+"<br>"+
                                      "longitude: "+data.lng+
                                      "<button class='editingDot' id="+ data.id +">수정</button>"+
                                      "<button class='destroyingDot' id="+data.id+">삭제</button>"+
                                      "</li>"+
                                      "</div>");
                    //console.log(data.lat);    

                    //마커 만들기
                    var marker = new google.maps.Marker({map: map});
                    marker.setPosition({lat : data.lat, lng: data.lng}); 
                    markers[data.id] = marker;
                    
                    //맵의 중심 이동
                    map.setCenter({lat : data.lat, lng: data.lng});
                    map.setZoom(18)
                    });

        }, function() {
            makeInfoWindow(map, map.center(), 'Error: The Geolocation service failed.')
        });
    } else {
        // Browser doesn't support Geolocation
        makeInfoWindow(map, map.center(), 'Error: Your browser doesn\'t support geolocation.')
    }
}

function editDot(){
  
}

function destroyDot(map,markers,dotId){
  $.ajax({
      url: "/dots/" + dotId,
      type: "Delete",
      success: function(result){
        $(".dot#"+result).remove();
        markers[result].setMap(null);
      }
  });
}

