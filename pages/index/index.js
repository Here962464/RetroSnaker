//初始化按下坐标
var startX=0;
var startY=0;
// 初始化移动坐标
var moveX = 0;
var moveY = 0;
// 初始化按下坐标与移动坐标的差值
var X=0;
var Y=0;
// 初始化蛇头
var head = {
  x:30,
  y:30,
  r:6,
  color:"red"
}
// 蛇头初始方向
var snakeDirection = "right";
// 手指方向
var figerDirection = null;
// 蛇身
var snakeBodys = [];
// 食物
var foods = [];
// 窗口的宽高
var windowW = 0;
var windowH = 0;

// 碰撞状态
var state = true;
var num = 0;
var numSpeed = 0;
var speed = 1;

Page({
  canvasStart:function(e){
    // 按下时更新坐标
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },
  canvasMove:function(e){
    // 移动时更新坐标
    console.log(e)
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;
    // 移动时计算坐标差值
    X = moveX - startX;
    Y = moveY - startY;

    // 判断
    // 比较横纵坐标差值的绝对值，如果X轴的差值大于Y轴差值，则在X轴上移动，反之在Y轴上移动。并且同时判断X或Y的正负，如果X<0，则向左移动，如果X>0，则向右移动；如果Y<0，则向上移动，如果Y>0，则向下移动
    if(Math.abs(X) > Math.abs(Y) && X < 0){
      figerDirection="left"
    } else if (Math.abs(X) > Math.abs(Y) && X > 0){
      figerDirection="right"
    } else if (Math.abs(X) < Math.abs(Y) && Y < 0) {
      figerDirection="top"
    } else if (Math.abs(X) < Math.abs(Y) && Y > 0) {
      figerDirection="bottom"
    }
  },
  canvasEnd:function(){
    snakeDirection = figerDirection;
  },
  onReady: function (e) {
    // 获取画布上下文
    var context = wx.createCanvasContext('RetroSnaker');
    // 帧数
    var moveFrame = 0;
    // 绘制图形
    function drawsnake(obj) {
      context.beginPath();
      context.arc(obj.x, obj.y, obj.r, 0, 360, false);
      context.setFillStyle(obj.color);//填充颜色,默认是黑色
      context.fill();//画实心圆
      context.closePath();
      // 填充颜色
      // context.setFillStyle(obj.color);
      // 开始绘制
      // context.beginPath();
      // 绘制路径
      // context.rect(obj.x, obj.y, obj.w, obj.h);
      // 关闭路径
      // context.closePath();
      // 填充
      // context.fill();
    };
    function aaa(){
      // 碰边检测
      // var deathLeft = 0;
      // var deathRight = windowW - head.r / 2;
      // var deathTop = 0;
      // var deathBottom = windowH - head.r / 2;

      // if (head.x <= deathLeft) {
      //   console.log('left');
      // } else if (head.x >= deathRight) {
      //   console.log('right');
      // } else if (head.y <= deathTop) {
      //   console.log('top');
      // } else if (head.y >= deathBottom) {
      //   console.log('right');
      // }
    };
    // 碰撞检测
    function collide(obj1,obj2){
      var l1 = obj1.x;
      var r1 = obj1.r*2 + l1;
      var t1 = obj1.y;
      var b1 = obj1.r*2 + t1;

      var l2 = obj2.x;
      var r2 = obj2.r*2 + l2;
      var t2 = obj2.y;
      var b2 = obj2.r*2 + t2;

      if (r1 > l2 && t2 < b1 && l1 < r2 && t1 < b2){
        return true;
      }else{
        return false;
      }

    };
    function animation(){
      moveFrame++;
      if (moveFrame % 2 == 0 ){
        // 蛇身初始化
        snakeBodys.push({
          x: head.x,
          y: head.y,
          r: head.r,
          color: "blue"
        });
        // 判断方向
        switch (snakeDirection) {
          case "left":
            head.x -= speed;
            break;
          case "right":
            head.x += speed;
            break;
          case "top":
            head.y -= speed;
            break;
          case "bottom":
            head.y += speed;
            break;
        }
        // 控制大小
        if (num >= 10) {
          head.r++;
          num = 0;
        }
        // 控制速度
        if (numSpeed >= 15) {
          speed++;
          if(speed >= 4){
            speed = 4;
          }
          numSpeed = 0;
        }
        if(snakeBodys.length >5 ){
          if (state){
            snakeBodys.shift();
          }else{
            state = true;
          }
        }
      }
      // 绘制蛇身
      for (var i = 0; i < snakeBodys.length; i++) {
        var snakeBody = snakeBodys[i];
        drawsnake(snakeBody);
      }
      // 绘制蛇头
      drawsnake(head);
      for(var i=0;i<foods.length;i++){
        var foodsobj = foods[i];
        // 绘制食物
        drawsnake(foodsobj);
        if (collide(head, foodsobj)){
          num++;
          numSpeed++;
          state = false;
          foodsobj.resetFood();
        }
        
      };
      // 调用微信api
      wx.drawCanvas({
        canvasId:"RetroSnaker",
        actions:context.getActions()
      });
      requestAnimationFrame(animation);
      
      var deathLeft = head.r;
      var deathRight = windowW - head.r;
      var deathTop = head.r;
      var deathBottom = windowH - head.r;

      if (head.x < deathLeft) {
        head.x = deathLeft;
        snakeDirection = "right";
        // wx.showModal({
        //   title: '失败',
        //   confirmText:"再来一局",
        //   cancelText:"退出",
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     }
        //   }
        // })
      } else if (head.x >= deathRight) {
        head.x = deathRight;
        snakeDirection = "left";
      } else if (head.y <= deathTop) {
        head.y = deathTop;
        snakeDirection = "bottom";
      } else if (head.y >= deathBottom) {
        head.y = deathBottom;
        snakeDirection = "top";
      }
    }
    function rand(min,max){
      return parseInt(Math.random()*(max-min)+1);
    };
    function Food() {
      this.x = rand(0, windowW);
      this.y = rand(0,windowH);
      this.r = rand(7,14);
      this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255)+")";
      this.resetFood = function(){
        this.x = rand(0, windowW);
        this.y = rand(0, windowH);
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
      }
    };
    wx.getSystemInfo({
      success: function (res) {
        windowW = res.windowWidth;
        windowH = res.windowHeight;
        for(var i=0;i<30;i++){
          var foodobj = new Food();
          foods.push(foodobj);
        }
        animation();
      },
    });
  }
})
