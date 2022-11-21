import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  UserLending,
  BookLent,
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
      const lendingUserRef = await db.collection("users").doc(req.body.userId);
      const lendingBookRef = await db.collection("books").doc(req.body.bookId);
      const notiRef = await db.collection("notification").doc("noti");

      const bookDoc = await trans.get(lendingBookRef);
      const bookData = bookDoc.data() as BookType;
      const userDoc = await trans.get(lendingUserRef);
      const userData = userDoc.data() as UserType;

      const targetUserWant = userData.want.find(
        (el) => el.bookId === req.body.bookId
      );
      const now = dateString(new Date());
      const notiDate = new Date(req.body.dueDate);
      notiDate.setDate(notiDate.getDate() - 3);

      const newLendingBook: UserLending = {
        bookId: bookDoc.id,
        bookName: bookData.bookName,
        bookShortName: bookData.bookShortName,
        dueDate: req.body.dueDate,
        lendDate: now,
      };

      const newLendingUser: BookLent = {
        dueDate: req.body.dueDate,
        userId: req.body.userId,
        userName: userData.userName,
        lentDate: now,
        lentState: 2,
      };

      const newNoti: NotificationType[] = [
        {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          dueDate: req.body.dueDate,
          lineId1: userData.lineId,
          lineId2: "",
          notiCode: 3,
          notiDate: now,
          userId1: req.body.userId,
          userId2: "",
          userName1: userData.userName,
          userName2: "",
        },
        {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          dueDate: req.body.dueDate,
          lineId1: userData.lineId,
          lineId2: "",
          notiCode: 6,
          notiDate: req.body.dueDate,
          userId1: req.body.userId,
          userId2: "",
          userName1: userData.userName,
          userName2: "",
        },
        {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          dueDate: req.body.dueDate,
          lineId1: userData.lineId,
          lineId2: "",
          notiCode: 7,
          notiDate: dateString(notiDate),
          userId1: req.body.userId,
          userId2: "",
          userName1: userData.userName,
          userName2: "",
        },
      ];

      // update--------------------------------------------------

      trans.update(notiRef, {
        notiList: FieldValue.arrayUnion(...newNoti),
      });

      trans.update(lendingBookRef, {
        lent: newLendingUser,
      });

      if (targetUserWant) {
        // wantがある場合消去する
        trans.update(lendingUserRef, {
          lending: FieldValue.arrayUnion(newLendingBook),
          want: FieldValue.arrayRemove(targetUserWant),
        });
      } else {
        // wantがない場合そのまま貸出する
        trans.update(lendingUserRef, {
          lending: FieldValue.arrayUnion(newLendingBook),
        });
      }

      return res.status(200).send({
        bookName: bookData.bookName,
        userName: userData.userName,
        due: req.body.dueDate,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}
