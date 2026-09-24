import { env } from "cloudflare:workers";
export type Bindings = { DB:D1Database;BUCKET:R2Bucket;AI_API_KEY?:string;AI_BASE_URL?:string;AI_MODEL?:string;JUDGE0_URL?:string;JUDGE0_KEY?:string;JUDGE0_PYTHON_ID?:string;JUDGE0_CPP_ID?:string };
export const bindings=()=>env as unknown as Bindings;
export function database(){const db=bindings().DB;if(!db)throw new Error("База данных недоступна");return db;}
export const id=()=>crypto.randomUUID();
export const now=()=>new Date().toISOString();
export class HttpError extends Error { constructor(public status:number,message:string){super(message);} }
export async function row(table:"tasks"|"submissions"|"exam_sessions",key:string){const r=await database().prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(key).first<Record<string,unknown>>();if(!r)throw new HttpError(404,"Запись не найдена");return r;}
export async function json(request:Request){if(Number(request.headers.get("content-length")||0)>100000)throw new HttpError(413,"Запрос слишком большой"); const content=await request.text();if(content.length>100000)throw new HttpError(413,"Запрос слишком большой");try{return JSON.parse(content);}catch{throw new HttpError(400,"Ожидается JSON");}}
