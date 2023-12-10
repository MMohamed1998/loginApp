
import postRouter from "./modules/posts/post.routes.js"
import userRouter from "./modules/user/user.routes.js"
import { AppError } from "./utils/AppError.js"
import { globalErrorHandling } from "./utils/errorHandling.js"

export function bootstrap(app){
    
    
    app.use('/user',userRouter)
    app.use('/post',postRouter)
    app.get('/', (req, res) => res.send('Hello World!'))
    app.all('*',(req,res,next)=>{
        next (new AppError('endpoint not found',404))
    })



    app.use(globalErrorHandling)
}