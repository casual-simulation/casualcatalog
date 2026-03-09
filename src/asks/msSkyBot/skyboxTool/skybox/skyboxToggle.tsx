if(tags.formAddress == that){
    setTagMask(thisBot, 'home', tags.home == false ? true : false, 'shared');
}
else {
    setTagMask(thisBot, 'home', false);
}