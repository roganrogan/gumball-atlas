export function filterCharacters(characters, options = {}) {
  const {camp='',type='',query=''}=options;
  const q=query.trim().toLocaleLowerCase();
  return characters.filter(c=>(!camp||c.camp===camp)&&(!type||c.type===type)&&(!q||[c.name,...(c.skill||[]),...(c.talent||[]),...(c.source||[])].join(' ').toLocaleLowerCase().includes(q)));
}
