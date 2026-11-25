# Becker’s Burguer — site

Abra `index.html` no navegador, ou envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

- `index.html` — estrutura da página
- `styles.css` — visual e animações
- `app.js` — animações ao rolar, cardápio, carrinho, pedido no WhatsApp e área do proprietário
- `assets/` — fotos e o GIF do hero (`burger_griddle_fire.mp4` é o vídeo original, opcional)

Para mudar: número do WhatsApp (`WA` no topo de `app.js`), itens do cardápio (`menu` em `app.js`) e senha do proprietário (`PASS` em `app.js`).

Fora do Claude, os itens que o proprietário adiciona ficam salvos só no navegador dele (localStorage). Para o cardápio ficar igual para todos os clientes, edite a lista `menu` em `app.js`.
