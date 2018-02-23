console.log("'Netflix AutoSkip' is running");

let setting;
chrome.storage.sync.get('netflixAutoSkip_setting', function (items) {
    setting = items.netflixAutoSkip_setting;
    if (setting === undefined) {
        chrome.storage.sync.set({
            'netflixAutoSkip_setting': 1
        }, function () {
            setting = 1;
        });
    }
});

/*
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        setting = storageChange.newValue;
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});
*/

const skipIntro = () => {
    const intro = document.querySelector('.skip-credits a');
    if (intro !== null) {
        setTimeout(function () {
            intro.click();
        }, 200);
    }
}

const skipNextEpisode = () => {
    const nextEpisodeFull = document.querySelector('div.WatchNext-still-container');
    const nextEpisode = document.querySelector('a.nf-icon-button.nf-flat-button.nf-flat-button-primary');
    if (nextEpisode !== null) {
        setTimeout(function () {
            nextEpisode.click();
        }, 200);
    }
    if (nextEpisodeFull !== null) {
        setTimeout(function () {
            nextEpisodeFull.click();
        }, 200);
    }
    
}

const skipEvent = () => {
    switch (setting) {
        case 1:
            skipIntro();
            skipNextEpisode();
            break;
        case 2:
            skipIntro();
            break;
        case 3:
            skipNextEpisode();
            break;
        case 4:
            break;
        default:
            break;
    }
};


let isWatch = false;
const el = document.querySelector('body');

setInterval(() => {
    // TODO: watch 정규표현식 검사로 바꾸기
    if (window.location.pathname.indexOf('watch') !== -1) {
        if (isWatch === false) {
            isWatch = true;
            el.addEventListener("DOMSubtreeModified", skipEvent);
        }
    } else {
        if (isWatch === true) {
            isWarch = false;
            el.removeEventListener("DOMSubtreeModified", skipEvent, { passive: true });
        }
    }
}, 1000);
