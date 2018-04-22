(function() {
    const NgDevTools = window.NgDevTools;
    if (typeof NgDevTools === 'object' && NgDevTools !== null) {
        return;
    }
    const script = document.createElement('SCRIPT');
    script.type = 'text/javascript';
    script.src = 'http://example.com/path/to/bundle.js';
    script.addEventListener('error', () => alert('An error occurred loading the bookmarklet'), false);
    document.head.appendChild(script);
})();