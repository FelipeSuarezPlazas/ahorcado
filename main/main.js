

// -------------------------------------------------------------- ALPHABET SOUP.

new p5();

// -------------------------------------------------------------- VARS.



/* TODO:

Show alert 'the word doesn't contains the letter: 'A'.

Animate the image to fall from the sky.


*/




const MARGIN = createVector(50, 60);

const DESCRIPTIONS = {
  'bubble': 'A ball formed of air surrounded by liquid that floats in the air.', 
  'business': 'The activity of buying and selling goods and services.', 
  'success': 'The achieving of the results wanted or hoped for.',
  'common': 'The same in a lot of places or for a lot of people.',
  'yellow': 'A colour like lemon or gold or the sun.',
  'address': 'The number of the place where a person lives or works.',
}

let words = Object.keys(DESCRIPTIONS);
words = words.map(word => word.toUpperCase());


// ------------------------------------------------------ IMAGES

let images = {
  image_size: createVector(350, 350),
  show_pos: MARGIN.copy(),
  hide_pos: createVector(-550, MARGIN.y),
  actual_index: 0,
  files: [
    '../imgs/1.jpg',
    '../imgs/2.jpg',
    '../imgs/3.jpg',
    '../imgs/4.jpg',
    '../imgs/5.jpg',
    '../imgs/6.jpg',
  ],
  images: [],
  load: function() { // load all the images in the html.
    this.files.forEach((FILE, INDEX) => {
      img = createImg(FILE, ('hangman' + INDEX));
      img.size(this.image_size.x, this.image_size.y);
      img.position(this.hide_pos.x, this.hide_pos.y);

      this.images.push(img);
    });
  },
  restart: function() {
    this.images.forEach((IMG, INDEX) => {
      IMG.position(this.hide_pos.x, this.hide_pos.y);
      if (INDEX == 0) {
        IMG.position(this.show_pos.x, this.show_pos.y);
      }
    })

    this.actual_index = 0;
  },
  next: function() {
    this.actual_index += 1;
    const IMG = this.images[this.actual_index];
    IMG.position(this.show_pos.x, this.show_pos.y);
  }
}


// ------------------------------------------------------ INPUT PANEL


let input_html;

let input_panel = {
  p_pos: createVector(MARGIN.x + images.image_size.x + 80 + 70, MARGIN.y + images.image_size.y - 60 - 17), // 40
  input_pos: createVector(MARGIN.x + images.image_size.x + 80, MARGIN.y + images.image_size.y - 60),
  button_pos: createVector(MARGIN.x + images.image_size.x + 80 + 70, MARGIN.y + images.image_size.y - 60 + 32),

  p: createP('Try a letter you think the word may contain.'),
  input: createInput(''),
  button: createButton('TRY LETTER'),

  setup: function() {
    this.button.mousePressed(onTryBttn);


    this.input.size(50, 50);
    this.input.input(inputManager);
    const input_id = 'game_input';
    this.input.id(input_id);

    input_html = document.getElementById(input_id);

    input_html.focus();
  },
  wrong: function(LETTER) {
    this.p.html("The word doesn't contains " + "'" + LETTER + "' letters. TRY ANOTHER.");
    this.p.style('color', 'red');
  },
  right: function(LETTER) {
    this.p.html("Good! The word contains " + "'" + LETTER + "' letters. NOW TRY ANOTHER.");
    this.p.style('color', 'blue');
  },
  repeated: function(LETTER) {
    this.p.html("You already tried letter: " + "'" + LETTER + "'. TRY ANOTHER.");
    this.p.style('color', 'grey');
  },
  hide: function() {
    this.p.position(-500, -500);
    this.input.position(-500, -500);
    this.button.position(-500, -500);
  },
  show: function() {
    this.p.html('Try a letter you think the word may contain.');
    this.p.style('color', 'black');

    this.p.position(this.p_pos.x, this.p_pos.y);
    this.input.position(this.input_pos.x, this.input_pos.y);
    this.button.position(this.button_pos.x, this.button_pos.y);
  }
}


function inputManager() {
  let word = this.value();
  if (word.length == 0) {
    word = '';
  } else {
    word = word[word.length-1].toUpperCase();
  }

  this.value(word);
  actual_letter = word;

  console.log(this.value());
}


// ------------------------------------------------------ RESULTS PANEL

let restart_bttn = createButton('RESTART');
restart_bttn.mousePressed(restart);

let results_panel = {
  p_result_pos: createVector(MARGIN.x + images.image_size.x + 50, MARGIN.y + images.image_size.y - 110),
  p_subtitle_pos: createVector(MARGIN.x + images.image_size.x + 50, MARGIN.y + images.image_size.y - 50),
  button_pos: createVector(MARGIN.x + images.image_size.x + 50, MARGIN.y + images.image_size.y - 60 + 55),

  p_result: createElement('h3'),
  p_subtitle: createP('The word was: '),
  button: restart_bttn,
  hide: function() {
    this.p_result.position(-500, -500);
    this.p_subtitle.position(-500, -500);
    this.button.position(-500, -500);
  },
  show: function(RESUTL, WORD) {
    this.p_result.style('font-size', '30px');
    if (RESUTL == 0) {
      // GAME OVER
      this.p_result.style('color', 'red');
      this.p_result.html('GAME OVER');
      this.button.html('TRY AGAIN');
    } else {
      // YOU WIN
      this.p_result.style('color', 'blue');
      this.p_result.html('YOU WIN');
      this.button.html('NEXT LEVEL');
    }

    this.p_subtitle.html('The word was: ' + WORD);

    console.log(RESUTL, WORD, 'FILL PARAMETERS');

    this.p_result.position(this.p_result_pos.x, this.p_result_pos.y);
    this.p_subtitle.position(this.p_subtitle_pos.x, this.p_subtitle_pos.y);
    this.button.position(this.button_pos.x, this.button_pos.y);
  }
}


// ------------------------------------------------------ WORD FILDS

const LETTER_SIZE = 40;
const FILD_SIZE = 60;
const FILD_MARGIN = 20;
const MARGIN_BETWEE_LETTER_AND_UNDERLINE = 10;

function letterFild(LETTER, POS) {
  this.letter = LETTER;
  this.is_empty =  true;
  this.underline = {x: POS.x, y: POS.y, width: FILD_SIZE, height: 5};
  this.letter_pos = createVector(
    POS.x + (FILD_SIZE/2),
    POS.y - MARGIN_BETWEE_LETTER_AND_UNDERLINE,
  );
}

let word_filds = {
  init_pos: createVector(MARGIN.x + images.image_size.x + 15, MARGIN.y + (images.image_size.y/2) - 10),
  center: 0,
  used_letters: '',
  marked_letters: '',
  filds: [],
  setFilds: function(WORD) {
    let actual_pos = this.init_pos.copy();

    for (let LETTER of WORD) {
      const LETTER_FILD = new letterFild(LETTER, actual_pos);

      actual_pos.add((FILD_SIZE + FILD_MARGIN), 0, 0);
      this.filds.push(LETTER_FILD);
    }

    this.center = ((actual_pos.x - FILD_MARGIN - this.init_pos.x) / 2) + this.init_pos.x;
  },
  drawFilds: function() {
    textAlign(CENTER, BOTTOM);
    textSize(30);
    fill('black');

    for (const FILD of this.filds) {
      rect(FILD.underline.x, FILD.underline.y, 
        FILD.underline.width, FILD.underline.height, 20);

      //text(FILD.letter, FILD.letter_pos.x, FILD.letter_pos.y);
    }
  },
  fill: function(LETTER) {
    // se pasa una letra y hay que dibujarla en los campos que la contienen.
    for (const FILD of this.filds) {
      if (FILD.letter == LETTER) {
        text(FILD.letter, FILD.letter_pos.x, FILD.letter_pos.y);
        //this.used_letters += LETTER;
        this.marked_letters += LETTER;
      }
    }
  },
  addLetter: function(LETTER) {
    this.used_letters += LETTER;
  },
  restart: function() {
    this.marked_letters = '';
    this.used_letters = '';
    this.filds = [];
  },
  autocomplete: function() {
    // a percentage of the word, appears completed.
  }
}


// ------------------------------------------------------ LIVES

let lives = {
  counter: 0,
  limit: images.files.length - 1, 
  //pos: createVector(MARGIN.x + (images.image_size.x/2),MARGIN.y + images.image_size.y), // middle wrong
  //pos: createVector(MARGIN.x + 20, MARGIN.y + images.image_size.y), // left
  pos: createVector(MARGIN.x + images.image_size.x + 50, MARGIN.y + 30), // title bottom

  p: createP('lives: '),
  decrease: function() {
    this.counter++;
    this.p.html('Lives: ' + (this.limit - this.counter));

  },
  restart: function() {
    this.p.position(this.pos.x, this.pos.y);
    this.p.html('Lives: ' + this.limit);
    this.p.style('color', 'blue');
    this.p.style('font-size', '20px');
    this.counter = 0;
  },
  hide: function() {
    this.p.position(-600, -600);
  }
}

// ------------------------------------------------------ WORD HINT

let hint = {
  graphics: createGraphics(windowWidth, windowHeight),
  pos: createVector(0, MARGIN.y + (images.image_size.y/2) + 10), // here goes the word description.
  draw: function(WORD_DESCRIPTION) {
    this.graphics.clear();
    this.graphics.textAlign(CENTER, TOP);
    //this.graphics.textSize(10);
    this.graphics.text('HINT: ' + WORD_DESCRIPTION, word_filds.center, this.pos.y);
    image(hint.graphics, 0, 0);
  }
  /*
  tengo un canvas solo para esta descripcion, pero puedo acomodarla justo en la mitad de la palabra.
  */
}

// ------------------------------------------------------ ALERTS


let alert = {
  pos: createVector(input_panel.input_pos.x, input_panel.input_pos.y + 40), // red
  p: createP("The word doesn't contains the letter: "),
  restart: function() { // ******************* FALTA IMPLEMENTAR *******
    this.p.position(this.pos.x, this.pos.y);
    this.p.html('Lives: ' + this.limit);
    this.counter = 0;
  }
}


// ------------------------------------------------------ HEADER


let header = {
  pos: createVector(MARGIN.x + images.image_size.x + 50, MARGIN.y), // red
  h: createSpan('COMPLETE THE WORD. SAVE THE MAN.'),
  show: function() {
    this.h.position(this.pos.x, this.pos.y);
  }
}


// ------------------------------------------------------ GENERALS


input_panel.show();
results_panel.hide();

let TURNS_LIMIT = images.files.length - 1;

let selected_word = '';
let actual_letter = '';

let CANVAS_SIZE = createVector(windowWidth, windowHeight);


// -------------------------------------------------------------- FUNCTIONS.

function setup() {
  let CNV = createCanvas(CANVAS_SIZE.x, CANVAS_SIZE.y);
  CNV.parent('canva-game');

  background('white');

  images.load();
  header.show();

  input_panel.setup();

  angleMode(DEGREES);
  frameRate(30);
  restart();
}

function restart() {
  clear();

  word_filds.restart();
  word_filds.autocomplete(); // ***** IMPLEMENTAR ****

  results_panel.hide();
  input_panel.show();
  images.restart();
  lives.restart();

  // *** IMPLEMENTAR 
  /*
  alert.
  */

  selected_word = random(words);


  word_filds.setFilds(selected_word);
  word_filds.drawFilds();
  
  hint.draw(DESCRIPTIONS[selected_word.toLowerCase()]);
}

function onTryBttn() {
  if (actual_letter == '') return;

  input_html.value = '';

  if (word_filds.used_letters.includes(actual_letter)) {
    //titilar las letras anteriormente puestas con color gris.
    console.log('YOU ALREADY TRIED THIS LETTER');
    input_panel.repeated(actual_letter);

  } else if (selected_word.includes(actual_letter)) { // la palabra tiene la letra seleccionada.
    word_filds.fill(actual_letter); // *** hacer

    if (word_filds.marked_letters.length == selected_word.length) {
      //mostrar pantalla de YOU WIN.
      //deshabilitar el input.
      input_panel.hide();
      lives.hide();
      results_panel.show(1, selected_word);
    }
    input_panel.right(actual_letter);
    
  } else { // la palabra no tiene la letra seleccionada.

    images.next();

    input_panel.wrong(actual_letter);

    lives.decrease();
    console.log(lives.counter, TURNS_LIMIT, 'TURNS INFO');
    if (lives.counter < lives.limit) {
      //titilar la pantalla en rojo.
      console.log(selected_word, 'doesnt contains: ' + actual_letter);

    } else { // se gastó el ultimo turno.
      console.log('SE ACABARON LOS TURNOS');
      //deshabilitar el input.
      input_panel.hide();
      lives.hide();
      results_panel.show(0, selected_word);
    }
  }

  word_filds.addLetter(actual_letter);

  actual_letter = '';
}



// ------------------------------------------------------ MOUSE CLICKS



function mousePressed() {
  //input_panel.hide();
  //results_panel.show();
}

function mouseReleased() {
  //input_panel.show();
  //results_panel.hide();
  input_html.focus();
}

















