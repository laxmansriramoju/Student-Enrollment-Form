var jpdbBaseURL='http:api.login2explore.com:5577';
var jpdbIRL='/api/irl';
var jpdbIML='/api/iml';
var schoolDBName='SCHOOL-DB';
var schoolRelationName='STUDENT-TABLE';
var connToken='90934677|-31949205400583262|90956089';
$('#empid').focus();
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
    +"\"token\":\""
    connToken
    +"\"dbName\":\""
    dbName
    "\",\n"+"\"cmd\":\"PUT\",\n"
    "\"rel\":\""
    +relName+"\","
    +"\"jsonStr\": \n"
    jsonObj
    +"\n"
    +"}";
    return putRequest;
}
function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url=dbBaseUrl=apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj=JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj=result.responseText;
        jsonObj=JSON.parse(dataJsonObj);
    });
    return jsonobj;
}
function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
    if (createTime!==undefined){
        if(createTime!==true){
            createTime=false;
        }
    }else {
            createTime=false;
        }
    if (updateTime!==undefined){
        if(updateTime!==true){
            updateTime=false;
        }
    }else{
            updateTime=false;
        }
    var value1="{\n"
    +"\"token\":\""
    +token
    +"\",\n"+"\"cmd\":\"GET_BY_KEY\",\n"
    +"\"dbName\":\""
    dbname
    +"\"\n"
    +"\"rel\": \""
    +relationName
    +"\",\n"
    +"\"jsonStr\":\n"
    +jsonObjStr
    +"\,"
    +"\"createTime\"+"
    +createTime
    +"\"updateTime\":"
    +updateTime
    +"\n"
    +"}";
    return value1;
}
function createUPDATERecordRequest(token, jsonObj, dbName, relName, reqId) {
    var req="{\n"
    +"\"token\":\""
    +token
    +"\","
    +"\"dbName\":\""
    +dbName
    +"\",\n"+"\"cmd\": \"UPDATE\", \n"
    +"\"rel\":\""
    +relName
    +"\",\n"
    +"\"jsonStr\":{\""
    +reqid
    +"\":\n"
    +jsonObj
    +"\n"
    +"}}";
    return req;
}
function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}
function getStudentAsJsonObj(){
    var rollno=$('#rollno').val();
    var jsonStr={
        no: rollno
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonobj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.fullname);
    $("#cls").val(record.cls);
    $("#birthdate").val(record.birthdate);
    $("#address").val(record.address);
    $("#enrollmentdate").val(record.enrollmentdate);
}
function resetForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#cls").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    $("#rollno").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#rollno").prop("disabled",true);
}
function validateData() {
    var rollno, fullname, cls, birthdate, address, enrollmentdate;
    rollno = $("#rollno").val();
    fullname = $("#fullname").val();
    cls = $("#cls").val();
    birthdate = $("#birthdate").val();
    adress = $("#address").val();
    enrollmentdate = $("#enrollmentdate").val();
    if (rollno ===""){
        alert("Roll no missing");
        $("#rollno").focus();
        return "";
    }
    if (fullname==="") {
        alert("Full Name missing");
        $("#fullname").focus();
        return "";
    }
    if (cls ===""){
        alert("Class missing");
        $("#cls").focus();
        return "";
    }
    if (birthdate===""){
        alert("Birth Date missing");
        $("#birthdate").focus();
        return "";
    }
    if (address===""){
        alert("Address HUSsang");
        $("#address").focus();
        return "";
    }
    if (enrollmentdate ===""){
        alert("Enrollment Date missing");
        $("#enrollmentdate").focus();
        return;
    }
    var jsonStrObj = {
        no: rollno,
        name: fullname,
        cls: cls,
        birthdate: birthdate,
        address: address,
        enrollment: enrollmentdate
    };
    return JSON.stringify(jsonStrObj);
}
function getStudent() {
    var studentJsonObj = getStudentAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, schoolDBName, schoolRelationName, studentJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    JQuery.ajaxSetup({async: true});
    if (resJsonObj.status===400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);
    
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#fullname").focus();
    }
}
function saveData() {
    var jsonStrObj=validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, schoolDBName, schoolRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj=executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollno").focus();
}
function changeData() {
    $("#change").prop("disabled", true);
    jsonChg=validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonchg, schoolDBName, schoolRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj=executeCommandAtGivenBaseUrl(updateRequest,jpdpBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    $("#rollno").focus();
}
