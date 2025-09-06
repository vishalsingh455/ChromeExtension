(() => {
  const toAbsolute = (u) => {
    try { return u ? (new URL(u, location.href).href) : null; }
    catch (e) { return null; }
  };

  const parseSrcset = (srcset) => {
    if (!srcset) return [];
    return srcset
      .split(',')
      .map(s => s.trim().split(/\s+/)[0])
      .map(toAbsolute)
      .filter(Boolean);
  };

  const collectFromImg = (img, set) => {
    if (img.src) set.add(toAbsolute(img.src));
    if (img.srcset) parseSrcset(img.srcset).forEach(u => set.add(u));

    const lazyAttrs = ['data-src', 'data-lazy', 'data-lazy-src', 'data-original', 'data-iesrc'];
    lazyAttrs.forEach(attr => {
      const v = img.getAttribute(attr);
      if (v) set.add(toAbsolute(v));
    });

    const lazySrcsetAttrs = ['data-srcset', 'data-lazy-srcset'];
    lazySrcsetAttrs.forEach(attr => {
      const v = img.getAttribute(attr);
      if (v) parseSrcset(v).forEach(u => set.add(u));
    });
  };

  const collectFromSources = (set) => {
    document.querySelectorAll('source[srcset]').forEach(s => parseSrcset(s.srcset).forEach(u => set.add(u)));
    document.querySelectorAll('source[data-srcset]').forEach(s => parseSrcset(s.getAttribute('data-srcset')).forEach(u => set.add(u)));
  };

  const collectFromBackgrounds = (set) => {
    document.querySelectorAll('*').forEach(el => {
      const bg = getComputedStyle(el).getPropertyValue('background-image');
      if (!bg || bg === 'none') return;
      const matches = [...bg.matchAll(/url\((['"]?)(.*?)\1\)/g)];
      matches.forEach(m => {
        const abs = toAbsolute(m[2]);
        if (abs) set.add(abs);
      });
    });
  };

  const collectAll = () => {
    const urls = new Set();
    document.querySelectorAll('img').forEach(img => collectFromImg(img, urls));
    collectFromSources(urls);
    collectFromBackgrounds(urls);
    return [...urls].filter(Boolean);
  };

  const updateWindowCollected = () => {
    try {
      window.collectedImages = collectAll();
    } catch (e) {
      window.collectedImages = [];
      console.error('collectAll error', e);
    }
  };

  updateWindowCollected();

  const observer = new MutationObserver(() => {
    if (observer._scheduled) return;
    observer._scheduled = setTimeout(() => {
      updateWindowCollected();
      observer._scheduled = null;
    }, 250);
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'data-src', 'style']
  });

  setTimeout(() => {
    try { observer.disconnect(); } catch (e) {}
  }, 60 * 1000);
})();