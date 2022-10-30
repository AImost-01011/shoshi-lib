import db from "../../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (typeof req.query.bookId === "string") {
      db.collection("books")
        .doc(req.query.bookId)
        .get()
        .then((item) => {
          let sendBook: any = item.data();
          sendBook.bookId = item.id;

          if (sendBook.bookId) return res.status(200).json(sendBook);
          else return res.status(404).send("no user found");
        })
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("undefined params");
    }
  }
}
