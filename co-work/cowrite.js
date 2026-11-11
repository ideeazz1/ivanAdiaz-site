/**
 * Co-write — one shared thread, answered by GPT or Claude when asked.
 *
 * Threads live in this browser's localStorage only. Every ask sends the whole
 * thread to the Decision OS host, which relays it to the chosen model and
 * streams the reply back. Model output is always rendered as plain text.
 */
(function () {
  'use strict';

  const STORE_KEY = 'cowrite.threads.v1';
  const ACTIVE_KEY = 'cowrite.active.v1';
  const MODEL_KEY = 'cowrite.models.v1';
  const AUTHORS = { ivan: 'Ivan', gpt: 'GPT', claude: 'Claude' };
  const PROVIDERS = ['gpt', 'claude'];

  const el = {
    threadList: document.getElementById('thread-list'),
    newThread: document.getElementById('new-thread'),
    backup: document.getElementById('backup'),
    restore: document.getElementById('restore'),
    restoreFile: document.getElementById('restore-file'),
    title: document.getElementById('thread-title'),
    download: document.getElementById('download'),
    deleteThread: document.getElementById('delete-thread'),
    banner: document.getElementById('banner'),
    bannerText: document.getElementById('banner-text'),
    bannerClose: document.getElementById('banner-close'),
    messages: document.getElementById('messages'),
    draft: document.getElementById('draft'),
    stop: document.getElementById('stop'),
    model: { gpt: document.getElementById('model-gpt'), claude: document.getElementById('model-claude') },
    ask: { gpt: document.getElementById('ask-gpt'), claude: document.getElementById('ask-claude') },
  };

  const state = {
    threads: [],
    activeId: '',
    providers: {},
    modelsLoaded: false,
    busy: null, // { controller, stopped } while a reply is streaming
  };

  /* ---------- storage ---------- */

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveThreads() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.threads));
      localStorage.setItem(ACTIVE_KEY, state.activeId);
      return true;
    } catch (_) {
      showBanner(
        'This browser could not save the thread (storage is full or blocked). Back up your threads, then delete old ones.'
      );
      return false;
    }
  }

  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function isThread(value) {
    return (
      value &&
      typeof value.id === 'string' &&
      Array.isArray(value.messages) &&
      value.messages.every(function (m) {
        return m && AUTHORS[m.author] && typeof m.text === 'string';
      })
    );
  }

  function activeThread() {
    return state.threads.find(function (t) { return t.id === state.activeId; }) || null;
  }

  function ensureThread() {
    let thread = activeThread();
    if (!thread) {
      thread = { id: newId(), title: '', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
      state.threads.unshift(thread);
      state.activeId = thread.id;
    }
    return thread;
  }

  function addMessage(thread, message) {
    message.id = newId();
    message.at = Date.now();
    thread.messages.push(message);
    thread.updatedAt = message.at;
    if (!thread.title && message.author === 'ivan') {
      thread.title = message.text.split('\n')[0].trim().slice(0, 60);
    }
    saveThreads();
    return message;
  }

  /* ---------- API ---------- */

  let apiBase = '';

  async function resolveApiBase() {
    try {
      if (window.IVAN_PROPOSAL_API_BASE_READY) await window.IVAN_PROPOSAL_API_BASE_READY;
    } catch (_) {}
    // IVAN_PROPOSAL_API_BASE already includes /api/database2 (see config/proposal-api-config.js).
    apiBase = String(window.IVAN_PRIVATE_API_BASE || window.IVAN_PROPOSAL_API_BASE || '').replace(/\/$/, '');
  }

  function apiUrl(path) {
    const suffix = '/os-console/cowrite' + path;
    if (!apiBase) return '/api/database2' + suffix;
    if (/\/api\/database2$/i.test(apiBase)) return apiBase + suffix;
    return apiBase + '/api/database2' + suffix;
  }

  function authHeaders(json) {
    const headers = {};
    if (json) headers['Content-Type'] = 'application/json';
    const token = window.SiteGate && SiteGate.getToken();
    if (token) headers.Authorization = 'Bearer ' + token;
    return headers;
  }

  function signInAgain() {
    if (window.SiteGate) SiteGate.clearToken();
    location.replace('/private/login.html?next=' + encodeURIComponent(location.pathname));
  }

  /* ---------- banner ---------- */

  function showBanner(text) {
    el.bannerText.textContent = text;
    el.banner.classList.remove('hidden');
  }

  function clearBanner() {
    el.banner.classList.add('hidden');
  }

  /* ---------- rendering ---------- */

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function formatTime(at) {
    if (!at) return '';
    return new Date(at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function nearBottom() {
    const box = el.messages;
    return box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  }

  function scrollToBottom() {
    el.messages.scrollTop = el.messages.scrollHeight;
    // On small screens the page scrolls, not the list.
    if (el.messages.scrollHeight <= el.messages.clientHeight + 1) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }

  function messageNode(message) {
    const node = make('li', 'msg msg-' + message.author);
    const head = make('div', 'msg-head');
    head.appendChild(make('span', 'msg-author', AUTHORS[message.author]));
    if (message.model) head.appendChild(make('span', 'msg-model', message.model));
    const time = make('span', 'msg-time', formatTime(message.at));
    head.appendChild(time);
    const actions = make('div', 'msg-actions');
    head.appendChild(actions);
    node.appendChild(head);
    const text = make('div', 'msg-text', message.text);
    node.appendChild(text);
    return { node: node, head: head, time: time, actions: actions, text: text };
  }

  function addFoot(parts, message) {
    const bits = [];
    if (message.usage && message.usage.inputTokens != null) {
      bits.push(
        Number(message.usage.inputTokens).toLocaleString() +
          ' tokens read · ' +
          Number(message.usage.outputTokens || 0).toLocaleString() +
          ' written'
      );
    }
    if (!bits.length && !message.notice) return;
    const foot = make('div', 'msg-foot');
    if (message.notice) foot.appendChild(make('span', 'msg-notice', message.notice + ' '));
    if (bits.length) foot.appendChild(document.createTextNode(bits.join(' · ')));
    parts.node.appendChild(foot);
  }

  function renderMessages() {
    const thread = activeThread();
    el.messages.textContent = '';
    if (!thread || !thread.messages.length) {
      const empty = make('li', 'empty');
      empty.appendChild(make('strong', '', 'Start a thread'));
      empty.appendChild(
        document.createTextNode(
          'Paste or write your text below, then ask GPT or Claude. Each of them sees everything said so far, including what the other wrote.'
        )
      );
      el.messages.appendChild(empty);
      return;
    }
    thread.messages.forEach(function (message) {
      const parts = messageNode(message);
      const copy = make('button', '', 'Copy');
      copy.type = 'button';
      copy.addEventListener('click', function () {
        navigator.clipboard.writeText(message.text).then(
          function () {
            copy.textContent = 'Copied';
            setTimeout(function () { copy.textContent = 'Copy'; }, 1500);
          },
          function () { showBanner('Could not copy — select the text and copy it by hand.'); }
        );
      });
      const remove = make('button', '', 'Delete');
      remove.type = 'button';
      remove.addEventListener('click', function () {
        if (state.busy) return;
        if (!confirm('Delete this message from the thread? Both models will stop seeing it.')) return;
        thread.messages = thread.messages.filter(function (m) { return m !== message; });
        thread.updatedAt = Date.now();
        saveThreads();
        renderAll();
      });
      parts.actions.appendChild(copy);
      parts.actions.appendChild(remove);
      addFoot(parts, message);
      el.messages.appendChild(parts.node);
    });
  }

  function renderThreadList() {
    el.threadList.textContent = '';
    state.threads
      .slice()
      .sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); })
      .forEach(function (thread) {
        const item = make('li');
        const button = make('button');
        button.type = 'button';
        button.disabled = Boolean(state.busy);
        if (thread.id === state.activeId) button.setAttribute('aria-current', 'true');
        button.appendChild(make('span', 't-title', thread.title || 'Untitled thread'));
        const count = thread.messages.length;
        button.appendChild(
          make('span', 't-meta', count + (count === 1 ? ' message · ' : ' messages · ') + formatTime(thread.updatedAt))
        );
        button.addEventListener('click', function () {
          state.activeId = thread.id;
          saveThreads();
          clearBanner();
          renderAll();
          scrollToBottom();
        });
        item.appendChild(button);
        el.threadList.appendChild(item);
      });
  }

  function renderControls() {
    const thread = activeThread();
    const busy = Boolean(state.busy);
    el.title.value = thread ? thread.title : '';
    el.title.disabled = !thread;
    el.download.disabled = !thread || !thread.messages.length;
    el.deleteThread.disabled = !thread || busy;
    el.newThread.disabled = busy;
    el.restore.disabled = busy;
    el.stop.classList.toggle('hidden', !busy);
    PROVIDERS.forEach(function (id) {
      const provider = state.providers[id];
      const usable = provider && provider.configured && el.model[id].value;
      el.ask[id].disabled = busy || !usable;
      el.model[id].disabled = busy || !(provider && provider.configured);
    });
  }

  function renderAll() {
    renderThreadList();
    renderMessages();
    renderControls();
  }

  /* ---------- models ---------- */

  function fillModelSelect(id) {
    const select = el.model[id];
    const provider = state.providers[id];
    const saved = readJson(MODEL_KEY, {})[id] || '';
    select.textContent = '';

    function option(value, label) {
      const node = make('option', '', label);
      node.value = value;
      select.appendChild(node);
    }

    if (!provider) {
      option('', state.modelsLoaded ? 'Models unavailable' : 'Loading models…');
      return;
    }
    if (!provider.configured) {
      option('', 'Not set up (' + provider.keyName + ' missing)');
      return;
    }
    const models = provider.models.slice();
    // Keep a remembered choice selectable even if the live list could not be read.
    if (saved && !models.some(function (m) { return m.id === saved; })) {
      models.unshift({ id: saved, label: saved });
    }
    if (!models.length) {
      option('', 'No models listed');
      return;
    }
    const chosen = saved || provider.defaultModel || '';
    if (!chosen) option('', 'Choose a ' + AUTHORS[id] + ' model…');
    models.forEach(function (m) {
      option(m.id, m.label && m.label !== m.id ? m.label + ' — ' + m.id : m.id);
    });
    select.value = chosen;
  }

  async function loadModels() {
    let data;
    try {
      const res = await fetch(apiUrl('/models'), { headers: authHeaders(false) });
      if (res.status === 401) return signInAgain();
      data = await res.json();
      if (!res.ok || data.status !== 'ok') throw new Error(data.message || 'Request failed (' + res.status + ')');
    } catch (err) {
      showBanner('Could not reach the Co-write service: ' + (err.message || err));
      state.modelsLoaded = true;
      PROVIDERS.forEach(fillModelSelect);
      renderControls();
      return;
    }
    state.providers = data.providers || {};
    state.modelsLoaded = true;
    PROVIDERS.forEach(fillModelSelect);
    const problems = PROVIDERS.map(function (id) { return state.providers[id] && state.providers[id].error; }).filter(Boolean);
    if (problems.length) showBanner(problems.join(' '));
    renderControls();
  }

  /* ---------- asking ---------- */

  async function ask(providerId) {
    if (state.busy) return;
    clearBanner();
    const model = el.model[providerId].value;
    const name = AUTHORS[providerId];
    if (!model) return showBanner('Choose a ' + name + ' model first.');

    const draft = el.draft.value.trim();
    const existing = activeThread();
    if (!draft && !(existing && existing.messages.length)) {
      return showBanner('Write something first — there is nothing to reply to yet.');
    }

    const thread = ensureThread();
    if (draft) {
      addMessage(thread, { author: 'ivan', text: draft });
      el.draft.value = '';
    }

    const controller = new AbortController();
    state.busy = { controller: controller, stopped: false };
    renderAll();

    const pending = { author: providerId, model: model, text: '' };
    const parts = messageNode(pending);
    parts.time.textContent = '';
    parts.text.textContent = name + ' is thinking…';
    parts.text.classList.add('msg-waiting');
    el.messages.appendChild(parts.node);
    scrollToBottom();

    let finished = null; // the server's closing event
    let failure = '';

    function onEvent(event) {
      if (event.type === 'delta' && event.text) {
        const stick = nearBottom();
        if (!pending.text) {
          parts.text.textContent = '';
          parts.text.classList.remove('msg-waiting');
        }
        pending.text += event.text;
        parts.text.appendChild(document.createTextNode(event.text));
        if (stick) scrollToBottom();
      } else if (event.type === 'done') {
        finished = event;
      } else if (event.type === 'error') {
        failure = event.message || name + ' request failed';
      }
    }

    try {
      const res = await fetch(apiUrl('/reply'), {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({
          provider: providerId,
          model: model,
          messages: thread.messages.map(function (m) {
            return { author: m.author, model: m.model || '', text: m.text };
          }),
        }),
        signal: controller.signal,
      });
      if (res.status === 401) return signInAgain();
      const type = res.headers.get('content-type') || '';
      if (!res.ok || type.indexOf('text/event-stream') === -1) {
        const data = await res.json().catch(function () { return {}; });
        throw new Error(
          data.message ||
            (res.status === 413
              ? 'This thread is too large to send. Start a new thread, or delete some messages.'
              : 'The Co-write service returned an error (' + res.status + ').')
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        let cut;
        while ((cut = buffer.indexOf('\n\n')) !== -1) {
          const block = buffer.slice(0, cut);
          buffer = buffer.slice(cut + 2);
          block.split('\n').forEach(function (line) {
            if (line.indexOf('data:') !== 0) return; // comments keep the connection alive
            try {
              onEvent(JSON.parse(line.slice(5)));
            } catch (_) {}
          });
        }
      }
      if (!finished && !failure) failure = 'The connection dropped before ' + name + ' finished.';
    } catch (err) {
      if (!state.busy.stopped) failure = err.message || String(err);
    }

    const stopped = state.busy.stopped;
    state.busy = null;

    if (finished && finished.refusal) {
      // A declined reply is not part of the work; say so and keep the thread clean.
      showBanner(finished.refusal + ' Nothing was added to the thread.');
    } else if (pending.text.trim()) {
      const notices = [];
      if (finished && finished.notice) notices.push(finished.notice);
      if (stopped) notices.push('Stopped early.');
      if (failure) notices.push('Cut off before it finished.');
      addMessage(thread, {
        author: providerId,
        model: (finished && finished.model) || model,
        text: pending.text.trim(),
        usage: finished ? finished.usage : undefined,
        notice: notices.join(' ') || undefined,
      });
      if (failure) showBanner(failure);
    } else if (failure) {
      showBanner(failure);
    } else if (!stopped) {
      showBanner(name + ' returned no text. Try asking again.');
    }

    const stick = nearBottom();
    renderAll();
    if (stick) scrollToBottom();
  }

  /* ---------- export / backup ---------- */

  function downloadFile(name, type, content) {
    const url = URL.createObjectURL(new Blob([content], { type: type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function slug(text) {
    return (text || 'thread').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'thread';
  }

  function threadMarkdown(thread) {
    const lines = ['# ' + (thread.title || 'Untitled thread'), ''];
    thread.messages.forEach(function (m) {
      const who = AUTHORS[m.author] + (m.model ? ' (' + m.model + ')' : '');
      lines.push('## ' + who + ' — ' + formatTime(m.at), '', m.text, '');
    });
    return lines.join('\n');
  }

  /* ---------- events ---------- */

  PROVIDERS.forEach(function (id) {
    el.ask[id].addEventListener('click', function () { ask(id); });
    el.model[id].addEventListener('change', function () {
      const saved = readJson(MODEL_KEY, {});
      saved[id] = el.model[id].value;
      try {
        localStorage.setItem(MODEL_KEY, JSON.stringify(saved));
      } catch (_) {}
      renderControls();
    });
  });

  el.stop.addEventListener('click', function () {
    if (!state.busy) return;
    state.busy.stopped = true;
    state.busy.controller.abort();
  });

  el.newThread.addEventListener('click', function () {
    state.activeId = '';
    clearBanner();
    renderAll();
    el.draft.focus();
  });

  el.title.addEventListener('change', function () {
    const thread = activeThread();
    if (!thread) return;
    thread.title = el.title.value.trim();
    saveThreads();
    renderThreadList();
  });

  el.deleteThread.addEventListener('click', function () {
    const thread = activeThread();
    if (!thread || state.busy) return;
    if (!confirm('Delete "' + (thread.title || 'Untitled thread') + '"? This cannot be undone.')) return;
    state.threads = state.threads.filter(function (t) { return t !== thread; });
    state.activeId = '';
    saveThreads();
    renderAll();
  });

  el.download.addEventListener('click', function () {
    const thread = activeThread();
    if (thread) downloadFile(slug(thread.title) + '.md', 'text/markdown', threadMarkdown(thread));
  });

  el.backup.addEventListener('click', function () {
    downloadFile(
      'cowrite-backup-' + new Date().toISOString().slice(0, 10) + '.json',
      'application/json',
      JSON.stringify({ app: 'cowrite', version: 1, exportedAt: new Date().toISOString(), threads: state.threads }, null, 2)
    );
  });

  el.restore.addEventListener('click', function () { el.restoreFile.click(); });

  el.restoreFile.addEventListener('change', async function () {
    const file = el.restoreFile.files[0];
    el.restoreFile.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const incoming = (data && data.threads) || [];
      if (data.app !== 'cowrite' || !Array.isArray(incoming) || !incoming.every(isThread)) {
        throw new Error('not a Co-write backup');
      }
      const byId = new Map(state.threads.map(function (t) { return [t.id, t]; }));
      incoming.forEach(function (t) { byId.set(t.id, t); });
      state.threads = Array.from(byId.values());
      if (saveThreads()) clearBanner();
      renderAll();
    } catch (err) {
      showBanner('Could not restore that file: ' + (err.message || err));
    }
  });

  el.bannerClose.addEventListener('click', clearBanner);

  /* ---------- start ---------- */

  const stored = readJson(STORE_KEY, []);
  state.threads = Array.isArray(stored) ? stored.filter(isThread) : [];
  let savedActive = '';
  try {
    savedActive = localStorage.getItem(ACTIVE_KEY) || '';
  } catch (_) {}
  state.activeId = state.threads.some(function (t) { return t.id === savedActive; }) ? savedActive : '';

  PROVIDERS.forEach(fillModelSelect);
  renderAll();
  scrollToBottom();
  resolveApiBase().then(loadModels);
})();
