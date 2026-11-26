import { Router } from "express";

const router = Router();

router.get('/health',(req,res)=>{
    res.status(200).json({
        status:'success',
        message:'AI chat backend is running.'
    })
})

export default router;