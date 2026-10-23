const MENU_KEY = "tinviet.menu.v3";
const POSTS_KEY = "tinviet.posts.v1";
const FALLBACK_MENU = [
  {id:"home",title:"Trang chủ",url:"#home",type:"home"},
  {id:"latest",title:"Tin mới",url:"#latest",type:"category"},
  {id:"thoi-su",title:"Thời sự",url:"https://dantri.com.vn/thoi-su.htm",type:"category"},
  {id:"kinh-doanh",title:"Kinh doanh",url:"https://dantri.com.vn/kinh-doanh.htm",type:"category"},
  {id:"the-gioi",title:"Thế giới",url:"https://dantri.com.vn/the-gioi.htm",type:"category"},
  {id:"bat-dong-san",title:"Bất động sản",url:"https://dantri.com.vn/bat-dong-san.htm",type:"category"},
  {id:"giao-duc",title:"Giáo dục - Hướng nghiệp",url:"https://dantri.com.vn/giao-duc.htm",type:"category"}
];
const SAMPLE_POST = {
  id:"dtri-20260928122246655",title:"Hà Nội tính cơ chế bồi thường đất đặc biệt cho 7 dự án đường sắt",
  slug:"ha-noi-tinh-co-che-boi-thuong-dat-dac-biet-cho-7-du-an-duong-sat",
  excerpt:"Hà Nội đang xem xét cơ chế bồi thường, hỗ trợ và tái định cư đặc biệt để triển khai 7 dự án đường sắt quan trọng trên địa bàn thành phố.",
  content:"Hà Nội đang nghiên cứu và đề xuất cơ chế bồi thường, hỗ trợ và tái định cư đặc biệt nhằm tháo gỡ khó khăn trong công tác giải phóng mặt bằng cho 7 dự án đường sắt trọng điểm. Đây là nhóm dự án hạ tầng giao thông có vai trò quan trọng trong việc phát triển mạng lưới vận tải công cộng và giảm ùn tắc đô thị. Thành phố nhấn mạnh việc cần cơ chế linh hoạt để đẩy nhanh tiến độ triển khai, đảm bảo quyền lợi cho người dân bị ảnh hưởng và đồng thời đáp ứng yêu cầu phát triển hạ tầng chiến lược.",
  author:"Văn Hưng",category:["Bất động sản"],publishedAt:"2026-09-28T12:22:00+07:00",source:"dantri.com.vn",
  url:"https://dantri.com.vn/bat-dong-san/ha-noi-tinh-co-che-boi-thuong-dat-dac-biet-cho-7-du-an-duong-sat-20260928122246655.htm",
  image:"",demo:true
};
let menu = [], posts = [];
const app = document.getElementById("app");
const AUTH_KEY = "tinviet.auth.user.v1";
const USERS_KEY = "tinviet.auth.users.v1";
const esc = (s="") => String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const flatMenu = () => menu.flatMap(item => [item,...(item.children||[]).map(child=>({...child,type:child.type||"category"}))]).filter(item => item.type === "category");
const slugTitle = id => (flatMenu().find(x=>x.id===id)?.title || id || "Tin mới");
async function loadPosts(){ let stored=[]; try { stored=JSON.parse(localStorage.getItem(POSTS_KEY)||"[]"); if(!Array.isArray(stored)) stored=[]; } catch { stored=[]; } let seed=Array.isArray(window.DANTRI_SEED?.posts)?window.DANTRI_SEED.posts:[]; if(!seed.length){ try { const res=await fetch("dantri-articles.json"); if(res.ok){ const data=await res.json(); seed=Array.isArray(data.posts)?data.posts:[]; } } catch {} } const merged=new Map(); for(const post of seed) merged.set(post.id,post); for(const post of stored) if(post.id!==SAMPLE_POST.id&&!merged.has(post.id)) merged.set(post.id,post); posts=[...merged.values()]; if(!posts.length) posts=[SAMPLE_POST]; savePosts(); }
function savePosts(){ localStorage.setItem(POSTS_KEY,JSON.stringify(posts)); }
async function loadMenu(){
  try { const saved=JSON.parse(localStorage.getItem(MENU_KEY)||"null"); if(saved?.menu?.length) return saved.menu; if(window.DANTRI_MENU?.length){localStorage.setItem(MENU_KEY,JSON.stringify({menu:window.DANTRI_MENU}));return window.DANTRI_MENU;} } catch{}
  try { const res=await fetch("dantri-menu.json"); if(res.ok){const data=await res.json();localStorage.setItem(MENU_KEY,JSON.stringify(data));return data.menu;} } catch{}
  return FALLBACK_MENU;
}
function renderNavigation(){
  const nav=document.getElementById("nav-categories"), footer=document.getElementById("footer-categories");
  const cats=menu.filter(c=>c.type==="category"); const navOrder=["latest","the-gioi","thoi-su","phap-luat","suc-khoe","doi-song","du-lich","kinh-doanh","bat-dong-san","the-thao","giai-tri","giao-duc","o-to-xe-may","noi-vu","tam-long-nhan-ai"]; const navLabels={"giao-duc":"Giáo dục","o-to-xe-may":"Xe ++","tam-long-nhan-ai":"Nhân ái"}; const navCats=navOrder.map(id=>cats.find(c=>c.id===id)).filter(Boolean); nav.innerHTML=navCats.map(c=>`<div class="nav-item"><div class="nav-item-head"><a class="nav-main" href="#category/${encodeURIComponent(c.id)}">${esc(navLabels[c.id]||c.title)}</a>${c.children?.length?`<button class="submenu-toggle" type="button" aria-label="Mở chuyên mục con: ${esc(c.title)}" aria-expanded="false">⌄</button>`:""}</div>${c.children?.length?`<div class="nav-submenu">${c.children.map(child=>`<a href="#category/${encodeURIComponent(child.id)}">${esc(child.title)}</a>`).join("")}</div>`:""}</div>`).join("")+`<button id="all-category-toggle" class="all-category-toggle" type="button" aria-expanded="false" aria-controls="mega-menu" aria-label="Mở toàn bộ chuyên mục"><span class="dot-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></button>`;
  const mega=document.getElementById("mega-menu"); mega.innerHTML=`<div class="mega-layout"><div class="mega-categories">${cats.map(c=>`<section class="mega-group"><h2><a href="#category/${encodeURIComponent(c.id)}">${esc(c.title)}</a></h2>${c.children?.length?c.children.map(child=>`<a class="mega-child" href="#category/${encodeURIComponent(child.id)}">${esc(child.title)}</a>`).join(""):`<a class="mega-child" href="#category/${encodeURIComponent(c.id)}">Xem tin ${esc(c.title)}</a>`}</section>`).join("")}</div><aside class="mega-aside"><div class="mega-aside-links"><a href="#latest">Tin mới nhất</a><a href="#home">Tin Việt 360</a><a href="#crawler">Crawler tin tức</a><a href="#latest">Tin nổi bật</a><a href="#latest">Bạn đọc</a><a href="#latest">Tọa đàm</a></div><div class="mega-contact"><strong>Liên hệ tòa soạn</strong><a href="mailto:toasoan@tinviet.vn">✉ toasoan@tinviet.vn</a><span>☎ 024-3736-6491</span></div><div class="mega-contact"><strong>Theo dõi Tin Việt</strong><div class="mega-social"><a href="https://facebook.com" aria-label="Facebook">f</a><a href="https://youtube.com" aria-label="YouTube">▶</a><a href="https://tiktok.com" aria-label="TikTok">♪</a></div></div></aside></div>`;
  const allToggle=document.getElementById("all-category-toggle"); allToggle.addEventListener("click",()=>{const open=mega.hidden;mega.hidden=!open;allToggle.setAttribute("aria-expanded",String(open));allToggle.setAttribute("aria-label",open?"Đóng toàn bộ chuyên mục":"Mở toàn bộ chuyên mục");allToggle.innerHTML=open?"×":"<span class=\"dot-grid\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>";nav.classList.toggle("mega-open",open);}); mega.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mega.hidden=true;nav.classList.remove("mega-open");allToggle.setAttribute("aria-expanded","false");allToggle.innerHTML="<span class=\"dot-grid\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>";}));
  footer.innerHTML=flatMenu().slice(0,12).map(c=>`<a href="#category/${encodeURIComponent(c.id)}">${esc(c.title)}</a>`).join("");
  nav.querySelectorAll('.submenu-toggle').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.nav-item');const open=item.classList.toggle('submenu-open');button.setAttribute('aria-expanded',String(open));nav.querySelectorAll('.nav-item').forEach(other=>{if(other!==item){other.classList.remove('submenu-open');other.querySelector('.submenu-toggle')?.setAttribute('aria-expanded','false');}});}));
}
function dateLabel(value){ if(!value) return ""; const d=new Date(value); return Number.isNaN(+d)?esc(value):new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short"}).format(d); }
function postCategories(p){ return (Array.isArray(p.category)?p.category:[p.category]).filter(Boolean); }
function postCategory(p){ return postCategories(p)[0]||""; }
function art(p,large=false){ if(p.image) return `<div class="post-art" style="background-image:url('${esc(p.image)}');background-size:cover;background-position:center" aria-label="Ảnh bài viết"></div>`;return `<div class="post-art" aria-hidden="true">${large?"✦":"◈"}</div>`; }
function cardInfo(p,heading="h3"){return `<div class="post-info"><span class="tag">${esc(postCategory(p)||"Tin tức")}</span><${heading}><a href="#article/${encodeURIComponent(p.id)}">${esc(p.title)}</a></${heading}><div class="meta">${esc(p.author||"Dân trí")} · ${dateLabel(p.publishedAt)}</div></div>`;}
function sortedPosts(category){ return posts.filter(p=>!category||category==="latest"||postCategories(p).includes(slugTitle(category))||postCategories(p).includes(category)).sort((a,b)=>new Date(b.publishedAt||0)-new Date(a.publishedAt||0)); }
function renderListing(category){
 const all=sortedPosts(category), title=category==="latest"?"Tin mới nhất":category?slugTitle(category):"Tin tức mới nhất";
 const [featured,...rest]=all;
 app.innerHTML=`<div class="page-heading"><div><span class="eyebrow">Tin Việt · ${category?"Chuyên mục":"Cập nhật mỗi ngày"}</span><h1>${esc(title)}</h1><p>Những câu chuyện mới nhất được cập nhật liên tục.</p></div><span class="count">${all.length} bài viết</span></div>`+
 (!featured?`<div class="empty-card">Chưa có bài trong chuyên mục này. Hãy thêm bài từ trang <a href="#crawler"><strong>Crawler</strong></a>.</div>`:`<section class="featured-grid" aria-label="Bài viết mới nhất"><a class="feature-card" href="#article/${encodeURIComponent(featured.id)}" ${featured.image?`style="--cover:url('${esc(featured.image)}')"`:""}><div><span class="tag">${esc(postCategory(featured)||"Tin tức")}</span><h2>${esc(featured.title)}</h2><p>${esc(featured.excerpt||"")}</p><span class="meta">${esc(featured.author||"Dân trí")} · ${dateLabel(featured.publishedAt)}</span></div></a><div class="feature-side">${rest.slice(0,2).map(p=>`<article class="side-card">${art(p)}${cardInfo(p)}</article>`).join("")}</div></section><section class="post-list" aria-label="Danh sách bài viết">${rest.slice(2).map(p=>`<article class="post-row">${art(p)}${cardInfo(p,"h2")}<div class="post-info row-excerpt"><p>${esc(p.excerpt||"")}</p></div></article>`).join("")||`<div class="empty-card">Chưa có bài viết khác trong chuyên mục.</div>`}</section>`);
 document.querySelectorAll(".nav-categories a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#category/${encodeURIComponent(category)}`));
}
function renderArticle(id){
 const p=posts.find(x=>x.id===id);
 if(!p){app.innerHTML='<div class="empty-card">Không tìm thấy bài viết. <a href="#home">Về trang chủ</a></div>';return;}
 const categories=postCategories(p); const category=categories[0]||"Tin tức"; const subCategory=categories[1];
 const categoryId=(flatMenu().find(c=>c.title===category)||{}).id||"latest";
 const body=p.content||p.excerpt||"Nội dung bài viết chưa được trích xuất. Mở bài gốc để đọc đầy đủ.";
 const author=typeof p.author==="object"?(p.author?.name||""):p.author;
 app.innerHTML=`<article class="detail-card">
   <a class="back-link" href="#category/${encodeURIComponent(categoryId)}">← ${esc(category)}</a>
   <p class="eyebrow">${esc(category)}</p>
   <h1>${esc(p.title)}</h1>
   ${p.image?`<figure class="detail-figure"><img class="detail-image" src="${esc(p.image)}" alt="${esc(p.title)}"><figcaption>Ảnh: Dân trí</figcaption></figure>`:""}
   <dl class="detail-facts">
     <div><dt>Tác giả</dt><dd>${esc(author||"Dân trí")}</dd></div>
     <div><dt>Thời gian đăng</dt><dd>${dateLabel(p.publishedAt)||"Chưa có dữ liệu"}</dd></div>
     <div><dt>Chuyên mục</dt><dd><a href="#category/${encodeURIComponent(categoryId)}">${esc(category)}</a>${subCategory?` › <a href="#category/${encodeURIComponent((flatMenu().find(c=>c.title===subCategory)||{}).id||categoryId)}">${esc(subCategory)}</a>`:""}</dd></div>
   </dl>
   ${p.excerpt&&p.excerpt!==body?`<p class="detail-lead">${esc(p.excerpt)}</p>`:""}
   <section class="detail-body"><h2>Nội dung</h2><div class="detail-content">${esc(body)}</div></section>
   <p class="source-link">Nguồn: <a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.url)}</a></p>
 </article>`;
 const heroImage=app.querySelector(".detail-image");
 if(heroImage){heroImage.addEventListener("error",()=>{if(!heroImage.dataset.proxyTried){heroImage.dataset.proxyTried="true";try{const u=new URL(heroImage.getAttribute("src")||"",location.href);heroImage.src=`https://images.weserv.nl/?url=${encodeURIComponent(u.host+u.pathname+u.search)}&w=1200`;}catch{showImageFallback(heroImage,p);}}else showImageFallback(heroImage,p);});}
}
function showImageFallback(img,post){
 const title=(post.title||"Tin tức mới nhất").replace(/[<>&\"']/g,"").slice(0,84);
 const chunks=title.match(/.{1,38}(?:\\s|$)/g)||[title];
 const rows=chunks.slice(0,2).map((t,i)=>`<tspan x="76" dy="${i?62:0}">${t.trim()}</tspan>`).join("");
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f4f1ec"/><rect width="1200" height="430" fill="#a9101b"/><text x="76" y="92" fill="white" font-family="Arial" font-size="30" font-weight="700">TIN VIỆT · ${post.category||"Tin tức"}</text><text x="76" y="230" fill="white" font-family="Arial" font-size="48" font-weight="700">${rows}</text><text x="76" y="520" fill="#a9101b" font-family="Arial" font-size="26" font-weight="700">ẢNH BÀI VIẾT TỪ DÂN TRÍ</text><text x="76" y="565" fill="#777" font-family="Arial" font-size="19">Ảnh gốc hiện không truy cập được từ CDN</text></svg>`;
 img.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
 const caption=img.parentElement?.querySelector("figcaption");if(caption)caption.textContent="Ảnh minh họa · CDN ảnh gốc hiện không truy cập được";
}function renderCrawler(){if(!authUser()){app.innerHTML=`<div class="page-heading"><div><span class="eyebrow">Công cụ nhập liệu</span><h1>Crawler bài viết</h1></div></div><section class="auth-required"><h2>Đăng nhập để đăng bài</h2><p>Bạn cần đăng nhập trước khi crawl và lưu bài viết vào website.</p><button id="crawler-login" class="primary-button" type="button">Đăng nhập / Đăng ký</button></section>`;document.getElementById("crawler-login").addEventListener("click",()=>document.getElementById("auth-dialog").showModal());return;}app.innerHTML=`<div class="page-heading"><div><span class="eyebrow">Công cụ nhập liệu</span><h1>Crawler bài viết</h1><p>Nhập URL để trích xuất thông tin và lưu bài vào LocalStorage.</p></div></div><section class="crawler-card"><form id="crawler-form"><label for="article-url">URL bài viết</label><input id="article-url" type="url" required placeholder="https://dantri.com.vn/...htm"><label for="proxy-url">Proxy CORS (tùy chọn)</label><input id="proxy-url" type="url" placeholder="https://api.allorigins.win/raw?url="><p class="hint">Trình duyệt chỉ cho phép tải trực tiếp từ cùng website. Nếu URL ngoài báo lỗi CORS, nhập proxy có quyền truy cập. Khi proxy cho phép, ảnh đại diện cũng được sao chép vào dữ liệu LocalStorage. Nội dung được lưu trên trình duyệt hiện tại.</p><div class="crawler-actions"><button class="primary-button" type="submit">Tải và lưu bài viết</button><span id="crawler-status" class="status" role="status"></span></div></form><div id="crawler-preview" class="preview"></div></section>`;
 document.getElementById("crawler-form").addEventListener("submit",runCrawler);
}
function jsonLdArticle(doc){const scripts=[...doc.querySelectorAll('script[type="application/ld+json"]')];for(const s of scripts){try{const data=JSON.parse(s.textContent);const nodes=(Array.isArray(data)?data:[data]).flatMap(x=>x["@graph"]||[x]);const hit=nodes.find(x=>/NewsArticle|Article/i.test([].concat(x["@type"]||[]).join(" ")));if(hit)return hit;}catch{}}return{};}
const textOf=(el)=>el?.textContent?.replace(/\s+/g," ").trim()||"";
async function copyArticleImage(imageUrl,proxy){
 if(!imageUrl||!proxy)return imageUrl||"";
 try{const response=await fetch(proxy+encodeURIComponent(imageUrl));if(!response.ok)return imageUrl;const blob=await response.blob();if(!blob.type.startsWith("image/")||blob.size>450000)return imageUrl;return await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>resolve(imageUrl);reader.readAsDataURL(blob);});}catch{return imageUrl;}
}
async function runCrawler(event){event.preventDefault();if(!authUser()){document.getElementById("auth-dialog").showModal();return;}const button=event.currentTarget.querySelector("button"),status=document.getElementById("crawler-status"),preview=document.getElementById("crawler-preview");button.disabled=true;status.className="status";status.textContent="Đang tải trang…";preview.style.display="none";
 try{const raw=document.getElementById("article-url").value.trim(),target=new URL(raw);if(!/^https?:$/.test(target.protocol))throw new Error("URL phải bắt đầu bằng http:// hoặc https://");const proxy=document.getElementById("proxy-url").value.trim();const fetchUrl=proxy?proxy+encodeURIComponent(target.href):target.href;const response=await fetch(fetchUrl);if(!response.ok)throw new Error(`Máy chủ trả về HTTP ${response.status}.`);const html=await response.text(),doc=new DOMParser().parseFromString(html,"text/html"),ld=jsonLdArticle(doc),meta=s=>doc.querySelector(s)?.content||"";
 const title=textOf(doc.querySelector("h1"))||ld.headline||meta('meta[property="og:title"]');if(!title)throw new Error("Không tìm thấy tiêu đề. Trang có thể chặn crawler hoặc không phải bài báo.");
 const contentNode=doc.querySelector(".singular-content, .dt-news__content, .e-magazine__body, article");const content=textOf(contentNode)||ld.articleBody||"";const excerpt=ld.description||meta('meta[name="description"]')||meta('meta[property="og:description"]')||"";const path=target.pathname;const slug=path.split("/").filter(Boolean).pop()?.replace(/\.htm$/,"")||"";const idFromUrl=path.match(/(\d{10,})/);
 const authorData=ld.author;const author=Array.isArray(authorData)?authorData.map(a=>typeof a==="string"?a:a.name).filter(Boolean).join(", "):typeof authorData==="string"?authorData:authorData?.name||textOf(doc.querySelector(".author-name, .dt-news__author"));
 const categoryName=[...doc.querySelectorAll(".breadcrumb a, .dt-news__tag a")].map(textOf).filter(Boolean).at(-1)||ld.articleSection||"Tin tức";
 const image=typeof ld.image==="string"?ld.image:Array.isArray(ld.image)?(typeof ld.image[0]==="string"?ld.image[0]:ld.image[0]?.url):ld.image?.url||meta('meta[property="og:image"]');
 const publishedAt=ld.datePublished||meta('meta[property="article:published_time"]')||"";
 const copiedImage=await copyArticleImage(image,proxy); const item={id:`dtri-${idFromUrl?.[1]||slug}`,title,slug,excerpt,content,author,category:categoryName,publishedAt,source:target.hostname.replace(/^www\./,""),url:target.href,image:copiedImage,imageSource:image||""};
 posts=posts.filter(p=>p.url!==item.url&&p.id!==item.id);posts.unshift(item);savePosts();status.className="status success";status.textContent="Đã trích xuất và lưu bài viết vào LocalStorage.";preview.style.display="block";preview.innerHTML=`<strong>${esc(item.title)}</strong><pre>${esc(JSON.stringify(item,null,2))}</pre>`;toast("Đã lưu bài viết");
 }catch(error){status.className="status error";status.textContent=`Không thể crawl: ${error.message} Hãy thử proxy CORS nếu đây là lỗi truy cập chéo.`;}finally{button.disabled=false;}}
function toast(message){const el=document.createElement("div");el.className="toast";el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2600);}
function authUser(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||"null")}catch{return null}}
function loadUsers(){try{const users=JSON.parse(localStorage.getItem(USERS_KEY)||"[]");return Array.isArray(users)?users:[]}catch{return[]}}
function setAuthUser(user){localStorage.setItem(AUTH_KEY,JSON.stringify(user));updateAuthButton();document.getElementById("auth-dialog").close();if(location.hash==="#crawler")renderCrawler();}
function updateAuthButton(){const button=document.getElementById("account-button"),user=authUser();button.textContent=user?`Đăng xuất · ${user.name||user.email||"Tài khoản"}`:"Đăng nhập";button.title=user?.email||"Đăng nhập hoặc đăng ký";}
function authMessage(message,isError=false){const status=document.getElementById("auth-status");status.textContent=message;status.classList.toggle("error",isError);status.classList.toggle("success",!isError&&Boolean(message));}
function authMode(mode){const registering=mode==="register",name=document.getElementById("auth-name"),confirm=document.getElementById("auth-confirm"),confirmField=document.getElementById("auth-confirm-field"),nameLabel=document.getElementById("auth-name-label"),confirmLabel=document.getElementById("auth-confirm-label"),emailLabel=document.getElementById("auth-email-label"),email=document.getElementById("auth-email"),intro=document.getElementById("auth-intro"),password=document.getElementById("auth-password"),rules=document.getElementById("password-rules"),dialog=document.getElementById("auth-dialog");dialog.dataset.mode=mode;dialog.classList.toggle("register-mode",registering);document.getElementById("auth-title").textContent=registering?"Đăng ký tài khoản":"Đăng nhập";intro.textContent="Tạo tài khoản Tin Việt bằng Gmail của bạn.";intro.hidden=!registering;document.getElementById("auth-submit").textContent=registering?"Đăng ký":"Đăng nhập";emailLabel.textContent=registering?"Email":"Gmail";email.placeholder=registering?"example@gmail.com":"example@gmail.com";password.autocomplete=registering?"new-password":"current-password";password.minLength=registering?8:0;password.value="";confirm.minLength=registering?8:0;confirm.value="";setPasswordVisible("auth-password","auth-password-toggle",false);setPasswordVisible("auth-confirm","auth-confirm-toggle",false);name.hidden=nameLabel.hidden=!registering;confirmField.hidden=confirmLabel.hidden=!registering;rules.hidden=!registering;name.required=confirm.required=registering;updatePasswordRules("");document.getElementById("auth-switch").textContent=registering?"Đã có tài khoản? Đăng nhập":"Chưa có tài khoản? Đăng ký tài khoản";authMessage("");}
async function passwordHash(password,salt){if(!crypto?.subtle)throw new Error("Trình duyệt không hỗ trợ mã hóa mật khẩu. Hãy mở trang qua localhost.");const bytes=salt?Uint8Array.from(atob(salt),c=>c.charCodeAt(0)):crypto.getRandomValues(new Uint8Array(16));const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:bytes,iterations:180000,hash:"SHA-256"},key,256);return{salt:btoa(String.fromCharCode(...bytes)),hash:btoa(String.fromCharCode(...new Uint8Array(bits)))}}
function passwordChecks(value){return{length:value.length>=8,lower:/[a-z]/.test(value),upper:/[A-Z]/.test(value),number:/[0-9]/.test(value),symbol:Array.from(value).some(ch=>!/[\p{L}\p{N}\s]/u.test(ch)),nospace:value.length>0&&!/\s/.test(value)}}
function updatePasswordRules(value){const checks=passwordChecks(value);for(const [key,valid] of Object.entries(checks))document.getElementById(`rule-${key}`).classList.toggle("met",valid)}
function setPasswordVisible(inputId,buttonId,visible){const input=document.getElementById(inputId),button=document.getElementById(buttonId),eye='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',eyeOff='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1 0 1.9-.2 2.8-.5"/></svg>';input.type=visible?"text":"password";button.innerHTML=visible?eye:eyeOff;button.setAttribute("aria-pressed",String(visible));button.setAttribute("aria-label",visible?"Ẩn mật khẩu":"Hiện mật khẩu")}
async function submitAuth(event){event.preventDefault();const form=event.currentTarget,mode=document.getElementById("auth-dialog").dataset.mode||"login",name=document.getElementById("auth-name").value.trim(),email=document.getElementById("auth-email").value.trim().toLowerCase(),password=document.getElementById("auth-password").value,users=loadUsers();try{if(!/^[^\s@]+@gmail\.com$/.test(email))throw new Error("Vui lòng nhập địa chỉ Gmail hợp lệ (@gmail.com).");if(mode==="register"){if(name.length<2)throw new Error("Nhập họ tên gồm ít nhất 2 ký tự.");if(!Object.values(passwordChecks(password)).every(Boolean))throw new Error("Mật khẩu chưa đáp ứng đủ các điều kiện bảo mật.");if(password!==document.getElementById("auth-confirm").value)throw new Error("Mật khẩu xác nhận chưa khớp.");if(users.some(user=>user.email===email))throw new Error("Gmail này đã đăng ký. Hãy đăng nhập.");const encoded=await passwordHash(password);users.push({id:`user-${Date.now()}`,name,email,salt:encoded.salt,passwordHash:encoded.hash,createdAt:new Date().toISOString()});localStorage.setItem(USERS_KEY,JSON.stringify(users));form.reset();authMode("login");document.getElementById("auth-email").value=email;authMessage("Đăng ký thành công. Hãy đăng nhập bằng Gmail và mật khẩu vừa tạo.");return;}const user=users.find(item=>item.email===email);if(!user)throw new Error("Không tìm thấy tài khoản này. Hãy đăng ký trước.");const encoded=await passwordHash(password,user.salt);if(encoded.hash!==user.passwordHash)throw new Error("Gmail hoặc mật khẩu không đúng.");setAuthUser({id:user.id,name:user.name,email:user.email});form.reset();}catch(error){authMessage(error.message||"Không thể xử lý tài khoản.",true)}}
function setupAuth(){const dialog=document.getElementById("auth-dialog");updateAuthButton();authMode("login");document.getElementById("account-button").addEventListener("click",()=>{if(authUser()){localStorage.removeItem(AUTH_KEY);updateAuthButton();if(location.hash==="#crawler")renderCrawler();return;}authMode("login");dialog.showModal();});document.getElementById("auth-close").addEventListener("click",()=>dialog.close());document.getElementById("auth-switch").addEventListener("click",()=>authMode(dialog.dataset.mode==="register"?"login":"register"));document.getElementById("auth-password").addEventListener("input",event=>updatePasswordRules(event.target.value));document.getElementById("auth-password-toggle").addEventListener("click",event=>setPasswordVisible("auth-password","auth-password-toggle",event.currentTarget.getAttribute("aria-pressed")!=="true"));document.getElementById("auth-confirm-toggle").addEventListener("click",event=>setPasswordVisible("auth-confirm","auth-confirm-toggle",event.currentTarget.getAttribute("aria-pressed")!=="true"));document.getElementById("auth-form").addEventListener("submit",submitAuth);}
function render(){const parts=decodeURIComponent(location.hash.slice(1)).split("/");if(parts[0]==="article")renderArticle(parts[1]);else if(parts[0]==="crawler")renderCrawler();else if(parts[0]==="category")renderListing(parts[1]);else if(parts[0]==="latest")renderListing("latest");else renderListing(null);const mega=document.getElementById("mega-menu"),toggle=document.getElementById("all-category-toggle"); if(mega&&!mega.hidden){mega.hidden=true;document.getElementById("nav-categories")?.classList.remove("mega-open");if(toggle){toggle.innerHTML='<span class="dot-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';toggle.setAttribute("aria-expanded","false");}} app.focus({preventScroll:true});}
async function start(){menu=await loadMenu();await loadPosts();renderNavigation();setupAuth();document.getElementById("year").textContent=new Date().getFullYear();document.getElementById("menu-toggle").addEventListener("click",()=>{const nav=document.getElementById("nav-categories"),open=nav.classList.toggle("open");document.getElementById("menu-toggle").setAttribute("aria-expanded",String(open));});window.addEventListener("hashchange",render);render();}
start();



















