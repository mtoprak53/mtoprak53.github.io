window.onload = () => {

  /** ELEMENTS ON THE SCREEN */
  const 
      background = document.getElementById("background"),
      scoreLbl = document.getElementById("score"),
      linesLbl = document.getElementById("lines"),
      canvas = document.getElementById("game-canvas"),
      nextCanvas = document.getElementById("next-canvas"),
      ctx = canvas.getContext("2d");
      ctxNext = nextCanvas.getContext("2d");

  /** TETROMINO CLASS */
  class Tetromino {
    static COLORS = ["blue", "green", "yellow", "red", "orange", "light-blue", "purple"]; 
    static BLOCK_SIZE = 28;
    static DELAY = 400;
    static DELAY_INCREASED = 5;

    constructor(xs, ys, color = null) {
      this.x = xs;
      this.y = ys;
      this.length = xs.length;
      if(color !== null) {
        this.color = color;
        this.img = new Image();
        this.img.src = `resources/${Tetromino.COLORS[color]}.jpg`
      }
    }

    /** METHOD-1 */
    update(updFunc) {
      for (let i=0; i < this.length; ++i) {
        ctx.clearRect(
          this.x[i] * Tetromino.BLOCK_SIZE,
          this.y[i] * Tetromino.BLOCK_SIZE,
          Tetromino.BLOCK_SIZE,
          Tetromino.BLOCK_SIZE
        );
        updFunc(i);
      }
      this.draw();
    }

    /** METHOD-2 */
    draw() {
      if (!this.img.complete) {
        this.img.onload = () => this.draw();
        return;
      }
      // Print the current tetromine
      for (let i=0; i < this.length; ++i) {
        ctx.drawImage(
          this.img,
          this.x[i] * Tetromino.BLOCK_SIZE,
          this.y[i] * Tetromino.BLOCK_SIZE,
          Tetromino.BLOCK_SIZE,
          Tetromino.BLOCK_SIZE
        );
      }
    }

    /** METHOD-2B */
    drawNext() {
      if (!this.img.complete) {
        this.img.onload = () => this.drawNext();
        return;
      }
      // Print the next tetromine
      for (let i=0; i < this.length; ++i) {
        ctxNext.drawImage(
          this.img,
          this.x[i] * Tetromino.BLOCK_SIZE,
          this.y[i] * Tetromino.BLOCK_SIZE,
          Tetromino.BLOCK_SIZE,
          Tetromino.BLOCK_SIZE
        );
      }
    }

    /** METHOD-3 */
    collides(checkFunc) {
      for (let i=0; i < this.length; ++i) {
        const {x, y} = checkFunc(i);
        if (x < 0 || x >= FIELD_WIDTH || y < 0 || y >= FIELD_HEIGHT || FIELD[y][x] !== false)
          return true;
      }
      return false;
    }

    //** METHOD-4 */
    merge() {
      for (let i=0; i < this.length; ++i) {
        FIELD[this.y[i]][this.x[i]] = this.color;
      }
    }

    //** METHOD-5 */
    rotate() {
      const 
        maxX = Math.max(...this.x),
        minX = Math.min(...this.x),
        minY = Math.min(...this.y),
        nx = [],
        ny = [];
      
      if (!this.collides(i => {
        nx.push(maxX + minY - tetromino.y[i]);
        ny.push(tetromino.x[i] - minX + minY);
        return { x: nx[i], y: ny[i] };
      })) {
        this.update(i => {
          this.x[i] = nx[i];
          this.y[i] = ny[i];
        });
      }
    }
  }

  /** GLOBAL CONSTANTS */
  const 
    FIELD_WIDTH = 10,
    FIELD_HEIGHT = 20,
    FIELD = Array.from({ length: FIELD_HEIGHT }),
    MIN_VALID_ROW = 4, 
    TETROMINOES = [
      new Tetromino([0, 0, 0, 0], [0, 1, 2, 3]),  // stick
      new Tetromino([0, 0, 1, 1], [0, 1, 0, 1]),  // square
      new Tetromino([0, 1, 1, 1], [0, 0, 1, 2]),  // L-1
      new Tetromino([0, 0, 0, 1], [0, 1, 2, 0]),  // L-2
      new Tetromino([0, 1, 1, 2], [0, 0, 1, 1]),  // S-1
      new Tetromino([0, 1, 1, 2], [1, 1, 0, 1]),  // T
      new Tetromino([0, 1, 1, 2], [1, 1, 0, 0])   // S-2
    ];
  
  /** GLOBAL VARIABLES */
  let tetromino = null,
    nextTetromino = null,
    delay, 
    score, 
    lines,
    isFreezed;  

  /** SETUP */
  (function setup() {
    canvas.style.top = Tetromino.BLOCK_SIZE;
    canvas.style.left = Tetromino.BLOCK_SIZE;

    ctx.canvas.width = FIELD_WIDTH * Tetromino.BLOCK_SIZE;
    ctx.canvas.height = FIELD_HEIGHT * Tetromino.BLOCK_SIZE;

    // Scale background
    const scale = Tetromino.BLOCK_SIZE / 13.83333333333;
    background.style.width = scale * 166;
    background.style.height = scale * 304;

    // Offset each block to the middle of the table width
    const middle = Math.floor(FIELD_WIDTH / 2);
    for (const t of TETROMINOES) t.x = t.x.map(x => x + middle);

    reset();
    draw();
  })();

  /** RESET */
  function reset() {

    // Make false all blocks
    FIELD.forEach((_, y) => FIELD[y] = Array.from({ length: FIELD_WIDTH }).map(_ => false));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    delay = Tetromino.DELAY;
    score = 0;
    lines = 0, 
    isFreezed = false;
  }

  /** DRAW */
  function draw() {
    if (tetromino) {

      // Collision?
      if (tetromino.collides(i => ({ x: tetromino.x[i], y: tetromino.y[i] + 1 }))) {
        tetromino.merge();

        // Prepare for new tetromino
        tetromino = null;

        // Check for completed rows
        let completedRows = 0;
        for (let y = FIELD_HEIGHT - 1; y >= MIN_VALID_ROW; --y)
          if (FIELD[y].every(e => e !== false)) {
            for (let ay = y; ay >= MIN_VALID_ROW; --ay)
              FIELD[ay] = [...FIELD[ay - 1]];

            ++completedRows;
            // Keep the same row
            ++y;
          }

        if (completedRows) {

          // Print the table again
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let y = MIN_VALID_ROW; y < FIELD_HEIGHT; ++y) {
            for (let x = 0; x < FIELD_WIDTH; ++x) {
              if (FIELD[y][x] !== false) {
                new Tetromino([x], [y], FIELD[y][x]).draw();
              }
            }
          }
          score += [40, 100, 300, 1200][completedRows - 1];
          lines += completedRows;
        } else {

          // Check if the player lost
          if (FIELD[MIN_VALID_ROW - 1].some(block => block !== false)) {
            alert("You have lost!");
            reset();
          }
        }

      } else 
          tetromino.update(i => ++tetromino.y[i]);
    }

    // No tetromino falling
    else {

      scoreLbl.innerText = score;
      linesLbl.innerText = lines;

      // Create random tetromino
      if (nextTetromino) {
        tetromino = nextTetromino;
      } else {
        let randomNum = Math.floor(Math.random() * (TETROMINOES.length));
        tetromino = ( ({x, y}, color) => 
          new Tetromino([...x], [...y], color)
        )(
          TETROMINOES[randomNum], randomNum
        );  
        tetromino.draw();
      }
      let randomNum = Math.floor(Math.random() * (TETROMINOES.length));
      nextTetromino = ( ({x, y}, color) => 
        new Tetromino([...x], [...y], color)
      )(
        TETROMINOES[randomNum], randomNum
      );

      console.log(nextTetromino);
      ctxNext.clearRect(0, 0, Tetromino.BLOCK_SIZE * 8, Tetromino.BLOCK_SIZE * 5);
      nextTetromino.drawNext();

    }
    
    // Pause the game
    if (isFreezed) {
      alert("Game paused!");
      isFreezed = !isFreezed;
    }

    setTimeout(draw, delay);
  }

  /** KEYBOARD CONTROLS */ 
  window.onkeydown = event => {
    switch (event.key) {
      case "ArrowLeft":
        if (!tetromino.collides(i => ({ x: tetromino.x[i] - 1, y: tetromino.y[i] })))
          tetromino.update(i => --tetromino.x[i]);
        break;
      case "ArrowRight":
        if (!tetromino.collides(i => ({ x: tetromino.x[i] + 1, y: tetromino.y[i] })))
          tetromino.update(i => ++tetromino.x[i]);
        break;
      case "ArrowDown":
        delay = Tetromino.DELAY / Tetromino.DELAY_INCREASED;
        break;
      case " ":
        tetromino.rotate();
        break;
      case "p":
        isFreezed = !isFreezed;
        break;
    }
  }

  window.onkeyup = event => {
    if (event.key === "ArrowDown")
      delay = Tetromino.DELAY;
  }

}