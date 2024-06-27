export const validateCreateAnswerData = (req, res, next) => {
    
    if(req.body.content === ""){
        return res.status(401).json({
            message: "กรุณาส่งข้อมูล Content"
        })
    }
    if(req.body.content.length > 300){
        return res.status(401).json({
            message: "กรุณาส่งข้อมูล Content ไม่เกิน 300 ตัวอักษร "
        })
    }
    
    next();
};