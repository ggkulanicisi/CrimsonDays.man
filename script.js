(function(){
  const listEl = document.getElementById('list');
  const emptyEl = document.getElementById('empty');
  const reader = document.getElementById('reader');
  const readerTitle = document.getElementById('readerTitle');
  const readerContent = document.getElementById('readerContent');
  const closeReader = document.getElementById('closeReader');
  const downloadBtn = document.getElementById('downloadBtn');

  function makeItem(name, url){
    const div = document.createElement('div');
    div.className = 'book-item';
    div.innerHTML = `<div class="book-title">${name.replace('.mesage','')}</div>`;
    div.addEventListener('click',()=>openBook(name,url));
    return div;
  }

  async function openBook(name,url){
    reader.classList.remove('hidden');
    readerTitle.textContent = name.replace('.mesage','');
    readerContent.innerHTML = '<pre>Yükleniyor...</pre>';
    try{
      const res = await fetch(url);
      const text = await res.text();
      readerContent.innerHTML = '<pre>'+text+'</pre>';
      downloadBtn.onclick = ()=>downloadText(name,text);
    }catch(err){
      readerContent.innerHTML = '<pre>Hata: '+err.message+'</pre>';
    }
  }

  function downloadText(filename, text){
    const blob = new Blob([text], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }

  closeReader.addEventListener('click',()=>reader.classList.add('hidden'));

  async function fetchBooks(){
    try{
      const r = await fetch('books/books.json');
      const arr = await r.json();
      const files = arr.map(n=>({name:n, url:`books/${encodeURIComponent(n)}`}));
      emptyEl.style.display='none';
      files.forEach(f=>listEl.appendChild(makeItem(f.name,f.url)));
    }catch{
      emptyEl.textContent = 'Henüz “Kızıl Günler” arşivinde kitap yok...';
    }
  }

  fetchBooks();
})();
