const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const http = require('http');
const fs = require('fs');

const DADOS_PATH = './dados.json';
const PORT = process.env.PORT || 3000;

// ====== FUNÇÕES ======

function carregarTotal() {
    if (fs.existsSync(DADOS_PATH)) {
        const dados = JSON.parse(
            fs.readFileSync(DADOS_PATH, 'utf-8')
        );
        return dados.total || 0;
    }
    return 0;
}

function salvarTotal(total) {
    fs.writeFileSync(
        DADOS_PATH,
        JSON.stringify({ total })
    );
}

let total = carregarTotal();
let qrDataUrl = null;
let botStatus = 'aguardando QR...';

// ====== SERVIDOR WEB ======

const server = http.createServer(async (req, res) => {

    if (req.url === '/qr') {

        if (!qrDataUrl) {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });

            res.end(`
                <html>
                <body style="text-align:center;padding:40px">
                <h2>QR ainda não gerado...</h2>
                <script>
                setTimeout(()=>location.reload(),3000)
                </script>
                </body>
                </html>
            `);

            return;
        }

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        res.end(`
            <html>
            <body style="text-align:center;padding:40px">
            <h2>Escaneie o QR</h2>
            <img src="${qrDataUrl}" width="300"/>
            <script>
            setTimeout(()=>location.reload(),5000)
            </script>
            </body>
            </html>
        `);

        return;
    }

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });

    res.end(`
        <html>
        <body style="text-align:center;padding:40px">
        <h2>🤖 Solarium Bot</h2>
        <p>Status: ${botStatus}</p>
        <a href="/qr">Abrir QR</a>
        </body>
        </html>
    `);
});

server.listen(PORT, () => {
    console.log("Servidor iniciado");
});

// ====== CLIENTE WHATSAPP ======

const client = new Client({
    authStrategy: new LocalAuth(),

    puppeteer: {
        executablePath:
            process.env.PUPPETEER_EXECUTABLE_PATH || undefined,

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ],
    },
});

// ====== EVENTOS ======

client.on('qr', async qr => {

    console.log("QR gerado");

    qrcode.generate(qr, { small: true });

    qrDataUrl = await QRCode.toDataURL(qr);

    botStatus = 'aguardando QR...';
});

client.on('ready', () => {

    console.log("Bot conectado");

    botStatus = 'conectado!';
});

// ====== COMANDOS ======

client.on('message', msg => {

    const body = msg.body.trim();
    const lower = body.toLowerCase();

    // ====== +VALOR ======

    if (body.startsWith('+')) {

        const valor = parseFloat(
            body.replace('+', '').replace(',', '.')
        );

        if (!isNaN(valor)) {

            total += valor;

            salvarTotal(total);

            msg.reply(
`✅ Valor adicionado: R$${valor.toFixed(2)}
💰 Total: R$${total.toFixed(2)}`
            );
        }

        return;
    }

    // ====== -VALOR ======

    if (body.startsWith('-')) {

        const valor = parseFloat(
            body.replace('-', '').replace(',', '.')
        );

        if (!isNaN(valor)) {

            total -= valor;

            if (total < 0) total = 0;

            salvarTotal(total);

            msg.reply(
`➖ Valor removido: R$${valor.toFixed(2)}
💰 Total: R$${total.toFixed(2)}`
            );
        }

        return;
    }

    // ====== !gastos ======

    if (lower === '!gastos') {

        msg.reply(
`💸 *GASTOS DO GRUPO*

Total atual:
R$${total.toFixed(2)}`
        );

        return;
    }

    // ====== !reset ======

    if (lower === '!reset') {

        total = 0;

        salvarTotal(total);

        msg.reply(
`🔄 Total zerado com sucesso!`
        );

        return;
    }

    // ====== !status ======

    if (lower === '!status') {

        msg.reply(
`🤖 Bot online e funcionando!`
        );

        return;
    }

    // ====== !comandos ======

    if (lower === '!comandos') {

        msg.reply(
`🤖 *SOLARIUM BOT*

📌 *COMANDOS DISPONÍVEIS*

➕ *Adicionar gasto*
Digite:
+valor

➖ *Remover gasto*
Digite:
-valor

📊 *Ver total*
Digite:
!gastos

🔄 *Resetar total*
Digite:
!reset

🤖 *Status do bot*
Digite:
!status

📋 *Ver comandos*
Digite:
!comandos

💡 *Dica:*
Use vírgula ou ponto nos valores!`
        );

        return;
    }

});

client.initialize();
