// Questions for Hero: shows the answer and notifies Hero ("gesture" event)
// so it can gesture and open its thought bubble.
export function initQuestions() {
  var answers = {
    frontend: 'Gosto de trabalhar na parte que a pessoa usa de verdade. Para mim, um site precisa funcionar bem e ser bom de olhar ao mesmo tempo, e é no front-end que essas duas coisas se encontram.',
    thinking: 'No meu TCC, o modelo acertava bem demais. Investiguei e descobri que quadros do mesmo vídeo caíam no treino e no teste, então ele reconhecia vídeos, não movimentos. Refiz a divisão por vídeo, e os resultados passaram a medir o que importa.',
    team: 'Na Main, coordeno equipes de desenvolvimento: organizo prioridades com Scrumban e defini o fluxo de trabalho e as regras de branch que o time segue. Antes, presidi o Centro Acadêmico de Ciência da Computação. Gosto de deixar o caminho claro para todo mundo conseguir entregar o seu melhor.',
    heart: 'Estudar Libras me mostrou quanta gente fica de fora quando uma interface só funciona de um jeito. No Engasguei isso pesa ainda mais: numa emergência, ninguém pode travar no app. Por isso construí os componentes pensando em acessibilidade desde a base.',
    raiseHand: 'React Three Fiber, para levar cenas 3D como esta figura para dentro de aplicações React. Também sigo me aprofundando em acessibilidade no front-end.',
    point: 'Uma vaga de desenvolvedor júnior em front-end, mobile ou full stack, num time em que eu aprenda com gente experiente e trabalhe em produtos que as pessoas usam de verdade. Se parece com o seu time, me mande um '
  };
  var speech = document.getElementById('speech');
  var answerBox = speech.parentElement;
  var buttons = document.querySelectorAll('[data-gesture]');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var active = b.getAttribute('aria-pressed') === 'true';
      buttons.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      var key = active ? null : b.getAttribute('data-gesture');
      if (key) b.setAttribute('aria-pressed', 'true');
      document.dispatchEvent(new CustomEvent('gesture', { detail: key }));
      // on phones, bring Hero into view so the visitor sees the gesture and the bubble
      var stage = document.querySelector('.stage');
      if (key && window.innerWidth <= 700 && stage.getBoundingClientRect().top < 0) stage.scrollIntoView({ block: 'start' });
      speech.classList.add('swap');
      setTimeout(function () {
        speech.textContent = key ? answers[key] : 'Pergunte alguma coisa para mim.';
        if (key === 'point') {
          var link = document.createElement('a');
          link.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=lucalvex25@gmail.com';
          link.target = '_blank';
          link.rel = 'noopener';
          link.textContent = 'e-mail';
          link.setAttribute('aria-label', 'Mandar e-mail para lucalvex25@gmail.com pelo Gmail');
          speech.appendChild(link);
          speech.appendChild(document.createTextNode('.'));
        }
        answerBox.classList.toggle('empty', !key);
        speech.classList.remove('swap');
      }, 180);
    });
  });
}
