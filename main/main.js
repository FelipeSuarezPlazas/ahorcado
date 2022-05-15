

// -------------------------------------------------------------- ALPHABET SOUP.

new p5();

// -------------------------------------------------------------- VARS.



/* TODO:

Show alert 'the word doesn't contains the letter: 'A'.

Animate the image to fall from the sky.


*/




const MARGIN = createVector(50, 60);

const DESCRIPTIONS = {
  'table': 'Where people eat', 
  'airport': 'Where planes are', 
  'baseball': 'Sport of hitting a ball with a wooden stick', 
  'inside': 'It has something outside and...',
}

let words = Object.keys(DESCRIPTIONS);
words = words.map(word => word.toUpperCase());


// ------------------------------------------------------ IMAGES

let images = {
  image_size: createVector(350, 350),
  show_pos: MARGIN.copy(),
  hide_pos: createVector(-350, MARGIN.y),
  actual_index: 0,
  files: [
    '../imgs/image1.jpg',
    '../imgs/image2.jpg',
    '../imgs/image3.jpg',
    '../imgs/image4.jpg',
    '../imgs/image5.jpg',
    '../imgs/image6.jpg',
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

//let p = createP('Insert letters to complete the word.');

let input = createInput('');
input.size(50, 50);
input.input(inputManager);
const input_id = 'game_input';
input.id(input_id);

const input_html = document.getElementById(input_id);
input_html.focus();

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

let try_bttn = createButton('TRY LETTER');
try_bttn.mousePressed(onTryBttn);

let input_panel = {
  //p_pos: createVector(MARGIN.x + images.image_size.x + 60 + 70, 150 - 10), // 40
  input_pos: createVector(MARGIN.x + images.image_size.x + 60, 150),
  button_pos: createVector(MARGIN.x + images.image_size.x + 60 + 70, 150 + 30),
  //p: p,
  input: input,
  button: try_bttn,
  hide: function() {
    //this.p.position(-500, -500);
    this.input.position(-500, -500);
    this.button.position(-500, -500);
  },
  show: function() {
    //this.p.position(this.p_pos.x, this.p_pos.y);
    this.input.position(this.input_pos.x, this.input_pos.y);
    this.button.position(this.button_pos.x, this.button_pos.y);
  }
}



// ------------------------------------------------------ RESULTS PANEL

let restart_bttn = createButton('RESTART');
restart_bttn.mousePressed(restart);

let results_panel = {
  p_result_pos: createVector(MARGIN.x + images.image_size.x + 60, 150),
  p_subtitle_pos: createVector(MARGIN.x + images.image_size.x + 60, 150 + 40),
  button_pos: createVector(MARGIN.x + images.image_size.x + 60, 150 + 80),

  p_result: createP(''),
  p_subtitle: createP('The word was: '),
  button: restart_bttn,
  hide: function() {
    this.p_result.position(-500, -500);
    this.p_subtitle.position(-500, -500);
    this.button.position(-500, -500);
  },
  show: function(RESUTL, BUTTON_TEXT, WORD) {
    this.p_result.html(RESUTL);
    this.p_subtitle.html('The word was: ' + WORD);
    this.button.html(BUTTON_TEXT);

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
  init_pos: createVector(MARGIN.x + images.image_size.x + 15, MARGIN.y + images.image_size.y - 45),
  center: 0,
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
        FILD.underline.width, FILD.underline.height);

      //text(FILD.letter, FILD.letter_pos.x, FILD.letter_pos.y);
    }
  },
  fill: function(LETTER) {
    // se pasa una letra y hay que dibujarla en los campos que la contienen.
    for (const FILD of this.filds) {
      if (FILD.letter == LETTER) {
        text(FILD.letter, FILD.letter_pos.x, FILD.letter_pos.y);
        this.marked_letters += LETTER;
      }
    }
  },
  restart: function() {
    this.marked_letters = '';
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
  //pos: createVector(MARGIN.x + (images.image_size.x/2),MARGIN.y + images.image_size.y),
  pos: createVector(MARGIN.x + images.image_size.x + 60 + 70, 150 - 10),
  p: createP('lives: '),
  decrease: function() {
    this.counter++;
    this.p.html('Lives: ' + (this.limit - this.counter));

  },
  restart: function() {
    this.p.position(this.pos.x, this.pos.y);
    this.p.html('Lives: ' + this.limit);
    this.counter = 0;
  },
  hide: function() {
    this.p.position(-600, -600);
  }
}

// ------------------------------------------------------ WORD HINT

let hint = {
  pos: createVector(0, images.image_size.y + 35), // here goes the word description.
  p: createP(),
  graphics: createGraphics(windowWidth, windowHeight),
  set: function(WORD_DESCRIPTION) {
    this.graphics.textAlign(CENTER, TOP);
    this.graphics.clear();
    this.graphics.text('HINT: ' + WORD_DESCRIPTION, word_filds.center, this.pos.y);
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
  pos: createVector(MARGIN.x + images.image_size.x + 30, MARGIN.y), // red
  h: createElement('h3', 'HANGMAN: Complete the word by guessing the letters.'),
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
  
  hint.set(DESCRIPTIONS[selected_word.toLowerCase()]);
}

function draw() {

}

function onTryBttn() {
  if (actual_letter == '') return;

  input_html.value = '';
  
  if (selected_word.includes(actual_letter)) { // la palabra tiene la letra seleccionada.

    if (word_filds.marked_letters.includes(actual_letter)) { // esta intentado una letra ya marcada antes
      //titilar las letras anteriormente puestas con color gris.
      console.log('YOU ALREADY TRIED THIS LETTER');

    } else { // es la primera vez, asi que esta muy bien.
      //titilar los espacios vacios con color verde.
      //rellenar los espacios con la nueva letra.

      word_filds.fill(actual_letter); // *** hacer

      if (word_filds.marked_letters.length == selected_word.length) {
        //mostrar pantalla de YOU WIN.
        //deshabilitar el input.
        input_panel.hide();
        lives.hide();
        results_panel.show('YOU WIN', 'NEXT LEVEL', selected_word);
      }
    }
  } else { // la palabra no tiene la letra seleccionada.

    images.next();

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
      results_panel.show('GAME OVER', 'TRY AGAIN', selected_word);
    }
  }

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

function draw() {
  image(hint.graphics, 0, 0);
}

















