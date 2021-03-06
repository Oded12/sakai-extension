(function() {

    var PI = {
        /**
         * Default sizes for media iframe - 400x285 pixels
         */
        BORDER_WIDTH: 400,
        BORDER_HEIGHT: 285,

        onReady: function() {
            $(document).find(".portletMainIframe").load(function() {
                PI.insertLTIFrame(this);
                PI.upgradeStatic(this);
                // PI.upgradeEditor(this);
            });
            PI.insertLTIFrame(document);
            PI.upgradeStatic(document);
        },

        // converts a <span with an embedded kaltura LTI image to an iframe for LTI rendering
        insertLTIFrame: function(doc) {
            try {
                $(doc).contents().find(".kaltura-lti-media > img").each(function () {
                    console.log("insertLTIFrame preset:: height: " + $(this).attr('height') + ", width: " + $(this).attr('width'));
                    var height = $(this).attr("height") ? $(this).attr("height") : PI.BORDER_HEIGHT;
                    var width = $(this).attr("width") ? $(this).attr("width") : PI.BORDER_WIDTH;
                    console.log("insertLTIFrame postset:: height: " + height + ", width: " + width);
                    var userId = portal.user.id;
                    var siteId = portal.siteId;
                    var mediaUrl = $(this).attr("kaltura-lti-url");
                    var iframeSource = "/media-gallery-tool/mediadisplay.htm?mediaitemurl=" + encodeURIComponent(mediaUrl) + "&siteid=" + siteId;
                    var iframe = $("<iframe height='" + height + "' width='" + width + "' src='" + iframeSource + "' allowfullscreen webkitallowfullscreen mozAllowFullScreen />");

                    iframe.css("border", "none");

                    $(this).parent().parent().append(iframe);
                });
                $(doc).contents().find(".kaltura-lti-media").remove();
            } catch(exception) {
                // a SecurityException will be thrown if processing an iframe violating the same-origin policy
                console.log("insertLTIFrame exception:: " + exception)
            }

            $(doc).attr("allowfullscreen", "");
            $(doc).attr("webkitallowfullscreen", "");
            $(doc).attr("mozAllowFullScreen", "");
        },

        // converts a <span with an embedded kaltura non-LTI image to an iframe for LTI rendering
        upgradeStatic: function(doc) {
            try {
                $(doc).contents().find("span.kaltura-media > img").each(function () {
                    //set the iframe size to default values
                    console.log("upgradeStatic preset:: height: " + $(this).attr('height') + ", width: " + $(this).attr('width'));
                    var height = $(this).attr("height") ? $(this).attr("height") : PI.BORDER_HEIGHT;
                    var width = $(this).attr("width") ? $(this).attr("width") : PI.BORDER_WIDTH;
                    console.log("upgradeStatic postset:: height: " + height + ", width: " + width);
                    var userId = portal.user.id;
                    var siteId = portal.siteId;

                    var mediaUrl = $(this).attr("src");
                    console.log("mediaUrl: [" + mediaUrl + "]");

                    var entryIds = mediaUrl.match(/.*\/entry_id\/([0-9]_[0-9A-Za-z]{8})\/.*/);
                    var entryId = "";
                    if (entryIds.length > 1) {
                        entryId = entryIds[1];
                    }
                    console.log("entryId: [" + entryId + "]");
                    var embeddedSource = "/media-gallery-tool/mediadisplaystatic.htm?entryid=" + entryId + "&siteid=" + siteId;

                    console.log("embeddedSource: [" + embeddedSource + "]");
                    var iframe = $("<iframe height='" + height + "' width='" + width + "' src='" + embeddedSource + "'>");

                    iframe.css("border", "none");

                    $(this).parent().parent().append(iframe);
                });

                $(doc).contents().find("span.kaltura-media").remove();
            } catch(exception) {
                // a SecurityException will be thrown if processing an iframe violating the same-origin policy
                console.log("upgradeStatic exception:: " + exception)
            }

        },

        // converts a <span with an embedded kaltura non-LTI image to the same lti div image format for rendering within CKEditor
        // TODO - errors retrieving media based on media id from kaltura servers
        upgradeEditor: function(doc) {
            try {
                $(doc).contents().find("textarea#body").each(function (index, value) {
                    var innerHtml = $(value).val();

                    // TODO - as-is this code replaces the entire contents of the textarea with only the iframe, need to
                    // respect the other content.
                    $(innerHtml).find("span.kaltura-media > img").each(function () {
                        var source = $(this).attr("src");
                        var height = 100;
                        var width = 100;
                        var iframe = $("<p><iframe height='" + height + "' width='" + width + "' src='" + source + "' /></p>");

                        iframe.css("border", "none");

                        $(value).val($(iframe).html());
                    });
                });
            } catch(exception) {
                // a SecurityException will be thrown if processing an iframe violating the same-origin policy
                console.log("upgradeEditor exception:: " + exception)
            }
        }
    }

    $(document).ready(PI.onReady);
})();
