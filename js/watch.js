console.log("'Netflix AutoSkip' is running");

let setting,
  skipList = [],
  setChange = false,
  pathName = "";

const targetEls = [
  {
    name: "intro",
    target: [
      {
        className: "skip-credits",
        el: () => document.querySelector(".skip-credits a")
      }
    ]
  },
  {
    name: "next",
    target: [
      {
        className: "main-hitzone-element-container",
        el: () =>
          document.querySelector(
            ".main-hitzone-element-container a.nf-flat-button-primary"
          )
      },
      {
        className: "ptrack-container fill-container",
        el: () =>
          document.querySelector(
            "div.WatchNext-still-hover-container div.PlayIcon"
          )
      }
    ]
  }
];

const makeSkipList = setting => {
  let skipList = [];
  for (let index in setting) {
    if (setting[index]) {
      skipList = [...skipList, ...targetEls[index].target];
    }
  }
  return skipList;
};

chrome.storage.sync.get("netflixAutoSkip_setting_v3", function(items) {
  setting = items.netflixAutoSkip_setting_v3;
  if (setting === undefined) {
    chrome.storage.sync.set(
      {
        netflixAutoSkip_setting_v3: [true, true]
      },
      function() {}
    );
  }
  skipList = makeSkipList(setting);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  setting = changes.netflixAutoSkip_setting_v3.newValue;
  skipList = makeSkipList(setting);
  setChange = true;
});

/**************************************************************************************************** */

const target = document.getElementById("appMountPoint");

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.nextSibling && mutation.addedNodes.length) {
      const className = mutation.addedNodes[0].className;
      for (let v of skipList) {
        if (v.className.indexOf(className) !== -1) {
          v.el().click();
          break;
        }
      }
    }
  });
});

const config = { childList: true, subtree: true };

const watchInterval = setInterval(() => {
  const newPathName = window.location.pathname;
  if (newPathName !== pathName) {
    if (newPathName.indexOf("watch") !== -1) {
      observer.disconnect();
      observer.observe(target, config);
    } else {
      observer.disconnect();
    }
  } else if (setChange) {
    observer.disconnect();
    observer.observe(target, config);
    setChange = false;
  }
  pathName = newPathName;
}, 3000);
