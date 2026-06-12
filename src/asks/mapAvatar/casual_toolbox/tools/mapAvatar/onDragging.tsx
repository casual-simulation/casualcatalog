if (tags.ownerID != authBot?.id) {
    return;
}

tags[that.to.dimension + 'X'] = that.to.x;
tags[that.to.dimension + 'Y'] = that.to.y;
tags[that.to.dimension] = true;