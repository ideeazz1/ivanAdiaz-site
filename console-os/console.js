(function () {
'use strict';
const ENDPOINT = 'https://decision-os-api-xpxhayoxhq-vp.a.run.app/api/database2/os-console/public-status';
const $ = id => document.getElementById(id);
let snapshot = null, lane = 'all', loading = false;
const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function date(value) { return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}).format(new Date(value)); }
function row(item) {
 const state = item.receiptState === 'valid' ? 'recorded' : item.receiptState === 'missing' ? 'missing' : 'unavailable';
 const result = state === 'recorded' ? item.outcome || 'Outcome withheld' : state === 'missing' ? 'No receipt' : 'Receipt unreadable';
 const explanation = item.scheduleType === 'event' || item.scheduleType === 'on_demand' ? 'Runs when triggered. The receipt records the latest published execution.' : 'The schedule is registered intent. Execution time and outcome come from the latest published receipt.';
 return '<details class="row" data-id="'+escape(item.id)+'"><summary><span><strong class="name">'+escape(item.name)+'</strong><span class="provider">'+escape(item.lane)+' / '+escape(item.provider)+'</span></span><span class="cadence">'+escape(item.schedule)+'</span><span class="evidence"><span class="badge '+state+'">'+escape(result)+'</span><time class="run-time"'+(item.lastRunAt?' datetime="'+escape(item.lastRunAt)+'"':'')+'>'+(item.lastRunAt?escape(date(item.lastRunAt)):'No public run timestamp')+'</time></span></summary><div class="detail"><p><strong>Registered state: '+escape(item.registeredState)+'</strong><br>'+escape(explanation)+'</p><p><strong>Last recorded outcome: '+escape(result)+'</strong><br>Execution evidence is reported by the worker. Client details and full receipts stay private.</p></div></details>';
}
// Titles, subgroup order and row order come from the shared factual projection.
function sectionMarkup(matches) {
 return snapshot.groups.map(section=>{
  const entries=matches.filter(item=>item.lane===section.lane);
  if(!entries.length)return '';
  const labels=section.sections || [];
  const items=labels.map(label=>{
   const members=entries.filter(item=>item.section===label);
   return members.length?'<h4 class="registry-subsection-title">'+escape(label)+'</h4>'+members.map(row).join(''):'';
  }).join('')+entries.filter(item=>!labels.includes(item.section)).map(row).join('');
  return '<section class="registry-section" aria-label="'+escape(section.title)+'"><h3 class="registry-section-title">'+escape(section.title)+'</h3>'+items+'</section>';
 }).join('');
}
function render() {
 if (!snapshot) return;
 const all=snapshot.automations.filter(item=>item.registeredState!=='retired'), query=$('search').value.toLowerCase().trim();
 const opened=new Set(Array.from(document.querySelectorAll('.row[open]')).map(el=>el.dataset.id));
 const matches=all.filter(item=>(lane==='all'||item.lane===lane)&&[item.name,item.provider,item.schedule].join(' ').toLowerCase().includes(query));
 $('rows').innerHTML=(lane==='all'?sectionMarkup(matches):matches.map(row).join(''))||'<p class="empty">No systems match this view.</p>';
 document.querySelectorAll('.row').forEach(el=>{el.open=opened.has(el.dataset.id);});
 $('total').textContent=all.length;
 $('recorded').textContent=all.filter(x=>x.receiptState==='valid').length;
 $('missing').textContent=all.filter(x=>x.receiptState!=='valid').length;
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
  if(payload.schemaVersion!==1||!Array.isArray(payload.automations)||!Array.isArray(payload.groups)||!Number.isFinite(Date.parse(payload.fetchedAt))) throw new Error('Invalid response');
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
