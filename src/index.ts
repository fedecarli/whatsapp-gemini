import wppconnect from '@wppconnect-team/wppconnect';

import dotenv from 'dotenv';
// import { initializeNewAIChatSession, mainOpenAI } from './service/openai';
import { mainGoogle } from './service/google';

dotenv.config();
// type AIOption = 'GPT' | 'GEMINI';

// const messageBufferPerChatId = new Map();
// const messageTimeouts = new Map();
// const AI_SELECTED: AIOption = (process.env.AI_SELECTED as AIOption) || 'GEMINI';
// const MAX_RETRIES = 3;

// if (AI_SELECTED === 'GEMINI' && !process.env.GEMINI_KEY) {
//   throw Error(
//     'Você precisa colocar uma key do Gemini no .env! Crie uma gratuitamente em https://aistudio.google.com/app/apikey?hl=pt-br'
//   );
// }

// if (
//   AI_SELECTED === 'GPT' &&
//   (!process.env.OPENAI_KEY || !process.env.OPENAI_ASSISTANT)
// ) {
//   throw Error(
//     'Para utilizar o GPT você precisa colocar no .env a sua key da openai e o id do seu assistante.'
//   );
// }

wppconnect
  .create({
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
  .then((client) => {
    client.onMessage(async (message) => {
      console.log('Mensagem recebida:', message.body);
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
    // start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

// async function start(client: wppconnect.Whatsapp): Promise<void> {
//   client.onMessage((message) => {
//     (async () => {
//       if (
//         message.type === 'chat' &&
//         !message.isGroupMsg &&
//         message.chatId !== 'status@broadcast'
//       ) {
//         const chatId = message.chatId;
//         console.log('Mensagem recebida:', message.body);
//         if (AI_SELECTED === 'GPT') {
//           await initializeNewAIChatSession(chatId);
//         }

//         if (!messageBufferPerChatId.has(chatId)) {
//           messageBufferPerChatId.set(chatId, [message.body]);
//         } else {
//           messageBufferPerChatId.set(chatId, [
//             ...messageBufferPerChatId.get(chatId),
//             message.body,
//           ]);
//         }

//         if (messageTimeouts.has(chatId)) {
//           clearTimeout(messageTimeouts.get(chatId));
//         }
//         console.log('Aguardando novas mensagens...');
//         messageTimeouts.set(
//           chatId,
//           setTimeout(() => {
//             (async () => {
//               const currentMessage = !messageBufferPerChatId.has(chatId)
//                 ? message.body
//                 : [...messageBufferPerChatId.get(chatId)].join(' \n ');
//               let answer = '';
//               for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//                 try {
//                   if (AI_SELECTED === 'GPT') {
//                     answer = await mainOpenAI({
//                       currentMessage: currentMessage ?? '',
//                       chatId,
//                     });
//                   } else {
//                     answer = await mainGoogle({
//                       currentMessage: currentMessage ?? '',
//                       chatId,
//                     });
//                   }
//                   break;
//                 } catch (error) {
//                   if (attempt === MAX_RETRIES) {
//                     throw error;
//                   }
//                 }
//               }

//               client
//                 .sendText(message.from, answer)
//                 .then((result) => {
//                   console.log('Pong retornado: ', result);
//                 })
//                 .catch((erro) => {
//                   console.error('ERRO: ', erro);
//                 });
//               messageBufferPerChatId.delete(chatId);
//               messageTimeouts.delete(chatId);
//             })();
//           }, 1500)
//         );
//       }
//     })();
//   });
// }
