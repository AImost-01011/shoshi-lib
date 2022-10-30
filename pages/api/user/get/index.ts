import db from "../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  db.collection("users")
    .get()
    .then((item) => {
      let newData: any[] = [];

      item.forEach((doc) => {
        const currentDoc = doc.data();
        currentDoc.userId = doc.id;

        newData = [...newData, currentDoc];
      });

      return res.status(200).send(newData);
    })
    .catch((err) => res.status(404).send(err));
}
