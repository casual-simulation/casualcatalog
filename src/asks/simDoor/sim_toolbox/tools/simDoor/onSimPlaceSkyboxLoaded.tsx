if (that && tags.destination && that.tags.simID == tags.destination) {
    tags.destination = that.tags.simID;
    tags.label = that.tags.label;
    tags.color = null;
    tags.form = "sphere";
    tags.formAddress = that.tags.formAddress;
    tags.scaleX = 2;
    tags.scaleY = 2;
    tags.scaleZ = 2;
    makeMiniSkybox();
}