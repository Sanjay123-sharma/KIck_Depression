const age=[23,22,45,67,88];
console.log("hello")
const double=age.map((x)=>{
    return x*x
});
console.log(double);

const even=age.filter((x)=>{
    return x%2==0
})
console.log(even);

const sum=age.reduce((x,y)=>{
return x+y
})
console.log(sum);

console.log("sir")