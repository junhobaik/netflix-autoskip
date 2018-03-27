document.addEventListener('DOMContentLoaded', () => {

    chrome.storage.sync.get('netflixAutoSkip_setting', function (items) {
        const select = items.netflixAutoSkip_setting;
        document.querySelector(`#dropdown>option:nth-child(${select})`).setAttribute('selected', true);
    });

    document.querySelector("body").addEventListener("change", () => {
        const setNum = dropdown.selectedIndex + 1;

        chrome.storage.sync.set({
            'netflixAutoSkip_setting': setNum,
            
        }, function () {});
    })

});
