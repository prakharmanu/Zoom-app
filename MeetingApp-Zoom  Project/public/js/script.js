const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
	host: "/",
	port: "443"
});
const myVideo = document.createElement("video");
// const myName = document.createElement("span");

let myVideoStream;
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
      myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("New User Connected");

       setTimeout(function ()
        {
          connectToNewUser(userId, stream);
        },5000
      )
    });

     // input value
  //let text = $("input");
  let text = document.getElementById('chat_message');
  //  let text = document.getElementById('chat_message');
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.value.length !== 0) {
        //console.log(text.value);


       var li  = document.createElement('li');
    li.appendChild(document.createTextNode('You Typed:'));
        //$("ul").append('<li class="message"><b>user</b><br/>$(message)</li>');
    //console.log(li);
    document.getElementsByTagName("ul")[0].appendChild(li).style.cssText="color:green";



      socket.emit('message', text.value);
      text.value= '';
    }
  });
  socket.on("createMessage",message => {
    var li  = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    //console.log(li);
    document.getElementsByTagName("ul")[0].appendChild(li).style.textTransform='capitalize';
    //$("ul").append('<li class="message"><b>user</b><br/>$(message)</li>');
    scrollToBottom()
  })
  });

socket.on("user-disconnected", (userId) => {
  console.log("New User Disconnected");
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
            console.log(userId);
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}


// URL Copy To Clipboard
document.getElementById("invite-button").addEventListener("click", getURL);

function getURL() {
  const c_url = window.location.href;
  copyToClipboard(c_url);
  alert("Url Copied to Clipboard,\nShare it with your Friends!\nUrl: " + c_url);
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// End Call
document.getElementById("end-button").addEventListener("click", endCall);

function endCall() {
  window.location.href = "/";
}



const scrollToBottom = () => {
  //var d = document.getElementsByClassName('main__chat_window')[0];
  var d = $('.main__chat_window');

  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
 // console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  const video = document.createElement("video");
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    //  while(videoGrid.hasChildNodes())
    // {
    //   videoGrid.removeChild(videoGrid.lastChild);
    // }
    // addVideoStream(video,myVideoStream);
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const displayChat = () => {
  let chat = document.getElementsByClassName('main__message_container')[0];
  let mainLeft = document.getElementsByClassName('main__left')[0];
  let mainRight = document.getElementsByClassName('main__right')[0];

  if(mainRight.style.display =="flex") {
    mainRight.style.display = 'none';
    mainLeft.style.flex = 1;
    chat.style.display = 'none';
  }
  else {
    mainRight.style.display = 'flex';
    mainLeft.style.flex = 0.8;
    chat.style.display = "flex";


  }
}
