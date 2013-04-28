String.prototype.trim = String.prototype.trim || function () {
    if (!this) return this;
    return this.replace(/^\s+|\s+$/g, "");
};

function showSpinner(directOptions) {
    var loaderOptions;
    if (directOptions != undefined && $.type(directOptions) === "object") {
        loaderOptions = directOptions;
    } else {
        if (Appery.loaderOptions != undefined && $.type(Appery.loaderOptions) === "object") {
            loaderOptions = Appery.loaderOptions;
        }
    }
    if (loaderOptions != undefined) {
        $.mobile.loading('show', loaderOptions);
    } else {
        $.mobile.loading('show');
    }
}

function hideSpinner() {
    $.mobile.loading('hide');
}

function resetActivePageContentHeight() {
    var aPage = $("." + $.mobile.activePageClass),
        aPagePadT = parseFloat(aPage.css("padding-top")),
        aPagePadB = parseFloat(aPage.css("padding-bottom")),
        aPageBorderT = parseFloat(aPage.css("border-top-width")),
        aPageBorderB = parseFloat(aPage.css("border-bottom-width")),
        aPageContentPadT = parseFloat(aPage.find(".ui-content").css("padding-top")),
        aPageContentPadB = parseFloat(aPage.find(".ui-content").css("padding-bottom"));

    aPage.find(".ui-content").css("min-height", $.mobile.getScreenHeight() - aPagePadT - aPagePadB - aPageBorderT - aPageBorderB - aPageContentPadT - aPageContentPadB);
}

$(window).bind("throttledresize", resetActivePageContentHeight);