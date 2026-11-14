(function () {
'use strict';
const ENDPOINT = 'https://decision-os-api-xpxhayoxhq-vp.a.run.app/api/database2/os-console/public-status';
const $ = id => document.getElementById(id);
let snapshot = null, lane = 'all', loading = false;
const labels = { recorded: 'Run recorded', aging: 'Aging receipt', attention: 'Needs attention', paused: 'Paused', retired: 'Retired', missing: 'No receipt', unavailable: 'Evidence unavailable', private_evidence: 'Private evidence' };
const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function date(value) { return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}).format(new Date(value)); }
function row(item, index) {
 const state = Object.hasOwn(labels,item.status) ? item.status : 'unavailable';
 const explanation = item.scheduleType === 'event' || item.scheduleType === 'on_demand' ? 'Runs when triggered; receipt age alone does not indicate a failure.' : item.freshnessWindowHours ? 'Aging means the receipt exceeds a conservative ' + item.freshnessWindowHours + '-hour freshness window. It does not prove a missed run.' : 'No automatic freshness window is available for this schedule.';
 return '<details class="row" data-index="'+index+'"><summary><span><strong class="name">'+escape(item.name)+'</strong><span class="provider">'+escape(item.lane)+' / '+escape(item.provider)+'</span></span><span class="cadence">'+escape(item.schedule)+'</span><span class="evidence"><span class="badge '+state+'">'+labels[state]+'</span><time class="run-time"'+(item.lastRunAt?' datetime="'+escape(item.lastRunAt)+'"':'')+'>'+(item.lastRunAt?escape(date(item.lastRunAt)):'No public run timestamp')+'</time></span></summary><div class="detail"><p><strong>Registered state: '+escape(item.registeredState)+'</strong><br>'+escape(explanation)+'</p><p><strong>Last recorded outcome: '+escape(item.outcome || 'Not available')+'</strong><br>Execution evidence is reported by the worker. Client details and full receipts are available only in the owner view.</p></div></details>';
}
// Display-only sections mirror the Daily Automation Update; registry data stays authoritative.
const sectionOrder = [
 {lane:'Shared Ivan OS',title:'SHARED IVAN OS'},
 {lane:'Peregrine',title:'PEREGRINE'},
 {lane:'Mortgage',title:'MORTGAGE INTELLIGENCE CORE'},
 {lane:'Career',title:'CAREER'}
];
function sectionMarkup(matches) {
 const sections=sectionOrder.map(section=>{
  const entries=matches.filter(({item})=>item.lane===section.lane);
  if(!entries.length)return '';
  const items=entries.map(({item,index})=>row(item,index)).join('');
  return '<section class="registry-section" aria-label="'+escape(section.title)+'"><h3 class="registry-section-title">'+escape(section.title)+'</h3>'+items+'</section>';
 }).join('');
 const other=matches.filter(({item})=>!sectionOrder.some(s=>s.lane===item.lane));
 return sections+(other.length?'<section class="registry-section" aria-label="OTHER SYSTEMS"><h3 class="registry-section-title">OTHER SYSTEMS</h3>'+other.map(({item,index})=>row(item,index)).join('')+'</section>':'');
}
function render() {
 if (!snapshot) return;
 const all=snapshot.automations, query=$('search').value.toLowerCase().trim();
 const opened=new Set(Array.from(document.querySelectorAll('.row[open]')).map(el=>el.dataset.index));
 const matches=all.map((item,index)=>({item,index})).filter(({item})=>(lane==='all'||item.lane===lane)&&[item.name,item.provider,item.schedule].join(' ').toLowerCase().includes(query));
 $('rows').innerHTML=(lane==='all'?sectionMarkup(matches):matches.map(({item,index})=>row(item,index)).join(''))||'<p class="empty">No systems match this view.</p>';
 document.querySelectorAll('.row').forEach(el=>{el.open=opened.has(el.dataset.index);});
 $('total').textContent=all.length;
 $('recorded').textContent=all.filter(x=>x.lastRunAt).length;
 $('attention').textContent=all.filter(x=>['attention','aging','missing','unavailable'].includes(x.status)).length;
 $('paused').textContent=all.filter(x=>['paused','retired'].includes(x.status)).length;
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
