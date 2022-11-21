import db from "../../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BookType } from "../../../../redux/globalType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    db.collection("books")
      .get()
      .then((item) => {
        let allBooks: BookType[] = [];

        item.forEach((item) => {
          const bookItem = item.data() as BookType;
          bookItem.bookId = item.id;
          allBooks = [...allBooks, bookItem];
        });

        const filter = [...req.body.usage, ...req.body.department];
        const state = req.body.state;

        const filteredArr = allBooks.filter((el) => {
          let judgement = 0;

          el.property.tag.forEach((value) => {
            if (filter.includes(value.tagId)) judgement += 1;
          });

          if (state.includes("s02")) {
            if (el.lent.lentState >= 1) judgement += 1;
          }
          if (state.includes("s01")) {
            if (el.requested.length) judgement += 1;
          }
          if (state.includes("s00")) {
            if (el.lent.lentState === 0 && !el.requested.length) judgement += 1;
          }

          return judgement;
        });

        return res.status(200).send(filteredArr);
      })
      .catch((err) => res.status(500).end(err));
  }
}
