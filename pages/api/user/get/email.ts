import db from "../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    db.collection("users")
      .where("email", "==", req.body.email)
      .get()
      .then((item) => {
        const gotUser = item.docs.map((el) => el.data());
        res.status(200).send(gotUser[0]);
      })
      .catch((err) => res.status(500).send(err));
  }
}
