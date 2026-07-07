// Pseudo-3D "OutRun" racer engine.
// Port of Jake Gordon's open-source javascript-racer (codeincomplete.com, MIT),
// adapted to use individual sprite images + a single panoramic background,
// plus the lives / clock / crash / radio HUD hooks used by The Summer Drive.

const Util = {
  timestamp: () => Date.now(),
  toInt: (value, fallback) => {
    const v = parseInt(value, 10);
    return isNaN(v) ? Util.toInt(fallback, 0) : v;
  },
  limit: (value, min, max) => Math.max(min, Math.min(value, max)),
  interpolate: (a, b, percent) => a + (b - a) * percent,
  randomInt: (min, max) => Math.round(Util.interpolate(min, max, Math.random())),
  randomChoice: (options) => options[Util.randomInt(0, options.length - 1)],
  percentRemaining: (n, total) => (n % total) / total,
  accelerate: (v, accel, dt) => v + accel * dt,
  exponentialFog: (distance, density) =>
    1 / Math.pow(Math.E, distance * distance * density),
  increase: (start, increment, max) => {
    let result = start + increment;
    while (result >= max) result -= max;
    while (result < 0) result += max;
    return result;
  },
  overlap: (x1, w1, x2, w2, percent) => {
    const half = (percent || 1) / 2;
    const min1 = x1 - w1 * half;
    const max1 = x1 + w1 * half;
    const min2 = x2 - w2 * half;
    const max2 = x2 + w2 * half;
    return !(max1 < min2 || min1 > max2);
  },
  project: (p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) => {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round(width / 2 + (p.screen.scale * p.camera.x * width) / 2);
    p.screen.y = Math.round(height / 2 - (p.screen.scale * p.camera.y * height) / 2);
    p.screen.w = Math.round((p.screen.scale * roadWidth * width) / 2);
  },
  formatTime: (dt) => {
    const minutes = Math.floor(dt / 60);
    const seconds = Math.floor(dt - minutes * 60);
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  },
};

const COLORS = {
  SKY: "#72D7EE",
  TREE: "#005108",
  FOG: "#3a6d2e",
  LIGHT: { road: "#6B6B6B", grass: "#10AA10", rumble: "#555555", lane: "#CCCCCC" },
  DARK: { road: "#696969", grass: "#009A00", rumble: "#BBBBBB" },
  START: { road: "white", grass: "white", rumble: "white" },
  FINISH: { road: "black", grass: "black", rumble: "black" },
};

const ROAD = {
  LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100 },
  HILL: { NONE: 0, LOW: 20, MEDIUM: 40, HIGH: 60 },
  CURVE: { NONE: 0, EASY: 2, MEDIUM: 4, HARD: 6 },
};

export function createRacer(options) {
  const canvas = options.canvas;
  const ctx = canvas.getContext("2d");
  const sprites = options.sprites; // { name: { img, w, h } }
  const background = options.background; // HTMLImageElement
  const carSprites = options.carSprites; // [{ img, w, h }, ...]
  const hud = options.hud || {};

  const fps = 60;
  const step = 1 / fps;
  const width = 1024;
  const height = 768;
  const centrifugal = 0.3;
  const skySpeed = 0.001;
  const fogDensity = 5;

  const roadWidth = 2000;
  const segmentLength = 200;
  const rumbleLength = 3;
  const lanes = 3;
  const fieldOfView = 100;
  const cameraHeight = 1000;
  const drawDistance = 300;
  const spriteScaleBase = 0.3 / (sprites.straight.w || 80);

  const cameraDepth = 1 / Math.tan(((fieldOfView / 2) * Math.PI) / 180);
  const playerZ = cameraHeight * cameraDepth;
  const resolution = height / 480;

  const maxSpeed = segmentLength / step;
  const accel = maxSpeed / 5;
  const breaking = -maxSpeed;
  const decel = -maxSpeed / 5;
  const offRoadDecel = -maxSpeed / 2;
  const offRoadLimit = maxSpeed / 4;
  const totalCars = 200;

  canvas.width = width;
  canvas.height = height;

  let segments = [];
  let cars = [];
  let trackLength = 0;
  let playerX = 0;
  let position = 0;
  let speed = 0;
  let bgOffset = 0;
  let currentLapTime = 0;
  let lives = 3;
  let collisionCooldown = 0;

  let keyLeft = false;
  let keyRight = false;
  let keyFaster = false;
  let keySlower = false;

  // ---- road building ----------------------------------------------------
  function lastY() {
    return segments.length === 0
      ? 0
      : segments[segments.length - 1].p2.world.y;
  }

  function addSegment(curve, y) {
    const n = segments.length;
    segments.push({
      index: n,
      p1: { world: { y: lastY(), z: n * segmentLength }, camera: {}, screen: {} },
      p2: { world: { y, z: (n + 1) * segmentLength }, camera: {}, screen: {} },
      curve,
      sprites: [],
      cars: [],
      color:
        Math.floor(n / rumbleLength) % 2 ? COLORS.DARK : COLORS.LIGHT,
    });
  }

  function addRoadSprite(source, offset) {
    segments[segments.length - 1].sprites.push({ source, offset });
  }

  function addRoad(enter, hold, leave, curve, y) {
    const startY = lastY();
    const endY = startY + Util.toInt(y, 0) * segmentLength;
    const total = enter + hold + leave;
    for (let n = 0; n < enter; n++)
      addSegment(easeIn(0, curve, n / enter), easeInOut(startY, endY, n / total));
    for (let n = 0; n < hold; n++)
      addSegment(curve, easeInOut(startY, endY, (enter + n) / total));
    for (let n = 0; n < leave; n++)
      addSegment(
        easeInOut(curve, 0, n / leave),
        easeInOut(startY, endY, (enter + hold + n) / total)
      );
  }

  function easeIn(a, b, percent) {
    return a + (b - a) * Math.pow(percent, 2);
  }
  function easeInOut(a, b, percent) {
    return a + (b - a) * (-Math.cos(percent * Math.PI) / 2 + 0.5);
  }

  const S = ROAD.LENGTH;
  const H = ROAD.HILL;
  const C = ROAD.CURVE;

  function addStraight(num) {
    num = num || S.MEDIUM;
    addRoad(num, num, num, 0, 0);
  }
  function addHill(num, height) {
    num = num || S.MEDIUM;
    height = height || H.MEDIUM;
    addRoad(num, num, num, 0, height);
  }
  function addCurve(num, curve, height) {
    num = num || S.MEDIUM;
    curve = curve || C.MEDIUM;
    height = height || H.NONE;
    addRoad(num, num, num, curve, height);
  }
  function addLowRollingHills(num, height) {
    num = num || S.SHORT;
    height = height || H.LOW;
    addRoad(num, num, num, 0, height / 2);
    addRoad(num, num, num, 0, -height);
    addRoad(num, num, num, C.EASY, height);
    addRoad(num, num, num, 0, 0);
    addRoad(num, num, num, -C.EASY, height / 2);
    addRoad(num, num, num, 0, 0);
  }
  function addSCurves() {
    addRoad(S.MEDIUM, S.MEDIUM, S.MEDIUM, -C.EASY, H.NONE);
    addRoad(S.MEDIUM, S.MEDIUM, S.MEDIUM, C.MEDIUM, H.MEDIUM);
    addRoad(S.MEDIUM, S.MEDIUM, S.MEDIUM, C.EASY, -H.LOW);
    addRoad(S.MEDIUM, S.MEDIUM, S.MEDIUM, -C.EASY, H.MEDIUM);
    addRoad(S.MEDIUM, S.MEDIUM, S.MEDIUM, -C.MEDIUM, -H.MEDIUM);
  }
  function addBumps() {
    addRoad(10, 10, 10, 0, 5);
    addRoad(10, 10, 10, 0, -2);
    addRoad(10, 10, 10, 0, -5);
    addRoad(10, 10, 10, 0, 8);
    addRoad(10, 10, 10, 0, 5);
    addRoad(10, 10, 10, 0, -7);
    addRoad(10, 10, 10, 0, 5);
    addRoad(10, 10, 10, 0, -2);
  }
  function addDownhillToEnd(num) {
    num = num || 200;
    addRoad(num, num, num, -C.EASY, -lastY() / segmentLength);
  }

  function resetRoad() {
    segments = [];
    addStraight(S.SHORT);
    addLowRollingHills();
    addSCurves();
    addCurve(S.MEDIUM, C.MEDIUM, H.LOW);
    addBumps();
    addLowRollingHills();
    addCurve(S.LONG * 2, C.MEDIUM, H.MEDIUM);
    addStraight();
    addHill(S.MEDIUM, H.HIGH);
    addSCurves();
    addCurve(S.LONG, -C.MEDIUM, H.NONE);
    addHill(S.LONG, H.HIGH);
    addCurve(S.LONG, C.MEDIUM, -H.LOW);
    addBumps();
    addHill(S.LONG, -H.MEDIUM);
    addStraight();
    addSCurves();
    addDownhillToEnd();

    // roadside scenery
    const treeSprite = sprites.tree;
    const signSprite = sprites.sign;
    for (let n = 10; n < segments.length - 50; n += 0) {
      const gap = Util.randomInt(4, 24);
      n += gap;
      if (n >= segments.length) break;
      const side = Util.randomChoice([-1, 1]);
      const isSign = Math.random() < 0.18;
      const source = isSign ? signSprite : treeSprite;
      const offset = side * (1.2 + Math.random() * 2.2);
      if (source) addRoadSpriteAt(n, source, offset);
    }

    // start/finish coloring
    segments[findIndex(playerZ)].color = COLORS.START;
    segments[findIndex(playerZ) + 1].color = COLORS.START;
    for (let n = 0; n < rumbleLength; n++)
      segments[segments.length - 1 - n].color = COLORS.FINISH;

    trackLength = segments.length * segmentLength;
  }

  function addRoadSpriteAt(index, source, offset) {
    if (segments[index]) segments[index].sprites.push({ source, offset });
  }

  function findIndex(z) {
    return Math.floor(z / segmentLength) % segments.length;
  }
  function findSegment(z) {
    return segments[findIndex(z)];
  }

  // ---- traffic ----------------------------------------------------------
  function resetCars() {
    cars = [];
    for (let n = 0; n < totalCars; n++) {
      const offset = Math.random() * Util.randomChoice([-0.8, 0.8]);
      const z = Math.floor(Math.random() * segments.length) * segmentLength;
      const sprite = Util.randomChoice(carSprites);
      const carSpeed =
        maxSpeed / 4 + (Math.random() * maxSpeed) / (sprite.w > 45 ? 4 : 2);
      const car = { offset, z, sprite, speed: carSpeed, percent: 0 };
      findSegment(car.z).cars.push(car);
      cars.push(car);
    }
  }

  function updateCars(dt, playerSegment, playerW) {
    for (let n = 0; n < cars.length; n++) {
      const car = cars[n];
      const oldSegment = findSegment(car.z);
      car.offset += updateCarOffset(car, oldSegment, playerSegment, playerW);
      car.z = Util.increase(car.z, dt * car.speed, trackLength);
      car.percent = Util.percentRemaining(car.z, segmentLength);
      const newSegment = findSegment(car.z);
      if (oldSegment !== newSegment) {
        const index = oldSegment.cars.indexOf(car);
        oldSegment.cars.splice(index, 1);
        newSegment.cars.push(car);
      }
    }
  }

  function updateCarOffset(car, carSegment, playerSegment, playerW) {
    const lookahead = 20;
    const carW = car.sprite.w * spriteScaleBase;
    if (carSegment.index - playerSegment.index > drawDistance) return 0;

    for (let i = 1; i < lookahead; i++) {
      const segment = segments[(carSegment.index + i) % segments.length];

      if (
        segment === playerSegment &&
        car.speed > speed &&
        Util.overlap(playerX, playerW, car.offset, carW, 1.2)
      ) {
        let dir;
        if (playerX > 0.5) dir = -1;
        else if (playerX < -0.5) dir = 1;
        else dir = car.offset > playerX ? 1 : -1;
        return (dir * 1) / i / speed * (car.speed - speed);
      }

      for (let j = 0; j < segment.cars.length; j++) {
        const otherCar = segment.cars[j];
        const otherCarW = otherCar.sprite.w * spriteScaleBase;
        if (
          car.speed > otherCar.speed &&
          Util.overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)
        ) {
          let dir;
          if (otherCar.offset > car.offset) dir = -1;
          else dir = 1;
          return (dir * 1) / i / car.speed * (car.speed - otherCar.speed);
        }
      }
    }
    return 0;
  }

  // ---- update -----------------------------------------------------------
  function update(dt) {
    const playerSegment = findSegment(position + playerZ);
    const playerW = sprites.straight.w * spriteScaleBase;
    const speedPercent = speed / maxSpeed;
    const dx = dt * 2 * speedPercent;
    const startPosition = position;

    updateCars(dt, playerSegment, playerW);

    position = Util.increase(position, dt * speed, trackLength);

    if (keyLeft) playerX -= dx;
    else if (keyRight) playerX += dx;

    playerX -= dx * speedPercent * playerSegment.curve * centrifugal;

    if (keyFaster) speed = Util.accelerate(speed, accel, dt);
    else if (keySlower) speed = Util.accelerate(speed, breaking, dt);
    else speed = Util.accelerate(speed, decel, dt);

    if ((playerX < -1 || playerX > 1) && speed > offRoadLimit)
      speed = Util.accelerate(speed, offRoadDecel, dt);

    // roadside sprite collisions
    for (let n = 0; n < playerSegment.sprites.length; n++) {
      const sprite = playerSegment.sprites[n];
      const spriteW = sprite.source.w * spriteScaleBase;
      if (
        Util.overlap(
          playerX,
          playerW,
          sprite.offset + (spriteW / 2) * (sprite.offset > 0 ? 1 : -1),
          spriteW
        )
      ) {
        speed = maxSpeed / 5;
        position = Util.increase(playerSegment.p1.world.z, -playerZ, trackLength);
        break;
      }
    }

    // car collisions
    for (let n = 0; n < playerSegment.cars.length; n++) {
      const car = playerSegment.cars[n];
      const carW = car.sprite.w * spriteScaleBase;
      if (speed > car.speed) {
        if (Util.overlap(playerX, playerW, car.offset, carW, 0.8)) {
          speed = car.speed * (car.speed / speed);
          position = Util.increase(car.z, -playerZ, trackLength);
          if (collisionCooldown <= 0) loseLife();
          break;
        }
      }
    }

    playerX = Util.limit(playerX, -3, 3);
    speed = Util.limit(speed, 0, maxSpeed);

    if (collisionCooldown > 0) collisionCooldown -= dt;

    bgOffset = Util.increase(
      bgOffset,
      skySpeed * playerSegment.curve * speedPercent,
      1
    );

    // lap timing
    currentLapTime += dt;
    if (position < playerZ && startPosition >= playerZ) {
      currentLapTime = 0;
    }
    if (hud.setTime) hud.setTime(Util.formatTime(currentLapTime));
    if (hud.setSpeed) hud.setSpeed(speedPercent);
  }

  function loseLife() {
    collisionCooldown = 1.2;
    lives -= 1;
    if (hud.crash) hud.crash();
    if (lives <= 0) {
      lives = 3;
      if (hud.gameOver) hud.gameOver();
    }
    if (hud.setLives) hud.setLives(lives);
  }

  // ---- render -----------------------------------------------------------
  function renderBackground(rotation, playerY) {
    ctx.fillStyle = COLORS.SKY;
    ctx.fillRect(0, 0, width, height / 2);
    if (!background) return;
    const bgW = background.width;
    const bgH = background.height;
    const scale = (height * 0.62) / bgH;
    const w = bgW * scale;
    const h = bgH * scale;
    const y = height / 2 - h + playerY * 0.00008 * height;
    let sx = -((rotation * w) % w);
    if (sx > 0) sx -= w;
    for (let x = sx; x < width; x += w) {
      ctx.drawImage(background, 0, 0, bgW, bgH, x, y, w, h);
    }
  }

  function renderPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  function renderFog(x, y, w, h, fog) {
    if (fog < 1) {
      ctx.globalAlpha = 1 - fog;
      ctx.fillStyle = COLORS.FOG;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
    }
  }

  function rumbleWidth(projectedRoadWidth) {
    return projectedRoadWidth / Math.max(6, 2 * lanes);
  }
  function laneMarkerWidth(projectedRoadWidth) {
    return projectedRoadWidth / Math.max(32, 8 * lanes);
  }

  function renderSegment(x1, y1, w1, x2, y2, w2, fog, color) {
    const r1 = rumbleWidth(w1);
    const r2 = rumbleWidth(w2);
    const l1 = laneMarkerWidth(w1);
    const l2 = laneMarkerWidth(w2);

    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);

    renderPolygon(x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    renderPolygon(x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);
    renderPolygon(x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    if (color.lane) {
      const lw1 = (w1 * 2) / lanes;
      const lw2 = (w2 * 2) / lanes;
      let lx1 = x1 - w1 + lw1;
      let lx2 = x2 - w2 + lw2;
      for (let lane = 1; lane < lanes; lx1 += lw1, lx2 += lw2, lane++)
        renderPolygon(
          lx1 - l1 / 2,
          y1,
          lx1 + l1 / 2,
          y1,
          lx2 + l2 / 2,
          y2,
          lx2 - l2 / 2,
          y2,
          color.lane
        );
    }
    renderFog(0, y1, width, y2 - y1, fog);
  }

  function renderSprite(sprite, scale, destX, destY, offsetX, offsetY, clipY) {
    const destW = ((sprite.w * scale * width) / 2) * (spriteScaleBase * roadWidth);
    const destH = ((sprite.h * scale * width) / 2) * (spriteScaleBase * roadWidth);
    destX = destX + destW * (offsetX || 0);
    destY = destY + destH * (offsetY || 0);
    const clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;
    if (clipH < destH) {
      ctx.drawImage(
        sprite.img,
        0,
        0,
        sprite.img.width,
        sprite.img.height * (1 - clipH / destH),
        destX,
        destY,
        destW,
        destH - clipH
      );
    }
  }

  function playerSpriteFor(steer, updown) {
    const dir = keyLeft ? "left" : keyRight ? "right" : "";
    let name;
    if (updown > 0) name = "up" + dir;
    else name = dir || "straight";
    if (keySlower) name += "-brake";
    return sprites[name] || sprites.straight;
  }

  function renderPlayer(scale, destX, destY, updown, speedPercent) {
    const bounce =
      1.5 * Math.random() * speedPercent * resolution * Util.randomChoice([-1, 1]);
    const sprite = playerSpriteFor(0, updown);
    renderSprite(sprite, scale, destX, destY + bounce, -0.5, -1);
  }

  function render() {
    const baseSegment = findSegment(position);
    const basePercent = Util.percentRemaining(position, segmentLength);
    const playerSegment = findSegment(position + playerZ);
    const playerPercent = Util.percentRemaining(position + playerZ, segmentLength);
    const playerY = Util.interpolate(
      playerSegment.p1.world.y,
      playerSegment.p2.world.y,
      playerPercent
    );
    let maxy = height;
    let x = 0;
    let dx = -(baseSegment.curve * basePercent);

    ctx.clearRect(0, 0, width, height);
    renderBackground(bgOffset, playerY);

    for (let n = 0; n < drawDistance; n++) {
      const segment = segments[(baseSegment.index + n) % segments.length];
      segment.looped = segment.index < baseSegment.index;
      segment.fog = Util.exponentialFog(n / drawDistance, fogDensity);
      segment.clip = maxy;

      Util.project(
        segment.p1,
        playerX * roadWidth - x,
        playerY + cameraHeight,
        position - (segment.looped ? trackLength : 0),
        cameraDepth,
        width,
        height,
        roadWidth
      );
      Util.project(
        segment.p2,
        playerX * roadWidth - x - dx,
        playerY + cameraHeight,
        position - (segment.looped ? trackLength : 0),
        cameraDepth,
        width,
        height,
        roadWidth
      );

      x += dx;
      dx += segment.curve;

      if (
        segment.p1.camera.z <= cameraDepth ||
        segment.p2.screen.y >= segment.p1.screen.y ||
        segment.p2.screen.y >= maxy
      )
        continue;

      renderSegment(
        segment.p1.screen.x,
        segment.p1.screen.y,
        segment.p1.screen.w,
        segment.p2.screen.x,
        segment.p2.screen.y,
        segment.p2.screen.w,
        segment.fog,
        segment.color
      );

      maxy = segment.p2.screen.y;
    }

    for (let n = drawDistance - 1; n > 0; n--) {
      const segment = segments[(baseSegment.index + n) % segments.length];

      for (let i = 0; i < segment.cars.length; i++) {
        const car = segment.cars[i];
        const spriteScale = Util.interpolate(
          segment.p1.screen.scale,
          segment.p2.screen.scale,
          car.percent
        );
        const spriteX =
          Util.interpolate(
            segment.p1.screen.x,
            segment.p2.screen.x,
            car.percent
          ) + (spriteScale * car.offset * roadWidth * width) / 2;
        const spriteY = Util.interpolate(
          segment.p1.screen.y,
          segment.p2.screen.y,
          car.percent
        );
        renderSprite(car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
      }

      for (let i = 0; i < segment.sprites.length; i++) {
        const sprite = segment.sprites[i];
        const spriteScale = segment.p1.screen.scale;
        const spriteX =
          segment.p1.screen.x +
          (spriteScale * sprite.offset * roadWidth * width) / 2;
        const spriteY = segment.p1.screen.y;
        renderSprite(
          sprite.source,
          spriteScale,
          spriteX,
          spriteY,
          sprite.offset < 0 ? -1 : 0,
          -1,
          segment.clip
        );
      }

      if (segment === playerSegment) {
        const updown = playerSegment.p2.world.y - playerSegment.p1.world.y;
        renderPlayer(
          cameraDepth / playerZ,
          width / 2,
          height / 2 -
            ((cameraDepth / playerZ) *
              Util.interpolate(
                playerSegment.p1.camera.y,
                playerSegment.p2.camera.y,
                playerPercent
              ) *
              height) /
              2,
          updown,
          speed / maxSpeed
        );
      }
    }
  }

  // ---- loop -------------------------------------------------------------
  let last = Util.timestamp();
  let gdt = 0;
  let raf = null;
  let running = true;

  function frame() {
    if (!running) return;
    const now = Util.timestamp();
    const dt = Math.min(1, (now - last) / 1000);
    gdt += dt;
    while (gdt > step) {
      gdt -= step;
      update(step);
    }
    render();
    last = now;
    raf = requestAnimationFrame(frame);
  }

  // ---- input ------------------------------------------------------------
  function onKey(e, pressed) {
    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        keyLeft = pressed;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        keyRight = pressed;
        break;
      case "ArrowUp":
      case "w":
      case "W":
        keyFaster = pressed;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        keySlower = pressed;
        break;
      default:
        return;
    }
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
    )
      e.preventDefault();
    if (pressed && options.onFirstInput) options.onFirstInput();
  }

  const keydown = (e) => onKey(e, true);
  const keyup = (e) => onKey(e, false);

  // touch controls (optional)
  function setControl(name, pressed) {
    if (name === "left") keyLeft = pressed;
    if (name === "right") keyRight = pressed;
    if (name === "faster") keyFaster = pressed;
    if (name === "slower") keySlower = pressed;
    if (pressed && options.onFirstInput) options.onFirstInput();
  }

  // ---- boot -------------------------------------------------------------
  resetRoad();
  resetCars();
  if (hud.setLives) hud.setLives(lives);
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  raf = requestAnimationFrame(frame);

  return {
    setControl,
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    },
  };
}
