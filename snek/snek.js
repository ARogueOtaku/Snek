var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

pGround = createHiDPICanvas(600, 600);
document.body.appendChild(pGround); 
ctx = pGround.getContext('2d');
cWidth = pGround.width / 50;
cHeight = pGround.height / 50;
gOver = false;
direction = 0;
fps = 15;
score = 0;

var food = function(xPos, yPos){
    this.xPos = xPos;
    this.yPos = yPos;
    this.draw = function(){
        ctx.fillStyle = 'pink';
        ctx.fillRect(this.xPos, this.yPos, cWidth, cHeight);
    }
}

var bPart = function(xPos, yPos, isHead){
    this.xPos = xPos;
    this.yPos = yPos;
    this.draw = function(){
        ctx.fillStyle = 'white'
        if(isHead)
            ctx.fillStyle = 'green';
        ctx.fillRect(this.xPos, this.yPos, cWidth, cHeight);
    }
}
var snek = []
var inpBuffer = []
var head = new bPart(0,0,1)
var foodIns = new food(cWidth * 10, cHeight * 10);
snek.push(head); 
window.addEventListener('keypress', function(e){
    if(inpBuffer.length <= 3)
        inpBuffer.push(e.charCode)
});

anim();

function anim(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,600,600);
    foodIns.draw();
    moveSnek(snek);
    detecFColl();
    ctx.fillStyle = 'white';
    ctx.font = '15px Arial'
    ctx.fillText('Score: '+score, pGround.width-70, 20);
    if(gOver){
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial'
        ctx.fillText('GAME OVER', 150, pGround.height/2);
        return 1;
    }
    setTimeout(anim,1000/fps);
}

function processInput(inp){
    if(inp == 119 && direction != 1) //w
        direction = 4
    else if(inp == 100 && direction != 2) //d
         direction = 0
    else if(inp == 115 && direction != 4) //s
        direction = 1
    else if(inp == 97 && direction != 0) //a
         direction = 2
}

function moveSnek(snek){
    var inp = inpBuffer.pop();
    processInput(inp)
    var x = head.xPos;
    var y = head.yPos;
    snek.forEach(part => {
        if(part === head){
            x = part.xPos;
            y = part.yPos;
            if(direction == 1){
                part.yPos += cHeight;
                part.yPos %= pGround.height;
            }
            else if(direction == 0){
                part.xPos += cWidth;
                part.xPos %= pGround.width;
            }
            else if(direction == 2){
                part.xPos -= cWidth;
                if(part.xPos < 0)
                    part.xPos = pGround.width - cWidth;
            }
            else{
                part.yPos -= cHeight;
                if(part.yPos < 0)
                    part.yPos = pGround.height - cHeight;
            }
        }
        else{
            tx = part.xPos;
            ty = part.yPos;
            part.xPos = x;
            part.yPos = y;
            part.draw();
            x = tx;
            y = ty;
        }
        part.draw();
        if(detColl(snek))
            gOver = true;
    });
}

function detColl(snek){
    var fl = 0
    var posi = [];
    snek.forEach(part => {
        posi.push(part.xPos + ',' + part.yPos);
    });
    posi.forEach(coord => {
        if(coord == head.xPos + ',' + head.yPos){
            fl++;
        }
    });
    if(fl > 1)
        return true;
    return false;
}

function detecFColl(){
    if(foodIns.xPos+','+foodIns.yPos == head.xPos+','+head.yPos){
        //fps++;
        score++;
        snek.push(new bPart(snek[snek.length-1].xPos,snek[snek.length-1].yPos));
        var nXp = Math.round(Math.floor(Math.random()*pGround.width)/cWidth)*cWidth;
        var nYp = Math.round(Math.floor(Math.random()*pGround.height)/cHeight)*cHeight;
        foodIns.xPos = nXp;
        foodIns.yPos = nYp;
    }
}
