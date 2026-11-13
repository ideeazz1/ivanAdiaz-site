"""Export only allowlisted operational metadata from a local ivan-cos main snapshot.
Usage: python scripts/refresh-mic-reference.py <ivan-cos-checkout>
Fetch/review origin/main first. No customer content or credentials are exported.
"""
import json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path
repo = sys.argv[1]
def read(path):
    return subprocess.check_output(['git','-C',repo,'show','origin/main:'+path],encoding='utf-8',stderr=subprocess.DEVNULL)
registry=json.loads(read('registry/automations.json'))
rows=[]
for item in registry['automations']:
    if item.get('lane')!='Mortgage' and 'END' not in item.get('name',''): continue
    if item.get('provider_state')=='retired': continue
    run={}
    if item.get('receipt_path'):
        try: run=json.loads(read(item['receipt_path'])).get('run',{})
        except subprocess.CalledProcessError: pass
    rows.append({ 'id':item['provider_id'], 'name':item['name'].replace('Mortgage - ','').replace('Ivan OS - ',''),
        'role':item.get('role','Worker'),'schedule':item.get('schedule','Not recorded'),
        'registeredState':item.get('provider_state','unknown'),
        'outcome':run.get('outcome'), 'completedAt':run.get('completed_at'),
        'contract':item.get('canonical_contract'), 'receiptPath':item.get('receipt_path') })
output={'checkedAt':datetime.now(timezone.utc).isoformat(),'sourceCommit':subprocess.check_output(['git','-C',repo,'rev-parse','origin/main'],text=True).strip(),'workers':rows}
path=Path(__file__).resolve().parent.parent/'experience/mortgage-intelligence/reference.json'
path.write_text(json.dumps(output,indent=2)+'\n',encoding='utf-8')
print('Exported',len(rows),'workers; only allowlisted metadata.')
