      function getHead(prevWord, lineNum) {
        console.log("getHead called with prevWord:", prevWord);
        let spanned;
        const spanRegex = /^<span[^>]*>(.*?)<\/span>/;
        let inner = document.getElementById("scroll" + (lineNum + 1)).innerHTML;
        spanned = inner.match(spanRegex);
        if (!spanned) throw new Error("No span found in next line");
        console.log("spanned[1]:", spanned[1]);
        spanned = spanned[1].trim() === prevWord ? "" : spanned[0];
        return [spanned, prevWord];
      }
      function getWord(prevWord) {
        console.log("getWord called with prevWord:", prevWord);
        let word;
        do {
          word = whatIAmGenerating[Math.floor(Math.random()*whatIAmGenerating.length)].toLowerCase();
        } while (word == prevWord)
        return [span(word), word];
      }

async function scrollGeneration() {
  console.log("entering scrollGeneration (parallel)");
  const lineScrollers = [];
  for (let i = 0; i < numOfLines; i++) {
    lineScrollers.push(scrollLine(i));
  }
  // Optionally wait for all lines to finish (they won't, unless you add a stop condition)
  // await Promise.all(lineScrollers);
}

async function scrollLine(lineIndex) {
  let count = 0;
  let prevWord = "", spanned = "";
  const scrollContainer = document.getElementById("scroll" + lineIndex);
  while (count++ < 1000) { // or use a while(true) for infinite
    scrollContainer.scrollLeft = 0;
    await scrollFirstWord(scrollContainer);
    let inner = scrollContainer.innerHTML;
    let head = inner.match(spanRegex);
    if (!head) continue; // skip if no span found
    let decapitated = inner.replace(head[0], "");
    [spanned, prevWord] = getWord(prevWord);
    scrollContainer.innerHTML = decapitated + spanned;
    // Optionally add a small delay for smoother effect
    // await new Promise(r => setTimeout(r, 10));
  }
}

// with adjustable speed:

let scrollSpeed = 10; // ms per scroll step; adjust as desired

async function scrollGeneration() {
  console.log("entering scrollGeneration (parallel, adjustable speed)");
  for (let i = 0; i < numOfLines; i++) {
    scrollLine(i, scrollSpeed);
  }
}

async function scrollLine(lineIndex, speed) {
  let prevWord = "", spanned = "";
  const scrollContainer = document.getElementById("scroll" + lineIndex);
  while (true) { // Infinite scroll; add a stop condition if needed
    scrollContainer.scrollLeft = 0;
    await scrollFirstWordWithSpeed(scrollContainer, speed);
    let inner = scrollContainer.innerHTML;
    let head = inner.match(spanRegex);
    if (!head) continue; // skip if no span found
    let decapitated = inner.replace(head[0], "");
    [spanned, prevWord] = getWord(prevWord);
    scrollContainer.innerHTML = decapitated + spanned;
    // Optional: await new Promise(r => setTimeout(r, speed));
  }
}

async function scrollFirstWordWithSpeed(scrollContainer, speed) {
  const wordToScroll = scrollContainer.firstChild;
  if (!wordToScroll) throw new Error("Element with first word not found");
  const amountToScroll = wordToScroll.offsetWidth;
  let tries = 0, maxTries = 1000;
  return new Promise((resolve) => {
    function smoothScroll() {
      tries++;
      if (scrollContainer.scrollLeft >= amountToScroll || tries > maxTries) {
        resolve();
      } else {
        scrollContainer.scrollBy({
          left: 1.5,
          behavior: "instant"
        });
        setTimeout(smoothScroll, speed);
      }
    }
    smoothScroll();
  });
}