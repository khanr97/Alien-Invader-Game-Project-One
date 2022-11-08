let player = {
    score : 0,
    speed : 3,
    gameOver: true,
    shoot: false,
    alienSpeed : 5
}
const startBtn = document.querySelector(".start-button")
const container = document.querySelector(".game-container")
const shooter = document.querySelector(".shooter")
const shooting = document.querySelector(".shoot")
const score = document.querySelector(".score")

const containerBoundary = container.getBoundingClientRect()
startBtn.addEventListener("click",startGame)

let keyValue = {}
document.addEventListener("keydown",function(e){
    //console.log(e)
    let key= e.code
    //console.log(key.code)
    if(key==="ArrowLeft"){
        keyValue.left = true;
    } else if(key==="ArrowRight"){
        keyValue.right = true;
    } else if(key === "ArrowUp" || key === "Space") {
        if(!player.shoot){
            firing()
        }
    }
    console.log(keyValue)
})
document.addEventListener("keyup",function(e){
    //console.log(e)
    let key= e.code
   // console.log(key.code)
    if(key==="ArrowLeft"){
        keyValue.left = false;
    } else if(key==="ArrowRight"){
        keyValue.right = false;
    } 
    //console.log(keyValue)
})

function startGame () {
    //console.log("start game")
    if(player.gameOver) {
        player.gameOver = false
        startBtn.style.display = "none"
        player.alienSpeed = 5;
    }
    player.animationFrame = requestAnimationFrame(updateGame);
}

function firing () {
    player.shoot = true 
    shooting.classList.remove("hide")
    shooting.xPosition = (shooter.offsetLeft+(shooter.offsetWidth/2))
    shooting.yPosition = shooter.offsetTop
    shooting.style.left = shooting.xPosition +"px"
    shooting.style.top = shooting.yPosition +"px"
}



function updateGame () {
    let tempPosition = shooter.offsetLeft
    //console.log("player")
    if(player.shoot) {
        if(shooting.yPosition>0) {
            shooting.yPosition -= 10
            shooting.style.top = shooting.yPosition + "px"
        } else {
            player.shoot = false
            shooting.classList.add("hide")
        }
    }
    if(keyValue.left && tempPosition > containerBoundary.left) {
        tempPosition -= player.speed
    }
    if(keyValue.right && (tempPosition+shooter.offsetWidth)  < containerBoundary.right) {
        tempPosition += player.speed
    }
    shooter.style.left = tempPosition + "px"
    player.animationFrame = requestAnimationFrame(updateGame)
}