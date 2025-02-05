import{a as $,g as x,j as l,b as y,h as P,f as w,k as M,Z as k,$ as v,a0 as S,o as L,w as D,a7 as _,a2 as C,a8 as T,a3 as F,a4 as N}from"./index-NCiPq6nK.js";import{h as R}from"./render-B39_BWDe.js";import{L as r}from"./leaflet.draw-ykfal64t.js";import{_ as B}from"./_plugin-vue_export-helper-DlAUqK2U.js";const b=$({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(d,{slots:s}){const{proxy:{$q:o}}=x(),n=w(M,l);if(n===l)return console.error("QPage needs to be a deep child of QLayout"),l;if(w(k,l)===l)return console.error("QPage needs to be child of QPageContainer"),l;const g=y(()=>{const p=(n.header.space===!0?n.header.size:0)+(n.footer.space===!0?n.footer.size:0);if(typeof d.styleFn=="function"){const e=n.isContainer.value===!0?n.containerHeight.value:o.screen.height;return d.styleFn(p,e)}return{minHeight:n.isContainer.value===!0?n.containerHeight.value-p+"px":o.screen.height===0?p!==0?`calc(100vh - ${p}px)`:"100vh":o.screen.height-p+"px"}}),h=y(()=>`q-page${d.padding===!0?" q-layout-padding":""}`);return()=>P("main",{class:h.value,style:g.value},R(s.default))}}),Q=v({__name:"MapComponent",setup(d){const s=S();let o,n;L(()=>{o=r.map("map").setView([51.505,-.09],13),r.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(o),n=new r.FeatureGroup,o.addLayer(n);const e=new r.Control.Draw({edit:{featureGroup:n},draw:{polygon:!1,circlemarker:!1,marker:!1,circle:!1,rectangle:!1,polyline:{shapeOptions:{color:"blue"},showLength:!1}}});o.addControl(e),o.on(r.Draw.Event.CREATED,a=>{const t=a.layer;if(t instanceof r.Polyline){const c=t.getLatLngs().map(f=>[f.lat,f.lng]),i=prompt("Введите среднюю скорость (км/ч):");if(!i||isNaN(parseFloat(i))){alert("Некорректная скорость. Маршрут не добавлен.");return}const u=JSON.stringify(c);s.addRoute(parseFloat(i),u)}n.addLayer(t)}),m()});const m=()=>{if(console.log("Drawing routes..."),!o){console.error("Map is not initialized!");return}o.eachLayer(e=>{(e instanceof r.Polyline||e instanceof r.Marker)&&o.removeLayer(e)}),s.routes.forEach(e=>{const a=r.polyline(e.coordinates,{color:"blue"}).addTo(o);o.fitBounds(a.getBounds());const t=e.coordinates[0];if(!t)return;const c=r.marker(t).addTo(o);g(c,e.id,e.departureTime);const i=e.coordinates[e.coordinates.length-1];if(!i)return;const u=r.marker(i).addTo(o);h(u,e)})},g=(e,a,t)=>{const c=`
    <div>
      <label>Время отправления:</label>
      <input
        type="datetime-local"
        value="${p(t)}"
        onchange="updateDepartureTime(${a}, this.value)"
      />
    </div>
  `;e.bindPopup(c).openPopup()},h=(e,a)=>{const t=Math.max(0,a.arrivalTime.getTime()-Date.now()),c=Math.floor(t/(1e3*60*60)),i=Math.floor(t%(1e3*60*60)/(1e3*60)),u=Math.floor(t%(1e3*60)/1e3),f=`
    <div>
      <strong>Время прибытия:</strong> ${a.arrivalTime.toLocaleTimeString()}<br>
      <strong>Ср. скорость:</strong>
      <input
        type="number"
        value="${a.speed}"
        onchange="updateSpeed(${a.id}, this.value)"
      ><br>
      <strong>Осталось времени:</strong> ${c}ч ${i}мин ${u}сек<br>
      <button onclick="deleteRoute(${a.id})">Удалить маршрут</button>
    </div>
  `;e.bindPopup(f).openPopup()},p=e=>new Date(e.getTime()-e.getTimezoneOffset()*6e4).toISOString().slice(0,16);return window.updateDepartureTime=(e,a)=>{const t=new Date(a);if(isNaN(t.getTime())){alert("Некорректное значение времени отправления.");return}s.updateDepartureTime(e,t)},window.updateSpeed=(e,a)=>{const t=parseFloat(a);if(isNaN(t)||t<=0){alert("Некорректное значение средней скорости.");return}s.updateSpeed(e,t)},window.deleteRoute=e=>{s.deleteRoute(e)},D(()=>s.routes,()=>{m()},{deep:!0}),(e,a)=>(C(),_(b,{class:"flex flex-center column",style:{width:"100%"}},{default:T(()=>a[0]||(a[0]=[F("div",{id:"map",class:"map-container"},null,-1)])),_:1}))}}),z=B(Q,[["__scopeId","data-v-9a723a20"]]),H=v({__name:"IndexPage",setup(d){return(s,o)=>(C(),_(b,{class:"flex flex-center"},{default:T(()=>[N(z)]),_:1}))}});export{H as default};
