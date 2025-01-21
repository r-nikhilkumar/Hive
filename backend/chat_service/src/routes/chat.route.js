const { verifyUser } = require("../middlewares/verifyUser");
const {
  getChatRoomsApi,
  createChatRoomApi,
  getMessagesByChatRoomApi,
  createMessageApi,
  deleteMessageApi,
  deleteChatRoomApi,
  uploadFilesApi,
} = require("../controllers/chat.controller");
const multer = require("multer");
const upload = multer({ dest: "chat_service/temp/upload/" });

const route = require("express").Router();

route.use(verifyUser);

route.get("/rooms", getChatRoomsApi);
route.post("/rooms", createChatRoomApi);
route.get("/rooms/:id/messages", getMessagesByChatRoomApi);
route.post("/messages", createMessageApi);
route.delete("/messages/:id", deleteMessageApi);
route.delete("/rooms/:id", deleteChatRoomApi);


module.exports = route;
