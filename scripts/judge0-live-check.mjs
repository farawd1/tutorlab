import assert from "node:assert/strict";
const origin=process.env.TEST_BASE_URL||"http://127.0.0.1:5173";
if(!["127.0.0.1","localhost"].includes(new URL(origin).hostname))throw new Error("Live check must target local Tutorlab");
const stamp=`Judge0 live check ${new Date().toISOString()}`;
const call=async(path,body,role="teacher")=>{const response=await fetch(`${origin}/api/${path}`,{method:body===undefined?"GET":"POST",headers:{"Content-Type":"application/json","x-demo-role":role},body:body===undefined?undefined:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(`${path}: ${response.status} ${JSON.stringify(data)}`);return data;};
const course=await call("courses",{title:stamp,subject:"code",description:"Disposable integration check"});
const task=await call("tasks",{courseId:course.id,title:"A+B",statement:"Read two integers and print their sum.",kind:"code",maxScore:10,expected:"",tolerance:0,rubric:"Two tests",tests:[{input:"2 3\n",output:"5\n",hidden:false},{input:"-9 4\n",output:"-5\n",hidden:true}]});
async function check(answer,language,expectedScore){
 const submission=await call("submissions",{taskId:task.id,answer,language},"student");
 await call(`submissions/${submission.id}/judge`,{});
 let result;
 for(let attempt=0;attempt<20;attempt++){
  await new Promise(resolve=>setTimeout(resolve,1000));
  result=await call(`submissions/${submission.id}/judge`);
  if(result.status==="reviewed")break;
 }
 assert.equal(result?.status,"reviewed","Judge0 did not finish in 20 seconds");
 const state=await call("state");
 const review=state.submissions.find(item=>item.id===submission.id)?.review;
 assert.equal(review?.source,"judge0");
 assert.equal(review?.score,expectedScore,JSON.stringify(review));
 return submission.id;
}
const pythonId=await check("a,b=map(int,input().split())\nprint(a+b)","python",10);
const wrongId=await check("a,b=map(int,input().split())\nprint(a-b)","python",0);
const cppId=await check("#include <iostream>\nusing namespace std; int main(){long long a,b;cin>>a>>b;cout<<a+b<<'\\n';}","cpp",10);
const state=await call("state");
assert(state.submissions.find(item=>item.id===cppId));
console.log(`Judge0 live PASS: Python AC 10/10, Python WA 0/10, C++ AC 10/10; local records: course=${course.id}, task=${task.id}, submissions=${pythonId},${wrongId},${cppId}`);
