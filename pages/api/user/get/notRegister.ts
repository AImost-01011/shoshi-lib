import db from "../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    db.collection("users")
      .where("email", "==", "")
      .get()
      .then((item) => {
        let gotUser: any = [];

        item.docs.map((el, i) => {
          gotUser = [...gotUser, el.data()];
          gotUser[i].userId = el.id;
        });

        if (gotUser) res.status(200).send(gotUser);
        else res.status(200).send(null);
      })
      .catch((err) => res.status(500).send(err));
  }
}
