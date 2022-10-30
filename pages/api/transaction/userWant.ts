import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  UserLending,
  BookLent,
  UserRequest,
  BookRequested,
  UserWant,
  BookWanted,
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
      const wantUserRef = await db.collection("users").doc(req.body.userId);
      const wantBookRef = await db.collection("books").doc(req.body.bookId);
      const notiRef = await db.collection("notification").doc("noti");

      let lendingArr: string[] = [];

      const userDoc = await trans.get(wantUserRef);
      const userData = userDoc.data() as UserType;
      const bookDoc = await trans.get(wantBookRef);
      const bookData = bookDoc.data() as BookType;

      userData.lending.forEach((el) => lendingArr.push(el.bookId));
      userData.want.forEach((el) => lendingArr.push(el.bookId));

      if (lendingArr.length <= 2) {
        const userWant: UserWant = {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          wantDate: dateString(new Date()),
        };

        const bookWanted: BookWanted = {
          userId: req.body.userId,
          userName: userData.userName,
          wantedDate: dateString(new Date()),
        };

        const newNoti: NotificationType = {
          bookId: req.body.bookId,
          bookName: bookData.bookName,
          dueDate: "",
          lineId1: userData.lineId,
          lineId2: "",
          notiCode: 1,
          notiDate: dateString(new Date()),
          userId1: req.body.userId,
          userId2: "",
          userName1: userData.userName,
          userName2: "",
        };

        trans.update(wantUserRef, {
          want: FieldValue.arrayUnion(userWant),
        });

        trans.update(wantBookRef, {
          wanted: bookWanted,
        });

        trans.update(notiRef, {
          notiList: FieldValue.arrayUnion(newNoti),
        });

        return res
          .status(200)
          .json({ isOk: true, bookName: bookData.bookName });
      } else {
        return res.status(200).json({
          isOk: false,
          message: "今借りている図書を返却してから予約してください",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}
