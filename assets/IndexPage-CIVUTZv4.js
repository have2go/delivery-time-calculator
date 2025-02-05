import{a as $,g as x,j as l,b as y,h as P,f as w,k as M,Z as k,$ as v,a0 as S,o as L,w as D,a7 as _,a2 as C,a8 as T,a3 as F,a4 as N}from"./index-BZfAhi-R.js";import{h as R}from"./render-BLEsxkF9.js";import{L as r}from"./leaflet.draw-ykfal64t.js";import{_ as B}from"./_plugin-vue_export-helper-DlAUqK2U.js";const b=$({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(d,{slots:s}){const{proxy:{$q:n}}=x(),a=w(M,l);if(a===l)return console.error("QPage needs to be a deep child of QLayout"),l;if(w(k,l)===l)return console.error("QPage needs to be child of QPageContainer"),l;const g=y(()=>{const p=(a.header.space===!0?a.header.size:0)+(a.footer.space===!0?a.footer.size:0);if(typeof d.styleFn=="function"){const e=a.isContainer.value===!0?a.containerHeight.value:n.screen.height;return d.styleFn(p,e)}return{minHeight:a.isContainer.value===!0?a.containerHeight.value-p+"px":n.screen.height===0?p!==0?`calc(100vh - ${p}px)`:"100vh":n.screen.height-p+"px"}}),h=y(()=>`q-page${d.padding===!0?" q-layout-padding":""}`);return()=>P("main",{class:h.value,style:g.value},R(s.default))}}),Q=v({__name:"MapComponent",setup(d){const s=S();let n,a;L(()=>{n=r.map("map").setView([51.505,-.09],13),r.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(n),a=new r.FeatureGroup,n.addLayer(a);const e=new r.Control.Draw({edit:{featureGroup:a},draw:{polygon:!1,circlemarker:!1,marker:!1,circle:!1,rectangle:!1,polyline:{shapeOptions:{color:"blue"},showLength:!1}}});n.addControl(e),n.on(r.Draw.Event.CREATED,o=>{const t=o.layer;if(t instanceof r.Polyline){const c=t.getLatLngs().map(f=>[f.lat,f.lng]),i=prompt("Введите среднюю скорость (км/ч):");if(!i||isNaN(parseFloat(i))){alert("Некорректная скорость. Маршрут не добавлен.");return}const u=JSON.stringify(c);s.addRoute(parseFloat(i),u)}a.addLayer(t)}),m()});const m=()=>{if(console.log("Drawing routes..."),!n){console.error("Map is not initialized!");return}n.eachLayer(e=>{(e instanceof r.Polyline||e instanceof r.Marker)&&n.removeLayer(e)}),s.routes.forEach(e=>{const o=r.polyline(e.coordinates,{color:"blue"}).addTo(n);n.fitBounds(o.getBounds());const t=e.coordinates[0];if(!t)return;const c=r.marker(t).addTo(n);g(c,e.id,e.departureTime);const i=e.coordinates[e.coordinates.length-1];if(!i)return;const u=r.marker(i).addTo(n);h(u,e)})},g=(e,o,t)=>{const c=`
    <div>
      <label>Время отправления:</label>
      <input
        type="datetime-local"
        value="${p(t)}"
        onchange="updateDepartureTime(${o}, this.value)"
      />
    </div>
  `;e.bindPopup(c).openPopup()},h=(e,o)=>{const t=Math.max(0,o.arrivalTime.getTime()-Date.now()),c=Math.floor(t/(1e3*60*60)),i=Math.floor(t%(1e3*60*60)/(1e3*60)),u=Math.floor(t%(1e3*60)/1e3),f=`
    <div>
      <strong>Время прибытия:</strong> ${o.arrivalTime.toLocaleTimeString()}<br>
      <strong>Ср. скорость:</strong>
      <input
        type="number"
        value="${o.speed}"
        onchange="updateSpeed(${o.id}, this.value)"
      ><br>
      <strong>Осталось времени:</strong> ${c}ч ${i}мин ${u}сек<br>
      <button onclick="deleteRoute(${o.id})">Удалить маршрут</button>
    </div>
  `;e.bindPopup(f).openPopup()},p=e=>new Date(e.getTime()-e.getTimezoneOffset()*6e4).toISOString().slice(0,16);return window.updateDepartureTime=(e,o)=>{const t=new Date(o);if(isNaN(t.getTime())){alert("Некорректное значение времени отправления.");return}s.updateDepartureTime(e,t)},window.updateSpeed=(e,o)=>{const t=parseFloat(o);if(isNaN(t)||t<=0){alert("Некорректное значение средней скорости.");return}s.updateSpeed(e,t)},window.deleteRoute=e=>{s.deleteRoute(e)},D(()=>s.routes,()=>{m()},{deep:!0}),(e,o)=>(C(),_(b,{class:"flex flex-center column",style:{width:"100%"}},{default:T(()=>o[0]||(o[0]=[F("div",{id:"map",class:"map-container"},null,-1)])),_:1}))}}),z=B(Q,[["__scopeId","data-v-6c5c8023"]]),H=v({__name:"IndexPage",setup(d){return(s,n)=>(C(),_(b,{class:"flex flex-center"},{default:T(()=>[N(z)]),_:1}))}});export{H as default};
