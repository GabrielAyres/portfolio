// ============================================================
//  main.js — Portfólio Lucas Ferreira
//  Tudo aqui foi feito na mão, sem frameworks nem bibliotecas
// ============================================================

// Aguarda o DOM carregar antes de fazer qualquer coisa
document.addEventListener('DOMContentLoaded', function () {

  // ---- Referências aos elementos ----
  var menuToggle   = document.getElementById('menuToggle');
  var navLinks     = document.getElementById('navLinks');
  var btnTema      = document.getElementById('btnTema');
  var formContato  = document.getElementById('formContato');
  var modalOverlay = document.getElementById('modalOverlay');
  var btnFechar    = document.getElementById('btnFecharModal');
  var navItens     = document.querySelectorAll('.nav-item');

  // --------------------------------------------------------
  //  1. MENU HAMBURGUER (mobile)
  //  Abre e fecha o menu em telas menores
  // --------------------------------------------------------
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var estaAberto = navLinks.classList.contains('aberto');

      if (estaAberto) {
        navLinks.classList.remove('aberto');
        menuToggle.classList.remove('aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('aberto');
        menuToggle.classList.add('aberto');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Fecha o menu se o usuário clicar em algum link
    navItens.forEach(function (item) {
      item.addEventListener('click', function () {
        navLinks.classList.remove('aberto');
        menuToggle.classList.remove('aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------
  //  2. ALTERNAR TEMA CLARO / ESCURO
  // --------------------------------------------------------
  function aplicarTema(tema) {
    if (tema === 'escuro') {
      document.body.classList.add('tema-escuro');
      document.body.classList.remove('tema-claro');
      btnTema.textContent = '☀️';
      btnTema.setAttribute('aria-label', 'Ativar tema claro');
    } else {
      document.body.classList.remove('tema-escuro');
      document.body.classList.add('tema-claro');
      btnTema.textContent = '🌙';
      btnTema.setAttribute('aria-label', 'Ativar tema escuro');
    }
  }

  // Verifica se tem preferência salva, senão usa a preferência do sistema
  var temaSalvo = localStorage.getItem('tema-portfolio');
  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else {
    // Checar se o sistema operacional prefere modo escuro
    var prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    aplicarTema(prefereEscuro ? 'escuro' : 'claro');
  }

  if (btnTema) {
    btnTema.addEventListener('click', function () {
      var temaAtual = document.body.classList.contains('tema-escuro') ? 'escuro' : 'claro';
      var novoTema  = temaAtual === 'escuro' ? 'claro' : 'escuro';
      aplicarTema(novoTema);
      localStorage.setItem('tema-portfolio', novoTema);
    });
  }

  // --------------------------------------------------------
  //  3. HIGHLIGHT DO ITEM ATIVO NO MENU
  //  Usa IntersectionObserver pra detectar qual seção está visível
  // --------------------------------------------------------
  var secoes = document.querySelectorAll('section[id]');

  var opcoes = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  var observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        var id = entrada.target.getAttribute('id');

        // Remove a classe ativo de todos e adiciona só no atual
        navItens.forEach(function (item) {
          item.classList.remove('ativo');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('ativo');
          }
        });
      }
    });
  }, opcoes);

  secoes.forEach(function (s) {
    observer.observe(s);
  });




  function emailValido(email) {
    
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


  function setErro(campoId, erroId, mensagem) {
    var campo = document.getElementById(campoId);
    var erro  = document.getElementById(erroId);

    if (mensagem) {
      campo.classList.add('campo-erro');
      erro.textContent = mensagem;
    } else {
      campo.classList.remove('campo-erro');
      erro.textContent = '';
    }
  }


  var camposForm = ['nome', 'email', 'mensagem'];
  camposForm.forEach(function (id) {
    var campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', function () {
        campo.classList.remove('campo-erro');
        var erroEl = document.getElementById('erro' + id.charAt(0).toUpperCase() + id.slice(1));
        if (erroEl) erroEl.textContent = '';
      });
    }
  });

  if (formContato) {
    formContato.addEventListener('submit', function (evento) {
  
      evento.preventDefault();

      var nome     = document.getElementById('nome').value.trim();
      var email    = document.getElementById('email').value.trim();
      var mensagem = document.getElementById('mensagem').value.trim();
      var temErro  = false;

      // Valida o campo nome
      if (nome === '') {
        setErro('nome', 'erroNome', 'Por favor, informe seu nome.');
        temErro = true;
      } else if (nome.length < 3) {
        setErro('nome', 'erroNome', 'O nome precisa ter pelo menos 3 caracteres.');
        temErro = true;
      } else {
        setErro('nome', 'erroNome', '');
      }

      // Valida o campo e-mail
      if (email === '') {
        setErro('email', 'erroEmail', 'Informe seu e-mail para contato.');
        temErro = true;
      } else if (!emailValido(email)) {
        setErro('email', 'erroEmail', 'Digite um e-mail válido (ex: voce@email.com).');
        temErro = true;
      } else {
        setErro('email', 'erroEmail', '');
      }

      // Valida o campo mensagem
      if (mensagem === '') {
        setErro('mensagem', 'erroMensagem', 'Escreva uma mensagem antes de enviar.');
        temErro = true;
      } else if (mensagem.length < 10) {
        setErro('mensagem', 'erroMensagem', 'A mensagem precisa ter pelo menos 10 caracteres.');
        temErro = true;
      } else {
        setErro('mensagem', 'erroMensagem', '');
      }

  
      if (temErro) return;

  
      formContato.reset();
      abrirModal();
    });
  }


  function abrirModal() {
    modalOverlay.classList.add('visivel');
    modalOverlay.setAttribute('aria-hidden', 'false');
    // Foca no botão de fechar pra acessibilidade
    if (btnFechar) btnFechar.focus();
  }

  function fecharModal() {
    modalOverlay.classList.remove('visivel');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  if (btnFechar) {
    btnFechar.addEventListener('click', fecharModal);
  }

  // Fecha o modal se clicar fora da caixa
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        fecharModal();
      }
    });
  }

  // Fecha o modal com a tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('visivel')) {
      fecharModal();
    }
  });

  // --------------------------------------------------------
  // --------------------------------------------------------
  var semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!semAnimacao) {
    var elementosAnimar = document.querySelectorAll(
      '.projeto-card, .card-curso, .timeline-item, .info-item'
    );

    var observerAnim = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.style.opacity = '1';
          entrada.target.style.transform = 'translateY(0)';
          observerAnim.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.1 });

    elementosAnimar.forEach(function (el) {
      // Estado inicial: invisível e um pouco abaixo
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observerAnim.observe(el);
    });
  }

}); // fim do DOMContentLoaded
