function DrawImage(imgd) {
    var img = new Image();
    var iwidth = 320;
    var iheight = 180;
    img.src = imgd.src;
    if (img.width > 0 && img.height > 0) {
        // 之后再弄明白
        if (img.width / img.height > iwidth / iheight) {
            if (img.width > iwidth) {
                imgd.width = iwidth;
                imgd.height = (img.height * iwidth) / img.width;
            } else {
                imgd.width = img.width;
                imgd.height = img.height;
            }
            imgd.alt = img.width + "x" + imgd.height;
        } else {
            if (img.height > iheight) {
                imgd.height = iheight;
                imgd.width = (img.width * iheight) / img.height;
            } else {
                imgd.height = img.height;
                imgd.width = img.width
            }
            imgd.alt = img.width + "x" + imgd.height;
        }

    }
}