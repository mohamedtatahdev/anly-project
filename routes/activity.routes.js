const router = require('express').Router();
const activityController = require('../controllers/activity.controller')


router.get('/', activityController.readActivity)
router.post('/', activityController.createActivity)
router.put('/:id', activityController.updateActivity)
router.delete('/:id', activityController.deleteActivity)
router.patch('/like-activity/:id', activityController.likeActivity)
router.patch('/unlike-activity/:id', activityController.unlikeActivity)


//comments
router.patch('/comment-activity/:id', activityController.commentActivity)
router.patch('/edit-comment-activity/:id', activityController.editCommentActivity)
router.patch('/delete-comment-activity/:id', activityController.deleteCommentActivity)

module.exports = router