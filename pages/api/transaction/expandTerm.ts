import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  UserLending,
  BookLent,
} from "../../../redux/globalType";
import { FieldValue } from "firebase-admin/firestore";
import { dateString } from "../../../utils/dateString";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await db.runTransaction(async (trans) => {
        const lendingUserRef = await db
          .collection("users")
          .doc(req.body.userId);
        const lendingBookRef = await db
          .collection("books")
          .doc(req.body.bookId);

        const bookDoc = await trans.get(lendingBookRef);
        const bookData = bookDoc.data() as BookType;
        const userDoc = await trans.get(lendingUserRef);
        const userData = userDoc.data() as UserType;

        const priorLendingBook = userData.lending.find(
          (el) => el.bookId === req.body.bookId
        );
        if (priorLendingBook) {
          const priorDueDate = new Date(priorLendingBook.dueDate);
          const newDueDate = priorDueDate.setDate(priorDueDate.getDate() + 7);

          const expandLendingBook: UserLending = {
            bookId: req.body.bookId,
            bookName: bookData.bookName,
            bookShortName: bookData.bookShortName,
            dueDate: dateString(new Date(newDueDate)),
            lendDate: bookData.lent.lentDate,
          };

          trans.update(lendingUserRef, {
            lending: FieldValue.arrayRemove(priorLendingBook),
          });
          trans.update(lendingUserRef, {
            lending: FieldValue.arrayUnion(expandLendingBook),
          });
          trans.update(lendingBookRef, {
            "lent.dueDate": dateString(new Date(newDueDate)),
          });

          return res.status(200).end();
        } else return res.status(404).end();
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}
