// Base64 encoding function for presentation layer
function base64Encode(input) {
  return btoa(input);
}

// Base64 decoding function for presentation layer
function base64Decode(input) {
  return atob(input);
}

document.getElementById("send-btn").addEventListener("click", function () {
  let message = document.getElementById("message-input").value;
  if (!message.trim()) {
    alert("Please enter a message");
    return;
  }

  let senderLayers = [
    { id: "sender-app-layer", func: "Message entered by user", transform: message },
    { id: "sender-pres-layer", func: "Message encoded (Base64)", transform: base64Encode(message) },
    { id: "sender-sess-layer", func: "Session ID added", transform: "Session_123: " + base64Encode(message) },
    { id: "sender-trans-layer", func: "Message segmented", transform: "Segment 1: " + base64Encode(message.substring(0, Math.ceil(message.length / 2))) + ", Segment 2: " + base64Encode(message.substring(Math.ceil(message.length / 2))) },
    { id: "sender-net-layer", func: "Message packetized", transform: "IP Packet: " + base64Encode(message) },
    { id: "sender-data-layer", func: "Message framed", transform: "MAC Frame: " + base64Encode(message) },
    { id: "sender-phy-layer", func: "Message converted to bits", transform: "Bits: " + base64Encode(message).split("").join(" ") }
  ];

  let receiverLayers = [
    { id: "receiver-phy-layer", func: "Received bits", transform: senderLayers[senderLayers.length - 1].transform },
    { id: "receiver-data-layer", func: "Unframed message", transform: senderLayers[senderLayers.length - 2].transform },
    { id: "receiver-net-layer", func: "Extracted from packet", transform: senderLayers[senderLayers.length - 3].transform },
    { id: "receiver-trans-layer", func: "Reassembled segments", transform: senderLayers[senderLayers.length - 4].transform },
    { id: "receiver-sess-layer", func: "Session restored", transform: senderLayers[senderLayers.length - 5].transform },
    { id: "receiver-pres-layer", func: "Decoded message", transform: base64Decode(senderLayers[1].transform) },
    { id: "receiver-app-layer", func: "Final message", transform: message }
  ];

  let senderIndex = 0;

  // Process sender layers
  function processSenderLayers() {
    if (senderIndex < senderLayers.length) {
      let layer = document.getElementById(senderLayers[senderIndex].id);
      layer.style.transform = "scale(1.2)";
      layer.style.backgroundColor = "#ffcccb"; // Highlight active layer
      layer.innerHTML = `${senderLayers[senderIndex].func}: ${senderLayers[senderIndex].transform}`;

      setTimeout(() => {
        layer.style.transform = "scale(1)";
        layer.style.backgroundColor = "#e0e0e0";
        senderIndex++;
        if (senderIndex === senderLayers.length) {
          processReceiverLayers();
        } else {
          processSenderLayers();
        }
      }, 2000);
    }
  }

  let receiverIndex = 0;

  // Process receiver layers
  function processReceiverLayers() {
    if (receiverIndex < receiverLayers.length) {
      let layer = document.getElementById(receiverLayers[receiverIndex].id);
      layer.style.transform = "scale(1.2)";
      layer.style.backgroundColor = "#ffcccb"; // Highlight active layer
      layer.innerHTML = `${receiverLayers[receiverIndex].func}: ${receiverLayers[receiverIndex].transform}`;

      setTimeout(() => {
        layer.style.transform = "scale(1)";
        layer.style.backgroundColor = "#e0e0e0";
        receiverIndex++;
        if (receiverIndex === receiverLayers.length) {
          alert(`Message received successfully: ${message}`);
          document.getElementById("reset-btn").style.display = "block";
        } else {
          processReceiverLayers();
        }
      }, 2000);
    }
  }

  // Start the sender processing
  processSenderLayers();
});

// Reset Button functionality
document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("message-input").value = "";

  let layers = document.querySelectorAll(".layer");
  layers.forEach(layer => {
    layer.style.backgroundColor = "#e0e0e0";
    layer.innerHTML = layer.textContent.split(":")[0] + ": ";
  });

  document.getElementById("reset-btn").style.display = "none";

  senderIndex = 0;
  receiverIndex = 0;
});
