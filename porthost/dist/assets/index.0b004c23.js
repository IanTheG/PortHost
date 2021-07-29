import{r as t,w as e,o as s,a as r,c as o,b as l,d as a,v as n,F as i,e as h,t as c,f as p}from"./vendor.9f25b5f4.js";const d={setup(){const r=t({port:"",recentPorts:[],savedPorts:[]}),o=localStorage.getItem("porthostdev-userports");if(o){const t=JSON.parse(o);r.recentPorts=t.recentPorts||[],r.savedPorts=t.savedPorts||[],r.port=t.savedPorts[t.savedPorts.length-1]||""}return e((()=>r.port),((t,e)=>{t.match(/^\d+$/)||(r.port=e),0===t.length&&(r.port=""),Number(t)>65535&&(r.port="65535")})),s((()=>{localStorage.setItem("porthostdev-userports",JSON.stringify(r))})),{state:r}},methods:{hideHelpText(){"none"!==this.$refs.helperText.style.display&&(this.$refs.helperText.style.display="none")},openPort(){0!==this.state.port.length&&(this.state.recentPorts.includes(this.state.port)&&(this.state.recentPorts=[...this.state.recentPorts.filter((t=>t!==this.state.port))]),this.state.savedPorts.includes(this.state.port)||this.state.recentPorts.push(this.state.port),this.state.recentPorts.length>=16&&this.state.recentPorts.shift())},detectKey({key:t}){"Enter"===t&&0!==this.state.port.length&&(this.openPort(),this.$refs.link.click())},savePort(t){this.state.savedPorts.includes(t)||(this.state.savedPorts.push(t),this.state.recentPorts=this.state.recentPorts.filter((e=>e!==t)))},deletePort(t){this.state.recentPorts=this.state.recentPorts.filter((e=>e!==t)),this.state.savedPorts=this.state.savedPorts.filter((e=>e!==t))}}},u=l("header",null,[l("h1",null,"porthost.io")],-1),P={class:"url"},v={for:"port"},f={class:"text",ref:"helperText"},k=l("h2",null,"Speed up development with easy access to your favorite localhost dev servers and ports.",-1),y=l("br",null,null,-1),b=l("p",null,"Type in a port number, hit Enter or click the link",-1),g=l("p",null,"Ports range from 0 to 65,535 (or 2^16 – 1)",-1),m=l("p",null,"Data persists using your browser's Local Storage",-1),x=l("p",null,"You may have to allow popups for this site",-1),C={key:0},S={key:1},$={class:"list"},w={class:"list-item-box"},T={class:"list-item"},I={class:"btn-box"},K={key:2},N={key:3},Y={class:"list"},E={class:"list-item-box"},F={class:"list-item"},H={class:"btn-box"},J=l("footer",null,[l("p",null,"Copyright 2021 Ian Goodwin"),l("p",null,"Built using Vue 3")],-1);d.render=function(t,e,s,p,d,O){return r(),o(i,null,[u,l("main",null,[l("div",P,[l("label",v,[l("a",{href:`http://localhost:${p.state.port}`,ref:"link",rel:"noreferrer",target:"blank",onClick:e[1]||(e[1]=t=>O.openPort())}," http://localhost: ",8,["href"])]),a(l("input",{id:"port",pattern:"[0-9]+",placeholder:"port #",type:"text","onUpdate:modelValue":e[2]||(e[2]=t=>p.state.port=t),onKeydown:e[3]||(e[3]=t=>O.detectKey(t)),onClick:e[4]||(e[4]=t=>O.hideHelpText())},null,544),[[n,p.state.port]])]),l("div",f,[k,y,b,g,m,x],512),0===p.state.savedPorts.length?(r(),o("h2",C,"You have no saved ports")):(r(),o("h2",S,"Saved Ports")),l("section",$,[(r(!0),o(i,null,h(p.state.savedPorts.slice().sort(((t,e)=>t-e)),(t=>(r(),o("div",null,[l("div",w,[l("div",T,[l("a",{href:`http://localhost:${t}`,ref:"link_savedPorts",rel:"noreferrer",target:"blank"},c(t),9,["href"]),l("div",I,[l("button",{class:"deletePortFromSaved",onClick:e=>O.deletePort(t)},"×",8,["onClick"])])])])])))),256))]),0===p.state.recentPorts.length?(r(),o("h2",K,"You have no recent ports")):(r(),o("h2",N,"Recent Ports")),l("section",Y,[(r(!0),o(i,null,h(p.state.recentPorts.slice().sort(((t,e)=>t-e)),(t=>(r(),o("div",null,[l("div",E,[l("div",F,[l("a",{href:`http://localhost:${t}`,ref:"link_recentPorts",rel:"noreferrer",target:"blank"},c(t),9,["href"]),l("div",H,[l("button",{class:"savePort",onClick:e=>O.savePort(t)},"♥︎",8,["onClick"]),l("button",{class:"deletePort",onClick:e=>O.deletePort(t)},"×",8,["onClick"])])])])])))),256))])]),J],64)},p(d).mount("#app");
