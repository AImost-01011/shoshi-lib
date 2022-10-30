import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  BookLent,
  UserHistory,
  NotificationType,
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
        const returnBookRef = await db.collection("books").doc(req.body.bookId);
        const returnUserRef = await db.collection("users").doc(req.body.userId);
        const notiRef = await db.collection("notification").doc("noti");

        const bookDoc = await trans.get(returnBookRef);
        const bookData = bookDoc.data() as BookType;
        const userDoc = await trans.get(returnUserRef);
        const userData = userDoc.data() as UserType;
        const notiDoc = await trans.get(notiRef);
        const notiData = notiDoc.data()?.notiList as NotificationType[];

        if (bookData) {
          const newReturnUser: BookLent = {
            dueDate: "",
            userId: "",
            userName: "",
            lentDate: "",
          };
          const returnBook = userData.lending.find(
            (el) => el.bookId === req.body.bookId
          );

          if (returnBook) {
            const now = dateString(new Date());
            const deleteNoti = notiData.filter((el) => {
              if (el.notiCode === 3 || el.notiCode === 6 || el.notiCode === 7) {
                return (
                  el.bookId === req.body.bookId &&
                  el.userId1 === req.body.userId &&
                  el.dueDate === bookData.lent.dueDate
                );
              }
            });

            const newHistory: UserHistory = {
              bookId: req.body.bookId,
              bookName: bookData.bookName,
              imagePath: bookData.property.imagePath,
              lendEnd: now,
              lendStart: returnBook.lendDate,
              tag: bookData.property.tag,
            };

            const newNoti: NotificationType = {
              bookId: req.body.bookId,
              bookName: bookData.bookName,
              dueDate: "",
              lineId1: userData.lineId,
              lineId2: "",
              notiCode: 4,
              notiDate: now,
              userId1: req.body.userId,
              userId2: "",
              userName1: userData.userName,
              userName2: "",
            };

            await trans.update(returnBookRef, { lent: newReturnUser });
            await trans.update(returnUserRef, {
              lending: FieldValue.arrayRemove(returnBook),
              history: FieldValue.arrayUnion(newHistory),
            });
            await trans.update(notiRef, {
              notiList: FieldValue.arrayUnion(newNoti),
            });
            await trans.update(notiRef, {
              notiList: FieldValue.arrayRemove(...deleteNoti),
            });

            return res.status(200).end();
          } else return res.status(200).end();
        } else {
          return res.status(404).send("no book found");
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
