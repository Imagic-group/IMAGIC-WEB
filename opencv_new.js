(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//Buffer = require('buffer').Buffer;

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


let beg = 0;
let end = 0;
let buf = new Uint8Array(0);

function read_jpeg() {
  var started = false;
  var wasbeg = beg;
  for (; beg + 1 < buf.length; beg++) {
    if (buf[beg + 0] == 255 &&
        buf[beg + 1] == 16 * 13 + 8) {
      started = true;
      break;
    }
  }
  
  if (!started) {
    return undefined;
  }
  if (beg != wasbeg) {
    //console.log('start of image found');
  }
  var finished = false;
  if (end <= beg) {
    end = beg + 1;
  }
  for (; end + 1 < buf.length; end++) {
    if (buf[end + 0] == 255 &&
        buf[end + 1] == 16 * 13 + 9) {
      finished = true;
      break;
    }
  }

  if (!finished) {
    return undefined;
  }
  //console.log('end of image found');
  end += 2;
  let im = buf.subarray(beg, end);
  buf = buf.subarray(end, buf.length);
  beg = 0;
  end = 0;
  return im;
}




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
    //console.log("Image Onload");
    ctx.drawImage(img, coords[0], coords[1],
                  canvas.width, canvas.height);
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
  let got = new Uint8Array(_base64ToArrayBuffer(event.data));  
  //console.log(got.byteLength);
  let res = new Uint8Array(got.length + buf.length);
  res.set(buf);
  res.set(got, buf.length);
  //console.log(buf.length);
  buf = new Uint8Array(res.length);
  buf.set(res);
  //console.log(buf.length);
  
  let im = read_jpeg();
  while (im != undefined) {
    //console.log('.');
    draw2(im, [0, 0]);
    im = read_jpeg();
  }
};

ws.onclose = function() {
  console.log("Connection is closed...");
}

},{}]},{},[1]);
