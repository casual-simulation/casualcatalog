const { data } = that;

delete data.tags.label;
delete data.tags.form ;
delete data.tags.formSubtype;
delete data.tags.formAddress;
delete data.tags.formAddressAspectRatio;

delete data.tags[data.tags.dimension + "X"];
delete data.tags[data.tags.dimension + "Y"];
delete data.tags[data.tags.dimension + "Z"];
delete data.tags[data.tags.dimension + "RotationX"];
delete data.tags[data.tags.dimension + "RotationY"];
delete data.tags[data.tags.dimension + "RotationZ"];
delete data.tags[data.tags.dimension];
delete data.tags.dimension;
delete data.tags.scale;

delete data.tags.artifactName;
delete data.tags.artifactLink;
delete data.tags.landmarkIDs;
delete data.tags.artifactID;
delete data.tags.artifactImage;
delete data.tags.artifactDescription;
delete data.tags.collectionID;
delete data.tags.collectable;
delete data.tags.realArtifactImage;
delete data.tags.artifactYear;
delete data.tags.artifactLocked;
delete data.tags.orientationMode;
delete data.tags.collected;