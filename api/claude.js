const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
async function ask(body){
  const { messages, json } = body || {};
  if (!Array.isArray(messages) || !messages.length || JSON.stringify(messages).length > 60000) return { status: 400, data: { error: 'bad_request' } };
  const contents = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const text = String(m.content);
    if (contents.length && contents[contents.length - 1].role === role) contents[contents.length - 1].parts[0].text += '\n\n' + text;
    else contents.push({ role, parts: [{ text }] });
  }
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: json ? 'Return ONLY valid JSON, no markdown, no commentary.' : 'You are the AI assistant of FuturePath, an app for university admissions. Answer in the language of the user.' }] },
      contents,
      generationConfig: json ? { responseMimeType: 'application/json' } : {}
    })
  });
  const d = await r.json();
  if (!r.ok) return { status: r.status, data: { error: 'upstream' } };
  const text = ((d.candidates || [])[0]?.content?.parts || []).map(p => p.text || '').join('');
  return { status: 200, data: { text } };
}
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { status, data } = await ask(req.body);
  res.status(status).json(data);
};
