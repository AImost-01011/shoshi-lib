import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  BookLent,
  UserHistory,
  UserLending,
  NotificationType,
  BookWanted,
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
        const returnUserRef = await db
          .collection("users")
          .doc(req.body.returnUserId);
        const lendUserRef = await db
          .collection("users")
          .doc(req.body.lendUserId);
        const notiRef = await db.collection("notification").doc("noti");

        const bookDoc = await trans.get(returnBookRef);
        const bookData = bookDoc.data() as BookType;
        const returnUserDoc = await trans.get(returnUserRef);
        const returnUserData = returnUserDoc.data() as UserType;
        const lendUserDoc = await trans.get(lendUserRef);
        const lendUserData = lendUserDoc.data() as UserType;
        const notiDoc = await trans.get(notiRef);
        const notiData = notiDoc.data()?.notiList as NotificationType[];

        let lendingArr: string[] = [];

        const userReturnBook = returnUserData.lending.find(
          (el) => el.bookId === req.body.bookId
        );

        const bookRequested = bookData.requested.find(
          (el) => el.userId === req.body.lendUserId
        );

        const userRequestBook = lendUserData.request.find(
          (el) => el.bookId === req.body.bookId
        );

        lendUserData.lending.forEach((el) => lendingArr.push(el.bookId));
        lendUserData.want.forEach((el) => lendingArr.push(el.bookId));

        if (
          lendingArr.length <= 2 &&
          userRequestBook &&
          userReturnBook &&
          bookRequested
        ) {
          const newDueDate = new Date();
          newDueDate.setDate(newDueDate.getDate() + 14);
          const notiDate = new Date();
          notiDate.setDate(notiDate.getDate() + 11);

          const deleteNoti = notiData.filter((el) => {
            if (el.notiCode === 3 || el.notiCode === 6 || el.notiCode === 7) {
              return (
                el.bookId === req.body.bookId &&
                el.userId1 === req.body.returnUserId &&
                el.dueDate === bookData.lent.dueDate
              );
            }
          });

          const returnUserHistory: UserHistory = {
            bookId: req.body.bookId,
            bookName: bookData.bookName,
            imagePath: bookData.property.imagePath,
            tag: bookData.property.tag,
            lendStart: bookData.lent.lentDate,
            lendEnd: dateString(new Date()),
          };

          const newLent: BookLent = {
            userId: lendUserDoc.id,
            userName: lendUserData.userName,
            lentDate: dateString(new Date()),
            dueDate: dateString(newDueDate),
          };

          const newUserLend: UserLending = {
            bookId: req.body.bookId,
            bookName: bookData.bookName,
            bookShortName: bookData.bookShortName,
            lendDate: dateString(new Date()),
            dueDate: dateString(newDueDate),
          };

          const newNoti: NotificationType[] = [
            {
              bookId: req.body.bookId,
              bookName: bookData.bookName,
              dueDate: dateString(newDueDate),
              lineId1: returnUserData.lineId,
              lineId2: lendUserData.lineId,
              notiCode: 5,
              notiDate: dateString(new Date()),
              userId1: req.body.returnUserId,
              userId2: req.body.lendUserId,
              userName1: returnUserData.userName,
              userName2: lendUserData.userName,
            },
            {
              bookId: req.body.bookId,
              bookName: bookData.bookName,
              dueDate: dateString(newDueDate),
              lineId1: lendUserData.lineId,
              lineId2: "",
              notiCode: 6,
              notiDate: dateString(newDueDate),
              userId1: req.body.lendUserId,
              userId2: "",
              userName1: lendUserData.userName,
              userName2: "",
            },
            {
              bookId: req.body.bookId,
              bookName: bookData.bookName,
              dueDate: dateString(newDueDate),
              lineId1: lendUserData.lineId,
              lineId2: "",
              notiCode: 7,
              notiDate: dateString(notiDate),
              userId1: req.body.lendUserId,
              userId2: "",
              userName1: lendUserData.userName,
              userName2: "",
            },
          ];

          await trans.update(returnUserRef, {
            lending: FieldValue.arrayRemove(userReturnBook),
            history: FieldValue.arrayUnion(returnUserHistory),
          });

          await trans.update(returnBookRef, {
            lent: newLent,
            requested: FieldValue.arrayRemove(bookRequested),
          });
          await trans.update(lendUserRef, {
            lending: FieldValue.arrayUnion(newUserLend),
            request: FieldValue.arrayRemove(userRequestBook),
          });
          await trans.update(notiRef, {
            notiList: FieldValue.arrayUnion(...newNoti),
          });
          await trans.update(notiRef, {
            notiList: FieldValue.arrayRemove(...deleteNoti),
          });

          return res.status(200).json({
            isOk: true,
            book: newUserLend,
          });
        } else
          return res.status(200).json({
            isOk: false,
            book: "",
          });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  }
}
