const fs = require('fs');
let data = fs.readFileSync('js/data.js', 'utf8');

// The safest way is to find all sizes: ["..."] and replace them based on standard rules
data = data.replace(/sizes:\s*\[\"(.*?)\"\]/g, (match, p1, offset) => {
    const textBefore = data.substring(0, offset);
    const lastObjectStr = textBefore.substring(textBefore.lastIndexOf('{'));
    
    if (lastObjectStr.includes('Royal Black (65ml)')) {
        return 'sizes: ["65ml"]';
    } else if (lastObjectStr.includes('Discovery set')) {
        return 'sizes: ["5x5ml"]';
    } else if (lastObjectStr.includes('Golden Musk') && lastObjectStr.includes('price: 500')) {
        return 'sizes: ["12ml"]'; 
    } else {
        return 'sizes: ["50ml"]'; 
    }
});

fs.writeFileSync('js/data.js', data);
console.log("data.js sizes successfully standardized");
