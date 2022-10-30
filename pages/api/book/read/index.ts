import db from "../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BookType } from "../../../../redux/globalType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  db.collection("books")
    .get()
    .then((item) => {
      let newData: BookType[] = [];

      item.forEach((doc) => {
        const currentDoc = doc.data() as BookType;
        currentDoc.bookId = doc.id;

        newData = [...newData, currentDoc];
      });

      return res.status(200).send(newData);
    })
    .catch((err) => res.status(404).send(err));
}
