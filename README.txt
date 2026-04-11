=============================
  BOT-WHATSAPP - Instruções
=============================

COMANDOS DO BOT:
----------------
+valor     → Adiciona um gasto (ex: +50,90)
!gastos    → Mostra os gastos totais do mês
!reset     → Zera o total
!solarium  → Mensagem de boas-vindas

ACESSAR O QR CODE POR LINK:
----------------------------
Após o deploy no Railway, acesse:
  https://SEU-DOMINIO.railway.app/qr

A página exibe o QR Code como imagem para escanear com o WhatsApp.
Ela atualiza automaticamente a cada 5 segundos.

DEPLOY NO RAILWAY (24/7):
--------------------------
1. Crie conta em railway.app
2. Suba os arquivos desta pasta em um repositório GitHub
3. No Railway: New Project > Deploy from GitHub Repo
4. Configure a variável de ambiente: PORT = 3000 (Railway faz isso automaticamente)
5. Aguarde o build e acesse o link gerado pelo Railway + /qr

INSTALAÇÃO LOCAL:
-----------------
1. npm install
2. node bot.js
3. Acesse http://localhost:3000/qr no navegador
