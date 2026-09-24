import {test} from "node:test";
import assert from "node:assert/strict";
import {hashPassword,verifyPassword} from "../lib/password.ts";

test("password hashing stays within Cloudflare's PBKDF2 per-call limit",async()=>{
 const hash=await hashPassword("Correct Horse Battery Staple","00112233445566778899aabbccddeeff");
 assert.match(hash,/^pbkdf2-chain-sha256:100000x2:/);
 assert.equal(await verifyPassword("Correct Horse Battery Staple",hash),true);
 assert.equal(await verifyPassword("wrong password",hash),false);
 assert.equal(await verifyPassword("anything","invalid"),false);
});
