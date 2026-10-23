# Portfólio — Lucas Alves de Lima

Portfólio pessoal de desenvolvedor front-end, com animações 3D feitas em three.js.

**Acesse:** https://lucalvex.github.io

## Sobre o projeto

O destaque da página é o **Hero**, um bonequinho em 3D formado pelos 17 pontos-chave do corpo usados pelo YOLO11n-Pose, o modelo de detecção de pose do meu TCC sobre detecção de estereotipias motoras. Ao abrir a página, os pontos aparecem um a um, como um detector travando no corpo, e depois se conectam para formar a figura.

O Hero não é só decoração: ele responde a perguntas sobre minha trajetória, reage ao cursor e tem vida própria quando ninguém está interagindo.

## Funcionalidades

- **Hero interativo:** a cabeça acompanha o cursor e o tronco se inclina na direção dele.
- **Perguntas e respostas:** cada pergunta faz o Hero assumir um gesto diferente (mão no queixo, braços abertos, mão no peito) e abre um balão de pensamento que surge bolinha por bolinha, com uma reação em emoji.
- **Poses automáticas:** após alguns segundos sem interação, o Hero se espreguiça, cruza os braços, olha o relógio ou dança, sempre com transições suaves entre as poses.
- **Foto que pisca:** ao passar o mouse, a foto gira como uma moeda e revela um rosto que pisca soltando corações.
- **Linha do tempo 3D guiada pela rolagem:** a câmera avança de 2023 até hoje sobre trilhas paralelas, mostrando experiências que aconteceram ao mesmo tempo.
- **Capivara em pixel art:** anda sobre as barras da linha do tempo enquanto a página rola, senta quando a rolagem para e salta entre as trilhas, com um fundo pixelado em três camadas de paralaxe.
- **Tema claro e escuro:** segue o sistema por padrão, com um botão para trocar manualmente. A escolha fica salva no navegador.

## Acessibilidade

- Com a opção de reduzir movimento ativada no sistema, as animações automáticas são desligadas e a linha do tempo vira uma lista simples.
- Todos os controles funcionam pelo teclado, com foco visível.
- As respostas do Hero são anunciadas por leitores de tela, e os elementos 3D, que são apenas visuais, ficam ocultos para eles.
- Layout responsivo para celular, tablet e desktop.

## Tecnologias

- HTML, CSS e JavaScript, sem framework e sem etapa de build
- [three.js](https://threejs.org/) (r128), para as cenas 3D
- Pixel art desenhada por código em `<canvas>`
- Fontes [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) e [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible), esta última criada pelo Braille Institute para máxima legibilidade

## Como rodar localmente

Como é uma página estática, basta abrir o `index.html` no navegador. Para testar como no servidor, use qualquer servidor local, por exemplo:

```bash
npx serve .
```

## Publicação

O site é publicado pelo GitHub Pages a partir da branch `main`. Qualquer alteração enviada para essa branch atualiza o site automaticamente.

## Contato

- E-mail: lucalvex25@gmail.com
- LinkedIn: [linkedin.com/in/lucalvex](https://www.linkedin.com/in/lucalvex/)
- GitHub: [github.com/lucalvex](https://github.com/lucalvex)
