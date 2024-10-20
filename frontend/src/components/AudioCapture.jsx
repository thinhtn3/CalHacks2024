// frontend/src/AudioCapture.jsx
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/Button"

const AudioCapture = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob); // Store the audio blob for later use
        audioChunksRef.current = []; // Clear the chunks for the next recording
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('YOUR_SERVER_ENDPOINT', {
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

  const handleDownload = () => {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.wav'; // Set the desired file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div className="space-x-10">
      <h1>Audio Capture</h1>
      <Button onClick={startRecording} disabled={isRecording} className='bg-blue-900 w-40 h-11 text-gray-50'>
        Start Recording
      </Button>
      <Button onClick={stopRecording} disabled={!isRecording} className='bg-blue-900 w-40 h-11 text-gray-50'>
        Stop Recording
      </Button>
      <Button onClick={handleUpload} disabled={!audioBlob} className='bg-blue-900 w-40 h-11 text-gray-50'>
        Upload Recording
      </Button>
      <Button onClick={handleDownload} disabled={!audioBlob} className='bg-blue-900 w-40 h-11 text-gray-50'>
        Download Recording
      </Button>
    </div>
  );
};

export default AudioCapture;
