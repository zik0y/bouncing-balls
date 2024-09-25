// 获取页面中的canvas元素
const canvas = document.querySelector("canvas");

// 获取canvas的2D渲染上下文
const ctx = canvas.getContext("2d");

// 获取开始和停止按钮元素
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

// 设置canvas的宽度和高度为浏览器窗口的宽度和高度
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// 生成一个指定范围内的随机整数
function random(min, max) {  
    return Math.floor(Math.random() * (max - min)) + min;  
}  

// 生成一个随机颜色
function randomColor() {  
    return "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";  
}  

// Ball构造函数，用于创建小球对象
function Ball(x, y, velX, velY, color, size) {  
    this.x = x;      // 小球的x坐标
    this.y = y;      // 小球的y坐标
    this.velX = velX; // 小球在x轴的速度
    this.velY = velY; // 小球在y轴的速度
    this.color = color; // 小球的颜色
    this.size = size;  // 小球的大小
}  

// Ball的原型方法，用于在画布上绘制小球
Ball.prototype.draw = function () {  
    ctx.beginPath();            // 开始绘制路径
    ctx.fillStyle = this.color; // 设置填充颜色
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // 绘制圆弧
    ctx.fill();                 // 填充颜色
};  

// Ball的原型方法，用于更新小球的位置
Ball.prototype.update = function () {  
    // 检测小球是否碰壁，并反转速度
    if (this.x + this.size >= width || this.x - this.size <= 0) {  
        this.velX = -this.velX;  
    }  

    if (this.y + this.size >= height || this.y - this.size <= 0) {  
        this.velY = -this.velY;  
    }  

    // 更新小球的坐标
    this.x += this.velX;  
    this.y += this.velY;  
};  

// Ball的原型方法，用于检测小球之间的碰撞
Ball.prototype.collisionDetect = function () {  
    for (let j = 0; j < balls.length; j++) {  
        if (this !== balls[j]) {  
            const dx = this.x - balls[j].x;  
            const dy = this.y - balls[j].y;  
            const distance = Math.sqrt(dx * dx + dy * dy);  

            // 如果两个小球之间的距离小于它们的大小之和，则发生碰撞
            if (distance < this.size + balls[j].size) {  
                balls[j].color = this.color = randomColor(); // 碰撞后改变颜色
            }  
        }  
    }  
};  

// 初始化小球数组
let balls = [];  

// 创建30个小球
while (balls.length < 30) {  
    const size = random(10, 30); // 随机大小
    let ball = new Ball(  
        random(0 + size, width - size),  // 随机x坐标
        random(0 + size, height - size), // 随机y坐标
        random(-11, 11),                   // 随机x轴速度
        random(-7, 7),                   // 随机y轴速度
        randomColor(),                   // 随机颜色
        size,                            // 大小
    );  
    balls.push(ball); // 将小球添加到数组中
}  

let animationFrameId = null; // 用于存储requestAnimationFrame的返回值

// 动画循环函数
function loop() {
    // 设置画布背景颜色为半透明的灰色，每次循环都会绘制，以清除之前的画面
    ctx.fillStyle = "rgba(128, 128, 128, 0.25)";
    // 绘制一个填充矩形作为背景，覆盖整个画布
    ctx.fillRect(0, 0, width, height);

    // 遍历所有小球
    for (let i = 0; i < balls.length; i++) {
        // 绘制小球
        balls[i].draw();
        // 更新小球的位置
        balls[i].update();
        // 检测小球之间的碰撞
        balls[i].collisionDetect();
    }

    // 使用requestAnimationFrame请求浏览器在下一次重绘之前调用loop函数，形成一个动画循环
    animationFrameId = requestAnimationFrame(loop);
}

// 开始动画的函数
function startAnimation() {
    // 如果当前没有动画帧在运行，则开始动画循环
    if (animationFrameId === null) {
        loop();
    }
}

// 停止动画的函数
function stopAnimation() {
    // 如果当前有动画帧在运行，则取消它
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        // 将animationFrameId设置为null，表示动画已停止
        animationFrameId = null;
    }
}

// 给开始按钮添加点击事件监听器，当按钮被点击时，调用startAnimation函数
startButton.addEventListener('click', startAnimation);

// 给停止按钮添加点击事件监听器，当按钮被点击时，调用stopAnimation函数
stopButton.addEventListener('click', stopAnimation);

// 当文档加载完毕后，添加事件监听器，调用startAnimation函数开始动画
document.addEventListener('DOMContentLoaded', startAnimation);
