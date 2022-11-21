import db from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserType, BookType } from "../../../redux/globalType";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await db.runTransaction(async (trans) => {
      const cancelUserRef = await db.collection("users").doc(req.body.userId);
      const cancelBookRef = await db.collection("books").doc(req.body.bookId);

      const userDoc = await trans.get(cancelUserRef);
      const userData = userDoc.data() as UserType;
      const bookDoc = await trans.get(cancelBookRef);
      const bookData = bookDoc.data() as BookType;

      const userRequest = userData.request.find(
        (el) => el.bookId === req.body.bookId
      );
      const bookRequested = bookData.requested.find(
        (el) => el.userId === req.body.userId
      );
      if (userRequest && bookRequested) {
        trans.update(cancelUserRef, {
          request: FieldValue.arrayRemove(userRequest),
        });

        trans.update(cancelBookRef, {
          requested: FieldValue.arrayRemove(bookRequested),
        });

        return res.status(200).json({ isOk: true, message: bookData.bookName });
      } else
        return res.status(200).json({
          isOk: false,
          message: "リクエストキャンセル中にエラーが起こりました",
        });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}
