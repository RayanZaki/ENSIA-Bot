const {createWorker} = require('tesseract.js');


const arabic = {
    code: "ara",
    name: "المدرسة الوطنية العليا للذكاء الاصطناعي"
}

const french = {
    code: "fra",
    name: "ECOLE NATIONALE SUPERIEURE EN INTELLIGENCE"
}

const arr = [
    arabic,
    french
]


const checkValidity = async (path) => {
    for (let element of arr) {
        const worker = await createWorker(element.code);
        const {data: {text}} = await worker.recognize(path)
        const accepted = text.includes(element.name);
        await worker.terminate();
        if (accepted)
            return accepted
    }
    return false;
}


( async () => {
    console.log(await checkValidity("lk.jpg"));
})()
