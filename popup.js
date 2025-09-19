// document.getElementById('fetch').addEventListener('click', async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => window.collectedImages || []
//   });

//   const urls = results[0].result || [];
//   const list = document.getElementById('imagelist');
//   list.innerHTML = '';
//   urls.forEach(url => {
//     const li = document.createElement('li');
//     li.textContent = url;
//     list.appendChild(li);
//   });
// });

// document.getElementById('download').addEventListener('click', async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => window.collectedImages || []
//   });

//   const urls = results[0].result || [];
//   urls.forEach((url, i) => {
//     chrome.downloads.download({
//       url: url,
//       filename: `collected_images/image_${i + 1}.jpg`
//     });
//   });
// });



// document.getElementById('fetch').addEventListener('click', async () => {
//   // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   const tabsArray = await chrome.tabs.query({ active: true, currentWindow: true });
//   const tab = tabsArray[0];

//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => window.collectedImages || []
//   });

//   const urls = results[0].result || [];
//   const list = document.getElementById('imagelist');
//   list.innerHTML = '';

//   urls.forEach(url => {
//     const li = document.createElement('li');

//     // Create image element instead of plain text
//     const img = document.createElement('img');
//     img.src = url;
//     img.style.maxWidth = "150px";  // prevent large images from breaking layout
//     img.style.maxHeight = "150px";
//     img.style.margin = "5px";

//     li.appendChild(img);
//     list.appendChild(li);
//   });
// });

// document.getElementById('download').addEventListener('click', async () => {
//   // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   const tabsArray = await chrome.tabs.query({ active: true, currentWindow: true });
//   const tab = tabsArray[0];


//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => window.collectedImages || []
//   });

//   const urls = results[0].result || [];
//   urls.forEach((url, i) => {
//     chrome.downloads.download({
//       url: url,
//       filename: `collected_images/image_${i + 1}.jpg`
//     });
//   });
// });


// In your first file (the popup script)

// document.getElementById('fetch').addEventListener('click', async () => {
//   const tabsArray = await chrome.tabs.query({ active: true, currentWindow: true });
//   const tab = tabsArray[0];

//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => window.collectedImages || []
//   });

//   const urls = results[0].result || [];
//   const list = document.getElementById('imagelist');
//   list.innerHTML = '';

//   // --- START OF FIX ---
//   // A function to get the base name of a file from a URL
//   const getBaseName = (url) => {
//     try {
//       const path = new URL(url).pathname;
//       const filename = path.substring(path.lastIndexOf('/') + 1);
//       // Remove extension and common responsive suffixes
//       return filename.replace(/\.[^/.]+$/, "").replace(/-\d+x\d+$/, "").replace(/@\dx$/, "");
//     } catch (e) {
//       return url; // Fallback for invalid URLs
//     }
//   };

//   const seenNames = new Set();
//   const uniqueUrls = [];

//   urls.forEach(url => {
//     const baseName = getBaseName(url);
//     if (!seenNames.has(baseName)) {
//       seenNames.add(baseName);
//       uniqueUrls.push(url);
//     }
//   });
//   // --- END OF FIX ---


//   // Now, iterate over the filtered list
//   uniqueUrls.forEach(url => {
//     const li = document.createElement('li');
//     const img = document.createElement('img');
//     img.src = url;
//     img.style.maxWidth = "150px";
//     img.style.maxHeight = "150px";
//     img.style.margin = "5px";

//     li.appendChild(img);
//     list.appendChild(li);
//   });
// });

// popup.js

// === FETCH IMAGES & PIN MARKS ON WEBPAGE ===
document.getElementById('fetch').addEventListener('click', async () => {
  const tabsArray = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabsArray[0];

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Decide rule: right now it's random (demo)
      const decideMark = () => {
        const random = Math.random();
        if(random<0.5) return "Real"
        return "Fake"
      }

      document.querySelectorAll("img").forEach(img => {
        // Prevent double marking
        if (img.parentElement?.classList.contains("image-wrapper")) return;

        // Create wrapper around image
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Create badge
        const badge = document.createElement("span");
        badge.textContent = decideMark();
        badge.style.position = "absolute";
        badge.style.top = "5px";
        badge.style.left = "5px";
        badge.style.backgroundColor = badge.textContent === "Real" ? "green" : "red";
        badge.style.color = "white";
        badge.style.fontSize = "12px";
        badge.style.fontWeight = "bold";
        badge.style.padding = "2px 5px";
        badge.style.borderRadius = "3px";
        badge.style.zIndex = "9999";

        wrapper.appendChild(badge);
        wrapper.classList.add("image-wrapper");
        // if(badge.textContent === "Fake") {
        //   // wrapper.style.filter = `blur(5px)`
        //   wrapper.style.display = `none`;
        // }
      });
    }
  });
});


// === DOWNLOAD ALL COLLECTED IMAGES ===
// document.getElementById('download').addEventListener('click', async () => {
//   const tabsArray = await chrome.tabs.query({ active: true, currentWindow: true });
//   const tab = tabsArray[0];

//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => window.collectedImages || []
//   });

//   const urls = results[0].result || [];
//   urls.forEach((url, i) => {
//     chrome.downloads.download({
//       url: url,
//       filename: `collected_images/image_${i + 1}.jpg`
//     });
//   });
// });

