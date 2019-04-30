const CMD_SERVER_HELLO = 0;
const CMD_SYSTEM_STAT = 1;
const CMD_TERMINAL = 2;
const CMD_TASKMGR = 3;
const CMD_PROCESS_ACTION = 4;
const CMD_LIST_SERVICES = 5;
const CMD_SERVICE_ACTION = 6;

const CommandStringMap = {
  0: "serverhello",
  1: "systemstat",
  2: "terminal",
  3: "taskmanager",
  4: "processaction",
  5: "listservices",
  6: "serviceaction"
};

const StringCommandMap = {
  serverhello: CMD_SERVER_HELLO,
  systemstat: CMD_SYSTEM_STAT,
  terminal: CMD_TERMINAL,
  taskmanager: CMD_TASKMGR,
  processaction: CMD_PROCESS_ACTION,
  listservices: CMD_LIST_SERVICES,
  serviceaction: CMD_SERVICE_ACTION
};

function _str(typeid) {
  return CommandStringMap[typeid];
}

function _cmd(comdstr) {
  return StringCommandMap[comdstr];
}
