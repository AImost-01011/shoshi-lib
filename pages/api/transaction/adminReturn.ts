import db from "../../../utils/db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserType,
  BookType,
  BookLent,
  UserHistory,
  NotificationType,
  UserLending,
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

        const returnBook = userData.lending.find(
          (el) => el.bookId === req.body.bookId
        );

        if (
          bookData.lent.lentState === 2 &&
          bookData.requested.length &&
          returnBook
        ) {
          // 今貸し出されている&&リクエストがある場合=>引継返却する

          const priorityArr = bookData.requested.map((el) => el.priority);
          const mostPriority = Math.min(...priorityArr);
          const priorityUser = bookData.requested.find(
            (el) => el.priority === mostPriority
          );

          if (priorityUser) {
            const lendUserRef = await db
              .collection("users")
              .doc(priorityUser.userId);
            const lendUserDoc = await lendUserRef.get();
            const lendUserData = lendUserDoc.data() as UserType;
            const lendingArr: string[] = [];
            lendUserData.lending.forEach((el) => lendingArr.push(el.bookId));
            lendUserData.want.forEach((el) => el.bookId);

            const bookRequested = bookData.requested.find(
              (el) => el.userId === lendUserDoc.id
            );
            const userRequestBook = lendUserData.request.find(
              (el) => el.bookId === req.body.bookId
            );

            if (lendingArr.length <= 2 && bookRequested) {
              // 今借りているのは2冊以内=>引継OK
              const newDueDate = new Date();
              newDueDate.setDate(newDueDate.getDate() + 15);
              const notiDate = new Date();
              notiDate.setDate(notiDate.getDate() + 11);

              const newLent: BookLent = {
                userId: lendUserDoc.id,
                userName: lendUserData.userName,
                lentDate: dateString(new Date()),
                dueDate: dateString(newDueDate),
                lentState: 2,
              };

              const deleteNoti = notiData.filter((el) => {
                if (
                  el.notiCode === 3 ||
                  el.notiCode === 6 ||
                  el.notiCode === 7
                ) {
                  return (
                    el.bookId === req.body.bookId &&
                    el.userId1 === req.body.userId &&
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
                  lineId1: userData.lineId,
                  lineId2: "",
                  notiCode: 3,
                  notiDate: dateString(new Date()),
                  userId1: req.body.userId,
                  userId2: "",
                  userName1: userData.userName,
                  userName2: "",
                },
                {
                  bookId: req.body.bookId,
                  bookName: bookData.bookName,
                  dueDate: "",
                  lineId1: userData.lineId,
                  lineId2: "",
                  notiCode: 4,
                  notiDate: dateString(new Date()),
                  userId1: req.body.userId,
                  userId2: "",
                  userName1: userData.userName,
                  userName2: "",
                },
                {
                  bookId: req.body.bookId,
                  bookName: bookData.bookName,
                  dueDate: dateString(newDueDate),
                  lineId1: lendUserData.lineId,
                  lineId2: "",
                  notiCode: 6,
                  notiDate: dateString(newDueDate),
                  userId1: req.body.userId,
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
                  userId1: req.body.userId,
                  userId2: "",
                  userName1: lendUserData.userName,
                  userName2: "",
                },
              ];

              await trans.update(returnUserRef, {
                lending: FieldValue.arrayRemove(returnBook),
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
                type: "handover",
                book: newUserLend,
              });
            } else {
              // 今借りているのは3冊
              return res.status(200).json({
                isOk: false,
                type: "error",
                book: undefined,
              });
            }
          }
        } else {
          // リクエストがない場合=>通常返却する

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

            let newReturnUser: BookLent = {
              dueDate: "",
              userId: "",
              userName: "",
              lentDate: "",
              lentState: 0,
            };

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

            // update-------------------------------------------------
            await trans.update(returnBookRef, { lent: newReturnUser });
            await trans.update(returnUserRef, {
              lending: FieldValue.arrayRemove(returnBook),
              history: FieldValue.arrayUnion(newHistory),
            });
            await trans.update(notiRef, {
              notiList: FieldValue.arrayUnion(newNoti),
            });
            if (deleteNoti.length) {
              await trans.update(notiRef, {
                notiList: FieldValue.arrayRemove(...deleteNoti),
              });
            }

            return res.status(200).json({
              isOk: true,
              type: "return",
            });
          } else return res.status(404).end();
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
