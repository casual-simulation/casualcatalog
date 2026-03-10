//logic for using a join code (checks for existing files)
shout("abMenuRefresh");

let getRecord;

if (that.data) {
    getRecord = { success: true, data: that.data };
} else {
    const joinCode = that.text.toUpperCase();
    const recordKey = links.remember.tags.abRecordKey;

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] join code:`, joinCode)
    }

    getRecord = await os.getData(recordKey, `abJoinCode_${joinCode}`);
}

if (getRecord && getRecord.success) {
    const nowTime = os.isCollaborative() ? os.agreedUponTime : os.localTime;
    const nowDate = DateTime.fromMillis(nowTime);
    const createDate = DateTime.fromMillis(getRecord.data.date);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] nowTime:`, nowTime, `nowDate:`, nowDate, `createDate:`, createDate);
    }

    let difference = nowDate.diff(createDate, "days").toObject();
    difference = Math.floor(difference.days);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] difference (days):`, difference);
    }
    
    if (difference < 8) {
        os.toast("joining host now");
        os.goToURL(getRecord.data.url);
    } else {
        os.toast("join code out of date, please generate a new join code");
    }
} else {
    os.toast("join code invalid, please try again");
}