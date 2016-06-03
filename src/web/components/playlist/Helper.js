module.exports = {
    formattedTime: function(time) {
        var mins = ("00" + Math.floor(time / 60));
        var secs = ("00" + (time % 60));
        mins = mins.substring(mins.length - 2);
        secs = secs.substring(secs.length - 2);
        return mins + ":" + secs;
    }
};
