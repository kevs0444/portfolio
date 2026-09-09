const { test, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');

// Compile with the project's TypeScript dependency; no extra test runner required.
function loader() {
  const cache = new Map();
  function load(relative) {
    const file = path.resolve(__dirname, '..', relative);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const requireFromFile = createRequire(file);
    new Function('require', 'module', 'exports', code)((id) => id.startsWith('.')
      ? load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(file), id + '.ts')))
      : requireFromFile(id), module, module.exports);
    return module.exports;
  }
  return load;
}
const original = {
  key: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL,
  mode: process.env.GROQ_ROUTING,
  guard: process.env.GROQ_MODERATION,
  geminiKey: process.env.GEMINI_API_KEY,
  googleKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL,
  cerebrasKey: process.env.CEREBRAS_API_KEY,
  cerebrasModel: process.env.CEREBRAS_MODEL,
};
afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of Object.entries({
    GROQ_API_KEY: original.key,
    GROQ_MODEL: original.model,
    GROQ_ROUTING: original.mode,
    GROQ_MODERATION: original.guard,
    GEMINI_API_KEY: original.geminiKey,
    GOOGLE_GENERATIVE_AI_API_KEY: original.googleKey,
    GEMINI_MODEL: original.geminiModel,
    CEREBRAS_API_KEY: original.cerebrasKey,
    CEREBRAS_MODEL: original.cerebrasModel,
  })) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
const msg = (content) => [{ role: 'user', content }];
const catalog = (...ids) => Response.json({ data: ids.map(id => ({ id })) });
const answer = (content = 'Grounded portfolio answer.') => Response.json({ choices: [{ finish_reason: 'stop', message: { content, reasoning: 'never expose this' } }] });
const models = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'];

test('classifies questions and keeps context for follow-ups', () => {
  const { classifyQuestion } = loader()('app/lib/groq.ts');
  assert.equal(classifyQuestion(msg('How can I contact Kevin?')), 'quick');
  assert.equal(classifyQuestion(msg('Tell me about his projects')), 'portfolio');
  assert.equal(classifyQuestion(msg('How did he automate SQL reporting?')), 'technical');
  assert.equal(classifyQuestion(msg('Compare his internships and evaluate his fit for a BI role')), 'analysis');
  assert.equal(classifyQuestion([...msg('Compare the internships'), { role: 'assistant', content: 'Context' }, ...msg('Tell me more')]), 'analysis');
  assert.equal(classifyQuestion(msg('Saan siya nakatira?')), 'quick');
});

test('filters unavailable models and supports explicit single-model mode', () => {
  const { selectModels } = loader()('app/lib/groq.ts');
  delete process.env.GROQ_ROUTING;
  process.env.GROQ_MODEL = models[1];
  assert.deepEqual(selectModels('quick', new Set(models)), models);
  assert.equal(selectModels('analysis', new Set(models))[0], models[1]);
  process.env.GROQ_ROUTING = 'single';
  assert.deepEqual(selectModels('quick', new Set(models)), [models[1]]);
  process.env.GROQ_MODEL = 'whisper-large-v3';
  assert.deepEqual(selectModels('quick', new Set(['whisper-large-v3'])), []);
});

test('free-tier default makes one answer request, caches catalog, and preserves grounding', async () => {
  delete process.env.GROQ_MODERATION; delete process.env.GROQ_ROUTING;
  const bodies = []; let catalogs = 0;
  mock.method(global, 'fetch', async (url, init) => {
    if (url.endsWith('/models')) { catalogs++; return catalog(...models); }
    bodies.push(JSON.parse(init.body)); return answer();
  });
  const { answerQuestion } = loader()('app/lib/groq.ts');
  const result = await answerQuestion('test-key', 'Verified portfolio facts', msg('Hello'));
  await answerQuestion('test-key', 'Verified portfolio facts', msg('Compare his internships'));
  assert.equal(catalogs, 1); assert.equal(bodies.length, 2);
  assert.equal(bodies[0].model, models[0]); assert.equal(bodies[1].model, models[1]);
  assert.equal(bodies[0].messages[0].content, 'Verified portfolio facts');
  assert.equal(bodies[0].include_reasoning, false);
  assert.equal(result.message, 'Grounded portfolio answer.');
  assert.equal(result.reasoning, undefined);
});

test('429 retries one alternative model without canned answers', async () => {
  delete process.env.GROQ_MODERATION; delete process.env.GROQ_ROUTING;
  let calls = 0;
  mock.method(global, 'fetch', async url => url.endsWith('/models') ? catalog(...models) : ++calls === 1 ? new Response('', { status: 429 }) : answer());
  const result = await loader()('app/lib/groq.ts').answerQuestion('test-key', 'facts', msg('Hello'));
  assert.equal(result.model, models[1]); assert.equal(calls, 2);
});

test('authentication failure is not retried', async () => {
  delete process.env.GROQ_MODERATION; delete process.env.GROQ_ROUTING;
  let calls = 0;
  mock.method(global, 'fetch', async url => url.endsWith('/models') ? catalog(...models) : (calls++, new Response('', { status: 401 })));
  await assert.rejects(loader()('app/lib/groq.ts').answerQuestion('test-key', 'facts', msg('Hello')), { status: 401 });
  assert.equal(calls, 1);
});

test('empty output does not become a fabricated success', async () => {
  delete process.env.GROQ_MODERATION; delete process.env.GROQ_ROUTING;
  mock.method(global, 'fetch', async url => url.endsWith('/models') ? catalog(...models) : answer(''));
  await assert.rejects(loader()('app/lib/groq.ts').answerQuestion('test-key', 'facts', msg('Hello')), { status: 502 });
});

test('optional moderation blocks before generation', async () => {
  process.env.GROQ_MODERATION = 'true'; delete process.env.GROQ_ROUTING;
  let calls = 0;
  mock.method(global, 'fetch', async url => url.endsWith('/models') ? catalog(...models, 'openai/gpt-oss-safeguard-20b') : (calls++, answer('UNSAFE')));
  const result = await loader()('app/lib/groq.ts').answerQuestion('test-key', 'facts', msg('unsafe request'));
  assert.equal(result.blocked, true); assert.equal(calls, 1);
});

test('chat rejects invalid input and missing configuration', async () => {
  const { POST } = loader()('app/api/chat/route.ts');
  delete process.env.GROQ_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  delete process.env.CEREBRAS_API_KEY;
  assert.equal((await POST(new Request('http://localhost/api/chat', { method: 'POST', body: '{' }))).status, 400);
  assert.equal((await POST(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ messages: msg('Hello') }) }))).status, 503);
});

test('Gemini uses the same system grounding and normalized conversation', async () => {
  delete process.env.GEMINI_MODEL;
  let request;
  mock.method(global, 'fetch', async (url, init) => {
    request = { url, headers: init.headers, body: JSON.parse(init.body) };
    return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Grounded Gemini answer.' }] } }] });
  });
  const messages = [
    { role: 'assistant', content: 'UI greeting' },
    { role: 'user', content: 'Tell me about Kevin.' },
    { role: 'user', content: 'Focus on projects.' },
  ];
  const result = await loader()('app/lib/gemini.ts').answerWithGemini('google-test-key', 'Verified portfolio facts', messages);
  assert.match(request.url, /gemini-3\.7-flash:generateContent$/);
  assert.equal(request.headers['x-goog-api-key'], 'google-test-key');
  assert.equal(request.body.systemInstruction.parts[0].text, 'Verified portfolio facts');
  assert.equal(request.body.contents.length, 1);
  assert.match(request.body.contents[0].parts[0].text, /Focus on projects/);
  assert.equal(result.message, 'Grounded Gemini answer.');
});

test('chat falls back to Gemini when Groq is rate-limited', async () => {
  process.env.GROQ_API_KEY = 'groq-test-key';
  process.env.GEMINI_API_KEY = 'gemini-test-key';
  mock.method(global, 'fetch', async (url) => {
    if (url.startsWith('https://api.groq.com/')) return new Response('', { status: 429 });
    if (url.startsWith('https://generativelanguage.googleapis.com/')) {
      return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Gemini fallback answer.' }] } }] });
    }
    throw new Error('Unexpected URL');
  });
  const { POST } = loader()('app/api/chat/route.ts');
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: msg('What are Kevin’s skills?') }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: 'Gemini fallback answer.', source: 'gemini' });
});

test('chat works with Gemini as the only configured provider', async () => {
  delete process.env.GROQ_API_KEY;
  delete process.env.CEREBRAS_API_KEY;
  process.env.GEMINI_API_KEY = 'gemini-test-key';
  mock.method(global, 'fetch', async () => Response.json({
    candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Gemini-only answer.' }] } }],
  }));
  const { POST } = loader()('app/api/chat/route.ts');
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: msg('How can I contact Kevin?') }),
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).source, 'gemini');
});

test('Cerebras discovers a live model and preserves the system grounding', async () => {
  delete process.env.CEREBRAS_MODEL;
  const requests = [];
  mock.method(global, 'fetch', async (url, init) => {
    requests.push({ url, init });
    if (url.endsWith('/models')) return catalog('llama3.1-8b', 'gpt-oss-120b');
    return answer('Grounded Cerebras answer.');
  });
  const result = await loader()('app/lib/cerebras.ts').answerWithCerebras(
    'cerebras-test-key',
    'Verified portfolio facts',
    msg('What can Kevin offer?'),
  );
  assert.equal(result.model, 'gpt-oss-120b');
  assert.equal(result.message, 'Grounded Cerebras answer.');
  assert.equal(requests.length, 2);
  assert.equal(requests[0].init.headers.Authorization, 'Bearer cerebras-test-key');
  const body = JSON.parse(requests[1].init.body);
  assert.equal(body.messages[0].role, 'system');
  assert.equal(body.messages[0].content, 'Verified portfolio facts');
  assert.equal(body.max_completion_tokens, 1200);
});

test('chat falls through Groq and Gemini to Cerebras', async () => {
  process.env.GROQ_API_KEY = 'groq-test-key';
  process.env.GEMINI_API_KEY = 'gemini-test-key';
  process.env.CEREBRAS_API_KEY = 'cerebras-test-key';
  mock.method(global, 'fetch', async (url) => {
    if (url.startsWith('https://api.groq.com/')) return new Response('', { status: 429 });
    if (url.startsWith('https://generativelanguage.googleapis.com/')) return new Response('', { status: 429 });
    if (url === 'https://api.cerebras.ai/v1/models') return catalog('gpt-oss-120b');
    if (url === 'https://api.cerebras.ai/v1/chat/completions') return answer('Cerebras fallback answer.');
    throw new Error('Unexpected URL');
  });
  const { POST } = loader()('app/api/chat/route.ts');
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: msg('What are Kevin’s data skills?') }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: 'Cerebras fallback answer.', source: 'cerebras' });
});

test('chat works with Cerebras as the only configured provider', async () => {
  delete process.env.GROQ_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  process.env.CEREBRAS_API_KEY = 'cerebras-test-key';
  mock.method(global, 'fetch', async (url) => url.endsWith('/models')
    ? catalog('gpt-oss-120b')
    : answer('Cerebras-only answer.'));
  const { POST } = loader()('app/api/chat/route.ts');
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: msg('Why is it called Bop AI?') }),
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).source, 'cerebras');
});
