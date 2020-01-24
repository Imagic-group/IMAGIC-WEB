var
  canv = document.getElementById('canvas'),
  ctx    = canv.getContext('2d')
canv.width = 2048;
canv.height = 1024;
var i = 0;

/*
function Tutor() {
  var background = new Image();
  background.src = "frame" + (i % 2) + ".jpg";
  i++;
  background.onload = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background,100,100);   
    console.log("I'm here!");
  }
  console.log("I'm not here!");
}
setInterval('Tutor()', 1000/10)
*/

//const cv = require('opencv');

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
  console.log(event.data);
  let image = cv.imdecode(cv.Mat(event.data), 1);
  cv.imshow('canvas', image);
  document.body.innerHTML += event.data + '</br>';
};
ws.onclose = function() {
  console.log("Connection is closed...");
}

/*
ws.on('image', function(msg) {
});
*/


/*
 module.exports = {
    JpegImage: JpegImage,

    JpegDecoder: JpegDecoder,
    JpxDecoder: JpxDecoder,
    Jbig2Decoder: Jbig2Decoder
  };
  */
