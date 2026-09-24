import { z } from "zod";
import { HttpError, type Bindings } from "./server";

const languageSchema=z.array(z.object({id:z.number().int().positive(),name:z.string()}));
const tokenSchema=z.object({token:z.string().uuid()});
const resultSchema=z.object({status:z.object({id:z.number().int(),description:z.string()}),time:z.union([z.string(),z.number()]).nullable().optional(),memory:z.number().nullable().optional()});
export type JudgeResult=z.infer<typeof resultSchema>;

function config(env:Bindings){
 if(!env.JUDGE0_URL)throw new HttpError(503,"Judge0 не подключён. Код не выполнялся.");
 const url=new URL(env.JUDGE0_URL);
 if(url.protocol!=="https:"&&!(["localhost","127.0.0.1"].includes(url.hostname)&&url.protocol==="http:"))throw new HttpError(500,"Judge0 должен использовать HTTPS");
 const headers:Record<string,string>={"Content-Type":"application/json"};
 if(env.JUDGE0_KEY)headers["X-Auth-Token"]=env.JUDGE0_KEY;
 return {base:url.href.replace(/\/$/,""),headers};
}
async function call(env:Bindings,path:string,init:RequestInit={}){
 const {base,headers}=config(env);
 let response:Response;
 try{response=await fetch(`${base}${path}`,{...init,headers:{...headers,...init.headers},signal:AbortSignal.timeout(20000)});}catch{throw new HttpError(502,"Judge0 недоступен. Попробуйте позже.");}
 if(!response.ok)throw new HttpError(response.status===401||response.status===403?503:502,`Judge0 вернул ${response.status}. Проверьте адрес и доступ.`);
 try{return await response.json() as unknown;}catch{throw new HttpError(502,"Judge0 вернул некорректный ответ");}
}
export async function getLanguageId(env:Bindings,language:"python"|"cpp"){
 const override=Number(language==="python"?env.JUDGE0_PYTHON_ID:env.JUDGE0_CPP_ID);
 if(Number.isInteger(override)&&override>0)return override;
 const languages=languageSchema.parse(await call(env,"/languages/"));
 const matches=languages.filter(l=>language==="python"?/^Python \(3\./.test(l.name):/^C\+\+ \(GCC /.test(l.name));
 if(!matches.length)throw new HttpError(503,`Judge0 не поддерживает ${language==="python"?"Python 3":"C++ GCC"}`);
 return matches.sort((a,b)=>b.id-a.id)[0].id;
}
export async function createJudgeRuns(env:Bindings,source:string,language:"python"|"cpp",tests:{input:string;output:string}[],onToken?:(tokens:string[])=>Promise<void>){
 const languageId=await getLanguageId(env,language);
 const tokens:string[]=[];
 // Separate submissions work with both public CE and managed Judge0 plans.
 // Persist partial tokens in the caller if a later request fails.
 for(const test of tests){
  const result=tokenSchema.parse(await call(env,"/submissions?base64_encoded=false",{method:"POST",body:JSON.stringify({source_code:source,language_id:languageId,stdin:test.input,expected_output:test.output,cpu_time_limit:2,wall_time_limit:5,memory_limit:128000,max_file_size:1024,max_processes_and_or_threads:32,enable_network:false})}));
  tokens.push(result.token);
  if(onToken)await onToken(tokens);
 }
 return tokens;
}
export async function getJudgeResults(env:Bindings,tokens:string[]){
 const results:JudgeResult[]=[];
 for(const token of tokens){
  if(!z.string().uuid().safeParse(token).success)throw new HttpError(500,"Некорректный токен проверки");
  results.push(resultSchema.parse(await call(env,`/submissions/${token}?fields=status,time,memory`)));
 }
 return results;
}
