
export default async function handler(req,res){
 const { url } = req.query;
 if(!url) return res.status(400).send("URL ausente");
 try{
   const r = await fetch(url);
   const b = await r.text();
   res.setHeader("Access-Control-Allow-Origin","*");
   res.status(200).send(b);
 }catch(e){
   res.status(500).send("Erro proxy");
 }
}
