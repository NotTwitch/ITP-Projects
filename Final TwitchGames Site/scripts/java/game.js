  
  const screenWidth = window.outerWidth;
  const screenHeight = 480;
    
  const frameDelay = 1000/60;
  
  const cell_size = 32;
  
  const canvas = document.createElement("canvas");
    
  const context = canvas.getContext("2d");

  var isMenuOpen = false;
  var Sensitivity = 10;
  var FOV = 60
  var whichSetting = false;

  const select = new Audio();
  select.src = "sounds/select.wav";

  const change = new Audio();
  change.src = "sounds/change.wav";

  const menu = new Audio();
  menu.src = "sounds/menu.wav";


const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
  ];
  
  const colorPallete = {
    floor: "grey", // "#ff6361"
    ceiling: "silver", // "#012975",
    wall: "blue", // "#58508d"
    wallDark: "navy", // "#003f5c"
    rays: "red",
    player: "yellow",
    miniMap: "black",
    settings: "white",
  };
  
  const player = {
    x: cell_size * 1.5,
    y: cell_size * 2,
    angle: toRadians(0),
    speed: 0,
  };

  canvas.setAttribute("width", screenWidth);
  canvas.setAttribute("height", screenHeight);
  document.body.appendChild(canvas);
  
  function clearScreen() {
    context.fillStyle = "white";
    context.fillRect(0, 0, screenWidth, screenHeight);
  }
  
  function renderMenu(posX = 0, posY = 0, scale, rays) {
    const cellSize = scale * cell_size;
    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          context.fillStyle = colorPallete.miniMap;
          context.fillRect(
            posX + x * cellSize,
            posY + y * cellSize,
            cellSize,
            cellSize
          );
        }
      });
    });
    context.fillStyle = colorPallete.player;
    context.fillRect(
      posX + player.x * scale - 10 / 2,
      posY + player.y * scale - 10 / 2,
      10,
      10
    );
  
    context.strokeStyle = "blue";
    context.beginPath();
    context.moveTo(player.x * scale, player.y * scale);
    context.lineTo(
      (player.x + Math.cos(player.angle) * 20) * scale,
      (player.y + Math.sin(player.angle) * 20) * scale
    );
    context.closePath();
    context.stroke();
  
    context.strokeStyle = colorPallete.rays;
    rays.forEach((ray) => {
      context.beginPath();
      context.moveTo(player.x * scale, player.y * scale);
      context.lineTo(
        (player.x + Math.cos(ray.angle) * ray.distance) * scale,
        (player.y + Math.sin(ray.angle) * ray.distance) * scale
      );
      context.closePath();
      context.stroke();
    });

    context.fillStyle = colorPallete.settings;
    context.font = "50px serif";
    context.fillText("Settings",cellSize * map[0].length + 10,55);
    context.font = "35px serif";
    context.fillText("Sensitivity: " + Sensitivity.toString(),cellSize * map[0].length + 10,100);
    context.fillText("FOV: " + FOV.toString(),cellSize * map[0].length + 10,140);
    context.strokeStyle = colorPallete.settings;
    context.lineWidth = 5;
    if(!whichSetting)
    {
      context.strokeRect(cellSize * map[0].length + 5,70,225,40);
    }
    else
    {
      context.strokeRect(cellSize * map[0].length + 5,105,225,40);
    }

  }
  
  function toRadians(deg) {
    return (deg * Math.PI) / 180;
  }
  
  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  function outOfBounds(x, y) {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
  }
  
  function getVCollision(angle) {
    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);
  
    const firstX = right
      ? Math.floor(player.x / cell_size) * cell_size + cell_size
      : Math.floor(player.x / cell_size) * cell_size;
  
    const firstY = player.y + (firstX - player.x) * Math.tan(angle);
  
    const xA = right ? cell_size : -cell_size;
    const yA = xA * Math.tan(angle);
  
    let wall;
    let nextX = firstX;
    let nextY = firstY;
    while (!wall) {
      const cellX = right
        ? Math.floor(nextX / cell_size)
        : Math.floor(nextX / cell_size) - 1;
      const cellY = Math.floor(nextY / cell_size);
  
      if (outOfBounds(cellX, cellY)) {
        break;
      }
      wall = map[cellY][cellX];
      if (!wall) {
        nextX += xA;
        nextY += yA;
      } else {
      }
    }
    return {
      angle,
      distance: distance(player.x, player.y, nextX, nextY),
      vertical: true,
    };
  }
  
  function getHCollision(angle) {
    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    const firstY = up
      ? Math.floor(player.y / cell_size) * cell_size
      : Math.floor(player.y / cell_size) * cell_size + cell_size;
    const firstX = player.x + (firstY - player.y) / Math.tan(angle);
  
    const yA = up ? -cell_size : cell_size;
    const xA = yA / Math.tan(angle);
  
    let wall;
    let nextX = firstX;
    let nextY = firstY;
    while (!wall) {
      const cellX = Math.floor(nextX / cell_size);
      const cellY = up
        ? Math.floor(nextY / cell_size) - 1
        : Math.floor(nextY / cell_size);
  
      if (outOfBounds(cellX, cellY)) {
        break;
      }
  
      wall = map[cellY][cellX];
      if (!wall) {
        nextX += xA;
        nextY += yA;
      }
    }
    return {
      angle,
      distance: distance(player.x, player.y, nextX, nextY),
      vertical: false,
    };
  }
  
  function castRay(angle) {
    const vCollision = getVCollision(angle);
    const hCollision = getHCollision(angle);
  
    return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
  }
  
  function fixFishEye(distance, angle, playerAngle) {
    const diff = angle - playerAngle;
    return distance * Math.cos(diff);
  }
  
  function getRays() {
    const initialAngle = player.angle - toRadians(FOV) / 2;
    const numberOfRays = screenWidth;
    const angleStep = toRadians(FOV) / numberOfRays;
    return Array.from({ length: numberOfRays }, (_, i) => {
      const angle = initialAngle + i * angleStep;
      const ray = castRay(angle);
      return ray;
    });
  }
  
  function movePlayer() {
    player.x += Math.cos(player.angle) * player.speed;
    player.y += Math.sin(player.angle) * player.speed;
  }
  
  function renderScene(rays) {
    rays.forEach((ray, i) => {
      const distance = fixFishEye(ray.distance, ray.angle, player.angle);
      const wallHeight = ((cell_size * 5) / distance) * 277;
      context.fillStyle = ray.vertical ? colorPallete.wallDark : colorPallete.wall;
      context.fillRect(i, screenHeight / 2 - wallHeight / 2, 1, wallHeight);
      context.fillStyle = colorPallete.floor;
      context.fillRect(
        i,
        screenHeight / 2 + wallHeight / 2,
        1,
        screenHeight / 2 - wallHeight / 2
      );
      context.fillStyle = colorPallete.ceiling;
      context.fillRect(i, 0, 1, screenHeight / 2 - wallHeight / 2);
    });
  }
  
  function gameLoop() {
    clearScreen();
    movePlayer();
    const rays = getRays();
    renderScene(rays);
    if(isMenuOpen) {
      renderMenu(0, 0, 1, rays);
    }
  }
  
  setInterval(gameLoop, frameDelay);
  
  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "w") {
      player.speed = 2;
    }
    if (e.key === "s") {
      player.speed = -2;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown" && isMenuOpen) {
      whichSetting = !whichSetting;
      select.load();
      select.play();
    }
    if (e.key === "ArrowLeft"  && isMenuOpen) {
      if(whichSetting  && FOV != 30)
      {
        FOV -= 1;
        change.load();
        change.play();
      }
      else
      {
        if(!whichSetting && Sensitivity != 1)
        {
          Sensitivity -= 1;
          change.load();
          change.play();
        }
      }

    }
    if (e.key === "ArrowRight"  && isMenuOpen) {
      if(whichSetting && FOV != 180)
      {
        FOV += 1;
        change.load();
        change.play();
      }
      else
      {
        if(!whichSetting && Sensitivity != 100)
        {
          Sensitivity += 1
          change.load();
          change.play();
        }
      }
    }
    if (e.key === "m") {
        isMenuOpen = !isMenuOpen;
        menu.load();
        menu.play();
    }
  });
  
  document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") {
      player.speed = 0;
    }
  });
  
  document.addEventListener("mousemove", function (event) {
    player.angle += toRadians((event.movementX / 50) * Sensitivity);
  });