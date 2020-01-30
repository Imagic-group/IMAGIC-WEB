var stdin = process.openStdin();

var beg = 0;
var buf = new Uint8Array(0);

stdin.addListener("data", (input) => {
  var got = new Uint8Array(input);
  
  var res = new Uint8Array(got.length + buf.length);
  res.set(buf);
  res.set(got, buf.length);
  buf = res;
  
  var im = read_jpeg();
  while (im != undefined) {
    process.stdout.write(im);
    im = read_jpeg();
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});


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
    process.stderr.write('start of image found');
  }
  var end = beg + 1;
  var finished = false;
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
  process.stderr.write('end of image found');
  end += 2;
  let im = buf.subarray(beg, end);
  buf = buf.subarray(end, buf.length);
  beg = 0;
  return im;
}
