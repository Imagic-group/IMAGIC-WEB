function draw2(imgData, coords) {
  "use strict";
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  //var uInt8Array = new Uint8Array(imgData);
  var uInt8Array = imgData;
  var i = uInt8Array.length;
  var binaryString = [i];
  while (i--) {
    binaryString[i] = String.fromCharCode(uInt8Array[i]);
  }
  var data = binaryString.join('');

  var base64 = window.btoa(data);

  var img = new Image();
  img.src = "data:image/jpeg;base64," + base64;
  img.onload = function () {
    console.log("Image Onload");
    ctx.drawImage(img, coords[0], coords[1], canvas.width, canvas.height);
  };
  img.onerror = function (stuff) {
    console.log("Img Onerror:", stuff);
  };

}

console.log('open: ');
var ws = new WebSocket("ws://127.0.0.1:8081");

ws.onopen = function (event) {
  console.log('Connection is open ...');
  ws.send("Hello Server");
};

ws.onerror = function (err) {
  console.log('err: ', err);
}

ws.onmessage = function (event) {
  //console.log(event.data);
  draw2(event.data);
};

ws.onclose = function() {
  console.log("Connection is closed...");
}

