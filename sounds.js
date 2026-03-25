// sounds.js - simple audio preloader
const Sounds = {
  click: new Audio('click.wav'),
  correct: new Audio('correct.wav'),
  wrong: new Audio('wrong.wav'),
  play(name) { if (this[name] && typeof this[name].play === 'function') { try { this[name].currentTime = 0; this[name].play(); } catch(e) {} } }
};
window.Sounds = Sounds;
