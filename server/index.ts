import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import mongoose, { Mongoose } from 'mongoose';
import morgan from 'morgan';

function connectToDB() {
  const URL = 'mongodb://127.0.0.1:27017/chat';
  mongoose.connect(URL, (err) => {
    if (err) {
      console.log(err);
      process.exit();
    }
    console.log('DB connected');
  }
  );
}

connectToDB();

const MessageSchema = new mongoose.Schema({
  message: String,
  user: String,
  createdAt: Date,
  chatRoomId: {type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom'}
});

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  messages: [MessageSchema]
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const Message = mongoose.model('Message', MessageSchema);

const app = express();
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: '*'
  }
});


app.post('/chat', async (req: Request, res: Response) => {
  try {
    const chatRoom = new ChatRoom({
      name: req.body.name,
      messages: []
    });
    await chatRoom.save();
    res.send(chatRoom);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.get('/chat/:id', async (req: Request, res: Response) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.id);
    res.send(chatRoom);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.post('/message', async (req: Request, res: Response) => {
  try {
    const message = new Message({
      message: req.body.message,
      user: req.body.user,
      createdAt: new Date(),
      chatRoomId: req.body.chatRoomId
    });
    await message.save();
    const chatRoom = await ChatRoom.findById(req.body.chatRoomId);
    chatRoom.messages.push(message);
    await chatRoom.save();
    res.send(message);
  } catch (error) {
    res.status(500).send(error);
  }
})





io.on('connection', (socket) => {
  console.log(socket.handshake.auth)
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chatMessage', (d)=>{
      console.log(d)
  })
});


http.listen(3000, () => {
  console.log('listening on *:3000');
}
)
