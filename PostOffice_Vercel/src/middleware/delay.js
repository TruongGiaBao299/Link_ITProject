
const delay = (req, res, next) =>{
    setTimeout(() => {
        // lấy token tại header
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
        } 
        next()
    }, 3000);
}

module.exports = delay;