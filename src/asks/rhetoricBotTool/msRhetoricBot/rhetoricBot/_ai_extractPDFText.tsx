// used to extract the text from a given pdf file, before returning it as one big string

console.log('loading pdfjs...');
const pdfjs = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/+esm');
console.log('pdfjs:', pdfjs);

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

console.log('loading tesseract...');
const tesseract = await import("https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/+esm");
console.log('tesseract:', tesseract);

const worker = await tesseract.createWorker('eng');
console.log('worker:', worker);

const pdf = await pdfjs.getDocument({
    data: that.data,
    // disableFontFace: true,
}).promise;
console.log('pdf:', pdf);

const pageCount = pdf.numPages;

const canvas = new OffscreenCanvas(512, 512);
const context = canvas.getContext('2d');

// let outputHtml = `<h1>${that.name} Text Content</h1>`;

let masterString = "";
for (let i = 1; i <= pageCount; i++) {
    os.showHtml(`Parsing ${that.name} page #${i}...`);

    const page = await pdf.getPage(i);
    console.log(`page ${i}:`, page);

    const scale = 2;
    const viewport = page.getViewport({ scale: scale, });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    // Render the page to the offscreen canvas context.
    await page.render(renderContext).promise;

    const blob = await canvas.convertToBlob({ type: 'image/png' });

    // os.download(blob, 'test.png', 'image/png');
    const result = await worker.recognize(blob, undefined, 'text');
    console.log('result:', result);

    masterString += result.data.text;

    // outputHtml += `<h2>Page ${i}</h2>`;
    // outputHtml += `<p style="white-space: pre">${result.data.text}</p>`;
}

os.hideHtml();
// os.showHtml(outputHtml);

return masterString;