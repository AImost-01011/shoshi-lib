import db from "../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    db.collection("users")
      .doc(req.body.userId)
      .update({ email: req.body.email, lineId: req.body.lineId })
      .then(() => res.status(200).send(req.body.userId))
      .catch((err) => res.status(500).send(err));
  }
}
