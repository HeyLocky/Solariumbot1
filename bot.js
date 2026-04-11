const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const http = require('http');
const fs = require('fs');

const DADOS_PATH = './dados.json';
const PORT = process.env.PORT || 3000;

function carregarTotal() {
    if (fs.existsSync(DADOS_PATH)) {
        const dados = JSON.parse(fs.readFileSync(DADOS_PATH, 'utf-8'));
        return dados.total || 0;
    }
    return 0;
}

function salvarTotal(total) {
    fs.writeFileSync(DADOS_PATH, JSON.stringify({ total }));
}

let total = carregarTotal();
let qrDataUrl = null;
let botStatus = 'aguardando QR...';

// Servidor web para acessar o QR por link
const server = http.createServer(async (req, res) => {
    if (req.url === '/qr') {
        if (!qrDataUrl) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <html><body style="font-family:sans-serif;text-align:center;padding:40px">
                <h2>QR Code ainda não gerado</h2>
                <p>Aguarde alguns segundos e recarregue a página.</p>
                <script>setTimeout(()=>location.reload(), 3000)</script>
                </body></html>
            `);
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#f0f0f0">
            <h2>Escaneie o QR Code com o WhatsApp</h2>
            <img src="${qrDataUrl}" style="width:300px;height:300px;border:8px solid white;border-radius:12px"/>
            <p style="color:#888">A página atualiza automaticamente após a conexão.</p>
            <script>setTimeout(()=>location.reload(), 5000)</script>
            </body></html>
        `);
        return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <html><body style="font-family:sans-serif;text-align:center;padding:40px">
        <h2>Bot WhatsApp</h2>
        <p>Status: <strong>${botStatus}</strong></p>
        ${botStatus !== 'conectado!' ? '<a href="/qr" style="font-size:18px">👉 Clique aqui para escanear o QR Code</a>' : ''}
        <script>setTimeout(()=>location.reload(), 5000)</script>
        </body></html>
    `);
});

server.listen(PORT, () => {
    console.log(`Servidor web rodando na porta ${PORT}`);
    console.log(`Acesse /qr para escanear o QR Code`);
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
    },
});

client.on('qr', async qr => {
    console.log('\nQR Code gerado! Acesse /qr no navegador para escanear.\n');
    qrcode.generate(qr, { small: true });
    qrDataUrl = await QRCode.toDataURL(qr);
    botStatus = 'aguardando QR scan...';
});

client.on('authenticated', () => {
    console.log('Autenticado!');
    botStatus = 'autenticado!';
    qrDataUrl = null;
});

client.on('ready', () => {
    console.log('Bot pronto! Aguardando mensagens...');
    botStatus = 'conectado!';
    qrDataUrl = null;
});

client.on('disconnected', reason => {
    console.log('Desconectado:', reason);
    botStatus = 'desconectado: ' + reason;
});

client.on('message', msg => {
    const body = msg.body.trim();
    const lower = body.toLowerCase();

    // +valor — adicionar gasto
    if (body.startsWith('+')) {
        const valor = parseFloat(body.replace('+', '').replace(',', '.'));
        if (!isNaN(valor)) {
            total += valor;
            salvarTotal(total);
            msg.reply(
                `Valor adicionado: R$${valor.toFixed(2)}\n` +
                `Total: R$${total.toFixed(2)}`
            );
        }
        return;
    }

    // !solarium — boas-vindas
    if (lower === '!solarium') {
        msg.reply('Hello world my name is solarium. Can I help you today?');
        return;
    }

    // !gastos — total do mês
    if (lower === '!gastos') {
        msg.reply(`💸 *Gastos*\nGastos totais do mês: R$${total.toFixed(2)}`);
        return;
    }

    // !reset — zerar total
    if (lower === '!reset') {
        total = 0;
        salvarTotal(total);
        msg.reply('Total zerado.');
        return;
    }
});

console.log('Iniciando bot...');
client.initialize();
