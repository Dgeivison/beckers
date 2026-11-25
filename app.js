var IMG={"hero":"assets/hero.jpg","b1":"assets/burger1.jpg","b2":"assets/burger2.jpg","fr":"assets/fries.jpg"};
var WA="5567984050104";
var menu=[
{id:"classic",img:"b1",name:"Becker’s Classic",desc:"Pão brioche, blend 160g, cheddar, alface, tomate e molho da casa.",price:28,cat:"Burgers",e:"🍔"},
{id:"bacon",img:"b1",name:"Double Bacon",desc:"Dois smash 90g, duplo cheddar, bacon crocante e maionese defumada.",price:36,cat:"Burgers",e:"🥓"},
{id:"onion",img:"b2",name:"Smash Onion",desc:"Dois smash, cheddar cremoso e cebola caramelizada na chapa.",price:33,cat:"Burgers",e:"🧅"},
{id:"salada",name:"X-Salada Becker’s",desc:"Blend 160g, queijo prato, alface, tomate, cebola roxa e maionese.",price:26,cat:"Burgers",e:"🥬"},
{id:"kids",name:"Kids Burger",desc:"Pão, blend 90g e cheddar. Simples e perfeito.",price:20,cat:"Burgers",e:"🍔"},
{id:"fritas",img:"fr",name:"Fritas Rústicas",desc:"Porção de batatas crocantes com páprica e molho especial.",price:18,cat:"Porções",e:"🍟"},
{id:"rings",img:"fr",name:"Onion Rings",desc:"Anéis de cebola empanados e crocantes.",price:22,cat:"Porções",e:"🧅"},
{id:"cb",name:"Fritas Cheddar & Bacon",desc:"Fritas cobertas com cheddar cremoso e bacon.",price:28,cat:"Porções",e:"🧀"},
{id:"refri",name:"Refrigerante lata",desc:"Coca-Cola, Guaraná ou Fanta — 350ml.",price:7,cat:"Bebidas",e:"🥤"},
{id:"suco",name:"Suco natural",desc:"Laranja, limão ou maracujá — 500ml.",price:10,cat:"Bebidas",e:"🍊"}];
var brl=function(n){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})};
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
document.querySelectorAll("[data-img]").forEach(function(e){e.src=IMG[e.dataset.img]});
/* owner area */
var PASS="beckers",auth=false,amsg="",custom=[];
try{custom=JSON.parse($("#menu-data").textContent)||[]}catch(e){custom=[]}
try{var lsv=localStorage.getItem("bb_menu");if(lsv)custom=JSON.parse(lsv)}catch(e){}
custom.forEach(function(x){menu.push(x)});
function clean(t){return String(t).replace(/[<>"]/g,"").trim()}
function shrink(file){return new Promise(function(ok){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.78))};im.onerror=function(){ok("")};im.src=r.result};r.onerror=function(){ok("")};r.readAsDataURL(file)})}
function persist(){
 amsg="Salvando…";arender();
 var json=JSON.stringify(custom).replace(/</g,"\\u003c");
 var getA=(window.claude&&claude.use)?claude.use("artifact"):Promise.resolve(null);
 return getA.then(function(a){
  if(!a)throw new Error("sem-publicacao");
  return fetch(location.href.split("#")[0],{cache:"no-store"}).then(function(r){return r.text()}).then(function(src){
   var re=/(<script type="application\/json" id="menu-data">)[\s\S]*?(<\/script>)/;
   if(!re.test(src))throw new Error("fonte");
   return a.publish(src.replace(re,function(m,x,y){return x+json+y}));
  });
 }).then(function(){try{localStorage.removeItem("bb_menu")}catch(e){}amsg="Publicado para todos os clientes.";arender()})
 .catch(function(){try{localStorage.setItem("bb_menu",JSON.stringify(custom))}catch(e){}amsg="Salvo só neste navegador. Para todos verem, abra esta página logado na conta dona do site.";arender()});
}
function arender(){
 var b=$("#abody");
 if(!auth){b.innerHTML='<form id="alogin"><label><span>Senha</span><input type="password" id="apw" autocomplete="current-password"></label>'+(amsg?'<span class="err">'+amsg+'</span>':'')+'<button class="btn" style="margin-top:12px">Entrar</button></form>';return}
 b.innerHTML='<form id="aform"><label><span>Nome do item</span><input name="n" maxlength="60"></label><label><span>Descrição</span><textarea name="d" rows="2" maxlength="160"></textarea></label><label><span>Preço (R$)</span><input name="p" inputmode="decimal" placeholder="29,90"></label><label><span>Categoria</span><select name="c"><option>Burgers</option><option>Porções</option><option>Bebidas</option><option>Sobremesas</option></select></label><label><span>Foto (opcional)</span><input type="file" name="f" accept="image/*"></label><button class="btn">Adicionar ao cardápio</button></form>'+(amsg?'<p class="ok">'+amsg+'</p>':'')
  +'<h3 class="cat" style="margin-top:24px">Itens adicionados</h3>'+(custom.length?custom.map(function(x){return'<div class="it"><div class="th">'+(x.photo?'<img src="'+x.photo+'" alt="">':x.e)+'</div><div class="m"><b>'+x.name+'</b><span class="price">'+brl(x.price)+'</span> <small>'+x.cat+'</small></div><button class="rm" data-rm="'+x.id+'">Remover</button></div>'}).join(""):'<p style="color:var(--muted)">Nenhum item ainda.</p>');
}
document.addEventListener("click",function(e){
 var t=e.target;
 if(t.id==="adm"){auth=false;amsg="";$("#aov").classList.add("on");arender();return}
 if(t.id==="aov"||t.id==="aclose"){$("#aov").classList.remove("on");return}
 var r=t.closest&&t.closest("[data-rm]");
 if(r){var id=r.getAttribute("data-rm");custom=custom.filter(function(x){return x.id!==id});menu=menu.filter(function(x){return x.id!==id});persist()}
});
document.addEventListener("submit",function(e){
 var f=e.target;
 if(f.id==="alogin"){e.preventDefault();if($("#apw").value===PASS){auth=true;amsg=""}else amsg="Senha incorreta.";arender();return}
 if(f.id==="aform"){e.preventDefault();
  var price=parseFloat(String(f.p.value).replace(",",".")),name=clean(f.n.value);
  if(!name){amsg="Informe o nome do item.";arender();return}
  if(!(price>=0)){amsg="Informe um preço válido, por exemplo 29,90.";arender();return}
  var it={id:"c"+Date.now(),name:name,desc:clean(f.d.value),price:price,cat:f.c.value,e:"🍽"},file=f.f.files[0];
  (file?shrink(file):Promise.resolve("")).then(function(ph){if(ph)it.photo=ph;custom.push(it);menu.push(it);persist()});
 }
});
document.addEventListener("keydown",function(e){if(e.key==="Escape")$("#aov").classList.remove("on")});
/* static bits */
$("#yr").textContent=new Date().getFullYear();
var eh="";for(var i=0;i<22;i++){var sz=3+(i%4)*2;eh+='<span class="ember" style="left:'+((i*37)%100)+'%;width:'+sz+'px;height:'+sz+'px;animation-delay:'+((i*.7)%8)+'s;animation-duration:'+(6+((i*1.3)%6))+'s"></span>'}
$("#embers").innerHTML=eh;
var words=["Smash na chapa","★","Blend artesanal","★","Pão brioche","★","Cheddar cremoso","★","Bacon crocante","★"];
$("#mq").innerHTML=words.concat(words).map(function(w){return"<span>"+w+"</span>"}).join("");
var grads=["radial-gradient(circle at 50% 40%,#3a1708,#1c1510 70%)","radial-gradient(circle at 50% 40%,#4a2008,#1c1510 70%)","radial-gradient(circle at 50% 40%,#2c1a0c,#1c1510 70%)"];
$("#preview").innerHTML=menu.slice(0,3).map(function(m,i){return'<article class="card rv"'+(i==0?' data-dir="left"':i==2?' data-dir="right"':'')+' style="transition-delay:'+i*.15+'s"><div class="ph"><img src="'+IMG[m.img]+'" alt="'+m.name+'" loading="lazy"></div><div class="b"><div class="r"><h3>'+m.name+'</h3><span class="price">'+brl(m.price)+'</span></div><p>'+m.desc+'</p></div></article>'}).join("");
/* nav + reveal */
addEventListener("scroll",function(){$("#nav").classList.toggle("s",scrollY>40)},{passive:true});
var els=document.querySelectorAll(".rv");
if("IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});els.forEach(function(e){io.observe(e)})}else els.forEach(function(e){e.classList.add("vis")});
/* menu / cart */
var cart={},step="menu",form={name:"",phone:"",address:"",payment:"Pix",notes:""},errors={};
var lines=function(){return menu.filter(function(m){return cart[m.id]}).map(function(m){return{item:m,qty:cart[m.id]}})};
var total=function(){return lines().reduce(function(s,l){return s+l.item.price*l.qty},0)};
var count=function(){return lines().reduce(function(s,l){return s+l.qty},0)};
function open(){$("#ov").classList.add("on");document.body.style.overflow="hidden";render()}
function close(){$("#ov").classList.remove("on");document.body.style.overflow=""}
function change(id,d){var n=Math.max(0,(cart[id]||0)+d);if(n)cart[id]=n;else delete cart[id];render()}
function render(){
 $("#back").hidden=step!=="checkout";$("#ttl").textContent=step==="menu"?"Cardápio":"Finalizar pedido";
 var b=$("#body"),f=$("#foot"),keep=b.scrollTop;
 if(step==="menu"){
  var cats=[];menu.forEach(function(m){if(cats.indexOf(m.cat)<0)cats.push(m.cat)});
  b.innerHTML=cats.map(function(c){return'<section style="margin-bottom:32px"><h3 class="cat">'+c+'</h3>'+menu.filter(function(m){return m.cat===c}).map(function(m){
   var q=cart[m.id]?'<button data-d="-1" data-id="'+m.id+'" aria-label="Remover">−</button><span>'+cart[m.id]+'</span>':"";
   return'<div class="it"><div class="th">'+((m.img||m.photo)?'<img src="'+(m.photo||IMG[m.img])+'" alt="'+m.name+'">':m.e)+'</div><div class="m"><b>'+m.name+'</b><small>'+m.desc+'</small><span class="price">'+brl(m.price)+'</span></div><div class="qty">'+q+'<button class="add" data-d="1" data-id="'+m.id+'" aria-label="Adicionar '+m.name+'">+</button></div></div>'}).join("")+'</section>'}).join("");
  var n=count();
  f.innerHTML='<button class="btn" id="go" '+(n?"":"disabled")+'><span>🛍 '+(n?n+(n>1?" itens":" item"):"Adicione itens")+'</span><span>Continuar · '+brl(total())+'</span></button>';
 }else{
  var fld=function(k,l,ph){return'<label><span>'+l+'</span><input name="'+k+'" placeholder="'+ph+'" value="'+esc(form[k])+'">'+(errors[k]?'<span class="err">'+errors[k]+'</span>':"")+'</label>'};
  b.innerHTML='<form id="of" novalidate><div class="sum">'+lines().map(function(l){return'<div><span>'+l.qty+'x '+l.item.name+'</span><span>'+brl(l.qty*l.item.price)+'</span></div>'}).join("")+'<div class="tot"><span>Total</span><span class="price">'+brl(total())+'</span></div></div>'
   +fld("name","Nome","Seu nome")+fld("phone","Telefone","(67) 90000-0000")+fld("address","Endereço de entrega","Rua, número, bairro e referência")
   +'<label><span>Pagamento</span><select name="payment">'+["Pix","Cartão (na entrega)","Dinheiro"].map(function(p){return"<option"+(form.payment===p?" selected":"")+">"+p+"</option>"}).join("")+'</select></label>'
   +'<label><span>Observações</span><textarea name="notes" rows="3" placeholder="Ex.: sem cebola, troco para R$ 100...">'+esc(form.notes)+'</textarea></label></form>';
  f.innerHTML='<button class="btn c" id="send">Enviar pedido pelo WhatsApp · '+brl(total())+'</button>';
 }
 b.scrollTop=keep;
}
function submit(){
 var e={},t=function(k){return form[k].trim()};
 if(t("name").length<2)e.name="Informe seu nome";
 if(t("phone").length<8)e.phone="Informe um telefone";
 if(t("address").length<5)e.address="Informe o endereço completo";
 errors=e;if(Object.keys(e).length){render();return}
 var items=lines().map(function(l){return"• "+l.qty+"x "+l.item.name+" — "+brl(l.item.price*l.qty)}).join("\n");
 var msg=["🍔 *Novo pedido — Becker’s Burguer*","",items,"","*Total:* "+brl(total()),"","*Nome:* "+t("name"),"*Telefone:* "+t("phone"),"*Endereço:* "+t("address"),"*Pagamento:* "+form.payment].concat(t("notes")?["*Observações:* "+t("notes")]:[]).join("\n");
 window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank");
}
document.addEventListener("click",function(e){
 var t=e.target;
 if(t.closest("[data-open]")){step="menu";open();return}
 if(t.id==="ov"||t.id==="close"){close();return}
 if(t.id==="back"){step="menu";render();return}
 if(t.closest("#go")&&count()){step="checkout";render();return}
 if(t.closest("#send")){submit();return}
 var d=t.closest("[data-d]");if(d)change(d.dataset.id,+d.dataset.d);
});
document.addEventListener("input",function(e){if(e.target.name&&e.target.name in form){form[e.target.name]=e.target.value}});
document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
