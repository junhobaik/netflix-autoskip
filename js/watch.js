console.log("'Netflix AutoSkip' is running");

let setting,
  skipList = [],
  isLoadingCheck = false;

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

const body = document.querySelector("body");
let isWatch = false;
let pathName = "";

function DOMSubtreeModifiedEventControl(fn) {
  this.remove = () => {
    document
      .querySelector("body")
      .removeEventListener("DOMSubtreeModified", fn);
    return this;
  };
  this.add = () => {
    document.querySelector("body").addEventListener("DOMSubtreeModified", fn);
    return this;
  };
}

// BUG FIX
const loadingCheck = new DOMSubtreeModifiedEventControl(() => {
  const loadingEl = document.querySelector(".PlayerSpinner--percentage");
  if (loadingEl) {
    const playButton = document.querySelector(".button-nfplayerPlay");
    if (loadingEl.innerHTML === "100%") {
      if (playButton) {
        setTimeout(() => {
          if (playButton) {
            playButton.onclick();
          }
        }, 1000);
      }
    }
  }
});

const eventControl = new DOMSubtreeModifiedEventControl(() => {
  let els = [];
  for (let loadEl of skipList) {
    els = [...els, ...loadEl()];
  }
  const el = selector(els);

  if (el) {
    setTimeout(() => {
      eventControl.remove();
      el.click();
    }, 200);

    if (el === skipList[0]()[0]) {
      eventControl.remove();
      loadingCheck.add();
      setTimeout(() => {
        eventControl.add();
        loadingCheck.remove();
      }, 10000);
    } else {
      setTimeout(() => {
        eventControl.add();
      }, 1000);
    }
  }
});

const selector = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      arr.splice(i, 1);
      i--;
    }
  }
  if (arr.length) return arr[0];
  return;
};

const watchInterval = setInterval(() => {
  const newPathName = window.location.pathname;
  if (newPathName !== pathName) {
    if (newPathName.indexOf("watch") !== -1) {
      isWatch = true;
      eventControl.add();
    } else {
      isWatch = false;
      eventControl.remove();
    }
  }
  pathName = newPathName;
}, 1000);
