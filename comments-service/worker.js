import { DurableObject } from 'cloudflare:workers';
export class Board extends DurableObject {
 constructor(ctx,env){
  super(ctx,env);
  this.sql=ctx.storage.sql;
  this.sql.exec('CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, author TEXT, body TEXT, created TEXT)');
 }
 list(){return this.sql.exec('SELECT author, body, created FROM comments ORDER BY id DESC').toArray()}
 add(author,body){this.sql.exec('INSERT INTO comments(author,body,created) VALUES(?,?,?)',author,body,new Date().toISOString())}
}
export default {
 async fetch(req,env){
  const headers={'Access-Control-Allow-Origin':'https://minalealbirch.github.io','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type','Cache-Control':'no-store'};
  const reply=(data,status)=>Response.json(data,{status,headers});
  if(req.method==='OPTIONS')return new Response(null,{headers});
  const board=env.BOARD.getByName('comments');
  if(req.method==='GET')return reply(await board.list(),200);
  if(req.method!=='POST')return reply('Method not allowed',405);
  if(!env.POST_KEY || req.headers.get('Authorization')!=='Bearer '+env.POST_KEY)return reply('Invalid link',403);
  let data;try{data=await req.json()}catch{return reply('Invalid JSON',400)}
  const author=typeof data?.author==='string'?data.author.trim():'';
  const body=typeof data?.body==='string'?data.body.trim():'';
  if(!author||author.length>60||!body||body.length>2000)return reply('Invalid comment',400);
  await board.add(author,body);return reply('Saved',201);
 }
};