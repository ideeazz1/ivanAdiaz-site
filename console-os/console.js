(function () {
'use strict';
const ENDPOINT = 'https://decision-os-api-xpxhayoxhq-vp.a.run.app/api/database2/os-console/public-status';
const $ = id => document.getElementById(id);
let snapshot = null, lane = 'all', loading = false;
const labels = { recorded: 'Run recorded', paused: 'Paused', missing: 'No receipt', unavailable: 'Evidence unavailable' };
const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function date(value) { return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}).format(new Date(value)); }
function row(item) {
 const state = Object.hasOwn(labels,item.status) ? item.status : 'unavailable';
 const evidence = item.outcome || (item.status === 'recorded' ? 'Recorded outcome unavailable' : labels[state]);
 const lifecycle = item.registeredState === 'paused' ? 'Paused — ' : item.registeredState === 'disabled' ? 'Disabled — ' : '';
 return '<details class="row" data-id="'+escape(item.id || item.name)+'"><summary><span><strong class="name">'+escape(item.name)+'</strong><span class="provider">'+escape(item.lane)+' / '+escape(item.provider)+'</span></span><span class="cadence">'+escape(lifecycle + item.schedule)+'</span><span class="evidence"><span class="badge '+state+'">'+escape(evidence)+'</span><time class="run-time"'+(item.lastRunAt?' datetime="'+escape(item.lastRunAt)+'"':'')+'>'+(item.lastRunAt?escape(date(item.lastRunAt)):'No recorded run timestamp')+'</time></span></summary><div class="detail"><p><strong>Registered state: '+escape(item.registeredState)+'</strong><br>Schedule and lifecycle are registered intent, not proof of execution.</p><p><strong>Last recorded outcome: '+escape(item.outcome || 'No factual result available')+'</strong><br>The latest valid registered receipt supplies the execution result. Private details remain in the owner view.</p></div></details>';
}
function sectionMarkup(matches) {
 const sections = snapshot.laneOrder || ['Shared Ivan OS','Peregrine','Mortgage','Career'];
 const titles = snapshot.laneTitles || {};
 const sectionsByLane = snapshot.sectionOrder || {};
 const blocks = sections.map(laneName => {
  const laneMatches = matches.filter(({item}) => item.lane === laneName);
  if (!laneMatches.length) return '';
  const sectionNames = sectionsByLane[laneName] || [];
  let html = '';
  for (const name of sectionNames) {
   const members = laneMatches.filter(({item}) => item.section === name);
   if (members.length) html += '<h4 class="registry-subsection-title">'+escape(name)+'</h4>'+members.map(({item})=>row(item)).join('');
  }
  const other = laneMatches.filter(({item}) => !sectionNames.includes(item.section));
  html += other.map(({item})=>row(item)).join('');
  return '<section class="registry-section" aria-label="'+escape(titles[laneName] || laneName)+'"><h3 class="registry-section-title">'+escape(titles[laneName] || laneName)+'</h3>'+html+'</section>';
 }).join('');
 const other = matches.filter(({item}) => !sections.includes(item.lane));
 return blocks + (other.length ? '<section class="registry-section" aria-label="OTHER SYSTEMS"><h3 class="registry-section-title">OTHER SYSTEMS</h3>'+other.map(({item})=>row(item)).join('')+'</section>' : '');
}
function render() {
 if (!snapshot) return;
 const all=snapshot.automations, query=$('search').value.toLowerCase().trim();
 const opened=new Set(Array.from(document.querySelectorAll('.row[open]')).map(el=>el.dataset.id));
 const matches=all.map((item,index)=>({item,index})).filter(({item})=>(lane==='all'||item.lane===lane)&&[item.name,item.provider,item.schedule].join(' ').toLowerCase().includes(query));
 $('rows').innerHTML=(lane==='all'?sectionMarkup(matches):matches.map(({item})=>row(item)).join(''))||'<p class="empty">No systems match this view.</p>';
 document.querySelectorAll('.row').forEach(el=>{el.open=opened.has(el.dataset.id);});
 $('total').textContent=all.length;
 $('recorded').textContent=all.filter(x=>x.lastRunAt).length;
 $('attention').textContent=all.filter(x=>x.status!=='recorded').length;
 $('paused').textContent=all.filter(x=>x.registeredState==='paused').length;
 $('count').textContent=matches.length+' of '+all.length+' systems. Select a row for evidence details. All times Chicago.';
}
async function refresh() {
 if(loading) return;
 loading=true; $('refresh').disabled=true; $('rows').setAttribute('aria-busy','true');
 const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),45000);
 try {
  const response=await fetch(ENDPOINT,{cache:'no-store',credentials:'omit',signal:controller.signal});
  if(!response.ok) throw new Error('Unavailable');
  const payload=await response.json();
  if(payload.schemaVersion!==1||!Array.isArray(payload.automations)||!Number.isFinite(Date.parse(payload.fetchedAt))) throw new Error('Invalid response');
  snapshot=payload; render();
  const old=Date.now()-Date.parse(payload.fetchedAt)>300000;
  const current=payload.sourceStatus==='current'&&!old;
  $('feed-dot').className='status-dot '+(current?'current':'stale');
  $('feed-message').textContent=(current?'Source checked ':payload.sourceStatus==='partial'&&!old?'Some evidence could not be read. Source checked ':'Showing older evidence. Last source check ')+date(payload.fetchedAt)+'. Auto-refresh: 2 min.';
 } catch (_) {
  $('feed-dot').className='status-dot stale';
  $('feed-message').textContent=snapshot?'Connection unavailable. Keeping evidence from '+date(snapshot.fetchedAt)+'. Retrying every 2 min.':'Status feed is temporarily unavailable. Retrying every 2 min.';
  if(!snapshot) $('rows').innerHTML='<p class="empty">No verified status to display yet. Please try Refresh status.</p>';
 } finally {clearTimeout(timeout);loading=false;$('refresh').disabled=false;$('rows').setAttribute('aria-busy','false');}
}
document.querySelectorAll('[data-lane]').forEach(button=>button.addEventListener('click',()=>{lane=button.dataset.lane;document.querySelectorAll('[data-lane]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
$('search').addEventListener('input',render);$('refresh').addEventListener('click',refresh);
setInterval(()=>{if(!document.hidden)refresh();},120000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
refresh();
})();
