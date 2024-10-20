// frontend/src/AudioCapture.jsx
import React, { useRef, useState } from 'react';

const AudioCapture = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(audioContextRef.current.destination);

      scriptProcessorRef.current.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(inputBuffer));
      };

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      audioContextRef.current.close();
      setIsRecording(false);
      convertToWAV();
    }
  };

  const convertToWAV = () => {
    const audioData = audioChunksRef.current;
    const buffer = new Float32Array(audioData.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    audioData.forEach(chunk => {
      buffer.set(chunk, offset);
      offset += chunk.length;
    });

    const wavBlob = createWavBlob(buffer);
    setAudioBlob(wavBlob);
    uploadRecording(wavBlob); // Upload the WAV blob
    audioChunksRef.current = []; // Clear the chunks for the next recording
  };

  const createWavBlob = (buffer) => {
    const wavHeader = new Uint8Array(44);
    const sampleRate = 44100;
    const numChannels = 1;
    const byteRate = sampleRate * numChannels * 2; // 16-bit audio
    const dataSize = buffer.length * 2; // 16-bit audio

    // Fill in the WAV header
    const dataView = new DataView(wavHeader.buffer);
    dataView.setUint32(0, 0x52494646, false); // "RIFF"
    dataView.setUint32(4, 36 + dataSize, true); // File size
    dataView.setUint32(8, 0x57415645, false); // "WAVE"
    dataView.setUint32(12, 0x666d7420, false); // "fmt "
    dataView.setUint32(16, 16, true); // Subchunk1Size
    dataView.setUint16(20, 1, true); // AudioFormat
    dataView.setUint16(22, numChannels, true); // NumChannels
    dataView.setUint32(24, sampleRate, true); // SampleRate
    dataView.setUint32(28, byteRate, true); // ByteRate
    dataView.setUint16(32, numChannels * 2, true); // BlockAlign
    dataView.setUint16(34, 16, true); // BitsPerSample
    dataView.setUint32(36, 0x64617461, false); // "data"
    dataView.setUint32(40, dataSize, true); // Subchunk2Size

    // Create a new Uint8Array to hold the WAV data
    const wavData = new Uint8Array(wavHeader.length + dataSize);
    wavData.set(wavHeader, 0);
    const int16Array = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      int16Array[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7FFF; // Convert to 16-bit PCM
    }
    wavData.set(new Uint8Array(int16Array.buffer), wavHeader.length);

    return new Blob([wavData], { type: 'audio/wav' });
  };

  const uploadRecording = async (blob) => {
    if (!blob) return;

    const formData = new FormData();
    console.log("Audio Blob size:", blob.size);
    formData.append('audio_file', blob, 'recording.wav'); // Append the WAV blob to the form data
    console.log("Trying to upload");

    // Log the FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/audio/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Audio uploaded successfully!');
      } else {
        console.error('Error uploading audio:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const downloadRecording = (blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob); // Create a URL for the blob
    const a = document.createElement('a'); // Create an anchor element
    a.href = url; // Set the href to the blob URL
    a.download = 'newRecording.wav'; // Set the name of the downloaded file
    document.body.appendChild(a); // Append the anchor to the document
    a.click(); // Programmatically click the anchor to trigger the download
    document.body.removeChild(a); // Remove the anchor from the document
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div>
      <h1>Audio Capture</h1>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default AudioCapture;
