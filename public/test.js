const jsondata = require('./test.json');

jsondata.bankara_challenge.forEach((v, i) => {
    if (i < 5) {
        console.log(`${i}:${v.start_time}`);
        
    }
})