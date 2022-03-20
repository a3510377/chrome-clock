if (!chrome.storage) location.href = "/";

const configs = {
  lave: ["title", "laveTime"],
  food: ["schoolName", "schoolId"],
};
const nameConfig = Object.entries(configs)
  .map(([key, value]) => value.map((_) => `${key}.${_}`))
  .reduce((d, a) => `${a},${d}`)
  .split(",");

const checkLunch = document.querySelector("input#checkLunch");
const inputs = document.querySelectorAll("input[type=text]");
checkLunch.addEventListener(
  "input",
  () =>
    (document.querySelector("div.lunchOptions").style.display =
      checkLunch.checked ? "block" : "none")
);

for (let input of inputs) {
  let name = input.getAttribute("name");
  if (!nameConfig.includes(name)) continue;
  let formatName = name.split(".");

  input.addEventListener("input", () => {
    chrome.storage.local.set({
      config: { [formatName[0]]: { [formatName[1]]: input.value } },
    });
  });
  chrome.storage.local.get(
    "config",
    ({ config }) =>
      (input.value = config?.[formatName[0]]?.[formatName[1]] || "")
  );
}
