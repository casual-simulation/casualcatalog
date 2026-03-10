const { data } = that;

delete data.tags.placeLabel;
delete data.tags.placeLabelColor;
delete data.tags.placeLabelFloatingBackgroundColor;
delete data.tags.color;
delete data.tags.form ;
delete data.tags.formSubtype;
delete data.tags.formAddress;
delete data.tags.formAddressAspectRatio;

// [Ryan] These shouldn't be hardcode but i dont understand whats going on with dimensionData.
delete data.tags.dimension;
delete data.tags.home;
delete data.tags.homeX;
delete data.tags.homeY;
delete data.tags.homeZ;
delete data.tags.homeRotationX;
delete data.tags.homeRotationY;
delete data.tags.homeRotationZ;