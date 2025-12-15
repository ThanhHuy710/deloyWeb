import express from "express"; // Framework để tạo server HTTP
import taskRoute from "./routes/tasksRouters.js"; // Định nghĩa các endpoint liên quan đến tasks
import { connectDB } from "./config/db.js"; // Hàm kết nối đến database
import dotenv from "dotenv"; // Đọc biến môi trường từ file .env
import cors from "cors"; // Cho phép truy cập từ domain khác (Cross-Origin Resource Sharing)
import path from "path";


dotenv.config();//load các biến từ file .env và process.env

const PORT = process.env.PORT || 5001;//lấy port từ .env hoặc 5001
const __dirname = path.resolve();
const app = express();//khởi tạo app expess

//thứ tự middleware phải đúng
app.use(express.json()); //cho phép server đọc dữ liệu từ json từ body của request(thường dùng trong POST por PUT)
if(process.env.NODE_ENV!=='production')
{
  app.use(cors({origin:"http://localhost:5173"}));//Cho phép client từ địa chỉ khác (ở đây là localhost:5173, thường là frontend như React/Vite) gọi API mà không bị lỗi CORS
}

app.use("/api/tasks", taskRoute); // Gắn các route từ taskRoute vào đường dẫn /api/tasks
//Ví dụ: GET /api/tasks sẽ được xử lý trong tasksRouters.js

if(process.env.NODE_ENV==='production')
{
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});
}
//connect DB
connectDB().then(() => {//Đây là một hàm bất đồng bộ (async) dùng để kết nối đến database (thường là MongoDB).
// //Nó trả về một Promise, nên ta dùng .then() để xử lý khi kết nối thành công.
//sau khi connected thì đoạn .then đc thực thi
  app.listen(PORT, () => {//Đây là lệnh để khởi động server Express và lắng nghe các request HTTP tại cổng PORT.
    console.log(`server bat dau tren cong ${PORT}`);
  });
});
