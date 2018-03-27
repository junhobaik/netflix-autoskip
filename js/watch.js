console.log("'Netflix AutoSkip' is running");

let setting;

chrome.storage.sync.get('netflixAutoSkip_setting', function (items) {
    setting = items.netflixAutoSkip_setting;
    if (setting === undefined) {
        chrome.storage.sync.set({
            'netflixAutoSkip_setting': 1
        }, function () {});
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    setting = changes.netflixAutoSkip_setting.newValue;
});

const skipping = function () {
    const arg = [...arguments];
    setTimeout(() => {
        for (let v of arg) {
            if (v) v.click();
        }
    }, 200);
}

const eventCase = () => {
    const opening = document.querySelector('.skip-credits a'),
        next = document.querySelectorAll('div.main-hitzone-element-container a.nf-icon-button')[1],
        nextFull = document.querySelector('div.WatchNext-still-hover-container div.PlayIcon');

    switch(setting){
        case 2:
            skipping(opening);
            break;
        case 1:
            skipping(opening);
        case 3:
            skipping(next, nextFull);
            break;
        case 4:
            break;
        default:
            break;
    }
}

/**************************************************************************************************** */
let isWatch = false;
const body = document.querySelector('body');

setInterval(() => {
    if (window.location.pathname.indexOf('watch') !== -1) {
        if (isWatch === false) {
            isWatch = true;
            body.addEventListener("DOMSubtreeModified", eventCase);
        }
    } else {
        if (isWatch === true) {
            isWatch = false;
            body.removeEventListener("DOMSubtreeModified", eventCase, {
                passive: true
            });
        }
    }
}, 1000);
