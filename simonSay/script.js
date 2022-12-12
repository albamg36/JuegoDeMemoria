const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon {
  constructor(simonButtons, startButton, round) {
    this.round = 0;
    this.userPosition = 0;
    this.totalRounds = 10;
    this.sequence = [];
    this.speed = 1000;
    this.blockButtons = true;
    this.buttons = Array.from(simonButtons);
    this.display = {
      startButton,
      round
    }
    this.errorSound = new Audio('./sounds/sounds_error.wav');
    this.buttonsSounds = [
      new Audio('./sounds/sounds_1.mp3'),
      new Audio('./sounds/sounds_2.mp3'),
      new Audio('./sounds/sounds_3.mp3'),
      new Audio('./sounds/sounds_4.mp3'),
    ]
  }

  //Iniciar Simon Dice
  init() {
    this.display.startButton.onclick = () => this.startGame();
  }

  //Comienzo de una partida
  startGame() {
    this.display.startButton.disabled = true;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence = this.createSequence();
    this.buttons.forEach((element, i) => {
      element.classList.remove('winner');
      element.onclick = () => this.buttonClick(i);
    });
    this.showSequence();
  }

  //Actualizacion de la ronda y tablero
  updateRound(value) {
    this.round = value;
    this.display.round.textContent = `Round ${this.round}`;
  }

  //Crea el array aleatorio de botones
  createSequence() {
    return Array.from({ length: this.totalRounds }, () => this.getRandomColor());
  }

  //Nos devuelve un numero al azar entre el 0 y el 3
  getRandomColor() {
    return Math.floor(Math.random() * 4);
  }

  //Ejecuta la funcion cuando cliqueas
  buttonClick(value) {
    !this.blockButtons && this.validateChosenColor(value);
  }

  //Valida si el boton es el correcto al dado anteriormente
  validateChosenColor(value) {
    if (this.sequence[this.userPosition] === value) {
      this.buttonsSounds[value].play();
      if (this.round === this.userPosition) {
        this.updateRound(this.round + 1);
        this.speed /= 1.02;
        this.isGameOver();
      } else {
        this.userPosition++;
      }
    } else {
      this.gameLost();
    }
  }

  //Verifica si el juego continua
  isGameOver() {
    if (this.round === this.totalRounds) {
      this.gameWon();
    } else {
      this.userPosition = 0;
      this.showSequence();
    };
  }

  //Muestra la secuencia de botones
  showSequence() {
    this.blockButtons = true;
    let sequenceIndex = 0;
    let timer = setInterval(() => {
      const button = this.buttons[this.sequence[sequenceIndex]];
      this.buttonsSounds[this.sequence[sequenceIndex]].play();
      this.toggleButtonStyle(button)
      setTimeout(() => this.toggleButtonStyle(button), this.speed / 2)
      sequenceIndex++;
      if (sequenceIndex > this.round) {
        this.blockButtons = false;
        clearInterval(timer);
      }
    }, this.speed);
  }

  //Pinta los botones cuando se muestre la secuencia
  toggleButtonStyle(button) {
    button.classList.toggle('active');
  }

  //Actualiza el simon cuando el jugador pierde
  gameLost() {
    this.errorSound.play();
    this.display.startButton.disabled = false;
    this.blockButtons = true;
    this.buttons.forEach(element => {
      element.classList.add('lost');
    })
  }

  //Muestra la animacion de triunfo y actualiza el simon cuando gana
  gameWon() {
    this.display.startButton.disabled = false;
    this.blockButtons = true;
    this.buttons.forEach(element => {
      element.classList.add('winner');
    });

  }

}

const simon = new Simon(simonButtons, startButton, round);
simon.init();
