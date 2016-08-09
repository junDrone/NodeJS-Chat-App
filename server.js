/**
 * Created by Arjun Sundaresh on 6/13/2016.
 */
var mongo= require('mongodb').MongoClient;
var client= require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
    if(err)
        throw err;

    client.on('connection',function(socket){

        var col=db.collection('messages');

        //emit all messages
        col.find().limit(100).toArray(function(err,res){
            if(err) throw err;

            socket.emit('output',res);
            console.log("New User");

        });

        socket.on('input',function(data){


            var name=data.name;
            var message=data.message;

            client.emit('newusermessage',data);
            col.insert({name:name,message:message},function(){

                console.log('inserted');
            });


        });


        //Event to get ll existing chat topics
        socket.on('gettopics',function(){

            var col = db.collection('topics');
            col.find().toArray(function(err,res){
               
                socket.emit('sendtopics',res);
                
            });
        });

    });
});