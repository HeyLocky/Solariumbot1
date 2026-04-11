=============================
  BOT-WHATSAPP - Instruções
=============================

COMANDOS DO BOT:
----------------
+valor     → Adiciona um gasto (ex: +50,90)
!gastos    → Mostra os gastos totais do mês
!reset     → Zera o total
!solarium  → Mensagem de boas-vindas

DEPLOY NO RAILWAY (24/7):
--------------------------
1. Crie conta em railway.app
2. Crie um repositório no GitHub e suba TODOS os arquivos desta pasta
3. No Railway: New Project > Deploy from GitHub Repo
4. O Railway vai detectar o Dockerfile automaticamente e fazer o build
5. Aguarde o build terminar e abra os "Logs"
6. Escaneie o QR Code que aparecer nos logs com o WhatsApp

INSTALAÇÃO LOCAL:
-----------------
1. Instale o Node.js (versão 18 ou superior)
2. Execute: npm install
3. Execute: node bot.js
4. Escaneie o QR Code

OBSERVAÇÕES:
------------
- Os gastos ficam salvos em dados.json
- A sessão fica salva na pasta .wwebjs_auth
- Após o primeiro login não precisa escanear de novo
