var flag_on_key = true;
var blocked = false;
var lockscreenId = 0;

var l = {
    "active": true,
    "url": chrome.runtime.getURL("lockscreen.html")
}

function lockscreen_active() {
    chrome.tabs.create(l, (tab) => {
        blocked = true;
        lockscreenId = tab.id;
        console.log("Lockscreen is created");
    });
}

function lockscreen_deactive() {
    blocked = false;
    chrome.tabs.remove(
        lockscreenId,
        () => {}
      )
}

function debug(){
    console.log("LOCKSCREEN v1.0 iniciado com sucesso!");
    console.log("Criado por SrBalbucio.");
    console.log("");
    console.log(blocked ? "SIM" : "Não");
    console.log(lockscreenId);
    console.log(l);
}

// Eventos da Extensão
chrome.management.onEnabled.addListener(() => {
    debug();
    lockscreen_active();
});

chrome.tabs.onActivated.addListener(() => {
    if(blocked){
        chrome.tabs.get(lockscreenId, (tab) =>{
            tab.active = true;
        })
    }
});

chrome.tabs.onRemoved.addListener((tabId, info) =>{
    if(blocked && lockscreenId == info.id){
        lockscreen_active();
    }
})

chrome.tabs.onUpdated.addListener((tabId, info, tab)=>{
    if(tab.id == lockscreenId){
        lockscreenId = tab.id;
        if(tab.url.includes("unlocked") || tab.pendingUrl.includes("unlocked")){
            blocked = false;
            lockscreen_deactive();
            return;
        } else{
            lockscreen_active();
        }
    }
})