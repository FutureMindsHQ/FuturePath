const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
async function ask(body){
  const { messages, json } = body || {};
  if (!Array.isArray(messages) || !messages.length || JSON.stringify(messages).length > 60000) return { status: 400, data: { error: 'bad_request' } };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 2000,
      system: json ? 'Return ONLY valid JSON, no markdown, no commentary.' : 'You are the AI assistant of FuturePath, an app for university admissions. Answer in the language of the user.',
      messages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) }))
    })
  });
  const d = await r.json();
  if (!r.ok) return { status: r.status, data: { error: 'upstream' } };
  return { status: 200, data: { text: (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('') } };
}
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { status, data } = await ask(req.body);
  res.status(status).json(data);
};
