var flag_on_key = true;
var blocked = false;
var lockscreenId = 0;

var l = {
    "active": true,
    "url": chrome.runtime.getURL("lockscreen.html")
}

function debug() {
    console.log("TAB LOCKSCREEN : " + lockscreenId)
    console.log("LOCKSCREEN ACTIVE : " + blocked)
}

function lockscreen_active() {
    if(!blocked) {
        debug()
        chrome.tabs.create(l, (tab) => {
            blocked = true;
            lockscreenId = tab.id;
            console.log("Lockscreen is created");
        });
    }
}

function lockscreen_deactive() {
    if (lockscreenId !== undefined) {
        chrome.tabs.get(lockscreenId, function (tab) {
            if (tab !== undefined && !chrome.runtime.lastError) {
                if (lockscreenId !== undefined) {
                    chrome.tabs.remove(
                        lockscreenId,
                        () => {
                        }
                    )
                }
                lockscreenId = undefined;
            }
        });
    }
    blocked = false;
}

function activeLockscreen() {
    chrome.tabs.get(lockscreenId, function (tab) {
        if (tab !== undefined && !chrome.runtime.lastError) {
            chrome.tabs.update(lockscreenId, {active: true}, function (updatedTab) {
            });
        }
    });
}

var intervalo = setInterval(() => {
    if (blocked) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (tabs.length > 0) {
                let activeTab = tabs[0];
                if (activeTab.id !== lockscreenId) {
                    activeLockscreen()
                }
            } else {
                lockscreen_active()
            }
        });
    }
}, 100);

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.storage.sync.set({"password": "password"});
        chrome.storage.sync.set({"min": 5});
        lockscreen_active()
    } else if (details.reason === "update") {
        lockscreen_active()
    }
});

chrome.runtime.onStartup.addListener(() => {
    lockscreen_active()
})

chrome.tabs.onCreated.addListener((tab) => {
    if (blocked) {
        if (tab.id !== lockscreenId && !chrome.runtime.lastError) {
            chrome.tabs.get(tab.id, function (tab) {
                if (tab !== undefined) {
                    chrome.tabs.remove(tab.id, function () {
                    });
                }
            });
        }
    }
})

chrome.tabs.onActivated.addListener((info) => {
    setTimeout(() => {
        if (blocked) {
            activeLockscreen()
        }
    }, 100);
})

chrome.tabs.onRemoved.addListener((tabid, removeInfo) => {
    if (blocked) {
        if (tabid === lockscreenId) {
            lockscreen_active()
        }
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeObj, tab) => {
    if (tabId === lockscreenId) {
        if (tab.url.includes("unlocked")) {
            let urlpass = tab.url.split("=");
            chrome.storage.sync.get(["password"]).then((result) => {
                if (result.password !== undefined) {
                    if (result.password === urlpass[1]) {
                        lockscreen_deactive()
                    } else {
                        lockscreen_deactive()
                        lockscreen_active()
                    }
                } else {
                    chrome.storage.sync.set({"password": "password"});
                    lockscreen_deactive()
                }
            });
        } else if (!tab.url.includes("lockscreen.html")) {
            lockscreen_deactive()
            lockscreen_active()
        }
    } else{
        chrome.storage.sync.get(["bloquearSite"]).then((result) => {
            if(result.bloquearSite === true){
                if(tab.url.includes("instagram.com") ||
                    tab.url.includes("discord.com") ||
                    tab.url.includes("facebook.com") ||
                    tab.url.includes("youtube.com") ||
                    tab.url.includes("twitter.com") ||
                    tab.url.includes("x.com") ||
                    tab.url.includes("reddit.com") ||
                    tab.url.includes("mercadopago.com") ||
                    tab.url.includes("bb.com.br") ||
                    tab.url.includes("nubank.com.br") ||
                    tab.url.includes("web.whatsapp.com")){
                    lockscreen_active()
                }
            }
        })
    }
})
