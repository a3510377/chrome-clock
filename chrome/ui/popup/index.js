if (!chrome?.storage) location.href = "/";

const configData = {
  lave: ["title", "laveTime"],
  food: ["schoolName", "schoolId"],
};
const nameConfig = Object.entries(configData)
  .map(([key, value]) => value.map((_) => `${key}.${_}`))
  .reduce((d, a) => `${a},${d}`)
  .split(",");

const finishEl = document.querySelector("button#finish");

const checkLunch = document.querySelector("input#checkLunch");
const inputs = document.querySelectorAll("input");
let configs = {};

chrome.storage.local.get("config", ({ config }) => {
  configs = config || configs;
  (configs.lave ||= {}).laveTime ||= "2022-05-21T00:00";
  upInfoFunc();
});

const upInfoFunc = () => {
  for (let input of inputs) {
    let name = input.getAttribute("name");
    let formatName = name?.split(".");
    if (formatName?.length >= 2)
      input.value = configs?.[formatName[0]]?.[formatName[1]] || "";
  }
};

finishEl.addEventListener("click", () => {
  for (let input of inputs) {
    let name = input.getAttribute("name");
    if (!nameConfig.includes(name)) continue;
    let formatName = name.split(".");
    (configs[formatName[0]] ||= {})[formatName[1]] = input.value;
  }
  chrome.storage.local.set({ config: configs });
});
