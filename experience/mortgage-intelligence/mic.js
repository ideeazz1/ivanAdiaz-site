const stations=[["Client data", "Facts, linked", "Contacts, Pipeline, Property and Loan fields hold facts. Notes and communication history supply relationship context.", "Operational foundation"], ["Intake", "Capture the signal", "Existing document and contact intake link incoming information to the correct relationship. Identity ambiguity stays visible.", "Operational"], ["Research", "5 AM preparation", "Research Scout reads client history. Enrichment workers verify missing facts. Results return to the Intelligence Box; unavailable evidence remains unknown.", "Operational; enrichment can be partial"], ["Opportunity Scout", "Find a reason", "Scan all Journey and Pipeline seeds for candidate needs. Existing Renter receipts help distinguish future promises, pending drafts and genuine information gaps.", "Read-only verified; daily integration deployed"], ["M Brain", "Choose the next move", "Coordinate opportunities and timing. Recommend action, wait, review a journey or request bounded research. Recommendations do not automatically change Pipeline or send a message.", "Deployed; recurring-run proof pending"], ["Communication", "7 AM follow-through", "Daily Follow Up brings review context and drafts to Ivan. Renter Journey prepares drafts on its own cadence. END is the marketing design layer; automatic brief consumption is not verified.", "Follow-up operational; END handoff proposed"], ["Client response", "Listen again", "A reply can change a need, commitment or timeline. At 9 PM, EOD reconciles eligible conversations into Notes and manages Next Touch.", "EOD operational"], ["New intelligence", "Close the loop", "Updated facts feed the next daily pass. Measuring conversations and opportunity progress is the next step; autonomous learning from business outcomes remains proposed.", "Feedback capture operational; outcome learning proposed"]];
const buttons=[...document.querySelectorAll('[data-station]')];
const detail=document.querySelector('#station-detail');
buttons.forEach((b,i)=>b.addEventListener('click',()=>{
 buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 detail.hidden=false;detail.querySelector('h3').textContent=stations[i][0];
 detail.querySelector('.badge').textContent=stations[i][3];detail.querySelector('p').textContent=stations[i][2];
}));
document.querySelector('#close-detail').addEventListener('click',()=>{detail.hidden=true;const selected=buttons.find(b=>b.getAttribute('aria-pressed')==='true');buttons.forEach(b=>b.setAttribute('aria-pressed','false'));selected?.focus();});
const scenarios=[['Purchase interest','Clarify the need','Confirm timing before choosing outreach.','\u2315'],['Future contact request','Wait until the agreed date','Respect the commitment. Prepare internally.','\u23F8'],['A specific property','Recommend personal action','Review the opportunity with Ivan.','\u2197']];
document.querySelectorAll('[data-scenario]').forEach((b,i)=>b.addEventListener('click',()=>{document.querySelectorAll('[data-scenario]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['signal-text','decision-title','decision-copy','result-icon'].forEach((id,j)=>document.getElementById(id).textContent=scenarios[i][j]);document.querySelector('.result').dataset.state=i;}));
document.querySelector('.result').setAttribute('aria-live','polite');

const viewButtons=[...document.querySelectorAll('[data-view]')];
viewButtons.forEach(button=>button.addEventListener('click',()=>{
 const reference=button.dataset.view==='reference';
 viewButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.getElementById('operating-reference').hidden=!reference;
 document.querySelectorAll('.scenario,.rhythm,.proof').forEach(s=>s.hidden=reference);
 document.body.classList.toggle('reference-view',reference);
}));
const workerFilter=document.getElementById('worker-filter');
workerFilter.addEventListener('change',()=>{
 let count=0;document.querySelectorAll('.worker-row').forEach(row=>{
 const value=workerFilter.value;
 const show=value==='all'||row.dataset.group===value||(value==='paused'&&row.dataset.state==='paused')||(value==='missing'&&row.dataset.missing==='true');
 row.hidden=!show;if(show)count++;
 });document.getElementById('worker-count').textContent=count+' workers';
});

const bdays=[['Replied last month. Conversation is active.','Close','\u201CHappy birthday, Maria. I hope today is easy and full of the people you love.\u201D'],['Last exchange this spring. Friendly, nothing open.','Friendly','\u201CHappy birthday, Maria. Wishing you a great year ahead.\u201D'],['Last contact two years ago, about a home equity line. No replies since.','Been a while','\u201CHappy birthday, Maria. I know it has been a while. I wanted to wish you the best day.\u201D'],['Not enough history to judge. No guess is made.','Short and simple','\u201CHappy birthday, Maria. Have a great day.\u201D']];
document.querySelectorAll('[data-bday]').forEach((b,i)=>b.addEventListener('click',()=>{document.querySelectorAll('[data-bday]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['bday-finding','bday-card','bday-copy'].forEach((id,j)=>document.getElementById(id).textContent=bdays[i][j]);}));
document.querySelector('.bday-result').setAttribute('aria-live','polite');
