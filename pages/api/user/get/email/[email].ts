import db from "../../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    db.collection("users")
      .where("email", "==", req.query.email)
      .get()
      .then((item) => {
        let sendUser: any = {};

        item.docs.map((el) => {
          sendUser = el.data();
          sendUser.userId = el.id;
        });

        if (sendUser) res.status(200).send(sendUser);
        else res.status(200).send(null);
      })
      .catch((err) => res.status(500).send(err));
  }
}
