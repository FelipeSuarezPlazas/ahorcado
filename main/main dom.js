


// ------------------------------------------------------------------------ START MENU.


let menu = {
  menu: document.getElementById('menu'),
  title: document.getElementById('title'),
  start_button: document.getElementById('start-button'),
  timeout: null,

  setup: function() {
    this.start_button.onclick = this.__handleStartButtonClick.bind(this);
    this.restart()
  },
  restart: function(msgs) {
    /*
    this.title.innerHTML = msgs.title_msg;
    this.start_button.innerHTML = msgs.start_button_msg;*/

    this.title.innerHTML = 'MEMORISE';
    this.start_button.innerHTML = 'START';

    this.menu.style.zIndex = 10;
    this.menu.style.opacity = '1';
    this.start_button.disabled = false;

  },
  __handleStartButtonClick: function() {
    console.log('start button clicked');

    this.start_button.disabled = true;
    this.menu.style.opacity = '0';

    this.timeout = setTimeout(() => {

      this.menu.style.zIndex = -10;
      control.startGame();

    }, 1000);
  },
}


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
  setup: function() { // load all the images in the html.
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


// ------------------------------------------------------ HEARTS

let hearts = {
  setup: function() {

  },
  restart: function() {
    
  }
}


// ------------------------------------------------------ INPUT

let input = {
  setup: function() {

  },
  restart: function() {
    
  }
}


// ------------------------------------------------------ TRY BUTTON

let try_button {
  setup: function() {

  },
  restart: function() {
    
  }
}


// ------------------------------------------------------ FIELDS

let fields = {
  setup: function() {

  },
  restart: function() {
    
  }
}


// ------------------------------------------------------ DESCRIPTION

let description = {
  setup: function() {

  },
  restart: function() {
    
  }
}





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


let input_html;

let input_panel = {
  input_pos: createVector(MARGIN.x + images.image_size.x + 80, MARGIN.y + images.image_size.y - 60),
  button_pos: createVector(MARGIN.x + images.image_size.x + 80 + 70, MARGIN.y + images.image_size.y - 60 + 32),

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
  hide: function() {
    this.input.position(-500, -500);
    this.button.position(-500, -500);
  },
  show: function() {
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


// ------------------------------------------------------ WORD FILDS

const LETTER_SIZE = 40;
const FILD_SIZE = createVector(50, 5);
const FILD_MARGIN = 15;
const MARGIN_BETWEE_LETTER_AND_UNDERLINE = 5;

function letter(POS) {
  this.value = '';
  this.is_active = false;
  this.pos = POS.copy();
}

let filds = {
  graphics: createGraphics(windowWidth, windowHeight),
  states: {
    REPEATED: 'REPEATED',
    RIGHT: 'RIGHT',
    WRONG: 'WRONG',
    COMPLETED: 'COMPLETED',
  },

  start_pos: createVector(MARGIN.x, alert.pos.y + 150),
  size: createVector(50, 5),
  right_margin: 15,
  text_size: 30,
  text_bottom_margin: 5,

  inactive_color: color(0,0,0,50),
  active_color: 'black',
  inactive_text: 'A',

  tried_letters: '',
  marked_letters: '',
  letters: [],

  saved_word: '',

  center: 0, // for hint positioning.

  setup: function() {
    this.graphics.textAlign(CENTER, BOTTOM);
    this.graphics.textFont('Cursive');
    this.graphics.textSize(this.text_size);
  },
  restart: function(WORD) {
    this.tried_letters = '';
    this.right_letters = '';
    this.letters = [];

    this.saved_word = WORD // IMPROVE THIS LATER *************

    this.__drawUnderlines(WORD);
    this.__initLettersData(WORD);
    this.__drawLetters();
  },
  tryLetter: function(TRY_LETTER) {
    let actual_state = null;

    if (this.tried_letters.includes(TRY_LETTER)) { // REPETED LETTER
      actual_state = this.states.REPEATED; // ----- STATE REPEATED
    } else { // RIGHT OR WRONG?
      this.tried_letters += TRY_LETTER;

      for (const LETTER of this.letters) {
        if (LETTER.value == TRY_LETTER) {
          LETTER.is_active = true;

          this.right_letters += TRY_LETTER;

          actual_state = this.states.RIGHT; // ----- STATE RIGHT

          this.__drawLetters();
        }
      }

      if (actual_state == null) { // THE WORD DOESN'T INCLUDES THIS LETTER.
        actual_state = this.states.WRONG; // ----- STATE WRONG

      } else if(this.right_letters.length == selected_word.length) {
        actual_state = this.states.COMPLETED; // ----- STATE COMPLETED
      }
    }

    return actual_state;
  },
  autocomplete: function() {
    // a percentage of the word, appears completed.
  },
  __drawBackground: function() {
    this.graphics.push();
    this.graphics.fill('white');
    this.graphics.noStroke();
    this.graphics.rect(this.start_pos.x, this.start_pos.y - 50, 700, 60);
    this.graphics.pop();
  },
  __drawUnderlines: function(WORD) {
    this.graphics.fill('black');

    let actual_pos = this.start_pos.copy();
    for (const LETTER of WORD) {
      this.graphics.rect(actual_pos.x, actual_pos.y, this.size.x, this.size.y, 20);

      actual_pos.add(this.size.x + this.right_margin, 0, 0);
    }
    this.center = ((actual_pos.x - FILD_MARGIN - this.start_pos.x) / 2) + this.start_pos.x;
  },
  __initLettersData: function(WORD) {
    let actual_pos = this.start_pos.copy();
    for (const WORD_LETTER of WORD) {
      const LETTER_POS = createVector(actual_pos.x + (this.size.x/2), this.start_pos.y - this.text_bottom_margin);
      const LETTER = new letter(LETTER_POS);
      LETTER.value = WORD_LETTER;
      this.letters.push(LETTER);

      actual_pos.add(this.size.x + this.right_margin, 0, 0);
    }
  },
  __drawLetters: function() {
    // esta se ejecuta cada vez que se añade una nueva letra.
    // ----------------- VOLVER A DIBUJAR BACKGROUND ATRAS.
    this.__drawBackground();
    this.__drawUnderlines(this.saved_word);

    for (const LETTER of this.letters) {
      let text;
      
      if (LETTER.is_active) {
        this.graphics.fill(this.active_color);
        text = LETTER.value;
      } else {
        this.graphics.fill(this.inactive_color);
        text = this.inactive_text;
      }

      this.graphics.text(text, LETTER.pos.x, LETTER.pos.y);
      console.log(text, LETTER.pos.x, LETTER.pos.y, 'LOOK AT THISSSS')
    }

    image(this.graphics,0,0);
  },
}


// ------------------------------------------------------ WORD HINT

let hint = {
  graphics: createGraphics(windowWidth, windowHeight),
  pos: createVector(0, filds.start_pos.y + 15), // setup
  restart: function(WORD_DESCRIPTION) {
    this.graphics.clear();


    this.graphics.textAlign(CENTER, TOP);
    this.graphics.rectMode(CENTER);

    this.__drawBackground();

    //this.graphics.textSize(10);
    this.graphics.fill('black');
    this.graphics.text('HINT: ' + WORD_DESCRIPTION, filds.center, this.pos.y);

    image(hint.graphics, 0, 0);
  },
  __drawBackground: function() {
    this.graphics.push();
    this.graphics.fill('white');
    this.graphics.noStroke();
    this.graphics.rect(filds.center, this.pos.y+3, 900, 20);
    this.graphics.pop();
  },
  /*
  tengo un canvas solo para esta descripcion, pero puedo acomodarla justo en la mitad de la palabra.
  */
}


// ------------------------------------------------------ GENERALS


let selected_word = '';
let actual_letter = '';

let CANVAS_SIZE = createVector(windowWidth, windowHeight);


// -------------------------------------------------------------- FUNCTIONS.

function setup() {
  let CNV = createCanvas(CANVAS_SIZE.x, CANVAS_SIZE.y);
  CNV.parent('canva-game');

  background('white');

  images.setup();
  results_panel.setup();
  input_panel.setup();
  filds.setup();

  restart();
}

function restart() {
  selected_word = random(words);
  

  images.restart();
  lives.restart();
  alert.restart();
  results_panel.restart();
  input_panel.show();
  filds.restart(selected_word);
  hint.restart(DESCRIPTIONS[selected_word.toLowerCase()]);
}

function onTryBttn() {
  if (actual_letter == '') return;

  input_html.value = '';

  if (filds.used_letters.includes(actual_letter)) { // REPEATED LETTER
    //titilar las letras anteriormente puestas con color gris.
    console.log('YOU ALREADY TRIED THIS LETTER');
    alert.repeated(actual_letter);

  } else if (selected_word.includes(actual_letter)) { // RIGHT LETTER.
    filds.fill(actual_letter); // *** hacer

    if (filds.marked_letters.length == selected_word.length) {
      //mostrar pantalla de YOU WIN.
      //deshabilitar el input.
      input_panel.hide();
      results_panel.draw(1);
    }
    alert.right(actual_letter);
    
  } else { // WRONG LETTER

    images.next();

    alert.wrong(actual_letter);

    lives.decrease();
    console.log(lives.counter, 'TURNS INFO');
    if (lives.counter < lives.limit) {
      //titilar la pantalla en rojo.
      console.log(selected_word, 'doesnt contains: ' + actual_letter);

    } else { // GAME OVER
      console.log('SE ACABARON LOS TURNOS');
      //deshabilitar el input.
      input_panel.hide();
      alert.hide();
      results_panel.draw(0);
    }
  }

  filds.addLetter(actual_letter);

  actual_letter = '';
}

function onTryBttn() {
  if (actual_letter == '') return;
  input_html.value = '';

  const FILDS_STATE = filds.tryLetter(actual_letter);

  if (FILDS_STATE == filds.states.REPEATED) {
    console.log('YOU ALREADY TRIED THIS LETTER');
    alert.repeated(actual_letter);

  } else if(FILDS_STATE == filds.states.RIGHT) {
    alert.right(actual_letter);

  } else if(FILDS_STATE == filds.states.WRONG) {
    images.next();
    alert.wrong(actual_letter);
    const LIVES_STATE = lives.decrease();

    if(LIVES_STATE == lives.states.DEAD) { // GAME OVER
      //deshabilitar el input.
      alert.hide();
      input_panel.hide();
      results_panel.draw(0);
    }

  } else if(FILDS_STATE == filds.states.COMPLETED) {
    alert.hide();
    input_panel.hide();
    results_panel.draw(1);
  }

  

  // ACTUALIZAR ESTO EN FILDS. ***********************************
  //filds.addLetter(actual_letter);

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

















