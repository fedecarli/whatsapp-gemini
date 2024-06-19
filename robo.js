import wppconnect from '@wppconnect-team/wppconnect';
import { mainGoogle } from './src/service/google.js';


wppconnect
  .create({
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
  .then((client) => {
    client.sendText("5511972881609@c.us", 'funcionando')
    .then((result) => {
      console.log('Pong retornado: ', result);
    })
    .catch((erro) => {
      console.error('ERRO: ', erro);
    });
    client.onMessage(async (message) => {
      console.log('Mensagem recebida:', JSON.stringify(message));
      const answer = await mainGoogle({
          currentMessage: message.body ?? '',
          chatId: message.chatId,
        });
      console.log('answer :>> ', answer);
      client
        .sendText(message.from, answer)
        .then((result) => {
          console.log('Pong retornado: ', result);
        })
        .catch((erro) => {
          console.error('ERRO: ', erro);
        });
    });
  })
  .catch((erro) => {
    console.log(erro);
  });