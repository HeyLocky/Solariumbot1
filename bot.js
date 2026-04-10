const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const DADOS_PATH = './dados.json';

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

client.on('qr', qr => {
    console.log('\nEscaneie o QR Code abaixo com o WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Autenticado!');
});

client.on('ready', () => {
    console.log('Bot pronto! Aguardando mensagens...');
});

client.on('disconnected', reason => {
    console.log('Desconectado:', reason);
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
