// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
 import {MongoClient} from 'mongodb';
 import {VercelRequest, VercelResponse} from '@vercel/node';

 let cacheddb;
 async function connectToDb(){

   if(cacheddb)
   return cacheddb;
   const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
   cacheddb = client;
   return client.connect();

 }

export default async (req: VercelRequest, res: VercelResponse) => {


const db = await connectToDb();

if(req.body.link){
  const entry = await db.db('links_db').collection('links_collection').insertOne({link:req.body.link});
  return res.status(201).json({shorten_link: `http://localhost:3000/r/${entry.insertedId}`});
}


  res.status(400).json({ error: 'no link found' , error_description:'no link found'});
}
