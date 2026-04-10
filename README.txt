=============================
  BOT-WHATSAPP - Instruções
=============================

INSTALAÇÃO LOCAL:
-----------------
1. Instale o Node.js (versão 18 ou superior)
2. Abra a pasta no terminal
3. Execute: npm install
4. Execute: node bot.js
5. Escaneie o QR Code com o WhatsApp

COMANDOS DO BOT:
----------------
+valor     → Adiciona um gasto (ex: +50,90)
!gastos    → Mostra os gastos totais do mês
!reset     → Zera o total
!solarium  → Mensagem de boas-vindas

DEPLOY NO RAILWAY (24/7):
--------------------------
1. Crie conta em railway.app
2. Crie um projeto > "Deploy from GitHub Repo"
   (faça upload dos arquivos em qualquer repositório GitHub)
3. Suba TODOS os arquivos desta pasta pro GitHub
4. O Railway vai detectar o nixpacks.toml e instalar
   automaticamente as dependências do sistema
5. Aguarde o build e clique em "View Logs"
6. Escaneie o QR Code que aparecer nos logs

OBSERVAÇÕES:
------------
- Os gastos ficam salvos no arquivo dados.json
- A sessão do WhatsApp fica salva na pasta .wwebjs_auth
- Após o primeiro login não precisa escanear de novo
- No Railway, vá em Settings > Add Volume para persistir
  os dados entre reinicializações (opcional)
