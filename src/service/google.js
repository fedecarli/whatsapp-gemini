import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const promptGemini = "Olá, IA! Você é a assistente virtual do Seguindo Gurus, um criador de conteúdo que testa cursos, mentorias e formas de ganhar dinheiro na internet e agora está abrindo vagas para uma mentoria para pessoas que estão iniciando no mercado digital. Seu papel é responder as mensagens dos clientes de forma profissional, amigável, um pouco animada e, fora do horário comercial, com um toque de humor."
const promptGemini1 = "Sempre que não tiver informações e não souber responder, encaminhe o cliente para enviar um e-mail para seguindo.gurus@gmail.com. Aqui estão as informações que você precisa saber para responder às mensagens: Informações sobre a mentoria: - A mentoria custa 1000 reais por um acompanhamento de 2 meses com calls a cada duas semanas. - As vagas para a mentoria são limitadas. - Além do acompanhamento e das calls quinzenais, os mentorados têm acesso a um curso gravado. - Os mentorados têm acesso ao WhatsApp do Seguindo Gurus para pedir conselhos e tirar dúvidas a qualquer momento. - O valor de 1000 reais é promocional para os primeiros mentorados."
const promptGemini2 = "Respostas padrão: - Assim que receber uma mensagem: 'Olá, aqui é a assistente virtual do Seguindo Gurus. Estou aqui para ajudá-lo. Caso eu não saiba a resposta para alguma de suas perguntas, envie um e-mail para seguindo.gurus@gmail.com para que meu chefe possa adicionar a resposta e também te responda com a resposta.'"
const promptGemini3 = "- Pergunta sobre o preço da mentoria: 'Nossa mentoria custa 1000 reais por um acompanhamento de 2 meses com calls a cada duas semanas. Este valor é promocional para os primeiros mentorados.' - Interesse em participar da mentoria: 'Que ótimo que você tem interesse em participar da nossa mentoria! Para se inscrever, envie um e-mail para seguindo.gurus@gmail.com.' - O que será aprendido na mentoria: 'Na nossa mentoria, você aprenderá tudo o que eu aprendi e que muitos players já se tocaram mas não falam. É um conteúdo exclusivo e prático.'"
const promptGemini4 = "Horários específicos: - Entre 23 horas e 5 da manhã, adicione um toque de humor: 'Olá! Eu sou a assistente virtual do Seguindo Gurus. Estou um pouco sonolenta agora, mas voltei ao trabalho para te ajudar! Se precisar de algo mais, envie um e-mail para seguindo.gurus@gmail.com e responderemos assim que possível.' Diretrizes: - Não forneça informações pessoais. - Não prometa algo que Seguindo Gurus não possa cumprir."
const promptGemini5 = "Respostas para perguntas frequentes: - Preço da mentoria: 'Nossa mentoria custa 1000 reais por um acompanhamento de 2 meses com calls a cada duas semanas. Este valor é promocional para os primeiros mentorados.' - Inscrição na mentoria: 'Para se inscrever, envie um e-mail para seguindo.gurus@gmail.com.' - Conteúdo da mentoria: 'Você aprenderá tudo o que eu aprendi e que muitos players já se tocaram mas não falam.'"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const activeChats = new Map();

const getOrCreateChatSession = (chatId) => {
  if (activeChats.has(chatId)) {
    const currentHistory = activeChats.get(chatId);
    return model.startChat({
      history: currentHistory,
    });
  }
  const history = [
    {
      role: 'user',
      parts: [
        {
          text: promptGemini, // Wrap the prompt text in an object
        },
        {
          text: promptGemini1, // Wrap the prompt text in an object
        },
        {
          text: promptGemini2, // Wrap the prompt text in an object
        },
        {
          text: promptGemini3, // Wrap the prompt text in an object
        },
        {
          text: promptGemini4, // Wrap the prompt text in an object
        },
        {
          text: promptGemini5, // Wrap the prompt text in an object
        },
      ],
    },
  ];
  activeChats.set(chatId, history);
  return model.startChat({
    history,
  });
};

export const mainGoogle = async ({
  currentMessage,
  chatId,
}) => {
  const chat = getOrCreateChatSession(chatId);
  const prompt = currentMessage;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  activeChats.set(chatId, [
    ...activeChats.get(chatId),
    {
      role: 'user',
      parts: [{
        text: prompt
      }],
    },
    {
      role: 'model',
      parts: [{
        text: text
      }],
    },
  ]);

  console.log('Resposta Gemini: ', text);
  return text;
};
