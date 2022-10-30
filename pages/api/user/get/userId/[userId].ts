import db from "../../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (typeof req.query.userId === "string") {
      db.collection("users")
        .doc(req.query.userId)
        .get()
        .then((item) => {
          let sendUser: any = item.data();
          sendUser.userId = item.id;

          if (sendUser) res.status(200).send(sendUser);
          else res.status(500).send("no user found");
        })
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("undefined params");
    }
  }
}
