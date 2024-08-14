(function($){typeof define=="function"&&define.amd?define($):$()})(function(){"use strict";const $="ll-strategy-dashboard-",V="ll-strategy-view-";var f=(e=>(e.equal="equal",e.in="in",e.greater_than="greater_than",e.lower_than="lower_than",e.is_null="is_null",e.is_numeric="is_numeric",e))(f||{});const W=e=>!e.disabled_by&&!e.hidden_by,C=(e,n,t)=>{const a=parseFloat(n),i=parseFloat(t);switch(e){case f.equal:return n==t;case f.in:if(Array.isArray(t))return t.includes(n);throw Error("Cannot compare. Value must be array.");case f.greater_than:if(isNaN(a)||isNaN(i))throw Error("Cannot compare. One or more values are not numeric");return a>i;case f.lower_than:if(isNaN(a)||isNaN(i))throw Error("Cannot compare. One or more values are not numeric");return a<i;case f.is_null:return!!n;case f.is_numeric:return!isNaN(a)}},q={entity:(e,n,t,a)=>{const i=e.entity_id;return C(a,i,t)},domain:(e,n,t,a)=>{const i=e.entity_id.split(".")[0];return C(a,i,t)},device:(e,n,t,a)=>{const i=e.device_id;return C(a,i,t)},integration:(e,n,t,a)=>{const i=e.platform;return C(a,i,t)},label:(e,n,t,a)=>e.labels.map(r=>C(a,r,t)).indexOf(!0)>0,state:(e,n,t,a)=>{var r;const i=(r=n.states[e.entity_id])==null?void 0:r.state;return C(a,i,t)},attribute:(e,n,t,a)=>{var s;const i=(s=n.states[e.entity_id])==null?void 0:s.attributes;if((m=>!!t&&typeof t=="object"&&t.hasOwnProperty("key")&&t.hasOwnProperty("value"))())return C(a,i[t.key],t.value);throw Error("value is not defined correctly")}},A=(e,n)=>{const t=r=>{const s=r.filter(m=>m.startsWith("sort_")).map(m=>m.replace("sort_",""));return s.push(1/0),s},a=t(e.labels||[])[0],i=t(n.labels||[])[0];return a-i};function B(e){return e!=null}const M={minColumnWidth:150,tabs:[{label:"Control",icon:"mdi:button-pointer",rows:[{domain:"alarm_control_panel",title:"Alarm",card:{type:"tile",entity:"$entity",features:[{type:"alarm-modes",modes:["armed_home","armed_away","armed_night","armed_vacation","armed_custom_bypass","disarmed"]}],tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:"media_player",title:"Media",card:{type:"custom:mushroom-media-player-card",entity:"$entity",use_media_artwork:!0,show_volume_level:!0,use_media_info:!1,collapsible_controls:!0,volume_controls:["volume_set"],media_controls:["play_pause_stop"],tap_action:{action:"toggle"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:"cover",title:"Cover",card:{type:"tile",entity:"$entity",features:[{type:"cover-open-close"}],tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:"vacuum",title:"Vacuum",card:{type:"tile",entity:"$entity",features:[{type:"vacuum-commands",commands:["start_pause","return_home"]}],tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:["switch","input_boolean"],title:"Switch",card:{type:"tile",entity:"$entity",hide_state:!0,color:"amber",tap_action:{action:"toggle"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:["select","input_select"],title:"Select",card:{type:"tile",entity:"$entity",hide_state:!0,color:"primary",features:[{type:"select-options"}],tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:["button","scene"],title:"Button",card:{type:"tile",entity:"$entity",hide_state:!0,color:"primary",tap_action:{action:"toggle"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:"number",title:"Number",card:{type:"tile",entity:"$entity",hide_state:!0,features:[{type:"numeric-input",style:"slider"}],tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}}]},{label:"Stats",icon:"mdi:chart-line",rows:[{domain:"binary_sensor",title:"Alert",filter:{exclude:[{type:"attribute",value:{key:"device_class",value:"motion"}},{type:"attribute",value:{key:"device_class",value:"occupancy"}}]},card:{type:"tile",entity:"$entity",hide_state:!0,color:"primary",tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:"sensor",title:"Sensor",filter:{exclude:[{type:"attribute",value:{key:"device_class",value:"battery"}},{type:"state",comparator:"is_numeric"}]},card:{type:"tile",entity:"$entity",color:"primary",tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}},{domain:"sensor",title:"Graphs",filter:{exclude:[{type:"attribute",value:{key:"device_class",value:"battery"}}],include:[{type:"state",comparator:"is_numeric"}]},card:{type:"custom:mini-graph-card",entities:["$entity"],align_header:"left",align_icon:"left",align_state:"center",font_size:50,font_size_header:12,tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"},card_mod:{style:`.header {
  max-width: 80%;
}
.line--rect,
.fill--rect,
.line--points {
  {% set COLOR = 'grey' %}
  {% if state_attr(config.entities[0].entity,'device_class') in ['date', 'timestamp', 'irradiance', 'distance', 'duration', 'illuminance', 'enum', 'monetary'] %} 
    {% set COLOR = 'grey' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['apparent_power', 'battery', 'current', 'energy', 'energy_storage', 'power_factor', 'power', 'voltage'] %} 
    {% set COLOR = 'yellow' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['aqi', 'sulphur_dioxide', 'volatile_organic_compounds', 'volatile_organic_compounds_parts', 'atmospheric_pressure', 'carbon_dioxide', 'carbon_monoxide', 'nitrogen_dioxide', 'gas', 'nitrogen_monoxide', 'nitrous_oxide', 'ozone', 'pm1', 'pm10', 'pm25'] %} 
    {% set COLOR = 'green' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['pressure', 'reactive_power', 'speed', 'temperature', 'weight', 'wind_speed'] %} 
    {% set COLOR = 'orangered' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['moisture', 'ph', 'precipitation', 'precipitation_intensity', 'humidity', 'water', 'volume', 'volume_storage'] %} 
    {% set COLOR = 'royalblue' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['data_rate', 'data_size', 'signal_strength', 'frequency', 'sound_pressure'] %}
    {% set COLOR = 'orange' %}
  {% endif %}            
  fill: {{COLOR}};
  stroke: {{COLOR}};
}
`}}}]},{label:"Camera",icon:"mdi:camera",rows:[{domain:"camera",card:{type:"picture-entity",entity:"$entity",tap_action:{action:"more-info"},icon_tap_action:{action:"none"},hold_action:{action:"more-info"}}}]}],areaCardConfig:{aspect_ratio:"35:15",alert_classes:["occupancy"],sensor_classes:["temperature","moisture"]},areaColors:["rgba(42,72,100,0.3)","rgba(234,162,33,0.3)","rgba(214,64,92,0.3)","rgba(190,70,178,0.3)","rgba(145,142,80,0.3)","rgba(12,162,121,0.3)","rgba(76,159,171,0.3)","rgba(147,72,26,0.3)"]},O=(e,n,t,a,i)=>{const r=[],s=[];return e.forEach(m=>{var u;const d=((u=(i||{})[m.entity_id])==null?void 0:u.card)||n.card,l=Object.entries(d).filter(([p,y])=>JSON.stringify(y).includes("$entity")).map(([p,y])=>{const o=JSON.stringify(y);return[p,JSON.parse(o.replace("$entity",m.entity_id))]});s.push({...d,...Object.fromEntries(l)})}),s.length>0&&(a&&r.push({type:"custom:mushroom-title-card",title:a,subtitle_tap_action:{action:"none"}}),r.push({type:"custom:layout-card",layout_type:"custom:grid-layout",layout:{"grid-template-rows":"auto","grid-template-columns":`repeat(auto-fit, minmax(${t}px, 1fr))`,padding:"0px 10px"},cards:s})),r};class F extends HTMLTemplateElement{static async generate(n,t){var d;const[a,i,r]=await Promise.all([t.callWS({type:"config/entity_registry/list"}),t.callWS({type:"config/device_registry/list"}),t.callWS({type:"config/area_registry/list"})]);return{views:[...r.filter(l=>{var u;return!((u=n.config)!=null&&u.areaBlacklist)||n.config.areaBlacklist.indexOf(l.area_id)==-1}).sort(A).map((l,u)=>({strategy:{type:"custom:area-view-strategy",meta:{entities:a,devices:i,areas:r},config:{...M,...n.config||{},area:l.area_id}},title:l.name,path:l.area_id,icon:"mdi:home",type:"panel",subview:!1,visible:u==0})),...((d=n.config)==null?void 0:d.extraViews)||[]]}}}class H extends HTMLTemplateElement{static async generate(n,t){const{config:a,meta:i}=n,r={...M,...a},{area:s,tabs:m,minColumnWidth:d,replaceCards:l,topCards:u,areaColors:p,areaCardConfig:y,areaBlacklist:o}=r;let w=Array(),x=Array(),g=Array();if(i)w=i.entities,x=i.devices,g=i.areas;else{const c=await Promise.all([t.callWS({type:"config/entity_registry/list"}),t.callWS({type:"config/device_registry/list"}),t.callWS({type:"config/area_registry/list"})]);w=c[0],x=c[1],g=c[2]}w=[...w].sort(A),x=[...x].sort(A),g=[...g].sort(A);const U=g.filter(c=>!o||o.indexOf(c.area_id)==-1),N=g.find(c=>c.area_id==s);if(!N)throw Error("No area defined");const z=new Set;for(const c of x)c.area_id===N.area_id&&z.add(c.id);const j={type:"vertical-stack",cards:[{type:"custom:layout-card",layout_type:"custom:grid-layout",layout:{"grid-template-rows":"auto","grid-template-columns":"repeat(auto-fit, minmax(300px, 1fr))"},cards:[]}]},T=U.reduce((c,h,_)=>{const b={...y,type:"area",area:h.area_id,navigation_path:`${h.area_id}#main`};return c.cards[0].cards.push({type:"conditional",conditions:[{condition:"screen",media_query:"(max-width: 1000px)"}],card:{...b,card_mod:{style:`
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${p[_]};
                  }`}}}),c.cards[0].cards.push({type:"conditional",conditions:[{condition:"screen",media_query:"(min-width: 1001px)"}],card:h.area_id==N.area_id?b:{...b,card_mod:{style:`
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${p[_]};
                        }`}}}),c},j);T.cards=[...u||[],...T.cards];const J=c=>c.reduce((h,_)=>{let b=w.filter(W).filter(v=>v.area_id?v.area_id===N.area_id:z.has(v.device_id)).filter(v=>{const L=v.entity_id.split(".")[0];return Array.isArray(_.domain)?_.domain.filter(E=>E==L).length>0:_.domain==L});_.filter&&(b=b.filter(v=>{var E;return(((E=_.filter)==null?void 0:E.include)||[]).reduce((S,k)=>S&&q[k.type](v,t,k.value,k.comparator||f.equal),!0)}),b=b.filter(v=>{var E;return(((E=_.filter)==null?void 0:E.exclude)||[]).reduce((S,k)=>S&&!q[k.type](v,t,k.value,k.comparator||f.equal),!0)}));const X=O(b,_,d,_.title,l);return h.push(...X),h},Array()),G=m.map(c=>{const h=J(c.rows);return h.length>0?{attributes:{label:c.label,icon:c.icon,stacked:!0},card:{type:"vertical-stack",cards:h}}:null}).filter(B),P={type:"custom:tabbed-card",styles:{"--mdc-tab-text-label-color-default":"var(--primary-text-color)","--mdc-tab-color-default":"var(--primary-text-color)"},tabs:G};return{panel:!0,cards:[{type:"vertical-stack",cards:[{type:"conditional",conditions:[{condition:"screen",media_query:"(max-width: 1000px)"}],card:{type:"custom:state-switch",entity:"hash",default:"default",states:{"":{type:"vertical-stack",cards:[T,{type:"custom:gap-card",height:60}]},default:{type:"vertical-stack",cards:[P,{type:"custom:mushroom-chips-card",card_mod:{style:`
                        ha-card { --chip-background: none; }
                        :host {
                          --chip-icon-size: 1em !important;
                          z-index: 2;
                          width: 100%;
                          position: fixed;
                          bottom: 0;
                          margin: 0 !important;
                          padding: 20px;
                          background: var(--app-header-background-color);
                          left: 50%;
                          transform: translateX(-50%);
                        }
                        @media (min-width: 1001px) {
                          :host {
                            display: none;
                          }
                        }`},chips:[{type:"spacer"},{type:"template",icon:"mdi:home",icon_height:"40px",tap_action:{action:"navigate",navigation_path:window.location.pathname}},{type:"spacer"}]},{type:"custom:gap-card",height:60}]}}}},{type:"conditional",conditions:[{condition:"screen",media_query:"(min-width: 1001px)"}],card:{type:"custom:layout-card",layout_type:"custom:grid-layout",layout:{"grid-template-columns":"2fr 3fr","grid-template-areas":"navigation main"},cards:[T,P]}}]}]}}}customElements.define(`${$}area-dashboard-strategy`,F),customElements.define(`${V}area-view-strategy`,H);const R={minColumnWidth:200};class D extends HTMLTemplateElement{static async generate(n,t){const{config:a}=n,i={...R,...a},{minColumnWidth:r,replaceCards:s}=i,[m]=await Promise.all([t.callWS({type:"config/entity_registry/list"})]),d={card:{type:"custom:mini-graph-card",entities:["$entity"],align_header:"left",align_icon:"left",align_state:"center",font_size:50,font_size_header:12,lower_bound:0,upper_bound:100,card_mod:{style:`
              .header {
                max-width: 80%;
              }
              .line--rect,
              .fill--rect,
              .line--points {
                fill: amber;
                stroke: amber;
              }`}}},l=m.filter(W).filter(o=>{var x,g;return o.entity_id.split(".")[0]=="sensor"&&((g=(x=t.states[o.entity_id])==null?void 0:x.attributes)==null?void 0:g.device_class)=="battery"}),u=l.filter(o=>!["mqtt","switchbot"].includes(o.platform)),p=l.filter(o=>["mqtt"].includes(o.platform)),y=l.filter(o=>["switchbot"].includes(o.platform));return{panel:!0,cards:[{type:"vertical-stack",cards:[...u.length>0?O(u,d,r,"Other",s):[],...p.length>0?O(p,d,r,"Zigbee",s):[],...y.length>0?O(y,d,r,"Switchbot",s):[]]}]}}}customElements.define(`${V}battery-view-strategy`,D);class I extends HTMLTemplateElement{static async generate(n,t){const{config:a}=n,i={...R,...a},{minColumnWidth:r,replaceCards:s}=i,[m]=await Promise.all([t.callWS({type:"config/entity_registry/list"})]),d={card:{type:"tile",entity:"$entity",hide_state:!0,features:[{type:"update-actions",backup:"ask"}]}},l=m.filter(W).filter(o=>{const w=o.entity_id.split(".")[0];return!o.disabled_by&&!o.hidden_by&&w=="update"}),u=l.filter(o=>!["unifi","esphome"].includes(o.platform)),p=l.filter(o=>["unifi"].includes(o.platform)),y=l.filter(o=>["esphome"].includes(o.platform));return{panel:!0,cards:[{type:"vertical-stack",cards:[...u.length>0?O(u,d,r,"Other",s):[],...p.length>0?O(p,d,r,"UniFi",s):[],...y.length>0?O(y,d,r,"ESPHome",s):[]]}]}}}customElements.define(`${V}update-view-strategy`,I)});
