
let apiBase = '/api/proxy?url=';

function login(){
  const host = document.getElementById('host').value;
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  const api = `${host}/player_api.php?username=${user}&password=${pass}`;
  fetch(apiBase + encodeURIComponent(api))
    .then(r=>r.json())
    .then(data=>{
      document.getElementById('login').classList.add('hidden');
      document.getElementById('content').classList.remove('hidden');
      loadCategories(host,user,pass);
    })
    .catch(()=>alert("Erro ao conectar"));
}

function loadCategories(host,user,pass){
  const url = `${host}/player_api.php?username=${user}&password=${pass}&action=get_live_categories`;
  fetch(apiBase + encodeURIComponent(url))
    .then(r=>r.json())
    .then(cats=>{
      const el = document.getElementById('categories');
      el.innerHTML='';
      cats.forEach(c=>{
        const div=document.createElement('div');
        div.textContent=c.category_name;
        div.onclick=()=>loadChannels(host,user,pass,c.category_id);
        el.appendChild(div);
      });
    });
}

function loadChannels(host,user,pass,cat){
  const url = `${host}/player_api.php?username=${user}&password=${pass}&action=get_live_streams&category_id=${cat}`;
  fetch(apiBase + encodeURIComponent(url))
    .then(r=>r.json())
    .then(chs=>{
      const ul=document.getElementById('channels');
      ul.innerHTML='';
      chs.forEach(c=>{
        const li=document.createElement('li');
        li.textContent=c.name;
        li.onclick=()=>play(`${host}/live/${user}/${pass}/${c.stream_id}.m3u8`);
        ul.appendChild(li);
      });
    });
}

function play(url){
  const video=document.getElementById('player');
  if(Hls.isSupported()){
    const hls=new Hls();
    hls.loadSource('/api/proxy?url='+encodeURIComponent(url));
    hls.attachMedia(video);
  } else {
    video.src='/api/proxy?url='+encodeURIComponent(url);
  }
}
