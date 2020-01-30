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

var beg = 0;
let buf = "";

ws.onmessage = function (event) {
  //console.log(event.data);
  buf += event.data;
  //console.log(buf.length);
  var im = read_jpeg();
  if (im != undefined) {
    draw2(im);
  }
};

ws.onclose = function() {
  console.log("Connection is closed...");
}

function read_jpeg() {
  var started = false;
  for (; beg + 1 < buf.length; beg++) {
    if (buf.charCodeAt(beg) * 256 + buf.charCodeAt(beg + 1) == 255 * 256 + (16 * 13 + 8)) {
      started = true;
      break;
    }
  }
  
  if (!started) {
    return undefined;
  }
  
  console.log('start of image found');
  var end = beg + 1;
  var finished = false;
  for (; end + 1 < buf.length; end++) {
    if (buf.charCodeAt(end) * 256 + buf.charCodeAt(end + 1) == 255 * 256 + (16 * 13 + 8)) {
      finished = true;
      break;
    }
  }
  end -= 2;

  if (!finished) {
    return undefined;
  }
  console.log('end of image found');

  let im = buf.substr(beg, end + 2 - beg);
  buf = buf.substr(end + 2, buf.length - end - 2);
  beg = 0;
  return im;
}
