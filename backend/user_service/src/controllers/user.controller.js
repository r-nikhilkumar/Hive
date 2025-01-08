const { getUserById } = require("../services/user.service");

const getUser = async (req, res) =>{
    try {
        const user = await getUserById(req.params.id);
        return res.status(200).json({user:user, message:"user sent"})
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports = {getUser}
