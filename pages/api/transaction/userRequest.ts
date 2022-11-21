import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  UserRequest,
  BookRequested,
  NotificationType,
} from "../../../redux/globalType";
import { FieldValue } from "firebase-admin/firestore";
import { dateString } from "../../../utils/dateString";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await db.runTransaction(async (trans) => {
      const requestUserRef = await db.collection("users").doc(req.body.userId);
      const requestBookRef = await db.collection("books").doc(req.body.bookId);
      const notiRef = await db.collection("notification").doc("noti");

      const userDoc = await trans.get(requestUserRef);
      const userData = userDoc.data() as UserType;
      const bookDoc = await trans.get(requestBookRef);
      const bookData = bookDoc.data() as BookType;

      if (userData && bookData) {
        // priority indexをつける
        let priorityArr: number[] = [];
        bookData.requested.forEach((el) => {
          priorityArr = [...priorityArr, el.priority];
        });
        const nowPriority = priorityArr.length
          ? Math.max(...priorityArr) + 1
          : 1;

        // update内容

        const userRequest: UserRequest = {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          bookShortName: bookData.bookShortName,
          priority: nowPriority,
        };

        const bookRequested: BookRequested = {
          userId: req.body.userId,
          userName: userData.userName,
          priority: nowPriority,
        };

        const newNoti: NotificationType = {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          dueDate: "",
          lineId1: userData.lineId,
          lineId2: "",
          notiCode: 2,
          notiDate: dateString(new Date()),
          userId1: req.body.userId,
          userId2: "",
          userName1: userData.userName,
          userName2: "",
        };

        // update---------------------------------------------

        trans.update(requestUserRef, {
          request: FieldValue.arrayUnion(userRequest),
        });

        trans.update(requestBookRef, {
          requested: FieldValue.arrayUnion(bookRequested),
        });

        trans.update(notiRef, {
          notiList: FieldValue.arrayUnion(newNoti),
        });

        return res.status(200).json({ bookName: bookData.bookName });
      } else return res.status(500).end();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}
