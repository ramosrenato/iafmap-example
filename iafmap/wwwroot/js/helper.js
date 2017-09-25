
/**
 * Detecta se o browser é de dispositivo móvel e 
 * modifica as dimensões da div do mapa de acordo
 *
 */
function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map_canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}

/**
 * Detecta a altura (em px) da área de navegação do browser
 */
function getWindowHeight() {
    if (window.self && self.innerHeight) {
        return self.innerHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }
    return 0;
}


