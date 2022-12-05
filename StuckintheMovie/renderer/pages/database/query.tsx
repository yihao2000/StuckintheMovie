import {
  addDoc,
  getDocs,
  collection,
  Timestamp,
  query,
  where,
} from "@firebase/firestore";
import { app, database } from "../database/firebaseconfig";

export async function queryEmployeeWarningLetterAmount(employeeId: string) {
  var counter = 0;
  const q = collection(database, "warningletters");

  const qWarningLetters = query(q, where("employeeid", "==", employeeId));

  const data = await getDocs(qWarningLetters).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertFiringRequest(employeeId: string) {
  const q = collection(database, "firingrequest");

  const qFiringRequest = query(q, where("employeeid", "==", employeeId));

  var alreadyExist = false;
  const data = await getDocs(qFiringRequest).then((item) => {
    item.docs.map((e) => {
      if (e.data().employeeid === employeeId) {
        alreadyExist = true;
      }
    });
  });

  if (alreadyExist == false) {
    addDoc(q, {
      id: employeeId + "-" + Math.random() * 11,
      employeeid: employeeId,
      requestDate: new Date().toLocaleString(),
    });
  }
}

export async function getNotificationCounter(employeeId: string) {
  const coll_notifications = collection(database, "notifications");

  const q = query(coll_notifications, where("employeeid", "==", employeeId));

  var generatedId;

  const data = await getDocs(q).then((e) => {
    e.docs.map((rank, i, arr) => {
      if (arr.length - 1 === i) {
        generatedId = rank.data().id + 1;
        console.log(generatedId);
      }
    });
  });
}
export async function insertNotification(
  employeeId: string,
  title: string,
  message: string
) {
  const coll_notifications = collection(database, "notifications");
}

export async function insertWarningLetter(
  passedEmployeeId: string,
  warningDescription: string
) {
  const coll_warningletters = collection(database, "warningletters");

  const counter = queryEmployeeWarningLetterAmount(passedEmployeeId);

  counter.then((e) => {
    const id = e + "-" + passedEmployeeId;
    addDoc(coll_warningletters, {
      id: id,
      employeeid: passedEmployeeId,
      description: warningDescription,
    });
  });

  // console.log(passedEmployeeId);
}

export async function queryEmployees() {
  var array = [];
  const q = collection(database, "employees");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}

export async function querySpecificEmployee(employeeId) {
  var array = [];
  const q = collection(database, "employees");

  const qEmployee = query(q, where("id", "==", employeeId));

  const data = await getDocs(qEmployee).then((item) => {
    item.docs.slice(0, 1).map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}
export async function queryDivisions() {
  var array = [];

  const q = collection(database, "divisions");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}

export async function queryDepartments() {
  var array = [];

  const q = collection(database, "departments");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}
