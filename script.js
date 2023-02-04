// Takes the viewport widths in pixels and the font sizes in rem
// This function is copied from https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/
function clampBuilder(minFontSize, maxFontSize, minWidthPx, maxWidthPx) {
  const root = document.querySelector("html");
  const pixelsPerRem = Number(getComputedStyle(root).fontSize.slice(0, -2));

  const minWidth = minWidthPx / pixelsPerRem;
  const maxWidth = maxWidthPx / pixelsPerRem;

  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minFontSize;

  return `clamp(${minFontSize}rem, ${yAxisIntersection}rem + ${slope * 100}vw, ${maxFontSize}rem)`;
}

const element = document.querySelector("h1");
const sections = document.querySelectorAll(".section");
const sectionsContainer = document.querySelector(".sections");
const codeContainer = document.querySelector(".code-container");
const sectionButton = document.querySelector(".create-section");
const generateCodeButton = document.querySelector(".generate-clamps");

function createNewSection() {
  const element = document.createElement("div");
  element.classList.add("section");
  element.innerHTML = `
        <div class="form-item">
          <label for="input--min-font-value">Min font size (rem)</label>
          <input type="text" id="input--min-font-value" class="input input--min-font-value" name="input--min-font-value" value="1">
        </div>
        <div class="form-item">
          <label for="input--max-font-value">Max font size (rem)</label>
          <input type="text" id="input--max-font-value" class="input input--max-font-value" name="input--max-font-value" value="2">
        </div>
        <div class="form-item">
          <label for="input--min-window-size">Min window size (px)</label>
          <input type="text" id="input--min-window-size" class="input input--min-window-size" name="input--min-window-size" value="360">
        </div>
        <div class="form-item">
          <label for="input--max-window-size">Max window size (px)</label>
          <input type="text" id="input--max-window-size" class="input input--max-window-size" name="input--max-window-size" value="960">
        </div>
      `;
  sectionsContainer.appendChild(element);
  const sections = document.querySelectorAll(".section");

  sections.forEach(updateSection);
}

function updateSection(section, index) {
  index = index + 1;
  section.classList.add(`section--${index}`);
  section.querySelectorAll("label").forEach((label) => {
    const currentFor = label.getAttribute("for");
    label.setAttribute("for", `${currentFor}-${index}`);
  });
  section.querySelectorAll("input").forEach((input) => {
    const currentName = input.getAttribute("name");
    const currentId = input.getAttribute("id");
    input.setAttribute("name", `${currentName}-${index}`);
    input.setAttribute("id", `${currentId}-${index}`);
  });
}

function generateCode() {
  const sections = document.querySelectorAll(".section");
  const element = document.createElement("div");
  const codeList = document.createElement("ul");
  element.classList.add("generated-code");
  codeList.classList.add("code-list");
  element.appendChild(codeList);
  codeContainer.appendChild(element);
  const listItems = document.querySelectorAll('.code-list-item');
  listItems.forEach(item => {
    item.remove();
  })
  sections.forEach((section) => {
    const parent = document.querySelector(".code-list");
    const listItem = document.createElement("li");
    const element = document.createElement("pre");
    element.classList.add("code-item");
    listItem.classList.add("code-list-item");
    listItem.appendChild(element);
    const minFontSize = section.querySelector(".input--min-font-value").value;
    const maxFontSize = section.querySelector(".input--max-font-value").value;
    const minWidthPx = section.querySelector(".input--min-window-size").value;
    const maxWidthPx = section.querySelector(".input--max-window-size").value;
    element.innerHTML = `
      <code>${clampBuilder(minFontSize, maxFontSize, minWidthPx, maxWidthPx)}</code>
    `;
    parent.appendChild(listItem);
  });
}

createNewSection();
sectionButton.addEventListener("click", createNewSection);
generateCodeButton.addEventListener("click", generateCode);
