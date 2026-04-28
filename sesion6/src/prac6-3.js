// WebRTC Video Call Application
//import adapter from 'webrtc-adapter';

// Define variables
let localStream,            // Local stream
    localPeerConnection,    // RTC local peer
    remotePeerConnection;   // RTC remote peer

    const offerOptions = {      // The options to create the offer
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    };

    // Get DOM elements
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const startButton = document.getElementById('startButton');
    const callButton = document.getElementById('callButton');
    const hangupButton = document.getElementById('hangupButton');

    // Initial state of the buttons
    startButton.disabled = false;
    callButton.disabled = true;
    hangupButton.disabled = true;

    // Call handlers
    startButton.onclick = start;
    callButton.onclick = call;
    hangupButton.onclick = hangup;

    // Video constraints
    const constraints = {
        audio: true,
        video: { width: { exact: 640 }, height: { exact: 480 } }
    };

    function start() {
        startButton.disabled = true;
        callButton.disabled = false;

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                // Video tracks (usually only one)
                const videoTracks = stream.getVideoTracks();
                console.log('Stream characteristics: ', constraints);
                console.log('Using device: ' + videoTracks[0].label);

                // End of stream handler
                stream.onended = () => {
                    console.log('End of stream');
                };

                // Bind the stream to the html video element
                localStream = stream;
                localVideo.srcObject = stream;
            })
            .catch((error) => {
                if (error.name === 'ConstraintNotSatisfiedError') {
                    console.error('The resolution ' + constraints.video.width.exact + 'x' +
                        constraints.video.height.exact + ' px is not supported by the camera.');
                } else if (error.name === 'PermissionDeniedError') {
                    console.error('The user has not allowed the access to the camera and the microphone.');
                }
                console.error('Error in getUserMedia: ' + error.name, error);
                startButton.disabled = false;
                callButton.disabled = true;
            });
    }

    function call() {
        callButton.disabled = true;
        hangupButton.disabled = false;

        console.log('Starting call...');

        // Update UI (state of the buttons)
        // No STUN/TURN servers
        const servers = null;

        // Local peer of the connection (caller)
        //   - create the local peer
        //   - bind the handler for receiving ICE candidates
        localPeerConnection = new RTCPeerConnection(servers);
        localPeerConnection.onicecandidate = gotLocalIceCandidate;

        // The same for the remote peer (callee)
        // We are calling ourselves
        //    - create the remote peer
        //    - bind the handler for receiving ICE candidates
        //    - bind the handler for receiving the counterpart stream
        remotePeerConnection = new RTCPeerConnection(servers);
        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        remotePeerConnection.ontrack = gotRemoteTrack;

        // Add local stream to the connection. This will trigger the onaddstream event
        // in the other side (the remote, callee)
        localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));

        // Start negotiation: the description depends on the streams added to the connection
        // This description is requested asynchronously
        localPeerConnection.createOffer(offerOptions).then(gotLocalDescription);
    }

    function hangup() {
        console.log('Hanging up...');

        // Close connections
        localPeerConnection.close();
        remotePeerConnection.close();

        // Set to null
        localPeerConnection = null;
        remotePeerConnection = null;

        // Update UI (state of the buttons)
        hangupButton.disabled = true;
        callButton.disabled = false;

        // Clear remote video
        remoteVideo.srcObject = null;
    }


    function gotLocalDescription(description) {
        console.log('gotLocalDescription');

        // The multimedia configuration offered by the caller (local peer) is received
        localPeerConnection.setLocalDescription(description);

        //
        // This description (offer) would be sent using some signaling mechanism to the other side
        //

        // Remote peer received the offer from the caller
        remotePeerConnection.setRemoteDescription(description);
        // Create an answer for the offer
        remotePeerConnection.createAnswer().then(gotRemoteDescription);
    }

    function gotRemoteDescription(description) {
        console.log('gotRemoteDescription');

        // The multimedia configuration as an answer for the offer is received
        remotePeerConnection.setLocalDescription(description);

        //
        // This answer would be sent using some signaling mechanism to the other side
        //

        localPeerConnection.setRemoteDescription(description);
    }

    function gotLocalIceCandidate(event) {
        console.log('gotLocalIceCandidate');

        // New ICE candidate
        if (event.candidate) {
            console.log('Local ICE candidate: ', event.candidate);
            remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    function gotRemoteIceCandidate(event) {
        console.log('gotRemoteIceCandidate');

        // New ICE candidate
        if (event.candidate) {
            console.log('Remote ICE candidate: ', event.candidate);
            localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    function gotRemoteTrack(event) {
        console.log('gotRemoteTrack');

        // New remote stream
        console.log('Remote stream received');
        remoteVideo.srcObject = event.streams[0];
    }