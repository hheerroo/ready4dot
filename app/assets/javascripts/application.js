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
//= require bootstrap-sprockets
//= require jquery_ujs
//= require turbolinks
//= require_tree .
  
function initMap() {
  //메인 맵
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 0, lng: 180}
  });
  var markers = [];
  
  //dot 수정에 활용하는 맵
  var dotMap = new google.maps.Map(document.getElementById('dotMap'), {
    zoom: 16,
    center: {lat: 37, lng: 126}
  });
  var dotMarker = new google.maps.Marker({map: dotMap});

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
  $('#makingDot').click(function() {
    //현재위치를 불러와 latlng에 저장
    // 버튼 로딩 변경 차후 추가

    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            //latlng을 이용한 dot생성
            makeDot(map,markers,latlng);
          }, function() {
              makeInfoWindow(map, map.center(), 'Error: The Geolocation service failed.')
          });
      } else {
          // Browser doesn't support Geolocation
          makeInfoWindow(map, map.center(), 'Error: Your browser doesn\'t support geolocation.')
      }
      

  });
  
  
  //dot삭제 버튼 액션
  $('body').on('click', '#destroyingDot', function () {
      destroyDot(map,markers,$("#dotId").val());
  });
  //새로 생성한 dot의 경수 작동하지 않음 <위와 같이 개선>
  //$('.destroyingDot').click(function() {
  //console.log("1")
  //destroyDot(map,markers,this.id);
  //});
  
  //dot수정 버튼 액션
  $('body').on('click', '.dot', function () {
    //google.maps.event.trigger($("#dotMap")[0], 'resize');
      editDot(map,markers,this.id,dotMap,dotMarker);
  });
  
  //modal속의 구글맵이 로드되지 않는 문제 해결
  $("#myDot").on("shown.bs.modal", function () {
      google.maps.event.trigger(dotMap, "resize");
      dotMap.setCenter({lat: parseFloat($("#dotLat").val()) , lng: parseFloat($("#dotLng").val())});
      dotMarker.setPosition({lat: parseFloat($("#dotLat").val()) , lng: parseFloat($("#dotLng").val())});
      //console.log(1);
  });

  //dot업데이트 버튼 액션
  $('body').on('click', '#updatingDot', function () {
      updateDot(map,markers);
  });
  
  //dot수정시 위치변경 액션
  dotMap.addListener('dblclick',function (e) {
      $("#dotLat").val(e.latLng.lat());
      $("#dotLng").val(e.latLng.lng());
      dotMarker.setPosition({lat: e.latLng.lat(), lng: e.latLng.lng()});
      //address 변경
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': {lat: e.latLng.lat(), lng: e.latLng.lng()}}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          //adress : results[0].formatted_address
          //console.log(results[0]);
          $("#dotAddress").val(results[0].formatted_address);
        } else {
        alert('Geocode was not successful for the following reason: ' + status);
        }
      });
  });
}


function makeDot(map,markers,latlng) {
  //geocoder을 이용한 address만들기
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      //adress : results[0].formatted_address
      //$("#address").val(results[0].formatted_address);
      var address0 = results[0].formatted_address;
    } else {
    alert('Geocode was not successful for the following reason: ' + status);
    }
      
  //DB에 dot0을 저장하고,  성공하면 리스트와 맵에 표시
  $.post('/dots',
          {lat: latlng.lat,
           lng: latlng.lng,
           address: address0,
           stat_id: "1",
           content: "이곳은?",
          },
          function(dot){
              $("#dots").append("<a class='dot list-group-item' id='"+dot.id+
                                "' type='button'  data-toggle='modal' data-target='#myDot'>"+
                                "<p class='list-group-item-text'>"+
                                "Dot"+dot.id+" "+dot.content+ "</p></a>");
              //console.log(data.lat);    

              //마커 만들기
              var marker = new google.maps.Marker({map: map});
              marker.setPosition({lat : dot.lat, lng: dot.lng}); 
              markers[dot.id] = marker;
              
              //맵의 중심 이동
              map.setCenter({lat : dot.lat, lng: dot.lng});
              map.setZoom(18)
              });
              

    });
}

function editDot(map, markers, dotId,dotMap,dotMarker){
  //dotId.json을 통해 수정할 dot 로드
  $.ajax({
    url: "dots/"+dotId+".json",
    type: "GET",
    success: function(dot){
      //dot 로드 성공시 edit 폼에 내용 입력
      $("#dotId").val(dot.id);
      $("#dotLat").val(dot.lat);
      $("#dotLng").val(dot.lng);
      $("#dotAddress").val(dot.address);
      $("#dotContent").val(dot.content);
      $("#dotStat_id").val(dot.stat_id);
      $("#dotCreated_at").text(dot.created_at);
      //console.log(dot.created_at);
      //console.log(dot.created_at.substr(0,16));
      $("#dotUpdated_at2").val(dot.created_at.substr(0,16));
    }
  })
}

function updateDot(map,markers){
  var dot1 = {
        id : $("#dotId").val(),
        lat : $("#dotLat").val(),
        lng : $("#dotLng").val(),
        address : $("#dotAddress").val(),
        content : $("#dotContent").val(),
        stat_id : $("#dotStat_id").val()
      }
  
  $.ajax({
    url: "dots/"+dot1.id,
    data: dot1,
    type: "PATCH",
    success: function(dot){
      //marker수정하고 중앙으로
      markers[dot.id].setPosition({lat:dot.lat,lng:dot.lng});
      map.setCenter({lat:dot.lat,lng:dot.lng});
      //dot리스트 수정
      $(".dot#"+dot.id).html("<p class='list-group-item-text'>"+
                                "Dot"+dot.id+" "+dot.content+ "</p>");
      //console.log(dot)
    }
  })
}

function destroyDot(map,markers,dotId){
  $.ajax({
      url: "/dots/" + dotId,
      type: "Delete",
      success: function(result){
        //db삭제 후 dot div삭제, marker삭제
        $(".dot#"+result).remove();
        markers[result].setMap(null);
      }
  });
}

