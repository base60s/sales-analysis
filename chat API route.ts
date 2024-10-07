import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, csvData } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert senior sales analyst that answers questions about CSV data.' },
          { role: 'user', content: `CSV data: ${JSON.stringify(csvData)}\n\nQuestion: ${prompt}\n\nAnswer:` }
        ],
      });

      res.status(200).json({ answer: response.choices[0].message.content.trim() });
    } catch (error) {
      res.status(500).json({ error: 'Error getting response from OpenAI' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
