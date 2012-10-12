/*
 This changes the size of text to fit divs
 which have a fixed width and height.
 Options include:
 increase: true/false - whether increase in font size is allowed
 decrease: true/false - whether decrease in font size is allowed
 */
;(function(window, $)
{

    FitText = {
        jQueryMethod: function(options) {
            return this.each(function() {

                console.log("applying fittext")
                var MIN_FONT_SIZE_PX = 7,
                    MAX_FONT_SIZE_PX = 100,
                    FONT_ADJUSTMENT_STEP = 1,
                    decrease = options && options.decrease ? options.decrease : true,
                    increase = options && options.increase ? options.increase : true;
                    $this = $(this),
                    width = $this.innerWidth(),
                    height = $this.innerHeight(),
                    originalFontSize = parseInt($this.css("font-size")),
                    adjustedFontSize = parseInt($this.css("font-size"));
                var clone = $this.clone();
                clone.css({
                    "position": "absolute",
                    "display": "block",
                    "top": $(window).innerHeight(),
                    "left": $(window).innerWidth(),
                    "width": width,
                    "whitespace": "normal",
                    "font-size": "",
                    "height": "auto",
                })
                $("body").append(clone);

                // Work out whether to make the font bigger or smaller
                var direction = height > clone.innerHeight() ? 1 : -1;
                var limit = direction == -1 ? MIN_FONT_SIZE_PX : MAX_FONT_SIZE_PX;
                var cloneHeight = clone.innerHeight();

                if ((decrease && direction == -1) ||
                    (increase && direction ==  1)) {
                    // TODO try to make a good guess about the required font size
                    // from the ratio of the clone height to the desired height.
                    // This will reduce the number of iterations in the next step.

                    // Loop until the font size means the clone height is correct
                    while ((cloneHeight - height > 0 && direction == -1) || // TODO need to account for max/min font size
                           (cloneHeight - height < 0 && direction == 1)) { // TODO consider using threshold instead of 0
                        adjustedFontSize += direction * FONT_ADJUSTMENT_STEP; // TODO make smarter guesses to reduce the number of steps
                        clone.css("fontSize", adjustedFontSize);
                        cloneHeight = clone.innerHeight();
                    }
                    if (direction == 1 && adjustedFontSize != originalFontSize) {
                        adjustedFontSize -= FONT_ADJUSTMENT_STEP; // Want the previous size.
                    }

                    // Account for words which are longer than the div width
                    var content = $this.text();
                    var words = content.split(/\s/);
                    clone.css("width", "auto");
                    $.each(words, function(index, word) {
                        clone.text(word);
                        var cloneWidth = clone.innerWidth();
                        while (cloneWidth - width > 0 && adjustedFontSize > MIN_FONT_SIZE_PX) {
                            adjustedFontSize -= FONT_ADJUSTMENT_STEP;
                            clone.css("fontSize", adjustedFontSize);
                            cloneWidth = clone.innerWidth();
                        }
                    });

                    clone.remove();
                    $this.css("fontSize", adjustedFontSize);
                }
            });
        }
    }

    $.fn.fittext = FitText.jQueryMethod;
    window.FitText = FitText;

})(this, jQuery);
