


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
  index: 0,

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
    this.index = 0;

    this.images.forEach((IMG, INDEX) => {
      if (INDEX > 0) {
        IMG.style.opacity = 0;
      }
    });
  },
  next: function() {
    /*
    this.actual_index += 1;
    const IMG = this.images[this.actual_index];
    IMG.position(this.show_pos.x, this.show_pos.y);
    */
  }
}


// ------------------------------------------------------ HEARTS

let hearts = {
  container: document.getElementById('hearts'),
  amount: images.files.length,
  hearts: [],

  setup: function() {
    for (let i=0; i<this.amount; i++) {
      const HEART = document.createElement('div');
      HEART.setAttribute('class', 'heart');
      this.hearts.push(HEART);
      this.container.appendChild(HEART);

    }
  },
  restart: function() {

  }
}


// ------------------------------------------------------ INPUT

let input = {
  input: document.getElementById('input_letter'),

  setup: function() {
    this.input.addEventListener('onchange', this.__onChange.bind(this));
  },
  restart: function() {
    
  },
  __onChange: function() {
    let letter;
    const VALUE = this.input.value;

    if (word.length == 0) {
      letter = '';
    } else {
      letter = word[word.length-1].toUpperCase();
    }

    this.input.value = letter;
    //actual_letter = word;

    console.log(this.input.value);
  },
}


// ------------------------------------------------------ TRY BUTTON

let try_button = {
  button: document.getElementById('try_button'),

  setup: function() {
    this.button.addEventListener('onclick', () => {

    })
  },
  restart: function() {
    
  }
}


// ------------------------------------------------------ FIELDS

let fields = {
  container: document.getElementById('fields'),
  word: undefined,
  fields: [],

  setup: function() {
    this.restart();

  },
  restart: function() {
    // remove fields;
    for (const FIELD of this.fields) {
      this.container.removeChild(FIELD);
    }

    // select a random word.
    this.word = 'word';

    // add fields
    for (let i=0; i<this.word.length; i++) {
      const FIELD = document.createElement('div');
      FIELD.innerHTML = this.word[i];
      FIELD.classList.add('field');
      this.fields.push(FIELD);
      this.container.appendChild(FIELD);
    }
  }
}


// ------------------------------------------------------ DESCRIPTION

let description = {
  setup: function() {

  },
  restart: function() {
    
  }
}


// ------------------------------------------------------ CONTROL

let control = {
  timeout: null,

  setup: function() {
    images.setup();
    hearts.setup();
    fields.setup();
    description.setup();
  },/*
  startGame: function() {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout)
      cards.uncoverAll();

      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout)
        instructions.startTimer();

      }, 500);
    }, 1000);
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
    cards.switchInputAvailability('remove');

    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      menu.restart( {title_text: 'GAME OVER', start_button_text: 'TRY AGAIN'} );

      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout);
        cards.coverAll();

        hearts.restart();
        cards.restart();
        instructions.restart();

      }, 500);

    }, 1400);

  }*/
}

control.setup();










