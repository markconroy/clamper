// Takes the viewport widths in pixels and the font sizes in rem
// This function is copied from https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/
function clampBuilder(minFontSize, maxFontSize, minWidthPx, maxWidthPx, precision = 3) {
  // Make sure we're using numbers instead of strings (so we can use .toFixed()
  // etc as needed).
  minFontSize = parseFloat(minFontSize);
  maxFontSize = parseFloat(maxFontSize);
  minWidthPx = parseFloat(minWidthPx);
  maxWidthPx = parseFloat(maxWidthPx);

  const root = document.querySelector("html");
  const pixelsPerRem = Number(getComputedStyle(root).fontSize.slice(0, -2));

  const minWidth = minWidthPx / pixelsPerRem;
  const maxWidth = maxWidthPx / pixelsPerRem;

  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minFontSize;

  return `clamp(${minFontSize}rem, ${yAxisIntersection.toFixed(precision)}rem + ${(slope * 100).toFixed(precision)}vw, ${maxFontSize}rem)`;
}

const element = document.querySelector("h1");
const sections = document.querySelectorAll(".section");
const sectionsContainer = document.querySelector(".sections");
const codeContainer = document.querySelector(".code-container");
const sectionButton = document.querySelector(".create-section");
const generateCodeButton = document.querySelector(".generate-clamps");
const clampRowTemplate = document.querySelector('#clamp-row');
const codeRowTemplate = document.querySelector('#code-row');

function createNewSection() {
  const element = clampRowTemplate.content.cloneNode(true);
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
  const element = document.querySelector('.generated-code');
  const codeList = element.querySelector('.code-list');
  element.hidden = false;
  codeList.textContent = '';
  sections.forEach((section) => {
    const minFontSize = section.querySelector(".input--min-font-value").value;
    const maxFontSize = section.querySelector(".input--max-font-value").value;
    const minWidthPx = section.querySelector(".input--min-window-size").value;
    const maxWidthPx = section.querySelector(".input--max-window-size").value;
    const codeRow = codeRowTemplate.content.cloneNode(true);
    const codeElement = codeRow.querySelector('code');

    codeElement.innerHTML = clampBuilder(minFontSize, maxFontSize, minWidthPx, maxWidthPx);
    codeList.appendChild(codeRow);
  });

  const copyClampValues = async () => {
    try {
      const calculatedValues = document.querySelectorAll(
        ".calculated-clamp-values"
      );

      const temporaryElement = document.createElement("text");
      temporaryElement.value = "";
      document.body.appendChild(temporaryElement);

      calculatedValues.forEach((calculatedValue, index, array) => {
        if (index === array.length - 1) {
          temporaryElement.value += calculatedValue.innerHTML;
        } else {
          temporaryElement.value += calculatedValue.innerHTML + "\n";
        }
      });

      await navigator.clipboard.writeText(temporaryElement.value);
      document.body.removeChild(temporaryElement);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const controls = document.querySelector(".controls");
  if (!document.querySelector(".copy-to-clipboard")) {
    const copyToClipboardButton = document.createElement("button");
    copyToClipboardButton.classList.add("copy-to-clipboard");
    copyToClipboardButton.setAttribute("type", "button");
    copyToClipboardButton.innerText = "Copy values to a clipboard";
    controls.insertAdjacentElement("beforeend", copyToClipboardButton);
    copyToClipboardButton.addEventListener("click", copyClampValues);
  }
}

createNewSection();
sectionButton.addEventListener("click", createNewSection);
generateCodeButton.addEventListener("click", generateCode);
