export const CMD_SERVER_HELLO = 0;
export const CMD_SYSTEM_STAT = 1;
export const CMD_TERMINAL = 2;
export const CMD_TASKMGR = 3;
export const CMD_PROCESS_ACTION = 4;
export const CMD_LIST_SERVICES = 5;
export const CMD_SERVICE_ACTION = 6;
export const CMD_EXIT = 7;
export const CMD_GCM_TOKEN = 8;
export const CMD_AGENTSBROADCAST = 9;
export const CMD_EVENTS = 10;
export const CMD_FM_LISTDIR = 11;
export const CMD_FM_ACTION = 12;
export const CMD_SYSTEM_ACTION = 13;
export const CMD_START_SERVICE = 14;
export const CMD_DOWNLOAD_SERVICE = 15;
export const CMD_UPLOAD_SERVICE = 16;
export const CMD_BUILTIN_MAX = 17;

export function parsePacket(arrbuf) {
  //let ubuff = new Uint8Array(data);
  let offset = arrbuf.byteLength - 4;
  let headerbuf = arrbuf.slice(offset, arrbuf.byteLength);
  let headerdataview = new DataView(headerbuf, 0);
  let connid = headerdataview.getUint16(0);
  let cmdtype = headerdataview.getUint8(2);
  let flow = headerdataview.getUint8(3);
  let header = {
    connid: connid,
    flow: flow,
    cmdtype: cmdtype
  };

  let bodybuff;
  //string/json
  var response;

  console.log("Cmdtype :", cmdtype);

  if (cmdtype == CMD_DOWNLOAD_SERVICE) {
    let eheadbuff = arrbuf.slice(offset - 10, offset);
    let eheaddv = new DataView(eheadbuff,0);
    console.log(eheaddv);
    let eoffset = 0;//eheaddv.getBigInt64(0, false);
    let eflag = eheaddv.getUint8(8);
    let eid = eheaddv.getUint8(9);
    header.ehead = { eoffset: eoffset, eflag: eflag, eid: eid };
    bodybuff = arrbuf.slice(0, offset - 10);

  if ("TextDecoder" in window) {
    let _tdv = new DataView(bodybuff);
    var decoder = new TextDecoder("utf-8");
    let rawstr = decoder.decode(_tdv);
    header.rawstr = rawstr;
    }
    
    return [header, bodybuff];
  }

  bodybuff = arrbuf.slice(0, offset);
  let bodydataview = new DataView(bodybuff);

  if ("TextDecoder" in window) {
    var decoder = new TextDecoder("utf-8");
    let rawstr = decoder.decode(bodydataview);
    //console.log("RAWSTR:", rawstr);
    response = JSON.parse(rawstr);
  } else {
    console.log("OLD BROWSER");
    let decodedString = String.fromCharCode.apply(
      null,
      new Uint8Array(bodybuff)
    );
    response = JSON.parse(decodedString);
  }

  return [header, response];
}

export function encodeMsg(msgstr, connid, cmdtype, flowtype) {
  let connidarr = new Uint16Array([connid]);
  let headUarr = new Uint8Array([
    connidarr[1],
    connidarr[0],
    cmdtype,
    flowtype
  ]);
  let bodyUarray;
  if ("TextDecoder" in window) {
    let json = JSON.stringify(msgstr);
    let encoder = new TextEncoder();
    bodyUarray = encoder.encode(json);
  } else {
    console.log("OLD Browser");
  }
  let combined = new Uint8Array([...bodyUarray, ...headUarr]);

  return combined.buffer;
}

export function formatBytes(a, label) {
  if (0 === a) return "0 Bytes";
  var c = 1024,
    d = 2,
    e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  label = !!label;
  console.log("label", label);
  if (label == true) {
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  } else {
    return parseFloat((a / Math.pow(c, f)).toFixed(d));
  }
}
