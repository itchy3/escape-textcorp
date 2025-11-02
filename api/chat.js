// api/chat.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "너는 텍스트 어드벤처 게임 Escape from TextCorp의 게임 마스터다. 감옥섬 탈출 상황을 서술하고, 플레이어의 입력에 따라 현실적인 결과를 묘사하라. 각 응답은 3~5문장 이내로 간결하게, 한 회차처럼 진행하라." },
        ...history,
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
