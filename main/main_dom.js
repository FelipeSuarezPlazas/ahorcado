


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

    this.title.innerHTML = 'HANGMAN';
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
  container: document.getElementById('images'),
  files: [
    '../imgs/1.jpg',
    '../imgs/2.jpg',
    '../imgs/3.jpg',
    '../imgs/4.jpg',
    '../imgs/5.jpg',
    '../imgs/6.jpg',
  ],
  images: [],
  counter: 1,

  setup: function() { // load all the images in the html.
    this.files.forEach((FILE, INDEX) => {
      const IMG = document.createElement('img');
      IMG.setAttribute('class', 'image');
      IMG.setAttribute('src', FILE);
      
      this.images.push(IMG);
      this.container.appendChild(IMG);
    });

    this.restart();
  },
  restart: function() {
    this.counter = 1;

    this.images.forEach((IMG, INDEX) => {
      if (INDEX > 0) {
        IMG.style.opacity = 0;
      }
    });
  },
  next: function() {
    console.log('NEXT IMAGE FUNCTION');
    /*
    this.actual_index += 1;
    const IMG = this.images[this.actual_index];
    IMG.position(this.show_pos.x, this.show_pos.y);
    */
    if (this.counter >= this.files.length) return;


    const IMG = this.images[this.counter];
    IMG.style.opacity = 1;

    this.counter += 1;
    if (this.counter >= this.amount-1) {
      control.finish();
    }
  }
}


// ------------------------------------------------------ HEARTS

let hearts = {
  container: document.getElementById('hearts'),
  amount: images.files.length - 1,
  hearts: [],
  counter: 0,

  setup: function() {
    for (let i=0; i<this.amount; i++) {
      const HEART = document.createElement('div');
      HEART.setAttribute('class', 'heart');
      this.hearts.push(HEART);
      this.container.appendChild(HEART);

    }
    this.restart();
  },
  restart: function() {
    this.counter = 0;
    for (const HEART of this.hearts) {
      HEART.style.background = '#eee';
    }
  },
  damage: function() {
    console.log('HEART DAMAGE FUNCTION');
    const HEART = this.hearts[this.counter];
    HEART.style.background = 'red';

    this.counter += 1;
    if (this.counter >= this.amount) {
      control.finish();
    }
  },
}


// ------------------------------------------------------ INPUT

let input = {
  input: document.getElementById('input-letter'),
  button: document.getElementById('try-button'),
  value: null,

  setup: function() {
    console.log('INPUT SETUP');
    this.input.focus();
    this.input.oninput = this.__onInput.bind(this);
    this.input.onchange = this.__onSubmit.bind(this);
    this.button.onclick = this.__onSubmit.bind(this);
  },
  restart: function() {
    this.enable();
  },
  __onInput: function(event) {
    console.log('ON CHANGE');
    let value = event.data;
    if (value == null) { value = '';
    } else { value = value.toUpperCase();}

    this.input.value = value;
    this.value = value;
  },
  __onSubmit: function(event) {
    console.log('INPUT SUBMIT', event);

    if (this.value != null && this.value.length == 1) {
      control.submitLetter(this.value);
      this.value = '';
      this.input.value = this.value;
    }
  },
  disable: function() {
    this.input.disabled = true;
    this.button.disabled = true;
  },
  enable: function() {
    this.input.disabled = false;
    this.button.disabled = false;
  },
}

// ------------------------------------------------------ FIELDS

class Field {
  constructor(VALUE, PARENT) {
    const DIV = document.createElement('div');
    DIV.classList.add('field');
    PARENT.appendChild(DIV); 

    const LETTER = document.createElement('p');
    //LETTER.style.textDecoration = '4px underline solid';
    LETTER.innerHTML = 'A';
    LETTER.style.color = '#ccc';
    DIV.appendChild(LETTER); 

    const UNDERLINE = document.createElement('div');
    UNDERLINE.classList.add('underline');
    //DIV.appendChild(UNDERLINE); 

    this.letter = VALUE;
    this.is_active = false;
    this.parent = PARENT;
    this.div = DIV;
    this.p = LETTER;
  }

  activateLetter() {
    this.is_active = true;
    this.p.innerHTML = this.letter;
    this.p.style.color = '#333';
  }

  remove() {
    this.div.remove();
  }
}

let fields = {
  container: document.getElementById('fields'),
  win_animation_class: 'fields-win',

  descriptions: {
    'bubble': 'A ball formed of air surrounded by liquid that floats in the air.', 
    'business': 'The activity of buying and selling goods and services.', 
    'success': 'The achieving of the results wanted or hoped for.',
    'common': 'The same in a lot of places or for a lot of people.',
    'yellow': 'A colour like lemon or gold or the sun.',
    'address': 'The number of the place where a person lives or works.',
  },
  words: [],

  word: '',
  fields: [],
  fields_already_selected: [],

  setup: function() {
    this.words = Object.keys(this.descriptions);
    this.words = this.words.map(word => word.toUpperCase());

    this.restart();

  },
  restart: function() {
    // remove fields;
    for (const FIELD of this.fields) {
      //this.container.removeChild(FIELD);
      FIELD.remove();
    }
    this.fields = [];
    this.fields_already_selected = [];

    // select a random word.
    let randomIndex = Math.round(Math.random() * this.words.length-1);
    if (randomIndex < 0) randomIndex = 0;
    this.word = this.words[randomIndex];
    console.log(randomIndex, this.word, 'LOOK AT THIS');

    // add fields
    for (let i=0; i<this.word.length; i++) {
      const LETTER = this.word[i].toUpperCase();
      const FIELD = new Field(LETTER, this.container);
      this.fields.push(FIELD);
    }
  },
  tryLetter: function(LETTER) {
    console.log('TRY LETTER FUNCTION');

    let already_selected = false;
    let is_available = false;
    
    let selected_or_available_fields = [];

    let not_found = true;

    for (const FIELD of this.fields) {
      console.log(FIELD.letter, LETTER, '*')
      if (FIELD.letter == LETTER) {
        not_found = false;
        is_available = true;
        selected_or_available_fields.push(FIELD);

        if (FIELD.is_active == true) {
          already_selected = true;
        }
      }
    }

    if (already_selected) {
      console.log('ALREADY SELECTED');
      // Animar las casillas que ya estan ocupadas
      // para que el usuario pueda verlas.

    } else if (is_available) {
      console.log('LETTER AVAILABLE');
      selected_or_available_fields.forEach((FIELD, INDEX) => {
        FIELD.activateLetter();
        this.fields_already_selected.push(FIELD);
      })
      
      if (this.fields_already_selected.length == this.fields.length) {
        // YOU WIN.
        console.log('ALL THE FIELDS HAVE BEEN COMPLETED');
        this.container.classList.add(this.win_animation_class);
        this.container.addEventListener('animationend', () => {
          this.container.classList.remove(this.win_animation_class);
        })
        control.finish();
      }

    } else if (not_found) { // no esta
      console.log('LETTER NOT FOUND');
      // Enviar un mensaje a control de que la palabra
      // no contiene la letra.
      control.wrongLetter();
    }
  }
}


// ------------------------------------------------------ DESCRIPTION

let description = {
  description: document.getElementById('description'),

  setup: function() {
    this.restart()

  },
  restart: function() {
    this.description.style.opacity = 0;
    const DESCRIPTION = fields.descriptions[fields.word.toLowerCase()];
    console.log(fields.descriptions);
    this.description.innerHTML = DESCRIPTION;
  },
  show: function() {
    this.description.style.opacity = 1;
  }
}


// ------------------------------------------------------ CONTROL

let control = {
  timeout: null,

  setup: function() {
    menu.setup();
    images.setup();
    hearts.setup();
    input.setup();
    fields.setup();
    description.setup();
  },
  submitLetter: function(LETTER) {
    fields.tryLetter(LETTER); 
  },
  wrongLetter: function() {
    // Enviar un mensajo a los corazones
    // Enviar un mnsaje a las imagenes.
    hearts.damage();
    images.next();

  }, 
  startGame: function() {
    input.input.focus();
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);

      description.show();
    }, 500);
  },
  coverCards: function() {
    cards.coverAll();
    this.timeout = setTimeout(() => {
      cards.switchInputAvailability('add');
    }, 500);
  },
  wrongSelection() {
    hearts.decrease();
  },
  finish: function() {
    input.disable();
    console.log('FINISH FUNCTION');
    //cards.switchInputAvailability('remove');

    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      menu.restart( {title_text: 'GAME OVER', start_button_text: 'TRY AGAIN'} );

      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout);
        images.restart();
        hearts.restart();
        input.restart();
        fields.restart();
        description.setup();

      }, 500);

    }, 1000);

  }
}

control.setup();










