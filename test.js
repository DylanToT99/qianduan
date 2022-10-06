let string1='abcd=q&kweq=w&wmeq=1';
for (const string of string1.split('&')) {
        console.log(string)
}
for (const mapElement of string1.split('&').map(k => k.split('='))) {
    console.log(mapElement)
}
let string2=string1.substring(1)
