masks.billboardLabel = "loading";

const JSZip = (await import("https://cdn.skypack.dev/jszip")).default;
const Papa = (await import("https://cdn.skypack.dev/papaparse")).default;

const rows = [];
const zip = new JSZip();

let permitCountInput = await os.showInput(tags.permitCount, {
    title: 'How many permits would you like to generate?',
    type: 'text',
    autoSelect: true,
})

if (permitCountInput) {
    let inputNumber = Number(permitCountInput);

    if (Number.isNaN(inputNumber)) {
        os.toast('input must be a number');
        return;
    }

    if (!Number.isInteger(inputNumber)) {
        os.toast('input must be an integer');
        return;
    }

    if (inputNumber <= 0) {
        os.toast('permit count must be >= 1');
        return;
    }

    masks.permitCount = Number(permitCountInput);
} else {
    os.toast('must provide a number of permits to generate');
    return;
}

for (let i = 0; i < tags.permitCount; i++) {
    const permit = thisBot.ppgCreatePermit();

    rows.push({
        UUID: permit.identifier,
        PIN: permit.pin,
        URL: permit.qrUrl
    });

    if (i !== tags.permitCount - 1) {
        masks.billboardLabel = "working on qr code " + i;
    } else {
        masks.billboardLabel = "generation complete";
        await os.sleep(1000);
    }
}

const csv = Papa.unparse(rows, {
    header: true,
    quotes: true
});

function fileDate() {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    const now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}

zip.file(fileDate() + 'practicePermits.csv', csv);
const content = await zip.generateAsync({ type: "blob" });
os.download(content, fileDate() + '_practicePermits.zip');

masks.billboardLabel = null;