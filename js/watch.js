console.log("'Netflix AutoSkip' is running");

let setting,
  skipList = [];

const el = [
  {
    name: "intro",
    loadEl: () => [document.querySelector(".skip-credits a")]
  },
  {
    name: "recap",
    loadEl: () => [document.querySelector("div.recap-lower a")]
  },
  {
    name: "next",
    loadEl: () => [
      document.querySelectorAll(
        "div.main-hitzone-element-container a.nf-icon-button"
      )[1],
      document.querySelector("div.WatchNext-still-hover-container div.PlayIcon")
    ]
  }
];

const makeSkipList = setting => {
  let skipList = [];
  for (let index in setting) {
    if (setting[index]) {
      skipList = [...skipList, el[index].loadEl];
    }
  }
  return skipList;
};

const skipping = function() {
  const arg = [...arguments];
  setTimeout(() => {
    for (let v of arg) {
      if (v) v.click();
    }
  }, 200);
};

const eventRunner = () => {
  let skip = [];
  for (let value of skipList) {
    skip.push(...value());
  }
  skipping(...skip);
};

chrome.storage.sync.get("netflixAutoSkip_setting", function(items) {
  setting = items.netflixAutoSkip_setting;

  if (setting === undefined) {
    chrome.storage.sync.set(
      {
        netflixAutoSkip_setting: [true, true, true]
      },
      function() {}
    );
  }
  skipList = makeSkipList(setting);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  setting = changes.netflixAutoSkip_setting.newValue;
  skipList = makeSkipList(setting);
});

/**************************************************************************************************** */
let isWatch = false;
const body = document.querySelector("body");

setInterval(() => {
  if (window.location.pathname.indexOf("watch") !== -1) {
    if (isWatch === false) {
      isWatch = true;
      body.addEventListener("DOMSubtreeModified", eventRunner);
    }
  } else {
    if (isWatch === true) {
      isWatch = false;
      body.removeEventListener("DOMSubtreeModified", eventRunner, {
        passive: true
      });
    }
  }
}, 1000);
