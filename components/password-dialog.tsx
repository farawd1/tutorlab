"use client";
import { useState } from "react";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Api } from "./tutor-app";

export function PasswordDialog({open,onOpenChange,api}:{open:boolean;onOpenChange:(value:boolean)=>void;api:Api}){
 const [busy,setBusy]=useState(false);
 async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);setBusy(true);try{await api("auth/password",{current:data.get("current"),next:data.get("next")});toast.success("Пароль изменён");onOpenChange(false);}catch(e){toast.error(e instanceof Error?e.message:"Не удалось изменить пароль");}finally{setBusy(false);}}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="lab-dialog"><DialogHeader><DialogTitle>Сменить пароль</DialogTitle><DialogDescription>После смены пароля другие сеансы будут завершены.</DialogDescription></DialogHeader><form className="form-stack" onSubmit={submit}><label className="field"><span>Текущий пароль</span><input type="password" name="current" required autoComplete="current-password"/></label><label className="field"><span>Новый пароль (от 10 символов)</span><input type="password" name="next" required minLength={10} maxLength={128} autoComplete="new-password"/></label><button className="primary" disabled={busy}>Сохранить пароль</button></form></DialogContent></Dialog>;
}
