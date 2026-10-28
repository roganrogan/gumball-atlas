import {filterCharacters} from './catalog.mjs';

const paths={
 'arrow-right':'M4 12h16m-6-6 6 6-6 6',
 'arrow-up-right':'M6 18 18 6M6 6h12v12',
 'chevron-down':'m6 9 6 6 6-6','chevron-left':'m15 6-6 6 6 6','chevron-right':'m9 6 6 6-6 6',
 'search':'M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
 'compass':'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM16 8l-2.5 5.5L8 16l2.5-5.5L16 8Z',
 'sparkles':'m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3ZM21 2v4M19 4h4',
 'grid':'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
 'flag':'M5 22V3m0 0c5-5 9 5 14 0v10c-5 5-9-5-14 0',
 'swords':'m4 3 17 17M3 3l1 5 4-4-5-1ZM3 17l4 4m-5 1 6-6m9 5 4-4m1 5-6-6M16 8l5-5-1 5-3 3',
 'wand':'m4 20 13-13 3 3L7 23ZM3 3v4M1 5h4m14-4v4m-2-2h4M9 6v4m-2-2h4',
 'map':'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16',
 'sliders':'M4 21v-7m0-4V3m8 18V10m0-4V3m8 18v-3m0-4V3M1 14h6m2-8h6m2 12h6',
 'users':'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M13 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 'lightbulb':'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z',
 'external-link':'M15 3h6v6m0-6L10 14m-1-11H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4',
 'x':'m6 6 12 12M6 18 18 6',
 'shield':'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4ZM9 12l2 2 4-4',
 'flame':'M12 2s2 6-2 9c-2-1-3-3-3-3S2 14 5 19s12 4 14-1-2-10-2-10-1 5-4 4c3-6-1-10-1-10Z',
 'book':'M12 5C9 2 5 2 2 3v17c4-1 7-1 10 1m0-16c3-3 7-3 10-2v17c-4-1-7-1-10 1V5Z',
 'link':'m10 13 4-4m-7 7-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
 'pin':'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 'shirt':'m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c0 4-8 4-8 0Z'
};
const icon=(name)=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.compass}"/></svg>`;
const hydrateIcons=(root=document)=>root.querySelectorAll('[data-icon]').forEach(el=>{el.outerHTML=icon(el.dataset.icon);});
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
hydrateIcons();
const camps=[
 {name:'',label:'全部冈布奥',icon:'grid',color:'#ab8e58',tint:'#eee5d2'},
 {name:'奥鲁维之刃',label:'奥鲁维之刃',icon:'swords',color:'#a28549',tint:'#ede5d2'},
 {name:'卡纳斯的启示',label:'卡纳斯的启示',icon:'wand',color:'#839275',tint:'#e5e9dd'},
 {name:'游荡者之歌',label:'游荡者之歌',icon:'compass',color:'#769394',tint:'#dfE8e5'},
 {name:'深渊的咆哮',label:'深渊的咆哮',icon:'flame',color:'#9c8296',tint:'#eae1e6'}
];
const campInfo=name=>camps.find(c=>c.name===name)||camps[0];
const campStyle=name=>{const c=campInfo(name);return `--camp-color:${c.color};--camp-tint:${c.tint}`;};
let data,characters=[],page=1,lastTrigger=null,currentDetail=null,toastTimer;
const state={camp:'',type:'',query:''};
const pageSize=24;

function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2300);}
function renderCamps(){
  $('#camp-options').innerHTML=camps.map(c=>`<button class="camp-button ${state.camp===c.name?'active':''}" data-camp="${c.name}" aria-pressed="${state.camp===c.name}" style="${campStyle(c.name)}"><span class="camp-symbol">${icon(c.icon)}</span><span>${c.label}</span><span class="camp-count">${c.name?characters.filter(x=>x.camp===c.name).length:characters.length}</span></button>`).join('');
}
function render(){
  const focused=document.activeElement;
  const focusSelector=focused.matches('[data-camp]')?`[data-camp="${CSS.escape(focused.dataset.camp)}"]`:focused.matches('#pagination button')?`#pagination button[aria-label="${CSS.escape(focused.getAttribute('aria-label'))}"]`:null;
  const filtered=filterCharacters(characters,state);
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
  page=Math.min(page,pages);
  const visible=filtered.slice((page-1)*pageSize,page*pageSize);
  $('#character-grid').innerHTML=visible.map(c=>`<article class="character-card" style="${campStyle(c.camp)}"><button class="card-main" data-detail="${c.id}" aria-label="查看${esc(c.displayName)}详情"><div class="card-art"><span class="card-number">NO. ${String(c.id).padStart(3,'0')}</span><img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy" width="180" height="160"></div><div class="card-info"><h3>${esc(c.displayName)}</h3><span class="card-camp">${esc(c.camp)}</span><span class="card-type">${esc(c.type)}</span></div></button></article>`).join('');
  $('#character-grid').setAttribute('aria-busy','false');
  $('#empty-state').hidden=filtered.length>0;
  $('#result-description').innerHTML=`${state.camp||'全部伙伴'} <span>·</span> 共 <b>${filtered.length}</b> 位冈布奥${state.query?' · 搜索“'+esc(state.query.trim())+'”':''}`;
  document.querySelectorAll('[data-type]').forEach(b=>{b.classList.toggle('active',b.dataset.type===state.type);b.setAttribute('aria-pressed',String(b.dataset.type===state.type));});
  renderCamps();
  $('#pagination').innerHTML='';
  if(filtered.length){
    const nums=[...new Set([1,page-1,page,page+1,pages].filter(n=>n>=1&&n<=pages))].sort((a,b)=>a-b);
    let prev=0;
    $('#pagination').innerHTML=`<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="上一页">${icon('chevron-left')}</button>`+nums.map(n=>{const dots=n-prev>1?'<span class="pagination-dots">…</span>':'';prev=n;return dots+`<button data-page="${n}" ${n===page?'class="active" aria-current="page"':''} aria-label="第${n}页">${n}</button>`;}).join('')+`<button data-page="${page+1}" ${page===pages?'disabled':''} aria-label="下一页">${icon('chevron-right')}</button><span class="page-label">${page} / ${pages} 页</span>`;
  }
  if(focusSelector&&!focused.isConnected){
    let replacement=document.querySelector(focusSelector);
    if(replacement?.disabled)replacement=$('#pagination [aria-current="page"]');
    (replacement||$('#search')).focus({preventScroll:true});
  }
}
function reset(){Object.assign(state,{camp:'',type:'',query:''});$('#search').value='';page=1;render();}
function renderCombos(){
  const names=['从初次相遇开始','向更远的迷宫出发','并肩，就是最强技能','各有所长，冒险更从容'];
  $('#combo-grid').innerHTML=data.combinations.map((combo,i)=>`<article class="combo-card"><div class="combo-card-top"><span>${String(combo.id).padStart(2,'0')}</span> 推荐组合</div><div class="combo-members">${combo.members.map(m=>{const c=characters.find(c=>c.name===m.name);return `<button class="combo-member" ${c?`data-detail="${c.id}"`:''} aria-label="查看${esc(m.name)}"><img loading="lazy" src="${esc(c?.image||m.imageUrl)}" alt="${esc(m.name)}"><span>${esc(m.name.replace(/冈布奥$/,''))}</span></button>`;}).join('')}</div><p class="combo-caption">${names[i]||'找到你的默契伙伴'}</p></article>`).join('');
}
function detailSection(title,key,iconName,paragraphs){
  return `<section class="detail-section"><h3>${icon(iconName)}${title}</h3>${paragraphs?.length?paragraphs.map(p=>{const [first,...rest]=p.split('\n');return `<div class="detail-block">${rest.length?`<strong>${esc(first)}</strong>${esc(rest.join('\n'))}`:esc(first)}</div>`;}).join(''):'<div class="detail-block">官网暂未提供相关信息</div>'}</section>`;
}
function openDetail(id,trigger){
  const c=characters.find(c=>c.id===id);if(!c)return;
  if(!$('#detail-dialog').open)lastTrigger=trigger||document.activeElement;
  currentDetail=c;
  $('#detail-content').innerHTML=`<div class="detail-top" style="${campStyle(c.camp)}"><div class="detail-portrait"><img id="detail-image" src="${esc(c.image)}" alt="${esc(c.name)}"></div><div class="detail-intro"><div class="detail-index">GUMBALL FIELD GUIDE / NO. ${String(c.id).padStart(3,'0')}</div><h2 id="detail-title">${esc(c.displayName)}</h2><div class="detail-tags"><span>${esc(c.camp)}</span><span>${esc(c.type)}</span><span>${c.skins.length} 款装束</span></div></div></div><div class="detail-body">${detailSection('专属技能','skill','wand',c.skill)}<div class="detail-section-grid">${detailSection('伙伴天赋','talent','sparkles',c.talent)}${detailSection('获取方式','source','pin',c.source)}</div>${detailSection('命运之链','fate','link',c.fate)}<section class="detail-section"><h3>${icon('shirt')}伙伴装束</h3><div class="skin-grid">${c.skins.map((s,i)=>`<button class="skin-button ${i===0?'active':''}" data-skin="${i}" aria-pressed="${i===0}"><img src="${esc(s.image||s.imageUrl)}" alt="${esc(s.name)}" loading="lazy"><span>${esc(s.name)}</span></button>`).join('')}</div><p class="skin-description" id="skin-description">${c.skins[0]?.source==='无'?'初始装束':esc(c.skins[0]?.source||'官网暂未提供装束信息')}</p></section></div>`;
  if(!$('#detail-dialog').open)$('#detail-dialog').showModal();
  $('#detail-dialog').scrollTop=0;
  $('#dialog-close').focus();
}
function closeDetail(){$('#detail-dialog').close();}

document.addEventListener('click',e=>{
  const detail=e.target.closest('[data-detail]');if(detail){openDetail(+detail.dataset.detail,detail);return;}
  const camp=e.target.closest('[data-camp]');if(camp){state.camp=camp.dataset.camp;page=1;render();return;}
  const type=e.target.closest('[data-type]');if(type){state.type=type.dataset.type;page=1;render();return;}
  const p=e.target.closest('[data-page]');if(p&&!p.disabled){page=+p.dataset.page;render();$('#atlas').scrollIntoView({behavior:'smooth'});return;}
  const skin=e.target.closest('[data-skin]');if(skin&&currentDetail){const i=+skin.dataset.skin;const s=currentDetail.skins[i];$('#detail-image').src=s.image||s.imageUrl;$('#detail-image').alt=s.name;$('#skin-description').textContent=s.source==='无'?'初始装束':s.source;document.querySelectorAll('[data-skin]').forEach(b=>{b.classList.toggle('active',b===skin);b.setAttribute('aria-pressed',String(b===skin));});}
});
$('#search').addEventListener('input',e=>{state.query=e.target.value;page=1;render();});
$('#reset-filters').addEventListener('click',reset);$('#empty-reset').addEventListener('click',reset);
$('#dialog-close').addEventListener('click',closeDetail);
$('#detail-dialog').addEventListener('click',e=>{if(e.target===$('#detail-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
$('#detail-dialog').addEventListener('close',()=>{
  const detailId=currentDetail?.id;
  currentDetail=null;
  const target=lastTrigger?.isConnected?lastTrigger:document.querySelector(`.card-main[data-detail="${detailId}"]`)||$('#search');
  target.focus({preventScroll:true});
});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#detail-dialog').open){e.preventDefault();$('#search').focus();$('#search').scrollIntoView({behavior:'smooth',block:'center'});}});

try {
  const response=await fetch('data/gumballs.json');if(!response.ok)throw Error('数据请求失败');
  data=await response.json();characters=data.characters;
  render();renderCombos();
}catch(e){$('#character-grid').setAttribute('aria-busy','false');$('#result-description').textContent='图鉴数据未能加载，请刷新页面重试。';toast('加载图鉴失败，请检查本地服务是否运行');console.error(e);}
