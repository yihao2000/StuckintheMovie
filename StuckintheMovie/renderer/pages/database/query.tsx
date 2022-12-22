import {
  addDoc,
  getDocs,
  collection,
  Timestamp,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "@firebase/firestore";
import secureLocalStorage from "react-secure-storage";
import { app, database } from "../database/firebaseconfig";

interface SalaryAdjustmentRequest {
  id: string;
  salaryChange: number;
}

// export async function queryEmployeeSalaryAdjustmentRequest(employeeId: string){
//   const q = collection(database, "salaryadjustmentrequests");

//   const qWarningLetters = query(q, where("employeeid", "==", employeeId));

//   const data = await getDocs(qWarningLetters).then((item) => {
//     item.docs.map((e) => {
//       counter++;
//     });
//   });

//   return counter;
// }
interface LoginCredential {
  id: string;
}

export async function queryEquipments() {
  var array = [];

  const q = collection(database, "equipments");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function acceptLeaveRequest(requestid: string) {
  console.log(requestid);
  const docRef = doc(database, "personalleaverequests", requestid);
  updateDoc(docRef, {
    status: "Accepted",
  });
}

export async function rejectLeaveRequest(requestid: string) {
  console.log(requestid);
  const docRef = doc(database, "personalleaverequests", requestid);
  updateDoc(docRef, {
    status: "Rejected",
  });
}

export async function declineLeaveRequest(requestid: string) {
  const docRef = doc(database, "personalleaverequests", requestid);
  updateDoc(docRef, {
    status: "Declined",
  });
}

export async function queryFacilities() {
  var array = [];

  const q = collection(database, "facilities");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryWorkingTime() {
  var array = [];

  const q = collection(database, "workingtime");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item) => {
      array.push(item.data());
    });
  });

  return array;
}

export async function queryEmployeeWorkingTime(employeeid: string) {
  var array = [];

  const compare = (a, b) => {
    if (parseInt(a.workingtimeid) < parseInt(b.workingtimeid)) {
      return -1;
    }
    if (parseInt(a.workingtimeid) > parseInt(b.workingtimeid)) {
      return 1;
    }
    return 0;
  };
  const q = collection(database, "workingtimedetail");

  const qWorkingTimeDetail = query(q, where("employeeid", "==", employeeid));

  const data = await getDocs(qWorkingTimeDetail).then((e) => {
    e.docs.map((item) => {
      array.push({ ...item.data() });
    });
  });

  array.sort(compare);

  return array;
}

export async function insertEmployeeSalaryAdjustmentRequest(
  employeeList: Array<SalaryAdjustmentRequest>
) {
  var auth = secureLocalStorage.getItem("credentials") as LoginCredential;
  const q = collection(database, "salaryadjustmentrequests");

  employeeList.map(async (e) => {
    var isExist = false;
    var selectedEmployee;
    const qAdjustmentRequests = query(q, where("employeeid", "==", e.id));

    const data = await getDocs(qAdjustmentRequests).then((item) => {
      item.docs.map((a) => {
        if (a.data().employeeid === e.id) {
          isExist = true;
          selectedEmployee = item.docs[0].id;
        }
      });
    });
    var salary = parseInt(e.salaryChange);
    if (isExist) {
      console.log("Exist");
      console.log(selectedEmployee);
      const docRef = doc(
        database,
        "salaryadjustmentrequests",
        selectedEmployee
      );

      updateDoc(docRef, {
        salaryadjustment: salary,
        requestdate: new Date().toLocaleString(),
      });
    } else {
      console.log(salary);
      addDoc(q, {
        id: e.id + "-" + auth.id,
        requesterid: auth.id,
        employeeid: e.id,
        requestdate: new Date().toLocaleString(),
        salaryadjustment: salary,
        status: "Pending",
      });
    }
  });
}

// export async function updateEmployeeSalary(
//   employeeList: Array<EmployeeAndSalary>
// ) {
//   employeeList.map(async (e) => {
//     const q = collection(database, "employees");

//     console.log(e.id);
//     const qEmployees = query(q, where("id", "==", e.id));

//     console.log(e.salaryChange);
//     const data = await getDocs(qEmployees).then((item) => {
//       const docRef = doc(database, "employees", item.docs[0].id);

//       updateDoc(docRef, {
//         salary: e.salaryChange,
//       });
//     });
//   });
// }

interface Auth {
  id: string;
  firsName: string;
  lastName: string;
  department: string;
  division: string;
}

export async function insertFundRequest(
  requestAmount: number,
  requestReason: string
) {
  var auth = secureLocalStorage.getItem("credentials") as Auth;
  console.log("Inserting");
  queryEmployeeFundRequestAmount(auth.id).then((e) => {
    console.log(e);
    setDoc(doc(database, "fundrequests", auth.id + "-1-" + e), {
      date: new Date().toLocaleString(),
      amount: requestAmount,
      reason: requestReason,
      anfstatus: "Pending",
      managerstatus: "Pending",
      requesterid: auth.id,
    });
  });
}

export async function insertPersonalLeave(
  leaveReason: string,
  leaveDate: Date
) {
  var auth = secureLocalStorage.getItem("credentials") as Auth;
  const q = collection(database, "personalleaverequests");

  const qPersonalLeave = query(q, where("employeeid", "==", auth.id));

  var alreadyExist = false;
  const data = await getDocs(qPersonalLeave).then((item) => {
    item.docs.map((e) => {
      if (leaveDate.toDateString() == e.data().personalleavedate) {
        alreadyExist = true;
      }
    });
  });

  if (alreadyExist) {
    return true;
  }

  queryEmployeePersonalLeaveRequestAmount(auth.id).then((e) => {
    setDoc(doc(database, "personalleaverequests", auth.id + "-2-" + e), {
      employeeid: auth.id,
      personalleavedate: leaveDate.toDateString(),
      personalleavereason: leaveReason,
      status: "Pending",
    });
  });

  return false;
}

export async function queryEmployeePersonalLeave(employeeid: string) {
  var array = [];
  const q = collection(database, "personalleaverequests");

  const qFundRequests = query(q, where("employeeid", "==", employeeid));

  const data = await getDocs(qFundRequests).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  array.reverse();
  return array;
}

export async function queryEmployeePersonalLeaveRequestAmount(
  employeeId: string
) {
  var counter = 0;
  const q = collection(database, "personalleaverequests");

  const qEmployeePersonalLeaveRequest = query(
    q,
    where("employeeid", "==", employeeId)
  );

  const data = await getDocs(qEmployeePersonalLeaveRequest).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

interface InventoryTransaction {
  inventoryname: string;
  inventorydescription: string;
  inventoryprice: number;
  inventoryquantity: number;
  inventorytype: string;
  fundrequestid: string;
  transactiondate: string;
}

export async function queryEquipmentPurchaseAmount() {
  var counter = 0;
  const q = collection(database, "equipmentpurchase");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryEquipmentAmount() {
  var counter = 0;
  const q = collection(database, "equipments");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityPurchaseAmount() {
  var counter = 0;
  const q = collection(database, "facilitypurchase");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityAmount() {
  var counter = 0;
  const q = collection(database, "facilities");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}
export async function insertInventoryPurchaseData(props: InventoryTransaction) {
  var auth = secureLocalStorage.getItem("credentials") as LoginCredential;
  if (props.inventorytype == "Equipment") {
    var equipmentid;
    queryEquipmentAmount().then((e) => {
      e++;
      equipmentid = "EQ" + "-" + e.toLocaleString().padStart(3, "0");
      setDoc(doc(database, "equipments", equipmentid), {
        name: props.inventoryname,
        description: props.inventorydescription,
        price: props.inventoryprice,
        damagestatus: "Undamaged",
        availabilitystatus: "Available",
      });
    });
    queryEquipmentPurchaseAmount().then((e) => {
      e++;
      setDoc(
        doc(
          database,
          "equipmentpurchase",
          "PEQ" + "-" + e.toLocaleString().padStart(3, "0")
        ),
        {
          date: props.transactiondate,
          quantity: props.inventoryquantity,
          equipmentid: equipmentid,
          fundrequestid: props.fundrequestid,
          employeeid: auth.id,
        }
      );
    });
  } else if (props.inventorytype == "Facility") {
    var facilityid;
    queryFacilityAmount().then((e) => {
      e++;
      facilityid = "FA" + "-" + e.toLocaleString().padStart(3, "0");
      setDoc(doc(database, "facilities", facilityid), {
        name: props.inventoryname,
        description: props.inventorydescription,
        price: props.inventoryprice,
        damagestatus: "Undamaged",
        availabilitystatus: "Available",
      });
    });
    queryFacilityPurchaseAmount().then((e) => {
      e++;
      setDoc(
        doc(
          database,
          "facilitypurchase",
          "PFA" + "-" + e.toLocaleString().padStart(3, "0")
        ),
        {
          date: props.transactiondate,
          quantity: props.inventoryquantity,
          facilityid: equipmentid,
          fundrequestid: props.fundrequestid,
          employeeid: auth.id,
        }
      );
    });
  }
  // queryEmployeeFundRequestAmount(auth.id).then((e) => {
  //   setDoc(doc(database, "fundrequests", auth.id + "-1-" + e), {
  //     date: new Date().toLocaleString(),
  //     amount: requestAmount,
  //     reason: requestReason,
  //     anfstatus: "Pending",
  //     managerstatus: "Pending",
  //     requesterid: auth.id,
  //   });
  // });
}

export async function queryAllInventoryPurchase() {
  var array = [];
  const q = collection(database, "equipmentpurchase");
  const data = await getDocs(q).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  const q2 = collection(database, "facilitypurchase");
  const data2 = await getDocs(q2).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function queryAllFundRequest() {
  var array = [];
  const q = collection(database, "fundrequests");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function confirmSelectedFundRequestByAnf(id: string) {
  const docRef = doc(database, "fundrequests", id);

  updateDoc(docRef, {
    anfstatus: "Accepted",
  });
}

export async function cancelSelectedFundRequestByAnf(id: string) {
  const docRef = doc(database, "fundrequests", id);

  updateDoc(docRef, {
    anfstatus: "Declined",
  });
}

export async function reviseSelectedFundRequestByAnf(id: string) {
  const docRef = doc(database, "fundrequests", id);

  updateDoc(docRef, {
    anfstatus: "Revised",
  });
}

export async function queryEmployeeFundRequest(employeeid: string) {
  var array = [];
  const q = collection(database, "fundrequests");

  const qFundRequests = query(q, where("requesterid", "==", employeeid));

  const data = await getDocs(qFundRequests).then((item) => {
    item.docs.map((e) => {
      array.push(e.data());
    });
  });

  return array;
}

export async function queryEmployeeFundRequestAmount(employeeId: string) {
  var counter = 0;
  const q = collection(database, "fundrequests");

  const qFundRequests = query(q, where("requesterid", "==", employeeId));

  const data = await getDocs(qFundRequests).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

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

interface WorkingTimeDetail {
  employeeid: string;
  workingtimeid: string;
}

export async function updateEmployeeSchedule(data: Array<WorkingTimeDetail>) {
  console.log(data[0]);
  const employeeid = data[0].employeeid;

  const q = collection(database, "workingtimedetail");
  const qWorkingTimeDetail = query(q, where("employeeid", "==", employeeid));

  const result = await getDocs(qWorkingTimeDetail).then((item) => {
    item.docs.map((a) => {
      deleteDoc(doc(database, "workingtimedetail", a.id));
    });
  });

  data.map((e) => {
    console.log(e);
    addDoc(q, {
      employeeid: e.employeeid,
      workingtimeid: e.workingtimeid,
    });
  });
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
