const Vendor = require('../models/Vendor');
const User = require('../models/user.model')
const Message = require('../models/messages')
var myPromise = require('promise')
const express = require('express');
const { Router } = require('express');
const messages = require('../models/messages');
const router = express.Router();

/** 
router.get('/:receiver',(req, res, next)=>{
    if(req.params.receiver){
        if (req.session.user){
            reciever = req.query.id;
            sender = req.session.user._id;
            const message = req.body.msg;
            }
        console.log(receiver)
    }
})
*/



var receivername;

router.get('/getname', (req, res)=>{
    id = req.query.id
    Vendor.find({_id: id}).exec().then(async (data)=>{
        console.log(data)
        res.send( data[0].vendorname);
                    
            })

})

var receivername;
//var name= getvendorname("5ee3aa5afa154e2298ab7a04")

//console.log(getvendorname("5edde91d9d392718b4d727b7").then((data)=>{console.log(data)}))



router.get('/',(req,res,next)=>{
  var user_id = req.session.user._id;
  console.log(user_id)

    Message.find({sender : req.session.user._id}).distinct('receiver',(err, data)=>{
        Message.find({seen:0, receiver: req.session.user._id},(err, unseen)=>{
         
        res.render('a',{
            people : data,
            count : unseen,
            userid : user_id,


        })
        
    })
    })
    
})


router.get('/chatusers',(req,res,next)=>{
  USER_ID = req.session.user._id
  var paramid =""
  if(req.query.q){
    paramid= req.query.q

  }
  
    Message.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    receiver: USER_ID
                  },
                  {
                    sender: USER_ID
                  }
                ],
                
              },
              
            ]
          }
        },{
          $sort: {
            'date': -1
          }
        },
        
        
        {
          $addFields: {
            conversationWith: {
              $cond: {
                if: {
                  $eq: [
                    "$sender",
                    USER_ID
                  ]
                },
                then: "$receiver",
                else: "$sender"
              }
            }
          }
        },
        
        
        {
          $group: {
            _id: "$conversationWith",
            message: {
              $first: "$$ROOT"
            }
          }
        },
         {
          $sort: {
            'message.date': -1
          }
        }  ],(err, result)=>{
         
          var userslist =""

        result.forEach(msg=>{
            
          if(msg._id!='null'){
            var current=""
            var unseentag=""
            var online="Offline"
            var who="user"
            var statuscolor="red"
               if(msg.message.receiver == USER_ID){
            if(msg.message.seen == 0){
              current= "id='unseen'"
              unseentag = "<span id='unseentag'>New</span>"
            }
          }
          
              if(msg._id== paramid){
                
                  current = "id='currentchat'"
                  
                }
              if(msg.message.sender== USER_ID){
                who = "you"
              }
            //console.log(active.users)
            
            userslist = userslist + "<a  href='/chat?q="+msg._id+"'><li "+current+" ><div><h2>User</h2><h3><span style='margin-right:7px'>"+who+":"+"</span>"+msg.message.message+"</h3>"+unseentag+"</div></li></a>"
             
          }




        })
        res.send(userslist)
        
      })
      


})


    // docs will now be an array containing 1 Message model

    
   






router.get('/id',(req, res, next)=>{
      let errors = []
      if(req.query.q){
  
          
          var paramid = req.query.q;
          var USER_ID = req.session.user._id;
          
          //var sender = "5ede707f04269403e4848520"
    
     var receivername
      //getvendorname(receiver).then((data)=>{
       //   receivername = data[0].name
      //})
      
      setTimeout(() => {
          
        Message.find({$or:[{sender : USER_ID , receiver: paramid}, {receiver: USER_ID, sender: paramid}]}).sort({date :1}).exec( (err,data)=>{
          
              var i;
              var out = "";
              console.log("working")
          
          //console.log(data)
          
          
          data.forEach(elem => {
              var date = new Date(elem.date)
                  displaydate = date.getDay() + "/" + date.getMonth() 
                  + "/" + date.getFullYear() + " @ " 
                  + date.getHours() + ":" 
                  + date.getMinutes() + ":" + date.getSeconds();
              
                
              if (elem.sender == USER_ID){
                  
                  classname = "me"
                  //sendername = req.session.user.name;
                  sendername = "You"
                  
                  out = out + "<li class="+classname+"  >"+"<div class='entete'><h2>"+ sendername +"</h2><h3>"+displaydate+"</h3></div><div class='triangle'></div><div class='message'>"+ elem.message+"</div></li>"
          
              }
              else {
                  classname = "you"
                  sendername = 'User'
                  out = out + "<li class="+classname+"  >"+"<div class='entete'><h2>"+ sendername +"</h2><h3>"+displaydate+"</h3></div><div class='triangle'></div><div class='message'>"+ elem.message+"</div></li>"
              }
                   
              })
              
            
              res.send(out)
              
                
              })
          }, 3000);
  
         updateunseen(USER_ID, paramid)
      }
  
     
  })
function updateunseen(USER_ID, paramid)
{
        let conditions = {seen:0, receiver: USER_ID, sender: paramid};
      let options = { multi: true};
      let update = {
          $set : {
              seen: 1,
        }
      };
      Message.updateMany(conditions , update,options,(err, data)=>{
          //console.log(data)
      } );
      

}



router.get('/checknewmessage',(req, res, next)=>{
    Message.find( {seen:0},(err, data)=>{
        //console.log(data.length)
    })

})


router.post('/send', (req, res, next)=>{
    let errors=[]
    console.log('send running')
    if(req.query.q){
        if (req.session){

            var receiver = req.query.q;
            var sender = req.session.user._id;
        var receivername;
    //getvendorname(receiver).then((data)=>{
     //   return data
    //})
        var seen = 0;
        var message = req.body.message;
        }
    if (!sender || !receiver || !message){
        errors.push({ msg: 'Please type something'});
                    }
                    console.log(errors)
    if(errors.length >0)
                {
        res.send('not inserted')
                    }
    else{
    const newmessage = new Message({
        sender,
        seen,
        receiver,
        message
                })
    console.log(newmessage)
    console.log("done")
    console.log(sender, receiver)
    newmessage.save()
    
        }
    }

    })




    module.exports = router;
