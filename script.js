let player = {
    speed: 5,
    gameOver: true,
    fire: false,
    alienSpeed: 1
}
const startBtn = document.querySelector(".start-button")
const spaceShip = document.querySelector(".space-ship")
const container = document.querySelector(".game-container")
const redFire = document.querySelector(".shoot")

const containerBoundary = container.getBoundingClientRect()
startBtn.addEventListener("click", startGame)

let keyValue = {}
document.addEventListener("keydown", function (e) {
    //console.log(e)
    let key = e.code
    //console.log(key.code)
    if (key === "ArrowLeft") {
        keyValue.left = true
    } else if (key === "ArrowRight") {
        keyValue.right = true
    } else if (key === "Space" || key === "ArrowUp") {
        firing()
    }
    //console.log(keyValue)
})
document.addEventListener("keyup", function (e) {
    //console.log(e)
    let key = e.code
    // console.log(key.code)
    if (key === "ArrowLeft") {
        keyValue.left = false
    } else if (key === "ArrowRight") {
        keyValue.right = false
    }
    //console.log(keyValue)
})
function gameOver() {
    startBtn.style.display = "block"
    startBtn.innerHTML = "Click here to Restart"
    player.fire = true
    redFire.classList.add("hide")
}
function clearAliens() {
    let allAliens = document.querySelectorAll(".alien")
    for (i = 0; i < allAliens.length; i++) {
        allAliens[i].parentNode.removeChild(allAliens[i])
    }
}
function startGame() {
    if (player.gameOver) {
        clearAliens()
        player.gameOver = false
        startBtn.style.display = "none"
        player.alienSpeed = 10
        player.fire = false
        alienList(18)
        player.animFrame = requestAnimationFrame(updateGame)

    }
}
function alienList(num) {
    let alienWidth = 70
    let lastColumn = containerBoundary.width - alienWidth
    let row = {
        x: containerBoundary.left + 50,
        y: 50
    }
    for (i = 0; i < num; i++) {
        if (row.x > (lastColumn - alienWidth)) {
            row.y += alienWidth
            row.x = containerBoundary.left + 50
        }
        createAlien(row, alienWidth)
        row.x += alienWidth + 20
    }
}

function createAlien(row, alienWidth) {
    let alienDiv = document.createElement("div")
    alienDiv.classList.add("alien")
    let mouth = document.createElement("span")
    mouth.classList.add("mouth")
    alienDiv.appendChild(mouth)
    alienDiv.style.width = alienWidth + "px"
    alienDiv.xSpot = Math.floor(row.x)
    alienDiv.ySpot = Math.floor(row.y)
    alienDiv.style.left = alienDiv.xSpot + "px"
    alienDiv.style.top = alienDiv.ySpot + "px"
    alienDiv.changeDirection = 1
    container.appendChild(alienDiv)
}

function firing() {
    player.fire = true
    redFire.classList.remove("hide")
    redFire.xSpot = (spaceShip.offsetLeft + (spaceShip.offsetWidth / 2))
    redFire.ySpot = spaceShip.offsetTop
    redFire.style.left = redFire.xSpot + "px"
    redFire.style.top = redFire.ySpot + "px"
}

function attacked(a, laser) {
    let aDim = a.getBoundingClientRect()
    let laserDim = laser.getBoundingClientRect()
    return !(
        (aDim.bottom < laserDim.top) ||
        (aDim.top > laserDim.bottom) ||
        (aDim.right < laserDim.left) ||
        (aDim.left > laserDim.right))
}

function updateGame() {
    if (!player.gameOver) {
        let allAliens = document.querySelectorAll(".alien")
        //console.log(allAliens)
        if (allAliens.length === 0) {
            player.gameOver = true
            //console.log("You win")
            gameOver()
        }
        for (i = allAliens.length - 1; i > -1; i--) {
            let alienEl = allAliens[i]
            if (attacked(alienEl, redFire)) {
                //console.log("attacked")
                player.alienSpeed++
                player.fire = false 
                redFire.classList.add("hide")
                alienEl.parentNode.removeChild(alienEl)
                redFire.ySpot = containerBoundary.height + 100
            }
            if (alienEl.xSpot > (containerBoundary.width - alienEl.offsetWidth) || alienEl.xSpot < containerBoundary.left) {
                alienEl.changeDirection *= -1
                alienEl.ySpot += 40
                if (alienEl.ySpot > (spaceShip.offsetTop - 65)) {
                    player.gameOver = true;
                    gameOver()
                }
            }
            alienEl.xSpot += (player.alienSpeed * alienEl.changeDirection)
            alienEl.style.left = alienEl.xSpot + "px"
            alienEl.style.top = alienEl.ySpot + "px"
        }
        let tempPosition = spaceShip.offsetLeft
        if (player.fire) {
            if (redFire.ySpot > 0) {
                redFire.ySpot -= 15
                redFire.style.top = redFire.ySpot + "px"
            }
            else {
                player.fire = false
                redFire.classList.add("hide")
            }
        }
        if (keyValue.left && tempPosition > containerBoundary.left) {
            tempPosition -= player.speed
        }
        if (keyValue.right && (tempPosition + spaceShip.offsetWidth) < containerBoundary.right) {
            tempPosition += player.speed
        }
        spaceShip.style.left = tempPosition + "px"
        player.animFrame = requestAnimationFrame(updateGame)
    }
}