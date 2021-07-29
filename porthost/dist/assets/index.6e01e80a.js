import{r as t,w as e,o as s,a as r,c as o,b as l,d as a,v as n,F as i,e as h,t as c,f as p,g as d}from"./vendor.7c4dc564.js";const u={setup(){const r=t({port:"",recentPorts:[],savedPorts:[]}),o=localStorage.getItem("porthostdev-userports");if(o){const t=JSON.parse(o);r.recentPorts=t.recentPorts||[],r.savedPorts=t.savedPorts||[],r.port=t.savedPorts[t.savedPorts.length-1]||""}return e((()=>r.port),((t,e)=>{t.match(/^\d+$/)||(r.port=e),0===t.length&&(r.port=""),Number(t)>65535&&(r.port="65535")})),s((()=>{localStorage.setItem("porthostdev-userports",JSON.stringify(r))})),{state:r}},methods:{fadeoutText(){"none"!==this.$refs.helperText.style.display&&(this.$refs.helperText.style.display="none")},openPort(){0!==this.state.port.length&&(this.state.recentPorts.includes(this.state.port)&&(this.state.recentPorts=[...this.state.recentPorts.filter((t=>t!==this.state.port))]),this.state.savedPorts.includes(this.state.port)||this.state.recentPorts.push(this.state.port),this.state.recentPorts.length>=16&&this.state.recentPorts.shift(),this.$refs.link.click())},detectKey({key:t}){"Enter"===t&&0!==this.state.port.length&&this.openPort()},savePort(t){this.state.savedPorts.includes(t)||(this.state.savedPorts.push(t),this.state.recentPorts=this.state.recentPorts.filter((e=>e!==t)))},deletePort(t){this.state.recentPorts=this.state.recentPorts.filter((e=>e!==t)),this.state.savedPorts=this.state.savedPorts.filter((e=>e!==t))}}},P=l("header",null,[l("h1",null,"porthost.dev")],-1),v={class:"url"},f={for:"port"},k={class:"text",ref:"helperText"},g=l("p",null,"Type in a port number, hit Enter or click the link",-1),y=l("p",null,"Ports range from 0 to 65,535 (or 2^16 – 1)",-1),b=l("p",null,"You may have to allow popups for this site",-1),m=l("p",null,"Data persists using your browser's Local Storage",-1),x={key:0},C={key:1},$={class:"list"},S={class:"list-item-box"},T={class:"list-item"},w={class:"btn-box"},I={key:2},K={key:3},N={class:"list"},Y={class:"list-item-box"},E={class:"list-item"},J={class:"btn-box"},O=l("footer",null,[l("p",null,"Copyright 2021 Ian Goodwin"),l("p",null,"Built using Vue 3")],-1);u.render=function(t,e,s,d,u,V){return r(),o(i,null,[P,l("main",null,[l("div",v,[l("label",f,[l("a",{href:`http://localhost:${d.state.port}`,ref:"link",rel:"noreferrer",target:"blank",onClick:e[1]||(e[1]=t=>V.openPort())}," http://localhost: ",8,["href"])]),a(l("input",{id:"port",pattern:"[0-9]+",placeholder:"port #",type:"text","onUpdate:modelValue":e[2]||(e[2]=t=>d.state.port=t),onKeydown:e[3]||(e[3]=t=>V.detectKey(t)),onClick:e[4]||(e[4]=t=>V.fadeoutText())},null,544),[[n,d.state.port]])]),l("div",k,[g,y,b,m],512),0===d.state.savedPorts.length?(r(),o("h2",x,"You have no saved ports")):(r(),o("h2",C,"Saved Ports")),l("section",$,[(r(!0),o(i,null,h(d.state.savedPorts.slice().sort(((t,e)=>t-e)),(t=>(r(),o("div",null,[l("div",S,[l("div",T,[l("a",{href:`http://localhost:${t}`,ref:"link_savedPorts",rel:"noreferrer",target:"blank"},c(t),9,["href"]),l("div",w,[d.state.savedPorts.includes(t)?p("",!0):(r(),o("button",{key:0,onClick:e=>V.savePort(t)},"♥︎",8,["onClick"])),l("button",{onClick:e=>V.deletePort(t)},"⨯",8,["onClick"])])])])])))),256))]),0===d.state.recentPorts.length?(r(),o("h2",I,"You have no recent ports")):(r(),o("h2",K,"Recent Ports")),l("section",N,[(r(!0),o(i,null,h(d.state.recentPorts.slice().sort(((t,e)=>t-e)),(t=>(r(),o("div",null,[l("div",Y,[l("div",E,[l("a",{href:`http://localhost:${t}`,ref:"link_recentPorts",rel:"noreferrer",target:"blank"},c(t),9,["href"]),l("div",J,[l("button",{onClick:e=>V.savePort(t)},"♥︎",8,["onClick"]),l("button",{onClick:e=>V.deletePort(t)},"⨯",8,["onClick"])])])])])))),256))])]),O],64)},d(u).mount("#app");
