import { serverLink } from "../../constants"

const likeFunction = async(postId)=>{
    try {
        const response = await fetch (`${serverLink}/api/v1/user/like`,{
            method: 'post',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId
            }),
            credentials: 'include'
        })
    } catch (error) {
        toast.error("Error", error)
    }
}