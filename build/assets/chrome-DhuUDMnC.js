const t={color:null,image:{filename:"",data:"",style:"cover",size:100,opacity:100,hue:0,grayscale:0,blur:0},closeTab:{pinned:!0,grouped:!0}};function c(){return{getSettings:async()=>{try{return(await chrome.storage.local.get(["page"])).page||t}catch{return JSON.parse(window.localStorage.getItem("page")||"")}},saveSettings:async e=>{try{await chrome.storage.local.set({page:e})}catch{window.localStorage.setItem("page",JSON.stringify(e))}},openShortcuts:()=>{try{chrome.tabs.create({url:"chrome://extensions/shortcuts"})}catch{}}}}export{t as d,c as u};
