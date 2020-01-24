var
  canv = document.getElementById('canvas'),
  ctx    = canv.getContext('2d')
canv.width = 903;
canv.height = 657;
var i = 0;
function Tutor() {
  //document.write('Hello Toturix');
  var background = new Image();
  background.src = "frame" + i + ".jpg";
  i++;
  background.onload = function(){
    ctx.drawImage(background,100,100);   
    console.log("I'm here!");
  }
  console.log("I'm not here!");
}
setInterval('Tutor()', 1000/10)
